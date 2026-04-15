# AUDIT-007a — Plán: Makléřská síť (Broker PWA)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (core business product, ale stabilní základ)
**Odhadovaná práce implementátora:** 3-5 dní
**Depends on:** AUDIT-001 (pool hardening — broker PWA generuje nejvíc conn)

---

## 1) Recon výstup (stav 2026-04-14)

**Odhad completion:** ~70 % HOTOVO, 25 % ČÁSTEČNĚ, 5 % CHYBÍ.

**Kompletní / solidní:**
- Routa: `app/(pwa)/makler/` (onboarding, vehicles, provize, contacts, leads, messages, offline)
- Prisma modely: User (role BROKER/MANAGER/REGIONAL_DIRECTOR), Vehicle (VIN, workflowChecklist JSON, status), Commission, Lead, AiConversation, BrokerPayout
- Onboarding: 5 kroků + quiz (10 otázek s Vitest coverage)
- Fotky: Sharp watermark, PhotoCategory enum (13 kategorií: EXT_FRONT/REAR/LEFT/RIGHT, INT_FRONT/REAR, DASHBOARD, TRUNK, ENGINE, WHEELS, DETAIL, DEFECT, DOCUMENT), self-host `/var/www/uploads`
- Claude API: `app/api/assistant/generate-description/route.ts` (claude-sonnet-4-6 generuje 3-5 odstavců CZ popisu z vehicle specs)
- Commission math: validovaná `commission-calculator.test.ts` (50/50 split, 25k min, -2500 manager bonus)
- Offline sync: OfflineStorage IndexedDB `carmakler-offline` v3, Background Sync events (sync-vehicles, sync-images, sync-contracts, sync-contacts)
- Lead management: source WEB_FORM/EXTERNAL_APP/MANUAL/REFERRAL, status NEW→ASSIGNED→CONTACTED→REJECTED, role-based filtering

**Částečné (FIX NEEDED):**
- **Workflow checklist 9 fází / 28 kroků:** endpoint GET/PUT funguje, ale schema je generic `{ steps: {}, lastUpdated }` bez hard-coded definice. **Frontend UI neexistuje** — makléř nemá rozhraní na odškrtnutí kroků.
- **E2E testy broker flow:** headed-all-flows.spec.ts pokrývá jen admin. Chybí e2e pro onboarding + vehicle creation + workflow completion.
- **Photo slot guide:** 12 slotů enum, ale PhotoCategory obsahuje 13 hodnot (přibylo DETAIL/DEFECT/DOCUMENT). Commit `d985efd` zmiňuje 13 exterior slots — pravděpodobně „exterior" míní jiné členění. Nekonfliktní, jen vyjasnit UI guide.

**Chybí (NOVÉ P1 tasky):**
- **E2E test broker onboarding + vehicle lifecycle** (5→published→sold→provize payout)
- **Workflow UI** (wizard / checklist komponenta konzumující `workflowChecklist` JSON)

## 2) Cíle AUDIT-007a

1. **Ověřit completeness proti Radimově vizi** (makléř v terénu nabírá auto → ze smartphonu workflow → BackOffice approval → prodej → provize payout) end-to-end
2. **Identifikovat bloker pro launch:** co brání makléři reálně použít PWA zítra?
3. **Navrhnout 9 fází / 28 kroků workflow UI** (strukturu, data contract, akceptační UX)
4. **Lead flow propojení** — web form `wantsBrokerHelp=true` (AUDIT-007b) musí trigger Lead v broker systému

## 3) Plán implementace

### 3.1 Workflow UI (P1, highest impact)

**Data contract (návrh):**

```ts
// lib/broker/workflow-definition.ts (NOVÝ)
export const BROKER_WORKFLOW = [
  { phase: 1, name: "Prvotní kontakt", steps: [
    { id: "lead_received", label: "Lead přijat", required: true },
    { id: "owner_contacted", label: "Majitel kontaktován (do 2h)", required: true },
    { id: "meeting_scheduled", label: "Domluven termín prohlídky", required: true },
  ]},
  { phase: 2, name: "Prohlídka vozu", steps: [...] },
  // ... 9 fází celkem, 28 kroků
] as const;
```

**Source of truth pro 28 kroků:** team-lead dodá (nebo Radim) — **blokující otázka**. V codebase nevidět žádný finální seznam. Commit `f415e93` bude mít detail.

**UI komponenta:** `components/pwa/vehicles/WorkflowChecklist.tsx`

- Accordion 9 fází, v každé fázi checkbox list
- Auto-save do `Vehicle.workflowChecklist` JSON při check
- Progress bar (completed steps / 28)
- Lock dalších fází dokud není předchozí kompletní?  ← **otázka UX pro Radima**
- Při poslední fázi (prodej) trigger Commission payout flow

**API:** stávající `PUT /api/vehicles/[id]/workflow` stačí, jen přidat validaci že `steps` keys jsou subset definice.

### 3.2 E2E testy broker flow (P1)

**Playwright spec:** `__tests__/e2e/broker-lifecycle.spec.ts`

```
1. Login jako BROKER
2. Onboarding (pokud onboardingStep < 5) → dokončit 5 kroků + quiz
3. Nová vehicle → wizard (VIN decoder → photos 12 slotů → publish)
4. Workflow checklist: odškrtnout 28 kroků (simulace prodeje)
5. Vehicle status → SOLD → Commission auto-created
6. Ověřit payout pending v /provize
```

Sandbox: `https://car.zajcon.cz` (bez Basic Auth).

### 3.3 Lead trigger z inzerce (propojení s 007b)

**Zjištění 007b:** `Listing.wantsBrokerHelp: Boolean` existuje v DB + form, ale **no webhook/trigger**.

**Fix:** `app/api/listings/route.ts` při POST listing s `wantsBrokerHelp=true`:

```ts
if (listing.wantsBrokerHelp) {
  await prisma.lead.create({
    data: {
      source: "WEB_FORM",
      status: "NEW",
      sourceListingId: listing.id,
      contactName: listing.contactName,
      contactPhone: listing.contactPhone,
      contactEmail: listing.contactEmail,
      vehicleBrand: listing.brand,
      vehicleModel: listing.model,
      vehicleYear: listing.year,
      message: `Žádost o makléře od inzerenta ${listing.slug}`,
      // assignedBrokerId: null → trigger manual assignment by MANAGER
    }
  });
}
```

**Assignment strategy:** prvotně manuální (MANAGER v adminu). Automatická round-robin / geo-based je P2.

### 3.4 Photo slot reconciliation (drobnost)

PhotoCategory enum má 13 hodnot včetně DETAIL/DEFECT/DOCUMENT. Commit `d985efd` mluví o 13 **exterior** slotů, ale reálně enum míchá exterior + interior + dokumentaci.

**Fix:** `PhotoSlotsGuide.tsx` — přeznačit kategorie podle reálného použití (exterior 8 / interior 4 / dokumentace 1 = 13). Nic kód-breaking, jen UI konzistence.

## 4) Acceptance criteria

- [ ] `lib/broker/workflow-definition.ts` obsahuje 9 fází / 28 kroků (schváleno team-leadem/Radimem)
- [ ] `WorkflowChecklist.tsx` renderuje s progress barem, auto-save funguje
- [ ] `e2e/broker-lifecycle.spec.ts` projde na sandboxu (login → onboarding → vehicle → workflow → sold → commission)
- [ ] Lead trigger z `wantsBrokerHelp=true` funguje, Lead se objeví v `/admin/leads` i `/makler/leads` (podle role)
- [ ] PhotoSlotsGuide UI vysvětluje 13 slotů bez zmatku
- [ ] `npm run build` + `npm run test` + `npm run test:e2e` passing

## 5) Risk & open questions

### Risk
- **R1 (medium):** Nesouhlas na 28 kroků definice → blokuje workflow UI. **Mitigation:** dodat kostra se strukturou z commitu `f415e93`, sladit s Radimem.
- **R2 (low):** Lead round-robin není implementován → první leady budou přiřazovány manuálně, OK pro MVP.
- **R3 (low):** Offline sync + workflow auto-save může triggerovat conflict pokud makléř mění workflow offline + online current. **Mitigation:** last-write-wins strategy + Sentry alert na conflict.

### Open questions pro Radima (přes team-lead)
1. **28 kroků workflow** — existuje kanonický seznam? (commit `f415e93` má být zdroj; ale git má jen 2 commity — kde je reálný detail?)
2. **Workflow UX**: můžou makléři skočit přes fázi, nebo musí odškrtnout postupně?
3. **Lead assignment**: manuálně (MANAGER), nebo auto round-robin dle regionu (REGIONAL_DIRECTOR)?
4. **AI asistent scope**: jenom generování popisů, nebo plánuje Radim i FAQ bot / pricing suggestions / kontrola smlouvy?
5. **Onboarding quiz passing score**: 8/10? 10/10? Může makléř opakovat?

## 6) Out of scope AUDIT-007a

- ❌ AI asistent rozšíření (→ samostatný task, možná AUDIT-012 integrace)
- ❌ Marketplace investic dealer flow (→ AUDIT-007d)
- ❌ Provize payout automatizace (manuální bankovní převod je OK pro MVP)
- ❌ Geolocation-based lead assignment (→ P2 backlog)
- ❌ Push notifikace (→ AUDIT-025 PWA)

---

**Verdict plánovače:** Broker PWA je **nejdále dotažený produkt** v ekosystému. 3-5 dní práce od „can launch" statusu. Workflow UI + e2e testy + lead trigger z inzerce = hlavní dluhy. Commission math je validovaný → finanční důvěra je OK.
