# AUDIT-031 — Plán: Wedos SMTP jako jediný email provider

**Datum:** 2026-04-14 (rev 2026-04-15b — factory pattern zrušen, Wedos-only)
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P0 (transakční maily pro M1 launch)
**Odhadovaná práce implementátora:** 3-5 hodin (včetně DNS propagation čekání)
**Depends on:** —
**Souvisí s:** FIX-037 (Resend demontáž — provádí implementátor), FIX-017 (magic link inzerce), AUDIT-024-erasure (erasure confirmation), AUDIT-028 T-028-038 (marketplace waitlist confirm)

> 🛑 **UPDATE 2026-04-15b:** Team-lead rozhodnutí po Radimově definitivním odmítnutí Resend (*"nebudeme používat resend ... koupíme si emaily normálně na wedosu"*). Původní provider-factory pattern (resend | wedos | dev) je ZRUŠEN. Cíl: **nodemailer-only Wedos SMTP**, žádný fallback na druhý provider. Pokud chybí creds → log `[EMAIL:NOT_CONFIGURED]`, nic nepadá.

---

## 1) Problem statement

### 1.1 Současný stav (pre-FIX-037)

`lib/email.ts` obsahuje Resend client + (v druhé iteraci FIX-019) Wedos fallback. Po FIX-037 má být:
- Resend úplně odstraněn (`npm uninstall resend`, `rm lib/resend.ts`)
- `lib/email.ts` přepsán na nodemailer-only SMTP wrapper
- `EMAIL_PROVIDER` env var odstraněn (není potřeba, jediný provider)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` odstraněny z `.env.example`

### 1.2 Proč jen Wedos

- Radim kupuje mailbox `info@carmakler.cz` u Wedosu — žádný další vendor
- Transakční volumy (verify, reset, order confirm) se bez problému vejdou pod Wedos rate limit (~10 msg/sec)
- Žádný fallback = jednodušší kód, jeden bod selhání, ale transparentní (Sentry alertuje)
- Newsletter / bulk NEBUDE přes Wedos — pro marketingové maily se v budoucnu zvolí jiný provider (AUDIT-X, post-M1)

### 1.3 Požadavky

- **Žádný breaking change** pro existující volání `sendEmail(...)` v codebase
- **Dev mode** (bez SMTP creds) zachovat console log pattern, ale bez `providerUsed: "dev"` — jen `[EMAIL:NOT_CONFIGURED]`
- **Deliverability:** SPF + DKIM + DMARC pro `info@carmakler.cz` přes Wedos DNS
- **Connection pooling** + rate limit ochrana (nodemailer built-in)
- **Graceful shutdown** — pool close na SIGTERM (propojit s AUDIT-001 instrumentation handler)

---

## 2) Architectural design

### 2.1 Jediný soubor `lib/email.ts`

Žádný adresář `lib/email/`, žádný factory pattern. Stačí:

```ts
// lib/email.ts
import nodemailer, { Transporter } from "nodemailer";
import { captureMessage } from "@sentry/nextjs";

export interface SendEmailParams {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string | Buffer; contentType?: string }>;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST || "smtp.wedos.net";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) {
    return null; // signalizuje log-only mode
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // STARTTLS na 587
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
    rateLimit: 10,
    tls: { rejectUnauthorized: true, minVersion: "TLSv1.2" },
  });
  return transporter;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const from = params.from || process.env.SMTP_FROM || "info@carmakler.cz";
  const t = getTransporter();

  if (!t) {
    console.warn("[EMAIL:NOT_CONFIGURED]", {
      to: params.to,
      subject: params.subject,
      reason: "SMTP_USER/SMTP_PASSWORD missing",
    });
    return { ok: false, error: "SMTP not configured" };
  }

  try {
    const info = await t.sendMail({
      from,
      to: Array.isArray(params.to) ? params.to.join(", ") : params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || htmlToText(params.html),
      replyTo: params.replyTo,
      attachments: params.attachments,
    });
    return { ok: true, id: info.messageId };
  } catch (error) {
    const err = error as Error;
    captureMessage("Email send failed (Wedos SMTP)", {
      extra: { to: params.to, subject: params.subject, error: err.message },
    });
    return { ok: false, error: err.message };
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gs, "")
    .replace(/<script[^>]*>.*?<\/script>/gs, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function closeEmailTransport(): Promise<void> {
  if (transporter) {
    transporter.close();
    transporter = null;
  }
}
```

### 2.2 ENV vars (post-FIX-037)

```
SMTP_HOST=smtp.wedos.net       # default pokud chybí
SMTP_PORT=587                  # default
SMTP_USER=info@carmakler.cz    # Wedos mailbox
SMTP_PASSWORD=<wedos password>
SMTP_FROM=info@carmakler.cz    # default same as USER
```

**Odstranit (po FIX-037):** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `EMAIL_PROVIDER`, `WEDOS_SMTP_HOST/PORT/USER/PASS` (přejmenovat na `SMTP_*`).

### 2.3 Graceful shutdown

`instrumentation.ts` (existuje per AUDIT-001):

```ts
process.on("SIGTERM", async () => {
  const { closeEmailTransport } = await import("./lib/email");
  await closeEmailTransport();
});
```

Idempotent — když transporter nikdy nebyl vytvořen, `closeEmailTransport()` no-op.

---

## 3) DNS setup pro deliverability

**Kritický předpoklad:** bez SPF/DKIM/DMARC Wedos maily skončí v spamu.

### 3.1 SPF

TXT záznam pro `carmakler.cz`:
```
v=spf1 include:_spf.wedos.com ~all
```

(Ověřit aktuální `include:` target v Wedos helpdesku — může být `_spf.wedos.cz`.)

### 3.2 DKIM

Wedos admin UI → **Email → DKIM** → vygenerovat klíč pro `carmakler.cz`. Wedos zobrazí TXT záznamy (typicky `wedos1._domainkey` + `wedos2._domainkey`) — přidat do DNS.

### 3.3 DMARC

TXT záznam:
```
_dmarc.carmakler.cz  "v=DMARC1; p=quarantine; rua=mailto:info@carmakler.cz; adkim=s; aspf=s; pct=100"
```

`p=quarantine` první 4 týdny, pak `p=reject` po monitoringu DMARC reportů.

### 3.4 Ověření

- `dig TXT carmakler.cz +short` — SPF visible
- `dig TXT wedos1._domainkey.carmakler.cz +short` — DKIM visible
- Mailtester.com → skóre 10/10
- MXToolbox DMARC lookup — valid
- Gmail test: pošli zprávu, **Show Original** → `SPF=PASS`, `DKIM=PASS`, `DMARC=PASS`

**Akce:** jednorázový ops setup. Radim má přístup k Wedos admin UI + DNS editoru domény.

---

## 4) Testing

### 4.1 Unit / smoke test

`scripts/test-email-send.ts` (manual run, ne v `tests/`):

```bash
SMTP_USER=info@carmakler.cz \
SMTP_PASSWORD='***' \
SMTP_FROM=info@carmakler.cz \
npx tsx scripts/test-email-send.ts radim@wikiporadce.cz "Wedos Test" "<h1>Funguje</h1>"
```

Ověř:
1. Email dorazí do inboxu (ne spam)
2. Gmail "Show Original" → DKIM=pass, SPF=pass, DMARC=pass
3. Header `Received` ukazuje Wedos SMTP

### 4.2 SMTP handshake smoke

```bash
openssl s_client -starttls smtp -connect smtp.wedos.net:587 -crlf
# expect: 220 ready, EHLO, 250-STARTTLS capability
```

### 4.3 E2E (Playwright)

Po deploy sandbox:
- Registrace → zadej email → obdrž verify link → klik → login funguje
- Password reset → email dorazí → reset OK
- FIX-017 magic link inzerce — end-to-end
- Marketplace waitlist confirm

### 4.4 Load check

Wedos rate limit typicky 10-30 msg/sec. `rateLimit: 10` v nodemailer ochraňuje. Bulk (> 50 recipients) NEPOSÍLEJ přes Wedos — budoucí newsletter stack (post-M1).

Dokumentovat v `lib/email.ts` hlavičkovém komentáři: *"Wedos je transakční mail provider. Pro bulk (> 50 recipients) použij dedikovaný newsletter stack (TBD post-M1)."*

---

## 5) Failure modes

### 5.1 Creds missing

`getTransporter()` vrátí `null` → `sendEmail()` loguje `[EMAIL:NOT_CONFIGURED]` + vrátí `{ ok: false }`. Žádný throw. User-facing flows (verify, reset) nebudou fungovat, ale aplikace nespadne.

### 5.2 Wedos down / rate limit

Nodemailer `sendMail` throw → catch → Sentry `captureMessage` + return `{ ok: false, error }`. Volající (např. `/api/auth/signup`) vidí `result.ok === false` a může rozhodnout (retry, user message "email se nepodařilo odeslat, zkuste později").

### 5.3 SPF/DKIM/DMARC fail → spam folder

Uživatel nevidí chybu, ale email není doručen. Detekce: Sentry NEPOZNÁ. Jediný signál = Gmail `Show Original` během smoke testu. Proto T-031-010 (DNS setup) je P0, ne P1.

---

## 6) Task breakdown

| # | Task | Soubory | Effort | Prio |
|---|---|---|---|---|
| **T-031-001** | `npm install nodemailer @types/nodemailer` | `package.json` | S (10min) | P0 |
| **T-031-002** | Přepis `lib/email.ts` na nodemailer-only Wedos SMTP | existing | M (1h) | P0 |
| **T-031-003** | Update `.env.example` — `SMTP_HOST/PORT/USER/PASSWORD/FROM` + odstranit RESEND/EMAIL_PROVIDER | existing | S (15min) | P0 |
| **T-031-004** | Manual test script `scripts/test-email-send.ts` | nový | S (30min) | P1 |
| **T-031-005** | SIGTERM close pool v `instrumentation.ts` | existing | S (20min) | P1 |
| **T-031-006** | DNS setup Wedos SPF + DKIM + DMARC | Wedos admin + DNS editor | M (30min + propagation 1-24h) | P0 |
| **T-031-007** | Deploy sandbox + smoke test (handshake + send + inbox check) | — | S (45min) | P0 |
| **T-031-008** | Deploy prod (po sandbox green) | — | S (30min) | P0 |
| **T-031-009** | Dokumentace `docs/email-setup.md` (ENV + DNS + troubleshoot) | nový | S (30min) | P1 |

**Celkem:** 4-5 hodin implementace + 1-24h DNS propagation.

**Pozn.:** FIX-037 (Resend demontáž) je **samostatný prerequisit task** pro implementátora — odstranit `lib/resend.ts`, `npm uninstall resend`, grep `"resend\|Resend\|RESEND"` musí vrátit 0 výskytů v `lib/` `app/` `components/`. AUDIT-031 na FIX-037 navazuje.

---

## 7) Acceptance criteria

- [ ] FIX-037 merged: `grep -r "resend\|Resend\|RESEND" lib/ app/ components/` = 0 výskytů
- [ ] `package.json` nemá `"resend"`, má `"nodemailer"` + `"@types/nodemailer"`
- [ ] `lib/email.ts` je nodemailer-only, neobsahuje factory / provider pattern
- [ ] `.env.example` obsahuje `SMTP_HOST/PORT/USER/PASSWORD/FROM`, neobsahuje `RESEND_*` ani `EMAIL_PROVIDER`
- [ ] Creds missing → `sendEmail()` vrátí `{ ok: false }` + log `[EMAIL:NOT_CONFIGURED]`, žádný throw
- [ ] Creds present → test email dorazí do inboxu
- [ ] Gmail "Show Original" → DKIM=pass, SPF=pass, DMARC=pass
- [ ] DNS propagace ověřena (`dig TXT` + mailtester 10/10)
- [ ] SIGTERM zavře pool bez hanging pm2 restart
- [ ] Deploy sandbox → FIX-017 magic link test → inbox OK
- [ ] Deploy prod → smoke test registrace verify OK
- [ ] Sentry `Email send failed (Wedos SMTP)` message type vidí chyby (trigger intentional chybou s wrong password → event v Sentry)

---

## 8) Risk & mitigations

| # | Risk | P | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Wedos SMTP password v env = plain text secret | M | M | Env přes pm2 env + chmod 600 `.env*`, NIKDY v Git. Rotace pokud exposure. |
| R2 | DNS propagace SPF/DKIM 24h → emaily ze spamu | H | M | Setup DNS den před deploy, monitoring mailtester během |
| R3 | Wedos rate limit překročen při burst | M | M | `rateLimit: 10` v nodemailer + max 5 connections. Bulk NEPOSÍLAT. |
| R4 | Wedos outage → maily tiše nejdou | H | H | Sentry `Email send failed` alert → Radim notifikace. Dočasné: retry cron/queue (post-M1 feature). |
| R5 | `@types/nodemailer` TS type mismatch | L | L | Pin verze v `package.json` |
| R6 | Connection pool nezavřený při SIGTERM → hanging pm2 restart | M | L | T-031-005 SIGTERM handler close pool |
| R7 | Žádný fallback = single point of failure pro auth | H | H | **Akceptováno** — Radimovo rozhodnutí. Mitigace: status banner "email dočasně nedostupný" pro user UX (post-M1) + Sentry alerting. |

---

## 9) Out of scope

- ❌ Newsletter / bulk email — TBD jiný stack (post-M1 AUDIT)
- ❌ Inbound mail parsing (reply handling) — future
- ❌ Email templating system (MJML/React Email) — zachovat current HTML strings
- ❌ A/B testing subject lines — budoucí
- ❌ Email analytics dashboard — post-M1
- ❌ Provider factory pattern — ZRUŠENO (Radim: Wedos-only)
- ❌ Resend integrace — ZRUŠENO (FIX-037 provádí odstranění)

---

## 10) Dependency chain

```
FIX-037 (implementátor: Resend demontáž)
  ↓
AUDIT-031 (T-031-001..009 Wedos-only SMTP wrapper)
  ↓
DNS setup (T-031-006)
  ↓
Deploy sandbox + prod
  ↓
Odblokuje:
  - FIX-017 magic link inzerce
  - F-032 erasure confirmation + export link
  - FIX-020 marketplace waitlist confirm
  - Všechny password-reset / verify flows
```

---

**Verdict plánovače:** Simplification win po Radimově rozhodnutí — jeden soubor, jeden provider, žádný switch overhead. Primary hazard = deliverability DNS. 4-5h implementace (+ 1-24h DNS propagation). Ready for implementátor handoff po FIX-037 merge.

**Konec dokumentu AUDIT-031-plan.md (rev 2026-04-15b)**
