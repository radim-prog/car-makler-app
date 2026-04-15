# AUDIT-024 — Plán: GDPR compliance (technická + legal vrstva)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** 🔴 **P0 BLOCKER před „jít do světa"** — GDPR je vymahatelné, ÚOOÚ pokuty 0.5-20 M Kč + až 4 % ročního obratu
**Odhadovaná práce implementátora:** 2-3 dny (technická) + externí (legal)
**Depends on:** AUDIT-007d (marketplace zvyšuje GDPR risk — finanční data)

---

## 1) Recon výstup (stav 2026-04-14)

### 1.1 Hotové ✅

- **Cookie consent banner** (`components/web/CookieConsent.tsx`) — funkční, 3 kategorie (necessary/analytics/marketing), verze consentů, storage v localStorage, custom event pro Analytics komponenty
- **Policy stránky** (`app/(web)/zasady-cookies/page.tsx`, `app/(web)/ochrana-osobnich-udaju/page.tsx`) — existují, obsah vyžaduje legal review
- **Data export endpoint** (`app/api/settings/export/route.ts`) — Art. 15 GDPR: vrací JSON s user profile + vehicles + contacts + commissions. Authenticated, správný Content-Disposition. **Slabiny:**
  - Nepokrývá všechny entity: chybí `Listing`, `Order`, `Investment`, `MarketplaceApplication`, `SellerContact.notes`, `AiConversation`, `Notification`
  - Pouze pro BROKER role (osoba viewing její vehicles) — BUYER/ADVERTISER/INVESTOR nemají ekvivalent
  - Chybí denial logging (kdo, kdy stahoval data)
- **Delete account endpoint** (`app/api/settings/delete-account/route.ts`) — **IMITACE, NE SMAZÁNÍ.** Pouze notifikuje admina, data zůstávají. Art. 17 NENÍ implementován.
- **Hook** `lib/hooks/useCookieConsent.ts` — existuje

### 1.2 Chybějící kritické ❌

- **AuditLog Prisma model** — **NEEXISTUJE** (ověřeno `grep "model AuditLog" prisma/schema.prisma` → no match)
- **Art. 17 (právo na výmaz)** — endpoint je stub, skutečné smazání neexistuje
- **Art. 16 (oprava údajů)** — není endpoint, předpokládá se že user edituje profil manuálně (OK pokud `/api/users/:id` PATCH autorizován vlastníkem)
- **Art. 20 (portabilita)** — JSON export existuje (OK) ale CSV/XML alternativa chybí (nice-to-have)
- **Art. 21 (námitka proti zpracování)** — chybí flow (analogie „opt-out marketing")
- **Art. 18 (omezení zpracování)** — chybí status pole na User (`processingRestricted: Boolean`?)
- **Retention policy** — žádné pole `dataRetentionUntil`, žádný cron pro purge starých Vehicles / Leads / AiConversations
- **DPO kontakt** — není email `dpo@carmakler.cz` ani MX
- **RoPA (Records of Processing Activities)** — interní legal dokument, Art. 30 ukládá povinně pokud >250 zaměstnanců NEBO systematic sensitive processing. Carmakler marketplace = sensitive processing (financial)
- **DPA (Data Processing Agreement)** — smlouvy s 3rd party procesory (Resend, Cloudinary, vindecoder.eu, Anthropic, Sentry, Plausible, Stripe, Pusher, Ondato pokud KYC, atd.)
- **Breach notification plán** — chybí SOP pro 72-hod notifikaci ÚOOÚ per Art. 33
- **Privacy by Default audit** — default consent `analytics: false, marketing: false` ✅ správně

### 1.3 Legal vs. Technical matrix

| Item | Technical (implementátor) | Legal (externí advokát) |
|---|---|---|
| Cookie consent banner | ✅ Hotovo | ⚠️ Legal review textu |
| Art. 15 data export | 🔧 Rozšířit o všechny entity | ✅ Adequacy potvrzena |
| Art. 17 právo výmaz | ❌ Kompletní přepis | ⚠️ Retention exceptions (fin. zákon) |
| AuditLog | ❌ Nový Prisma model | — |
| Privacy policy | ✅ Existuje | ⚠️ Legal review obsahu |
| Cookie policy | ✅ Existuje | ⚠️ Legal review obsahu |
| DPO kontakt | 🔧 Email + MX | ⚠️ Určení osoby DPO |
| RoPA | — | ❌ Externí — advokát sepíše |
| DPA | 🔧 Template v Notion | ❌ Advokát → 3rd parties |
| Breach SOP | — | ❌ Advokát + CISO |
| ÚOOÚ registrace | — | ❌ Pouze pokud marketplace spustí |

## 2) Cíle AUDIT-024

**Technická vrstva (Batch 1):**

1. **AuditLog Prisma model + middleware** — sledování přístupu k osobním údajům
2. **Art. 17 real deletion flow** — hard delete s exceptions (finance records 10 let per §89/4 DPH)
3. **Art. 15 export rozšíření** — všechny entity napříč všemi 4 produkty
4. **Retention policy fields + cron** — auto-purge po X měsících od last activity / user request
5. **DPO email** `dpo@carmakler.cz` + mailto: v policy stránkách

**Legal vrstva (externí, paralelně):**

6. **RoPA dokument** — advokát sepíše, cca 50-100k Kč
7. **DPA templates** s 3rd party procesory — advokát + pošle k podpisu
8. **Breach notification SOP** — advokát + ops (Radim)
9. **Legal review** všech 3 policy stránek (cookies/ochrana/podmínky)

## 3) Plán implementace — technická část

### 3.1 AuditLog Prisma model (P0, 3h)

```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String?  // kdo provedl akci (null = systém/cron)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action      AuditAction
  entityType  String   // "User", "Vehicle", "Investment", atd.
  entityId    String
  details     Json?    // delta starých/nových hodnot, IP, UA
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

enum AuditAction {
  // Read
  DATA_EXPORT            // Art. 15 export triggered
  PROFILE_VIEWED
  SENSITIVE_FIELD_ACCESSED  // bankAccount, ico viděn adminem

  // Write
  CREATE
  UPDATE
  DELETE
  SOFT_DELETE
  HARD_DELETE

  // GDPR specific
  CONSENT_GIVEN
  CONSENT_REVOKED
  ERASURE_REQUESTED      // Art. 17 žádost
  ERASURE_EXECUTED
  ERASURE_DENIED         // retention exception
  RESTRICTION_REQUESTED  // Art. 18
  OBJECTION_RAISED       // Art. 21

  // Security
  LOGIN_SUCCESS
  LOGIN_FAILURE
  PASSWORD_CHANGED
  ROLE_CHANGED
  IMPERSONATION_START    // admin přepnul se na user
  IMPERSONATION_END
}
```

**Helper:** `lib/audit-log.ts`

```ts
export async function logAudit(params: {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  req?: NextRequest;
}) {
  await prisma.auditLog.create({
    data: {
      ...params,
      ipAddress: params.req?.headers.get("x-forwarded-for") ?? null,
      userAgent: params.req?.headers.get("user-agent") ?? null,
    },
  });
}
```

**Integrace:** volat ve všech routes které čtou/mění sensitive data: `/api/admin/users/*`, `/api/settings/*`, `/api/marketplace/*`, `/api/broker/*` sensitive endpoints.

**Retention AuditLogu:** 3 roky (standard compliance), cron purge po 3+ letech.

### 3.2 Art. 17 real deletion (P0, 1 den)

**Přepis `app/api/settings/delete-account/route.ts`:**

```ts
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return unauthorized();

  const userId = session.user.id;

  // 1. Log žádost
  await logAudit({ userId, action: "ERASURE_REQUESTED", entityType: "User", entityId: userId, req });

  // 2. Check retention exceptions
  const hasActiveInvestments = await prisma.investment.count({
    where: { investorId: userId, paymentStatus: { not: "REFUNDED" } }
  });
  const hasRecentCommissions = await prisma.commission.count({
    where: { brokerId: userId, createdAt: { gte: new Date(Date.now() - 10 * 365 * 86400_000) } } // 10 let
  });

  if (hasActiveInvestments > 0 || hasRecentCommissions > 0) {
    await logAudit({ userId, action: "ERASURE_DENIED", entityType: "User", entityId: userId,
      details: { reason: "active_investments_or_finance_records", hasActiveInvestments, hasRecentCommissions }, req });
    return NextResponse.json({
      error: "Nemůžeme smazat účet — máte aktivní investice nebo zákonem vyžadované finanční záznamy (§89/4 DPH, §35d AML). Data budou zachována po zákonné lhůtě a poté smazána automaticky.",
      retentionUntil: "viz privacy policy"
    }, { status: 409 });
  }

  // 3. Soft delete → hard delete po grace period (30 dní)
  await prisma.$transaction(async (tx) => {
    // Anonymize personal fields immediately
    await tx.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@carmakler.local`,
        phone: null,
        firstName: "[smazáno]",
        lastName: "[smazáno]",
        bio: null,
        avatar: null,
        bankAccount: null,
        ico: null,
        status: "DELETED",
        deletedAt: new Date(),
      }
    });
    // Cascade: vehicles status ARCHIVED, listings status INACTIVE
    await tx.vehicle.updateMany({ where: { brokerId: userId }, data: { status: "ARCHIVED" } });
    await tx.listing.updateMany({ where: { userId }, data: { status: "INACTIVE" } });

    await logAudit({ userId, action: "ERASURE_EXECUTED", entityType: "User", entityId: userId, req });
  });

  // 4. Force logout
  return NextResponse.json({
    message: "Váš účet byl anonymizován. Data budou kompletně smazána po uplynutí zákonné retenční lhůty.",
  });
}
```

**Hard delete cron** (`/api/cron/purge-deleted-users`) — po 30 dnech grace + retention check zruší User row.

### 3.3 Art. 15 export rozšíření (P1, 4h)

**Current:** profile + vehicles + contacts + commissions (jen BROKER).

**Fix:** role-aware export všechno relevantní:

```ts
const exportData = {
  exportedAt: new Date().toISOString(),
  profile: user,
  vehicles: await prisma.vehicle.findMany({ where: { brokerId: userId }, select: {...} }),
  contacts: await prisma.sellerContact.findMany({ where: { brokerId: userId }, select: {...} }),
  commissions: await prisma.commission.findMany({ where: { brokerId: userId }, select: {...} }),
  listings: await prisma.listing.findMany({ where: { userId }, select: {...} }),
  inquiries: await prisma.inquiry.findMany({ where: { listing: { userId } }, select: {...} }),
  orders: await prisma.order.findMany({ where: { buyerId: userId }, select: {...} }),
  investments: await prisma.investment.findMany({ where: { investorId: userId }, select: {...} }),
  marketplaceApplications: await prisma.marketplaceApplication.findMany({ where: { contactEmail: user.email }, select: {...} }),
  aiConversations: await prisma.aiConversation.findMany({ where: { userId }, select: {...} }),
  notifications: await prisma.notification.findMany({ where: { userId }, select: {...} }),
  consents: { cookieVersion: "1", /* z audit logu CONSENT_GIVEN events */ },
};

await logAudit({ userId, action: "DATA_EXPORT", entityType: "User", entityId: userId, req });
```

### 3.4 Retention policy (P1, 4h)

**Schema addition:**

```prisma
model User {
  ...
  lastActivityAt DateTime @default(now())
  dataRetentionUntil DateTime? // null = active, po expiraci purge
}
```

**Cron `/api/cron/retention-purge`:**

- User inactive > 3 roky → anonymize (viz 3.2)
- Lead CLOSED status + > 2 roky → delete
- AiConversation > 1 rok → delete
- Vehicle status ARCHIVED + > 5 let → delete (kromě prodaných s commission → 10 let)
- Inquiry REPLIED/CLOSED + > 1 rok → delete

**Vše pod ochranou:**
```ts
if (hasFinancialRecord(entity, thresholdYears: 10)) skip();
```

### 3.5 DPO email (P0, 30 min)

- Radim založí mailbox `dpo@carmakler.cz` (MX přes Forpsi / Google Workspace)
- Update `app/(web)/ochrana-osobnich-udaju/page.tsx` — přidat sekci „Kontakt na pověřence pro ochranu osobních údajů" s `mailto:dpo@carmakler.cz` + adresa sídla
- Footer všech stránek: link na privacy policy + DPO email

## 4) Plán — legal část (externí advokát)

### 4.1 Co potřebujeme od advokáta (30-100k Kč)

1. **RoPA** (Art. 30) — seznam všech processing activities, právní bazí, kategorie osobních údajů, příjemci (3rd parties), retention. Template: ICO GDPR template + customization pro Carmakler.
2. **DPA templates** s 3rd parties:
   - **Processors** (oni zpracovávají naším jménem): Resend, Cloudinary, Sentry, Plausible, Pusher, Anthropic (AI assistant), vindecoder.eu, Ondato (pokud KYC), Stripe (pro marketplace)
   - **Joint controllers** (my + oni rozhodujeme o zpracování): pravděpodobně žádný
3. **Breach notification SOP** — 72-hod process, communication template k ÚOOÚ
4. **Legal review** privacy policy + cookies policy + obchodní podmínky (update o marketplace pokud relevantní)
5. **Advice k marketplace compliance** (překrývá s AUDIT-007d)

**Doporučení advokátů se specializací na IT/GDPR:**
- Bříza & Trubač
- Havel & Partners (data protection team)
- PRK Partners
- Rowan Legal

### 4.2 Output advokáta (dokumenty v Notion / shared drive)

- `RoPA-carmakler-2026.xlsx` (s poli: Processing activity, Purpose, Legal basis, Data categories, Data subjects, Recipients, Transfers, Retention, Technical/Organizational measures)
- `DPA-template-carmakler.docx` (k podpisu s každým procesorem)
- `SOP-breach-notification.md`
- `Privacy-policy-v2.md`, `Cookie-policy-v2.md`, `Terms-of-service-v2.md`

## 5) Acceptance criteria

### Technical (implementátor)
- [ ] `AuditLog` model migrated, helper `lib/audit-log.ts` existuje
- [ ] Art. 17 deletion endpoint: anonymize + cascade + ERASURE_EXECUTED audit entry
- [ ] Art. 15 export pokrývá všechny entity (Listing, Order, Investment, Inquiry, ...)
- [ ] `dpo@carmakler.cz` email funguje, v policy stránkách + footer
- [ ] Retention cron `/api/cron/retention-purge` běží, dry-run logy clean
- [ ] `npm run test` passing (nové test cases pro logAudit + delete-account)
- [ ] E2E test: registrace → export → delete → ověř anonymizaci

### Legal (Radim + advokát)
- [ ] Písemný legal posudek na ochranu osobních údajů doručen (30-100k Kč budget schválen)
- [ ] RoPA vyplněna, v Notion
- [ ] 5+ DPA podepsaných (Resend, Cloudinary, Sentry, Plausible, Stripe minimum)
- [ ] Breach SOP dokumentován
- [ ] Privacy policy v2 publikována

## 6) Risk & open questions

### Risk
- **R1 (high):** Launch marketplace bez RoPA + DPA → ÚOOÚ audit = pokuta. **Mitigation:** technická vrstva AUDIT-024 před marketplace launch, legal paralelně.
- **R2 (medium):** Art. 17 deletion nechtěně smaže data která má podle zákona držet. **Mitigation:** retention exception check v kodéru (3.2), test cases pro edge cases.
- **R3 (medium):** AuditLog může růst neomezeně → storage cost + pomalé queries. **Mitigation:** retention 3 roky + indexy.
- **R4 (low):** Cookie banner je currently localStorage only → když user smaže localStorage, vrací se dotaz. OK chování, per ePrivacy směrnici.

### Open questions pro Radima
1. **Má Carmakler s.r.o. určeného DPO?** Formálně je povinné pro large-scale sensitive processing (marketplace = ano, broker sám o sobě borderline).
2. **Rozpočet na advokáta:** 30 (rychlá konzultace) / 50 (střední scope) / 100k (full deliverable) — kdy?
3. **ÚOOÚ registrace** (deprecovaná od GDPR 2018, ale statutár si má pamatovat že ÚOOÚ může provést audit kdykoli) — jsme připraveni?
4. **Existující marketing databáze** (emails, leady) — jak byly získány (opt-in evidence)? Pokud ne, nemůžeme rozesílat.
5. **Backup retention** — Radim má DB backupy kde? Na jak dlouho? Backup retention = data retention pro legal účely.
6. **User export formát** — JSON stačí, nebo PDF/CSV?

## 7) Out of scope

- ❌ DSR (Data Subject Request) admin panel (P2) — zatím vše přes email/direct API
- ❌ Automatizovaný breach detection (P3) — zatím manuální detection přes Sentry alerts
- ❌ Consent management platform (CMP) enterprise řešení (OneTrust, Cookiebot) — naše custom banner stačí pro MVP
- ❌ Cross-border transfer (SCC) s USA procesory — většina našich 3rd parties má EU data residency nebo SCC framework ready

---

**Verdict plánovače:**

GDPR je **P0 blocker pro launch** — technická vrstva je realizovatelná za 2-3 dny, legal část vyžaduje externí (30-100k Kč + 2-4 týdny lead time na advokáta). Doporučuji:

1. **Hned:** objednat legal posudek (Radim)
2. **Technická vrstva v Batch 1:** AuditLog, Art. 17 real delete, Art. 15 extended export
3. **Paralelně s advokátem:** RoPA, DPA templates, breach SOP
4. **Podmínka launch:** legal posudek OK + technická vrstva deployed na prod

**Bez GDPR compliance = okamžitá expozice na ÚOOÚ audit + pokuty + reputační risk. Toto je netradičně risk-free investice** — GDPR je **povinný**, ne volitelný.
