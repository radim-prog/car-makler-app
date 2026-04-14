# AUDIT-024-erasure — Plán: GDPR Art. 17 anonymizace flow (F-032 P0)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** 🔴 **P0** — aktivní GDPR porušení (30-dní lhůta Art. 17/3 počíná od 1. žádosti)
**Odhadovaná práce implementátora:** 2-3 dny (kód + migration + 7-day cooling-off cron + testy + deploy)
**Depends on:** **F-031 (AuditLog model)** — ✅ **confirmed order: F-031 FIRST → F-032 SECOND** (team-lead decision 2026-04-14)
**Souvislost:** AUDIT-024-plan.md (full GDPR scope), AUDIT-007d (marketplace investice zvyšuje retention complexity)

---

## 0) 🎯 ZÁVAZNÁ ROZHODNUTÍ (team-lead 2026-04-14 10:05)

Všech 6 open questions rozhodnuto. Tato sekce má precedenci nad pozdějšími návrhy v tomto dokumentu — pokud text dále odporuje, plán sekce 0 vyhrává.

### D1 — Backup retention → **14 dní** + DPA dokumentace

- **Akce implementátora:** Edit `/etc/cron.d/pg-backup-carmakler`: `mtime +30 → +14` (3 místa: prod cleanup, sandbox cleanup, případné backup-index)
- **DPA text** (vložit do `/ochrana-osobnich-udaju` a smluvní DPA appendix):
  > *Zálohy databáze obsahují snapshot dat. Při uplatnění práva na výmaz se data v aktivní databázi anonymizují / vymažou. Záložní snapshoty jsou retainovány po dobu 14 dnů a poté přepsány. Při restoraci je proces výmazu automaticky reaplikován pomocí AuditLog erasure entries.*
- **Post-restore automation (volitelné, AUDIT-033 future):** Po DB restore z backup spustit job, který pro každý `AuditLog(action='USER_ERASURE', createdAt < restored_snapshot_date)` reaplikuje erasure pipeline. Zajistí kontinuitu práva na výmaz přes DR události.

### D2 — SUPER_ADMIN edge → **Guard 409**

Pre-check v `POST /api/settings/delete-account`:

```ts
if (user.role === 'ADMIN') {
  const activeAdmins = await prisma.user.count({
    where: { role: 'ADMIN', status: 'ACTIVE', deletedAt: null, id: { not: user.id } }
  });
  if (activeAdmins < 1) {
    return NextResponse.json({
      error: 'LAST_ADMIN_GUARD',
      message: 'Před smazáním účtu vytvořte alespoň jednoho dalšího administrátora a převeďte na něj práva.'
    }, { status: 409 });
  }
}
```

### D3 — Team-lead s podřízenými → **Reassign UI dialog + fallback na SYSTEM_DELETED**

Pre-check spočítá podřízené (brokers pod managerem, managers pod regional directorem). Response pro GET `/api/settings/delete-account/preview`:

```json
{
  "subordinates": {
    "brokers": [{"id": "...", "name": "..."}],
    "managers": [{"id": "...", "name": "..."}]
  },
  "reassignCandidates": [
    {"id": "...", "name": "...", "role": "MANAGER", "region": "..."}
  ]
}
```

UI flow:
1. Pokud `subordinates.brokers.length + subordinates.managers.length === 0` → přeskoč dialog
2. Jinak: dropdown „Převést X podřízených na: [select]" + CTA „Pokračovat"
3. Pokud `reassignCandidates.length === 0` → checkbox „Převést na SYSTEM (region potřebuje nového managera)" + auto email regional directorovi („Region {X} potřebuje nového managera, dočasně řízeno systémem")
4. Request body do DELETE zahrne `reassignToUserId: string | 'SYSTEM_DELETED'`

### D4 — Export-before-erasure → **Auto-trigger + 7-day cooling-off**

**Nový flow (nahrazuje immediate atomic transaction):**

```
T+0 (user clicks "Smazat účet"):
  ├─ Spustí export job (async, Art. 15 full export)
  ├─ Pošle email s ZIP download linkem (expire 7 days)
  ├─ User.deletionRequestedAt = now
  ├─ User.deletionScheduledAt = now + 7 days
  ├─ AuditLog: USER_ERASURE_REQUESTED
  └─ Response 202: "Smazání naplánováno na DD.MM. Můžete zrušit do té doby."

T+0 až T+7 (cooling-off window):
  ├─ Každý login: banner "Smazání účtu naplánováno na DD.MM. Zrušit?"
  ├─ POST /api/settings/delete-account/cancel → user.deletionRequestedAt = null
  └─ User stále active, může cancel

T+7 (cron erasure job — nový `scripts/cron/execute-scheduled-erasures.ts`):
  ├─ SELECT users WHERE deletionScheduledAt <= now AND deletedAt IS NULL
  ├─ Pro každého: spustí atomic transaction (current plan sekce 4-7)
  ├─ Pošle final confirmation email
  └─ AuditLog: USER_ERASURE_COMPLETED
```

**Schema changes navíc:**
- `User.deletionRequestedAt DateTime?` + index
- `User.deletionScheduledAt DateTime?` + index
- `User.deletionCancelledAt DateTime?` (audit trail)

**Cron setup:** `/etc/cron.d/gdpr-erasure`:
```
5 2 * * * root cd /var/www/car.zajcon.cz && /usr/bin/node scripts/cron/execute-scheduled-erasures.js >> /var/log/gdpr-erasure.log 2>&1
```

Runs 02:05 UTC daily (po DB backup 03:00 aby erasure bylo v dalším backup cyklu). 30-day GDPR deadline s 7-day window = 23 dní margin, adekvátní.

### D5 — Marketplace investor blocking → **Refuse 409 s strukturovaným blockers array**

Pre-check (sekce 5 tohoto dokumentu) rozšířit o investor-specific blokátory. Response:

```json
{
  "error": "ERASURE_BLOCKED",
  "blockers": [
    {
      "type": "active_investment",
      "id": "inv_abc123",
      "opportunityId": "flip_xyz789",
      "amount": 500000,
      "currency": "CZK",
      "status": "FUNDED",
      "expectedRefundDate": "2026-08-15",
      "link": "/investor/investments/inv_abc123"
    },
    {
      "type": "active_flip_opportunity",
      "id": "flip_xyz789",
      "status": "IN_REPAIR",
      "link": "/dealer/opportunities/flip_xyz789"
    }
  ],
  "legalBasis": "GDPR Art. 17/3/b — oprávněný nárok na ochranu práv (investiční prostředky)",
  "message": "Před smazáním účtu dokončete aktivní investice nebo si vyžádejte refund."
}
```

UI: seznam s linky + „Kontaktovat platformu" CTA pro exit strategy.

### D6 — DPO email → **`gdpr@carmakler.cz`**

- ENV: `GDPR_CONTACT_EMAIL=gdpr@carmakler.cz` (default, override per env)
- Kód: `lib/gdpr/contact.ts` → `export const GDPR_CONTACT_EMAIL = process.env.GDPR_CONTACT_EMAIL || 'gdpr@carmakler.cz'`
- Používat v: confirmation emaily (erasure request, erasure completed), `/ochrana-osobnich-udaju` stránka, footer kontakt sekce
- **Mailbox setup:** samostatný dev/ops task (Wedos admin UI) — do té doby **přesměrování na `info@carmakler.cz`** přes MX/alias nastavení; tracknutý jako **FIX-023 (DPO mailbox)** v implementator queue

### D7 — Dependency order

**✅ CONFIRMED:** F-031 AuditLog model FIRST → F-032 erasure SECOND. Team-lead schválil, implementátor dostane zadání v tomto pořadí.

---

## 1) Problem statement

### 1.1 Stav v produkci (ověřeno recon)

`app/api/settings/delete-account/route.ts` (47 řádků):
- ✅ Ověří session
- ✅ Pošle notifikaci adminům (`createNotification`)
- ❌ **Neprovede žádný výmaz / anonymizaci PII**
- ❌ **Žádný audit záznam**
- ❌ **Žádná konfirmace uživateli**

**GDPR důsledek:** porušení čl. 17/3 — data musí být smazána „bez zbytečného odkladu", nejpozději do 30 dní. Aktuální stav = data trvale uchována, pouze se „doufá" že admin zareaguje manuálně. **Vymahatelné ÚOOÚ pokutou 0.5-20M Kč / až 4 % obratu.**

### 1.2 Root cause analýza cascade chain

Ověřeno ve `prisma/schema.prisma`: **User** má 35+ relations na jiné tabulky, většina **bez explicitního `onDelete`** (Prisma default = `NoAction` ≈ Restrict).

**Proto hard `prisma.user.delete(id)` selže** s FK constraint errorem. Musíme **anonymizovat**, ne mazat.

**Bonus zjištění:** některé relation jsou `onDelete: Cascade` (Vehicle→VehiclePhoto/Image/Status, Listing→ListingPhoto/Inquiry, Order→OrderItem atd.) — kaskády fungují na dceřiných objektech, ale User jako rodičovský uzel nelze kaskádově smazat bez explicitního opt-in.

---

## 2) Rozhodovací matice — anonymize vs. hard-delete per tabulka

### Pravidlo rozhodnutí

```
Pro každou tabulku s FK na User rozhodujeme:
  1. Obsahuje PII?                → ano/ne
  2. Obsahuje finanční/právní record?  → ano/ne
  3. Je potřeba pro audit trail?       → ano/ne

Když finanční/legal/audit = YES → ANONYMIZE (zachovat row, scrub PII)
Když PII-only bez legal důvodu → HARD DELETE
Když ani PII ani legal → zůstává beze změny (např. role, level)
```

### 2.1 Matice — Batch 1 produktový ekosystém (dle schema.prisma)

| Tabulka | FK field | PII obsah | Legal retence? | **Akce** | Co zachovat |
|---|---|---|---|---|---|
| **User** | id (self) | email, phone, firstName, lastName, bio, avatar, bankAccount, ico, slug | ANO (commission 10y) | **ANONYMIZE** | id, role, status=DELETED, createdAt, totalSales (agregát bez PII), deletedAt |
| **Vehicle** | brokerId (line 238) | — (sám o sobě nemá PII, jen VIN vozidla) | ANO (technická/právní evidence vozidla) | **KEEP INTACT** (brokerId nullable) | vše |
| **VehicleInquiry** | brokerId (L357) | contact PII v polích | ANO (obchodní jednání) | **ANONYMIZE** (contact fields→null) | záznam existence |
| **Commission** | brokerId (L414) | salePrice/amount | **ANO 10 let** §89/4 DPH | **KEEP INTACT** (brokerId set to SYSTEM_DELETED user) | finanční záznam |
| **Notification** | userId (L447) | body může obsahovat jméno | NE | **HARD DELETE** | — |
| **Contract** | brokerId (L469) | brokerSignature, contractPdfUrl | ANO (smlouva 10 let) | **ANONYMIZE** (scrub signature, URL ponechat se záznamem „anonymized") | smlouva je legal proof |
| **AiConversation** | userId (L525) | conversation content s PII | NE | **HARD DELETE** | — |
| **Listing** | userId (L607) | contactName, contactPhone, contactEmail, city | NE (inzerát není legal record) | **ANONYMIZE contact fields, set status=INACTIVE** | vehicle data for marketplace analytics |
| **Inquiry** | userId (L752, optional) | name, email, phone, message | NE | **HARD DELETE** (pokud userId se shoduje) | — |
| **Favorite** | userId (L777) | — | NE | **HARD DELETE** | — |
| **ListingFeedConfig** | userId (L848) | feedUrl (může obsahovat auth) | NE | **HARD DELETE** | — |
| **Part** | supplierId (L893) | — | ANO (obchodní evidence) | **KEEP INTACT** (supplierId reassign SYSTEM_DELETED nebo SetNull) | inventář |
| **Order** | buyerId (L1013, optional) | shipping address, phone | **ANO 10 let** (reklamace/záruka) | **ANONYMIZE** (buyerId→SYSTEM_DELETED, scrub shippingAddress) | záznam transakce |
| **OrderItem** | supplierId (L1073) | — | ANO | **KEEP INTACT** (supplierId→SYSTEM_DELETED pokud se user=supplier mazal) | záznam dodávky |
| **FlipOpportunity** | dealerId (L1154) | — | ANO (marketplace deal record) | **KEEP INTACT** (dealerId→SYSTEM_DELETED) | deal log |
| **Investment** | investorId (L1199) | amount, paymentReference | **ANO 10 let (finanční)** + 5 let AML §35d | **BLOCK ERASURE** pokud `paymentStatus != REFUNDED`, jinak ANONYMIZE (investorId→SYSTEM_DELETED) | finanční záznam |
| **MarketplaceApplication** | reviewedById/convertedUserId (L1249, L1253) | contact info | NE (žádost o přístup) | **HARD DELETE** pokud lze, jinak SetNull | — |
| **SellerContact** | brokerId (L1360) | name, phone, email kontaktů makléře | NE (broker data, ne user data) | **KEEP INTACT** pokud broker zůstává. Pokud broker maže účet: **HARD DELETE** všech jeho contacts | — |
| **SellerCommunication** | brokerId (L1404) | message content | NE | **HARD DELETE** | — |
| **UserAchievement** | userId (L1436) | — | NE | **HARD DELETE** | — |
| **Escalation** | brokerId (L1468) | message/details | NE | **HARD DELETE** | — |
| **NotificationPreference** | userId (L1528) | — | NE | **HARD DELETE** | — |
| **EmailLog** | senderId (L1558) | email body, recipient | ANO (audit legitimních zpráv 6 měs.) | **ANONYMIZE** (senderId→SYSTEM_DELETED, scrub body/subject pokud obsahuje PII jiných osob) | audit |
| **PartsFeedConfig** | supplierId (L1607) | feedUrl | NE | **HARD DELETE** | — |
| **Partner** | userId (L1690, optional unique) | companyName | ANO (partnerská smlouva) | **SetNull + anonymize partner record** | smlouva |
| **PartnerActivity** | userId (L1743) | — | ANO (partner audit) | **KEEP INTACT** (userId→SYSTEM_DELETED) | audit |
| **Payment** | confirmedById (L-) | — | ANO (financial) | **KEEP INTACT** (confirmedById→SYSTEM_DELETED) | financial |
| **BrokerPayout** | brokerId / approvedById (L1333) | amount | **ANO 10 let** | **KEEP INTACT** (brokerId→SYSTEM_DELETED) | financial |
| **CebiaReport** | userId | reportData (VIN → může obsahovat historické vlastníky) | NE (ne user's PII) | **KEEP INTACT** (userId→SYSTEM_DELETED) pokud placený, jinak HARD DELETE | záznam platby |
| **DamageReport** | userId | — | ANO (vehicle audit) | **KEEP INTACT** (userId→SYSTEM_DELETED) | audit |
| **Watchdog** | userId (L778) | search criteria (můžou obsahovat PII?) | NE | **HARD DELETE** | — |
| **Lead** | assignedToId/assignedById | contact info | NE | **ANONYMIZE** (contact fields→null, assignedToId→SYSTEM_DELETED) | statistika leadu |
| **AuditLog** | userId (nový per F-031) | IP, UA, details | **ANO 3 roky** (GDPR compliance) | **KEEP INTACT** (userId→SYSTEM_DELETED) | compliance audit |

### 2.2 „SYSTEM_DELETED" user pattern

Pro zachování FK integrity při anonymizaci:

```ts
// Vytvoření seed row (jednorázově přes migration):
INSERT INTO "User" (id, email, firstName, lastName, role, status, passwordHash)
VALUES (
  'system-deleted-user',
  'deleted-user@carmakler.local',
  'Smazaný',
  'uživatel',
  'SYSTEM',         // nová role
  'DELETED',
  '$argon2id$dummy' // never-usable hash
);
```

Všechny `brokerId`/`userId`/`supplierId`/`buyerId`/`investorId`/`dealerId` reassignujeme na `system-deleted-user` ID místo `SetNull` tam, kde FK je `NOT NULL` (většina).

**Výhoda oproti SetNull migration:** nemusíme měnit schema (není třeba drop NOT NULL constraint), implementace je jen UPDATE.

### 2.3 Retention exception blokace

**Hard blokace erasure** pokud user má:
1. `Investment` s `paymentStatus != REFUNDED` — aktivní investice
2. `Commission` novější než 10 let a ne `status=COMPLETED` s `paidOutAt` starším než 10 let
3. `Order` s `paymentStatus=PAID` a `createdAt` novější než 10 let (DPH §89/4)
4. Open legal dispute (`Contract.status=DISPUTED`)

V těchto případech endpoint vrátí 409 s vysvětlením + retention period end date. **User zmíněn v ERASURE_DENIED audit eventu.**

---

## 3) Implementation flow

### 3.1 Pořadí závislostí (KRITICKÉ)

**Preferred: F-031 → F-032**

Důvody:
1. Anonymizace musí logovat do AuditLog (`ERASURE_REQUESTED`, `ERASURE_EXECUTED`, `ERASURE_DENIED`)
2. Pokud implementujeme F-032 bez F-031, erasure je „ghost action" — nelze prokázat splnění Art. 17 u ÚOOÚ auditu
3. F-031 je 3h práce (AuditLog model + migration + helper), F-032 pak využívá

**Pokud team-lead schválí reverse order:** F-032 obsahuje TODO komentář + log do `console.log` (transientní) + flag `TODO: migrate to AuditLog after F-031`. NOT RECOMMENDED — vytváří tech debt a neprokazatelnost.

### 3.2 Atomic transaction blueprint

```ts
// app/api/settings/delete-account/route.ts (přepis)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const userEmailBefore = session.user.email;

  // 1. PRE-CHECK: retention exceptions
  const exception = await checkRetentionExceptions(userId);
  if (exception.blocked) {
    await logAudit({
      userId, action: "ERASURE_DENIED",
      entityType: "User", entityId: userId,
      details: { reasons: exception.reasons, retentionUntil: exception.retentionUntil }, req
    });
    return NextResponse.json({
      error: "Nemůžeme okamžitě smazat účet — máte záznamy chráněné zákonnou retencí.",
      details: exception.reasons,
      retentionUntil: exception.retentionUntil,
    }, { status: 409 });
  }

  // 2. Log request
  await logAudit({ userId, action: "ERASURE_REQUESTED", entityType: "User", entityId: userId, req });

  // 3. Atomic transaction
  await prisma.$transaction(async (tx) => {
    const SYSTEM = "system-deleted-user";

    // 3a. HARD DELETE — PII-only, no legal holds
    await tx.notification.deleteMany({ where: { userId } });
    await tx.aiConversation.deleteMany({ where: { userId } });
    await tx.favorite.deleteMany({ where: { userId } });
    await tx.watchdog.deleteMany({ where: { userId } });
    await tx.userAchievement.deleteMany({ where: { userId } });
    await tx.notificationPreference.deleteMany({ where: { userId } });
    await tx.listingFeedConfig.deleteMany({ where: { userId } });
    await tx.partsFeedConfig.deleteMany({ where: { supplierId: userId } });
    await tx.escalation.deleteMany({ where: { brokerId: userId } });
    await tx.sellerCommunication.deleteMany({ where: { brokerId: userId } });
    await tx.sellerContact.deleteMany({ where: { brokerId: userId } });
    await tx.inquiry.deleteMany({ where: { userId } });
    // MarketplaceApplication, pokud user = žadatel (matched by email before anonymization)
    await tx.marketplaceApplication.deleteMany({ where: { email: userEmailBefore } });

    // 3b. ANONYMIZE contact fields, keep record
    await tx.listing.updateMany({
      where: { userId },
      data: {
        userId: SYSTEM,
        contactName: null, contactEmail: null, contactPhone: null,
        status: "INACTIVE",
      }
    });
    await tx.lead.updateMany({
      where: { OR: [{ assignedToId: userId }, { assignedById: userId }] },
      data: {
        assignedToId: SYSTEM,
        contactName: null, contactEmail: null, contactPhone: null,
      }
    });
    await tx.vehicleInquiry.updateMany({
      where: { brokerId: userId },
      data: { brokerId: SYSTEM /* + scrub contact fields dle schema */ }
    });

    // 3c. REASSIGN to SYSTEM_DELETED (preserve legal records)
    await tx.commission.updateMany({ where: { brokerId: userId }, data: { brokerId: SYSTEM } });
    await tx.brokerPayout.updateMany({ where: { brokerId: userId }, data: { brokerId: SYSTEM } });
    await tx.brokerPayout.updateMany({ where: { approvedById: userId }, data: { approvedById: SYSTEM } });
    await tx.contract.updateMany({
      where: { brokerId: userId },
      data: { brokerId: SYSTEM, brokerSignature: null /* base64 signature = PII */ }
    });
    await tx.vehicle.updateMany({ where: { brokerId: userId }, data: { brokerId: SYSTEM } });
    await tx.order.updateMany({
      where: { buyerId: userId },
      data: {
        buyerId: SYSTEM,
        shippingAddress: null, shippingCity: null, shippingZip: null,
        shippingPhone: null, shippingName: null,
      }
    });
    await tx.orderItem.updateMany({ where: { supplierId: userId }, data: { supplierId: SYSTEM } });
    await tx.part.updateMany({ where: { supplierId: userId }, data: { supplierId: SYSTEM } });
    await tx.flipOpportunity.updateMany({ where: { dealerId: userId }, data: { dealerId: SYSTEM } });
    await tx.investment.updateMany({ where: { investorId: userId }, data: { investorId: SYSTEM } });
    await tx.damageReport.updateMany({ where: { userId }, data: { userId: SYSTEM } });
    await tx.cebiaReport.updateMany({ where: { userId }, data: { userId: SYSTEM } });
    await tx.emailLog.updateMany({ where: { senderId: userId }, data: { senderId: SYSTEM } });
    await tx.partnerActivity.updateMany({ where: { userId }, data: { userId: SYSTEM } });
    await tx.payment.updateMany({ where: { confirmedById: userId }, data: { confirmedById: SYSTEM } });
    // Partner profil: SetNull na unique userId
    await tx.partner.updateMany({ where: { userId }, data: { userId: null } });
    // MarketplaceApplication reviewer/converter
    await tx.marketplaceApplication.updateMany({
      where: { reviewedById: userId }, data: { reviewedById: null }
    });
    await tx.marketplaceApplication.updateMany({
      where: { convertedUserId: userId }, data: { convertedUserId: null }
    });

    // 3d. ANONYMIZE User row (keep for FK integrity + audit trail)
    await tx.user.update({
      where: { id: userId },
      data: {
        email: `erased-${userId}@deleted.local`,
        phone: null,
        firstName: "Smazaný",
        lastName: "uživatel",
        passwordHash: "$argon2id$erased$never", // never-usable
        avatar: null, bio: null, slug: null,
        bankAccount: null, documents: null,
        brokerContractUrl: null, brokerSignature: null,
        ico: null, companyName: null, logo: null,
        specializations: null, cities: null,
        status: "DELETED",
        deletedAt: new Date(), // NEW FIELD — viz migration §4
        // zachovat: id, role, createdAt, totalSales, level (agregáty bez PII)
      }
    });

    // 3e. Log execution
    await tx.auditLog.create({
      data: {
        userId: null, // user už je anonymizován, akce = systém
        action: "ERASURE_EXECUTED",
        entityType: "User",
        entityId: userId,
        details: {
          formerEmail: userEmailBefore, // pro compliance audit trail
          tablesAffected: ["User", "Listing", "Vehicle", "Commission", "...15 dalších"],
        },
        ipAddress: req.headers.get("x-forwarded-for") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
      }
    });
  }, { timeout: 30_000 }); // 30s safety limit pro multi-table transaction

  // 4. Konfirmace email uživateli (mimo transaction — best-effort)
  try {
    await resend.emails.send({
      from: "Carmakler <noreply@carmakler.cz>",
      to: userEmailBefore,
      subject: "Potvrzení smazání účtu",
      html: `
        <p>Dobrý den,</p>
        <p>Váš účet u Carmakler byl anonymizován v souladu s čl. 17 GDPR. Osobní údaje byly nenávratně odstraněny z aktivní databáze.</p>
        <p><strong>Výjimky retence:</strong> finanční záznamy (provize, objednávky, investice) jsou zachovány po zákonnou dobu 10 let (§89/4 DPH, §35d AML), poté budou automaticky smazány.</p>
        <p>Pro dotazy kontaktujte <a href="mailto:dpo@carmakler.cz">dpo@carmakler.cz</a>.</p>
        <p>Čas zpracování: ${new Date().toLocaleString("cs-CZ")}</p>
      `,
    });
  } catch (err) {
    // Email failure neblokuje erasure — log do Sentry
    Sentry.captureException(err, { tags: { context: "erasure-confirmation-email" } });
  }

  // 5. Force logout (invalidate session)
  const response = NextResponse.json({
    message: "Váš účet byl anonymizován. Potvrzení bylo odesláno na původní email.",
  });
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  return response;
}
```

### 3.3 Helper funkce

```ts
// lib/gdpr/retention-exceptions.ts (NEW)
export async function checkRetentionExceptions(userId: string) {
  const [activeInvestments, recentCommissions, recentOrders, disputedContracts] = await Promise.all([
    prisma.investment.count({
      where: { investorId: userId, paymentStatus: { not: "REFUNDED" } }
    }),
    prisma.commission.count({
      where: {
        brokerId: userId,
        createdAt: { gte: new Date(Date.now() - 10 * 365 * 86400_000) },
        status: { not: "COMPLETED" },
      }
    }),
    prisma.order.count({
      where: {
        buyerId: userId,
        paymentStatus: "PAID",
        createdAt: { gte: new Date(Date.now() - 10 * 365 * 86400_000) },
      }
    }),
    prisma.contract.count({
      where: { brokerId: userId, status: "DISPUTED" }
    }),
  ]);

  const reasons: string[] = [];
  if (activeInvestments > 0) reasons.push(`Aktivní investice (${activeInvestments})`);
  if (recentCommissions > 0) reasons.push(`Nevypořádaná provize (${recentCommissions})`);
  if (recentOrders > 0) reasons.push(`Finanční záznamy do 10 let (${recentOrders})`);
  if (disputedContracts > 0) reasons.push(`Otevřený spor (${disputedContracts})`);

  const retentionUntil = reasons.length > 0
    ? new Date(Date.now() + 10 * 365 * 86400_000) // 10 let max
    : null;

  return {
    blocked: reasons.length > 0,
    reasons,
    retentionUntil,
  };
}
```

### 3.4 Idempotence

Endpoint **MUSÍ** být idempotent — druhé volání pro již anonymizovaného usera:
- Check na začátku: `if (user.status === "DELETED") return 410 Gone "Already erased"` (s prvním `deletedAt` timestampem)
- Log jako `ERASURE_REQUESTED` s flagem `alreadyErased: true`, ale neprovádí druhý run

---

## 4) Prisma migration requirements

### 4.1 Required schema changes

```prisma
model User {
  // ... stávající fields ...
  deletedAt DateTime?  // NEW — timestamp anonymizace
  @@index([deletedAt])
}
```

**Migration:** `20260415000000_add_user_deleted_at/migration.sql`
```sql
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
```

### 4.2 Seed SYSTEM_DELETED user

**Migration:** `20260415000001_seed_system_deleted_user/migration.sql`
```sql
INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, status, "createdAt", "updatedAt")
VALUES (
  'system-deleted-user',
  'deleted-user@carmakler.local',
  '$argon2id$erased$never-usable-hash',
  'Smazaný',
  'uživatel',
  'SYSTEM',
  'DELETED',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

### 4.3 Schema changes NOT needed (confirmed)

- Žádná změna `onDelete` rules nutná — anonymizujeme místo mazání
- Žádné dropnutí NOT NULL constraintů
- Existující FK constraints zůstávají intaktní

### 4.4 Data filtering v queries

Všechny existující dotazy na User musí přidat filter:

```ts
// lib/prisma-helpers.ts (NEW nebo rozšíření)
export const ACTIVE_USER = { status: { not: "DELETED" } };

// Použití ve všech API endpoints:
const brokers = await prisma.user.findMany({ where: { role: "BROKER", ...ACTIVE_USER } });
```

**Audit:** `grep -rn "prisma.user.findMany\|prisma.user.findFirst" app/` → přidat filter. Cca 40-60 míst.

---

## 5) Test scénář (comprehensive)

### 5.1 Unit test — `__tests__/gdpr/erasure.test.ts`

```ts
describe("GDPR Art. 17 erasure flow", () => {
  let testUser: User;

  beforeEach(async () => {
    // Setup: vytvořit test user + listing + order + contract
    testUser = await prisma.user.create({ data: { email: "test@test.cz", /* ... */ } });
    await prisma.listing.create({ data: { userId: testUser.id, /* ... */ } });
    // ... order, contract, notification, etc.
  });

  afterEach(async () => {
    // Cleanup
    await prisma.user.deleteMany({ where: { id: testUser.id } });
  });

  test("anonymizes PII fields on User", async () => {
    await callErasureEndpoint(testUser.id);
    const after = await prisma.user.findUnique({ where: { id: testUser.id } });
    expect(after?.email).toBe(`erased-${testUser.id}@deleted.local`);
    expect(after?.firstName).toBe("Smazaný");
    expect(after?.phone).toBeNull();
    expect(after?.status).toBe("DELETED");
    expect(after?.deletedAt).toBeInstanceOf(Date);
  });

  test("hard deletes PII-only records (notifications, favorites, etc.)", async () => {
    await callErasureEndpoint(testUser.id);
    const notifications = await prisma.notification.count({ where: { userId: testUser.id } });
    const favorites = await prisma.favorite.count({ where: { userId: testUser.id } });
    expect(notifications).toBe(0);
    expect(favorites).toBe(0);
  });

  test("preserves financial records (Commission, Order, Investment) with anonymized FK", async () => {
    await callErasureEndpoint(testUser.id);
    const commissions = await prisma.commission.findMany({ where: { brokerId: "system-deleted-user" } });
    expect(commissions.length).toBeGreaterThan(0);
    expect(commissions[0].salePrice).toBeDefined(); // finanční data zachována
  });

  test("anonymizes Listing contact fields but keeps vehicle data", async () => {
    await callErasureEndpoint(testUser.id);
    const listings = await prisma.listing.findMany({ where: { userId: "system-deleted-user" } });
    expect(listings[0].contactEmail).toBeNull();
    expect(listings[0].brand).toBeDefined(); // vehicle info zachován
    expect(listings[0].status).toBe("INACTIVE");
  });

  test("blocks erasure when user has active Investment", async () => {
    await prisma.investment.create({
      data: { investorId: testUser.id, paymentStatus: "CONFIRMED", amount: 100000, /* ... */ }
    });
    const res = await callErasureEndpoint(testUser.id);
    expect(res.status).toBe(409);
    expect(res.body.error).toContain("Aktivní investice");
  });

  test("creates ERASURE_EXECUTED audit entry", async () => {
    await callErasureEndpoint(testUser.id);
    const audit = await prisma.auditLog.findFirst({
      where: { entityId: testUser.id, action: "ERASURE_EXECUTED" }
    });
    expect(audit).toBeDefined();
    expect(audit?.details).toMatchObject({ formerEmail: "test@test.cz" });
  });

  test("is idempotent — second call returns 410", async () => {
    await callErasureEndpoint(testUser.id);
    const res = await callErasureEndpoint(testUser.id);
    expect(res.status).toBe(410);
  });

  test("sends confirmation email to former address", async () => {
    const resendSpy = vi.spyOn(resend.emails, "send");
    await callErasureEndpoint(testUser.id);
    expect(resendSpy).toHaveBeenCalledWith(expect.objectContaining({
      to: "test@test.cz",
      subject: "Potvrzení smazání účtu",
    }));
  });

  test("invalidates session cookies", async () => {
    const res = await callErasureEndpoint(testUser.id);
    const setCookies = res.headers.getSetCookie();
    expect(setCookies.some(c => c.includes("next-auth.session-token=") && c.includes("Max-Age=0"))).toBe(true);
  });
});
```

### 5.2 E2E test — `e2e/gdpr-erasure.spec.ts`

```ts
test("full erasure flow from UI", async ({ page }) => {
  // 1. Register test user
  await page.goto("/registrace");
  // ... fill form ...
  // 2. Create listing
  await page.goto("/inzerat/pridat");
  // ... fill form ...
  // 3. Trigger delete from settings
  await page.goto("/makler/settings");
  await page.click("button:has-text('Smazat účet')");
  await page.click("button:has-text('Ano, smazat')");
  // 4. Verify redirect + session cleared
  await expect(page).toHaveURL("/login");
  // 5. Try login → should fail
  await page.fill('input[name="email"]', "test@test.cz");
  await page.fill('input[name="password"]', "OldPassword123");
  await page.click('button[type="submit"]');
  await expect(page.locator("text=Neplatné přihlašovací údaje")).toBeVisible();
});
```

### 5.3 Manual QA checklist

- [ ] Test user přihlášen → klik „Smazat účet" → 409 pokud má aktivní investice (seed data)
- [ ] Test user bez legal holds → successful erasure, redirect, session invalid
- [ ] Email doručí do inboxu testera (Mailtrap sandbox)
- [ ] `psql` query: `SELECT email FROM "User" WHERE id = '<test-id>'` → `erased-<id>@deleted.local`
- [ ] `SELECT "brokerId" FROM "Commission" WHERE id IN (test_commission_ids)` → `system-deleted-user`
- [ ] `SELECT action FROM audit_logs WHERE "entityId" = '<test-id>'` → `ERASURE_EXECUTED`

---

## 6) Acceptance criteria

### Code
- [ ] `POST /api/settings/delete-account` přepsán dle §3.2 blueprint
- [ ] `lib/gdpr/retention-exceptions.ts` existuje
- [ ] Migration `add_user_deleted_at` + `seed_system_deleted_user` aplikována
- [ ] `User.deletedAt` field + index v schema
- [ ] `ACTIVE_USER` helper aplikován v relevantních queries (audit grep)

### Tests
- [ ] 9 unit testů v `erasure.test.ts` passing
- [ ] E2E Playwright test passing
- [ ] Manual QA checklist signed-off

### Compliance
- [ ] Konfirmační email funguje (Resend sandbox + prod)
- [ ] AuditLog entry pro každou erasure (via F-031)
- [ ] 30-dní deadline Art. 17/3 pokrytý synchronním execution (ne async queue)
- [ ] Privacy policy update (`app/(web)/ochrana-osobnich-udaju/page.tsx`) popisuje:
  - Co se maže (PII-only tables)
  - Co zůstává (finanční retence 10 let)
  - Jak dlouho trvá (okamžitě + 10 let legal holds)
  - Kontakt DPO

### Ops
- [ ] Sandbox smoke test před prod deploy
- [ ] Deploy změn synchronně (migration → code → restart)
- [ ] Sentry alert pro failed erasure transactions (tag `gdpr-erasure-fail`)

---

## 7) Risk & edge cases

### Risk
- **R1 (high):** Multi-table transaction timeout (30s limit) pokud user má 1000+ listingů / orderů. **Mitigation:** batch update (100 rows/iteration), escape to async job pokud > 30s.
- **R2 (high):** Race condition — user mění listing během erasure. **Mitigation:** `SELECT FOR UPDATE` na User row, zablokuje konkurentní session.
- **R3 (medium):** SYSTEM_DELETED user může být omylem smazán adminem. **Mitigation:** middleware guard `if (userId === 'system-deleted-user') return 403`.
- **R4 (medium):** Prisma Client generates type expecting non-null FK → TS compilation break after anonymization if fields were `String` not `String?`. **Mitigation:** audit schema pro NOT NULL FK fields — všechny v matici mají opt-in (většina User FK je NOT NULL, SYSTEM_DELETED zajistí non-null).
- **R5 (low):** Email confirmation fails → erasure prošel, user neví. **Mitigation:** Sentry alert + admin notification pro retry manuálně.
- **R6 (medium):** Anonymizovaný user se pokusí znovu registrovat se stejným emailem → success (email volný). Nový user bude mít fresh data, ale v audit logu původní historie zachována pod `erased-<id>@deleted.local`.
- **R7 (high):** F-032 deployed bez F-031 = žádný audit log = nelze prokázat compliance. **Mitigation:** enforce order F-031 → F-032 (team-lead explicit acknowledge).

### Edge cases
- User je jediný SUPER_ADMIN → blokovat erasure, vyžadovat převod role jinému adminovi před smazáním
- User má nevydělané provize (`status=PENDING`) → flag `pendingPayout`, admin notification „vyplatit před erasure"
- User je Manager s přiřazenými broker (teamMembers) → reassign broker ke SYSTEM_DELETED manageru nebo force admin-action
- User je Partner s VAT invoicing → partner record má vlastní legal retence (10 let), reassign partner.userId=null ale keep partner company data

---

## 8) Open questions pro Radima

1. **Záloha/backup** — až anonymizovaný user přepíše PII v live DB, **backupy obsahují původní PII** dokud nevyprší retention. Máme politiku purge backupů po 10 letech? (Viz AUDIT-024 backup retention Q.)
2. **SUPER_ADMIN edge case** — pokud Radim jako jediný admin žádá erasure, jak? (Musí se přidat 2. admin PŘED erasure; fallback: manuální DBA proces.)
3. **Team lead / Manager erasure** — broker který žádá erasure má přiřazené subordinates (`teamMembers`). Reassign k SYSTEM_DELETED manageru je funkční, ale broker-strategicky špatné (subordinates bez vedení). Alternativa: force admin-action nejdřív.
4. **Export před erasure** — má user povinnost nejdřív si stáhnout Art. 15 export? (GDPR nevyžaduje, ale best practice.) Navrhuji zobrazit tlačítko „Stáhnout moje data" před confirm modal.
5. **Marketplace zvláštní** — pokud marketplace spustí s investicemi, erasure investora s paidOutAt < 10 let = blokováno. Komunikujeme to jasně v /pro-investory landing?
6. **DPO contact** — `dpo@carmakler.cz` kam pošle user reklamaci erasure? (Potřebujeme alespoň alias.)

---

## 9) Out of scope

- ❌ Automatizovaný purge backupů po 10 letech (P1, jiný task)
- ❌ Retention cron pro post-10y hard delete (P1, souvisí s AUDIT-024 retention policy)
- ❌ Bulk erasure admin tool (P2 — zatím jen per-user self-service)
- ❌ GDPR consent log (P2 — tracking kdy user dal/odvolal marketing opt-in)
- ❌ Anonymizace v `EmailLog` zpráv které zmiňují jiné users (cross-user PII) — složité, P2
- ❌ Recycled email prevence (někdo se zaregistruje se stejným emailem po erasure) — akceptujeme jako feature

---

**Verdict plánovače:**

Tohle je **P0 regulatorní fix**, ne nice-to-have. Pokud Radim nereaguje a první zpráva od user/ÚOOÚ dorazí za víc než 30 dní, máme **vymahatelné porušení**.

**Doporučené pořadí provedení:**
1. **F-031 AuditLog model first** (3h — model + migration + helper)
2. **F-032 erasure flow** (1.5-2 dny — per tento plán)
3. **AUDIT-024 full GDPR suite** (zbylé elementy: Art. 15 rozšíření, retention cron, DPO kontakt)

**Implementátor může začít F-031+F-032 paralelně s AUDIT-001 a AUDIT-003** — nejsou na kritické cestě, neblokují sebe.

**Po dokončení F-032:** provést **live test na sandboxu** s reálným test userem, zvalidovat že anonymizace funguje atomically a že `dpo@carmakler.cz` email dorazí. Teprve potom prod deploy.
