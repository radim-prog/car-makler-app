# CREDS SHOPPING LIST — pro Radima
**Audit:** AUDIT-015  
**Autor:** radim-kontrolor  
**Datum:** 2026-04-15  
**Target:** car.zajcon.cz (Milestone 1 demo)  

---

## TL;DR — Co potřebuješ teď (M1 blockers)

| Priorita | Klíč | Proč | Cena | Kde získat |
|----------|------|------|------|-----------|
| 🔴 P1 | `ANTHROPIC_API_KEY` | AI asistent pro makléře → 500 | Pay-as-you-go, ~$5-20/měsíc demo | console.anthropic.com |
| 🔴 P1 | `SMTP_USER` + `SMTP_PASSWORD` + `SMTP_FROM` | Všechny emaily tiše zahozeny (Resend demontováno FIX-037) | Placený Wedos mailbox | wedos.com/hosting/ |
| 🔴 P1 | `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` | Platby throws AuthError | FREE test-mode | dashboard.stripe.com |
| 🔴 P1 | `UPLOAD_DIR` + adresář | Upload fotek → crash | 0 Kč (jen nastavit) | viz níže |
| 🟠 P2 | `STRIPE_WEBHOOK_SECRET` | Webhook confirm plateb | 0 Kč (stripe CLI) | stripe CLI listen |
| 🟠 P2 | `NEXT_PUBLIC_SENTRY_DSN` | Error tracking v M1 | FREE 5k errors/měsíc | sentry.io |
| 🟡 P3 | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics | FREE (self-hosted) nebo $9/měsíc | plausible.io |

---

## Sekce 1 — KRITICKÉ (M1 demo nefunguje bez nich)

### 1.1 Anthropic Claude API
**Klíč:** `ANTHROPIC_API_KEY`  
**Stav:** Chybí zcela v pm2 env  
**Dopad:** AI asistent makléře (pwa/ai-assistant) → 500 | Generování popisů vozidel → 500  

**Jak získat:**
1. Přejdi na console.anthropic.com
2. Settings → API Keys → Create Key
3. Pojmenuj: `carmakler-sandbox`
4. Zkopíruj klíč (zobrazí se jen jednou!)

**Jak přidat do pm2:**
```bash
ssh root@91.98.203.239
pm2 set car-zajcon ANTHROPIC_API_KEY=sk-ant-...
pm2 restart car-zajcon --update-env
```

**Cena:** Pay-as-you-go. Pro M1 demo: ~$2-10/měsíc (claude-3-5-haiku je nejlevnější)  
**Poznámka:** V kódu je `new Anthropic()` — auto-čte z env, žádná code změna potřeba.

---

### 1.2 Wedos SMTP (email) — ~~Resend deprecated 2026-04-15~~
**Klíče:** `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`  
**Stav:** Creds zcela chybí v pm2 env. Resend demontován (FIX-037). Wedos SMTP implementováno (AUDIT-031 ✅ commit 3db417d).  
**Dopad:** Pozvánky makléřů, potvrzení plateb, GDPR emaily → `[EMAIL:NOT_CONFIGURED]` log (žádné tiché zahazování — explicit error od FIX-037)  

**Jak získat:**
1. Přejdi na **wedos.com/hosting/** (nebo wedos.com → Hosting → Mailhosting)
2. Zakup mailbox pro doménu `carmakler.cz` (balíček MAIL nebo součást webhostingu)
3. Vytvoř mailbox `info@carmakler.cz` (nebo `noreply@carmakler.cz`)
4. Zapiš si: login (`SMTP_USER`), heslo (`SMTP_PASSWORD`)

**Wedos SMTP konfigurace (již v kódu):**
```
host: smtp.wedos.net
port: 587
security: STARTTLS
```

**Jak přidat do pm2:**
```bash
ssh root@91.98.203.239
pm2 set car-zajcon SMTP_USER=info@carmakler.cz
pm2 set car-zajcon SMTP_PASSWORD=tvoje-heslo
pm2 set car-zajcon SMTP_FROM="CarMakléř <info@carmakler.cz>"
pm2 restart car-zajcon --update-env
```

**Cena:** Wedos mailhosting od ~50 Kč/měsíc. Webhostingový balíček obsahuje mailboxy.  
**Pozor:** DNS záznamy SPF/DKIM/DMARC musí být nastaveny v DNS domény carmakler.cz (Wedos → Správa DNS).  
**Radim:** Toto je na tobě — koupit mailbox + dodat 3 env vars týmu.

---

### 1.3 Stripe (platby)
**Klíče:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`  
**Stav:** `STRIPE_SECRET_KEY` prázdný string; ostatní klíče — neznámý stav  
**Dopad:** Jakékoliv platby → `AuthenticationError: No API key provided`  

**Jak získat (TEST mode):**
1. Přejdi na dashboard.stripe.com
2. Ujisti se že jsi v TEST mode (přepínač nahoře vlevo)
3. Developers → API Keys
4. Zkopíruj: `sk_test_...` (Secret key) a `pk_test_...` (Publishable key)
5. Pro webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` (lokálně) nebo v dashboard → Webhooks → Add endpoint → `https://car.zajcon.cz/api/webhooks/stripe`

**Jak přidat:**
```bash
ssh root@91.98.203.239
pm2 set car-zajcon STRIPE_SECRET_KEY=sk_test_...
pm2 set car-zajcon NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
pm2 set car-zajcon STRIPE_WEBHOOK_SECRET=whsec_...
pm2 restart car-zajcon --update-env
```

**Cena:** FREE pro test mode. Pro produkci: 1.4% + 10 Kč za transakci (EU cards).

---

### 1.4 Upload adresář (self-hosted, 0 Kč)
**Klíče:** `UPLOAD_DIR` (env var) + fyzický adresář na serveru  
**Stav:** Env var chybí, `/var/www/uploads/` neexistuje  
**Dopad:** Nahrávání fotek vozidel → crash nebo 500  

**Fix (žádná registrace, jen SSH):**
```bash
ssh root@91.98.203.239

# Vytvoř adresář
mkdir -p /var/www/uploads/carmakler
chown www-data:www-data /var/www/uploads/carmakler
chmod 755 /var/www/uploads/carmakler

# Nastav env
pm2 set car-zajcon UPLOAD_DIR=/var/www/uploads/carmakler
pm2 restart car-zajcon --update-env

# Ověř
curl -I https://car.zajcon.cz/uploads/test.jpg
# Nebo přidej nginx location block pro /uploads/
```

**Nginx config (přidat do site config):**
```nginx
location /uploads/ {
    alias /var/www/uploads/carmakler/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**Alternativa:** Místo self-hosted použij Cloudinary (klíče jsou v env). Stačí nastavit `UPLOAD_PROVIDER=cloudinary` (pokud kód tuto env var podporuje — ověřit v lib/upload.ts).

---

## Sekce 2 — DŮLEŽITÉ (M1 bez nich funguje, ale nedoporučeno)

### 2.1 Sentry (error tracking)
**Klíče:** `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`  
**Stav:** Zcela chybí  
**Dopad:** Nevidíš chyby v produkci/M1 → debugging naslepo  

**Jak získat:**
1. sentry.io → Sign up (GitHub)
2. Create Project → Next.js
3. Zkopíruj DSN (vypadá jako `https://xxx@yyy.ingest.sentry.io/zzz`)
4. Přidat do pm2: `NEXT_PUBLIC_SENTRY_DSN=https://...`

**Cena:** FREE 5 000 errors/měsíc. Stačí pro M1 demo.

---

### 2.2 Zásilkovna (autodíly eshop)
**Klíč:** `ZASILKOVNA_API_KEY`  
**Stav:** Chybí — ale kód má dry-run mode  
**Dopad:** Widget pro výběr výdejního místa zobrazí fallback/prázdnou mapu  

**Jak získat:**
1. client.packeta.com → Registrace
2. API sekce → API key

**Cena:** 0 Kč registrace. Platíš jen za zásilky.  
**Priorita:** Jen pokud chceš demo eshop s dílky (modul 3 — autodíly).

---

## Sekce 3 — NICE TO HAVE (M2 / produkce)

### 3.1 Plausible Analytics
**Klíč:** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`  
**Stav:** Chybí — analytiky se nesledují  
**Poznámka:** Není cookie-consent dependent (GDPR-friendly by design)  

**Možnosti:**
- **Self-hosted** (0 Kč): deploy Plausible CE na vlastním serveru (Docker)
- **Cloud**: plausible.io → $9/měsíc nebo €90/rok

**Jak přidat:** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=car.zajcon.cz`

---

### 3.2 Twilio (SMS notifikace)
**Klíče:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`  
**Stav:** Chybí  
**Dopad:** SMS notifikace makléřům nefungují  
**Priorita:** M2 / produkce — pro M1 demo není kritické

---

### 3.3 Mapy.cz
**Klíč:** `MAPYCZ_API_KEY`  
**Stav:** Klíč přítomen v env, ale komponenta není implementována v kódu  
**Dopad:** Žádný (kód nenaplněn)  
**Priorita:** M2 (implementace + klíč)

---

### 3.4 Raynet CRM
**Klíč:** `RAYNET_API_KEY`  
**Stav:** Pravděpodobně chybí (nedetekován v env)  
**Dopad:** CRM propojení pro makléřský pipeline  
**Registrace:** raynet.cz (SaaS CRM, CZ produkt)

---

## Postup — jak přidat klíče do pm2 (obecný)

```bash
ssh root@91.98.203.239

# Přidat/aktualizovat env var
pm2 set car-zajcon KLÍČ=hodnota

# Po všech změnách restartovat
pm2 restart car-zajcon --update-env

# Ověřit
pm2 env 4 | grep KLÍČ
```

**Alternativa — pm2 ecosystem file** (bezpečnější, verzovatelné):
```bash
# Na serveru: /var/www/car.zajcon.cz/ecosystem.config.js
# Přidat klíče tam a pak: pm2 startOrReload ecosystem.config.js
```

---

## Shrnutí nákladů M1

| Položka | Cena/měsíc | Poznámka |
|---------|-----------|---------|
| Anthropic API | ~$5-15 | Pay-as-you-go, demo traffic |
| Resend | $0 | FREE 3000/měsíc |
| Stripe | $0 | Test mode zdarma |
| Sentry | $0 | FREE 5k errors/měsíc |
| Upload dir | $0 | Jen SSH + mkdir |
| **CELKEM M1** | **~$5-15/měsíc** | Minimální náklady |

---

*Autor: radim-kontrolor | AUDIT-015 Phase 3 output | 2026-04-15*
