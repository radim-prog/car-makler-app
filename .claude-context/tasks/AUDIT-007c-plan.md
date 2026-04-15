# AUDIT-007c — Plán: Shop autodílů (katalogizace + distributor API)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (core business product, ale launch možný i bez distributor API)
**Odhadovaná práce implementátora:** 1-2 dny (launch) + 2-3 dny (distributor API — po launchi)
**Depends on:** —

---

## 1) Recon výstup (stav 2026-04-14)

**Odhad completion:** ~80 % HOTOVO pokud odložíme distributor API, ~55 % s distributor API.

**Kompletní:**
- Middleware: subdomain `shop.carmakler.cz` → `app/(web)/shop/` + `/dily/` (nerewrituje existující path), brand/model/rok kaskáda `/dily/znacka/[brand]/[model]/[rok]` s diakritikou 301 redirect
- Prisma modely kompletní:
  - `Part`: id/slug/supplierId/category/name/description/partNumber/oemNumber/manufacturer/warranty/stock/price/wholesalePrice/markupPercent/condition/partType (USED/NEW/AFTERMARKET), **raw kompatibilita:** `compatibleBrands[]`, `compatibleModels[]`, `compatibleYearFrom/To`, `universalFit`
  - `Order`: status (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), deliveryMethod (PPL/DPD/ZASILKOVNA/GLS/CESKA_POSTA), paymentMethod (BANK_TRANSFER/COD/CARD), paymentStatus, guestToken, tracking info
  - `OrderItem`: commissionRateApplied snapshot, carmaklerFee, supplierPayout
  - `PartsFeedConfig`: feedUrl, feedFormat (XML/CSV/JSON), fieldMapping JSON, updateFrequency
  - `PartsFeedImportLog`: totalItems/created/updated/errors
  - `ReturnRequest`: WITHDRAWAL (14-dní)/WARRANTY, status NEW→RECEIVED→IN_REVIEW→APPROVED→REFUNDED, 30-den deadline (§19/3 ZoS)
- PWA pro PARTS_SUPPLIER: `/app/(pwa-parts)/parts/` (onboarding, my inventory, new, edit, profile)
- Cart: `lib/cart.ts` — localStorage + event-driven `cart-updated`
- Checkout: `/app/(web)/shop/objednavka/page.tsx` (3-step: doručení → platba → potvrzení)
- Order creation: `/api/orders` s stock validation v transakci, guest checkout token
- Returns: admin endpoints `/app/api/admin/returns`, public formulář `/shop/vraceni-zbozi/page.tsx`
- SeoContent model pro pre-seeded landing pages (brand/model/year/category)

**Částečné / slabiny:**
- **Distributor API (AutoKelly, AP Partner): 0% — úplně chybí** `lib/integrations/`. PartsFeedConfig schema je připraven pro pull (XML/CSV/JSON feed), ale žádný parser, žádný auth client, žádný push-webhook handler.
- **Zásilkovna widget:** backend field `zasilkovnaPointId` ano, ale frontend `<script src="widget.packeta.com">` na checkout **chybí** → zákazník nemůže vybrat pickup point.
- **Shipping labels:** `shippingLabelUrl` field na Order + `getLabelUrl()` metoda ale throw „not implemented" u všech 5 dopravců.
- **Stripe checkout:** `/api/stripe/*` + `/api/payments/*` configured, ale end-to-end flow z košíku → Stripe → webhook → Order status CONFIRMED = neověřeno.
- **VIN mapping:** Kompatibilita v Part modelu je **raw JSON arrays**, ne `PartVehicleFitment` pivot. Chybí `getCompatibleParts(vin: string)` resolver → výhoda katalogizace „podle VINu" není plně exploited; katalog filtruje přes dropdown.

**Chybí:**
- Distributor API (AutoKelly, AP Partner) — complete greenfield
- Zásilkovna widget UI
- Shipping label generation (nutné pro expedici)
- VIN resolver (P2 enhancement, ne blocker)

## 2) Cíle AUDIT-007c

1. **Launch-ready subset:** shop může přijímat objednávky i bez distributor API (vrakoviště plní ručně přes PWA)
2. **Zásilkovna widget + shipping labels** (minimum viable fulfillment)
3. **Stripe checkout end-to-end** ověření
4. **Distributor API roadmap** jako samostatný follow-up (post-launch)

## 3) Plán implementace

### 3.1 Zásilkovna widget (P0, 2h)

```tsx
// components/shop/checkout/ZasilkovnaSelector.tsx (NOVÝ)
"use client";
import Script from "next/script";

export function ZasilkovnaSelector({ onSelect }: Props) {
  useEffect(() => {
    window.Packeta?.Widget.pick(
      process.env.NEXT_PUBLIC_ZASILKOVNA_API_KEY!,
      (point) => {
        onSelect({ id: point.id, name: point.name, street: point.street, city: point.city });
      },
      { country: "cz", language: "cs" }
    );
  }, []);
  return <div id="packeta-widget" />;
}
```

Checkout page: při volbě deliveryMethod=ZASILKOVNA zobrazit widget, uložit `zasilkovnaPointId` do Order.

Env: `NEXT_PUBLIC_ZASILKOVNA_API_KEY` — musí být veřejný (widget js), přidat do `.env.example`.

### 3.2 Shipping labels (P1, 1 den)

**Priorita: Zásilkovna** (nejvíc objednávek očekáváno).

```ts
// lib/shipping/carriers/zasilkovna.ts — implementace
async createShipment(order: Order): Promise<{ labelUrl: string; trackingNumber: string }> {
  const response = await fetch("https://www.zasilkovna.cz/api/rest", {
    method: "POST",
    body: /* XML payload dle Packeta API spec */,
    headers: { "X-API-Key": process.env.ZASILKOVNA_API_KEY! },
  });
  // parse response, return PDF label URL + tracking number
}
```

Ostatní 4 (DPD, PPL, GLS, Česká pošta) — stub s dry-run mode (log + manual label printing), real API integrace je P2.

### 3.3 Stripe checkout end-to-end ověření (P1, 2h)

Testovací flow (na sandboxu):
1. Přidat položku do košíku
2. Checkout → Stripe Checkout session vytvořena
3. Test card 4242 4242 4242 4242 → platba
4. Webhook volá `/api/payments/webhook` → Order.paymentStatus = PAID, status = CONFIRMED
5. Supplier dostane email (Resend)
6. Buyer dostane email (Resend)

**Pokud něco selže:** flag v `AUDIT-007c-impl.md`, fix před launchem.

### 3.4 VIN resolver (P2, 1 den — post-launch enhancement)

```ts
// lib/parts/vin-compatibility.ts (NOVÝ)
export async function getCompatibleParts(vin: string, category?: string) {
  const decoded = await decodeVin(vin); // lib/vin-decoder.ts
  if (!decoded) return [];
  return prisma.part.findMany({
    where: {
      OR: [
        { universalFit: true },
        {
          AND: [
            { compatibleBrands: { has: decoded.brand } },
            { compatibleModels: { has: decoded.model } },
            { compatibleYearFrom: { lte: decoded.year } },
            { compatibleYearTo: { gte: decoded.year } },
          ]
        }
      ],
      ...(category && { category }),
      stock: { gt: 0 },
    }
  });
}
```

Routa `/dily/vin/[vin]` → landing s pre-filtered katalog. Diferenciátor vs. Bazoš.

**Pozor:** Prisma `has` operator funguje pro `String[]`, ověřit že compatibleBrands je `String[]` v schema.

### 3.5 Distributor API — roadmap (samostatný post-launch sprint)

**Fáze 1 — AutoKelly pull feed (2 dny)**

- Získat AutoKelly B2B credentials od Radima (API key, endpoint, feed format)
- `lib/integrations/autokelly/client.ts` — OAuth / API key auth
- `lib/integrations/autokelly/parser.ts` — XML/JSON → Part create/update
- Cron `/api/cron/feed-import` s CRON_SECRET auth, volá `PartsFeedImportRunner` pro každou PartsFeedConfig
- Logs do PartsFeedImportLog (totalItems, created, updated, errors)

**Fáze 2 — AP Partner (1 den)**

Podobné, jiný format parser.

**Fáze 3 — Live stock sync + price updates** (P2)

Incrementální updates přes webhook (pokud AP/AK podporují), jinak daily cron.

**Blokující otázky:**
- Má Radim B2B účet u AutoKelly? AP Partner? Credentials?
- Commission struktura: my si přičítáme `markupPercent` nebo žijeme z `wholesalePrice` vs retail gap?

## 4) Acceptance criteria

- [ ] Zásilkovna widget funguje na checkout, pickup point se uloží
- [ ] Zásilkovna `createShipment()` vrací real tracking number + label URL
- [ ] Stripe end-to-end checkout passing (test card → Order CONFIRMED → emaily)
- [ ] Ostatní 4 dopravci mají dry-run stub (log-only, manuální label)
- [ ] `npm run test` + integration test pro Zasilkovna client (mocked API) passing
- [ ] Distributor API **NE** v scope launchového AUDIT-007c (dokumentováno v `AUDIT-007c-followup.md`)

## 5) Risk & open questions

### Risk
- **R1 (medium):** Zásilkovna widget vyžaduje veřejný API key → může být abused. **Mitigation:** v Zásilkovna admin zapnout domain whitelist na `*.carmakler.cz`.
- **R2 (medium):** Stripe webhook secret musí být správně nastaven, jinak webhook ignored. **Mitigation:** `stripe listen --forward-to https://car.zajcon.cz/api/payments/webhook` test + check `STRIPE_WEBHOOK_SECRET` v prod env.
- **R3 (low):** Bez distributor API je katalog malý (jen vrakoviště). **Mitigation:** ne-blocker pro launch, Radim bude mít realistic user feedback před rozhodnutím prioritizace AutoKelly.
- **R4 (low):** guest checkout bez email verifikace — guestToken může být abused. **Mitigation:** token je jednorázový + platnost 30 dní.

### Open questions pro Radima
1. **Distributor API**: máme B2B credentials u AutoKelly / AP Partner? Kdy lze začít integraci (launch + 1 týden?)
2. **Shipping**: kdo tiskne labely (manuálně v BackOffice, nebo auto-generated PDF v dodavatelské PWA)?
3. **Commission model na dílech**: `markupPercent` field implicates, že my určujeme markup. Jak default? 15 %? 20 %? Per category?
4. **Vrakoviště onboarding**: prošel nějakým schvalováním (ICO check, smlouva)?
5. **Reklamace**: §19/3 ZoS 30-dní deadline je v modelu. Kdo odpovídá na customer kontakt při reklamaci: shop admin centrálně, nebo supplier sám?

## 6) Out of scope

- ❌ Distributor API (AutoKelly, AP Partner) — **samostatný AUDIT-007c-followup**, post-launch
- ❌ PartVehicleFitment pivot migrace — raw arrays stačí pro MVP, refactor je P3
- ❌ Real API pro DPD/PPL/GLS/ČP — dry-run stub OK, real integrace post-launch
- ❌ Předzákonné schvalování objednávek (AML check pro dražší díly) — N/A při malém ticket size
- ❌ Multi-supplier split orders (jedna objednávka, více dodavatelů, split shipment) — P2 enhancement

---

**Verdict plánovače:** Shop **může launch** během 1-2 dnů s ručně naplněným katalogem od vrakovišť + Zásilkovna + Stripe. Distributor API je nejvýraznější dluh (3-4 dny post-launch). VIN resolver je killer feature pro diferenciaci, ale ne blocker.
