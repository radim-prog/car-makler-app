# AUDIT-007b — Plán: Inzerce (Bazoš-like free)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (self-contained produkt, low dependency)
**Odhadovaná práce implementátora:** 2-3 dny
**Depends on:** —
**Propojení:** AUDIT-007a (lead trigger z `wantsBrokerHelp`)

---

## 1) Recon výstup (stav 2026-04-14)

**Odhad completion:** ~85 % HOTOVO, 15 % ČÁSTEČNĚ/CHYBÍ.

**Kompletní:**
- Middleware subdomain rewrite `inzerce.carmakler.cz/**` → `app/(web)/inzerce/**`
- Prisma `Listing` model (kompletní): slug, userId, listingType (PRIVATE/DEALER/BROKER), brand/model/year/mileage/price, priceNegotiable, condition, VIN, contact, city, description, equipment JSON, highlights JSON, isPremium+premiumUntil, **wantsBrokerHelp** ← lead hook, moderationStatus (AUTO_APPROVED/PENDING_REVIEW/APPROVED/REJECTED), status (DRAFT/ACTIVE/INACTIVE/SOLD/EXPIRED), flagged+flagReasons
- `Inquiry` model: name/email/phone/message + reply/repliedAt/status (NEW/READ/REPLIED/CLOSED)
- Form wizard 6 kroků: `components/web/listing-form/ListingFormWizard.tsx`
- VIN decoder: `lib/vin-decoder.ts` (vindecoder.eu primární + NHTSA fallback, auto-fill brand/model/year)
- Upload: `/app/api/upload/route.ts` (self-host, watermark enabled, max 10 MB)
- Vyhledávání + filtry: `/app/api/listings/route.ts` (brand, model, price, year, city, fuelType, bodyType, condition; Prisma fulltext `searchVector` tsvector)
- Moderace: `lib/listing-flagging.ts` (PRICE_TOO_LOW, DUPLICATE_VIN, FEW_PHOTOS → PENDING_REVIEW, jinak AUTO_APPROVED)
- Admin queue: `/app/(admin)/admin/inzerce/[id]/page.tsx`
- Email templates: `lib/email-templates/listing/inquiry-notification.ts`, `inquiry-reply.ts`

**Otevřené položky (3 TODO):**
1. **Paywall status nejasný**: `isPremium` + `premiumUntil` v DB existují, Stripe webhook+checkout routes existují (`/api/payments/*`), ale **nevypadá to že je connected s inzerát form**. Radim: „free Bazoš-like". Musí se ověřit že žádný platební gate není aktivní.
2. **SEO chybí**: sitemap má statickou `/inzerce` (priority 0.8), ale **no dynamic listing URLs**. Structured data (JSON-LD Product/Vehicle) na detail page nevidět.
3. **Lead trigger `wantsBrokerHelp`**: field je v DB + formu, ale **no code který vytváří Lead entity** v broker systému. (cross-reference AUDIT-007a §3.3)

**Security gap**: inquiry form (Step5 contact) nemá viditelnou captchu. Spam resistance?

## 2) Cíle AUDIT-007b

1. **Confirm free model:** žádný paywall/gate na inzerát publishing
2. **Dynamic sitemap** pro všechny ACTIVE listingy + structured data pro detail pages
3. **Lead trigger** (sdíleno s 007a §3.3)
4. **Captcha / anti-spam** na inquiry form

## 3) Plán implementace

### 3.1 Paywall audit & disable (P0, 30 min)

**Akce:**

1. `grep -rn "isPremium\|premiumUntil" app/ components/` — mapovat všechna místa, kde se tyto field čtou
2. Zkontrolovat Step5/6 form wizardu: je nějaké volby „Standard / Premium" s redirect na Stripe?
3. Zkontrolovat `/api/listings/route.ts` POST: vytváří listing jen s `isPremium: false`? Nebo se z formu propadá?

**Možné stavy po auditu:**

- **A)** `isPremium` není nikde v publikačním formu → **OK, free je free**, jen dokumentovat
- **B)** `isPremium` je v formu s volbou „Premium za 99 Kč/30 dní" → **Radimovo rozhodnutí**: zachovat jako future revenue, nebo vypnout
- **C)** `isPremium` se nastaví admin only (manuální highlight VIP listingů) → **OK**, keep as is

**Preferované default:** stav (C) — field zachován pro budoucí admin manuálně-podporu (= feature), frontend neposílá.

### 3.2 Dynamic sitemap + structured data (P1, 3-4h)

**Sitemap:**

```ts
// app/sitemap.ts — rozšíření
const listings = await prisma.listing.findMany({
  where: { status: "ACTIVE", moderationStatus: "APPROVED" },
  select: { slug: true, updatedAt: true },
  take: 50_000, // Google sitemap limit
});

return [
  ...staticRoutes,
  ...listings.map(l => ({
    url: `https://inzerce.carmakler.cz/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  })),
];
```

**Strukturovaná data (Vehicle / Product):**

```tsx
// app/(web)/inzerce/[slug]/page.tsx — rozšíření
<Script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Vehicle",
  name: `${listing.brand} ${listing.model} ${listing.year}`,
  vehicleIdentificationNumber: listing.vin,
  mileageFromOdometer: { "@type": "QuantitativeValue", value: listing.mileage, unitCode: "KMT" },
  offers: { "@type": "Offer", price: listing.price, priceCurrency: "CZK", availability: "https://schema.org/InStock" },
  ...
})}
</Script>
```

**OG tags:** `generateMetadata()` v detail page — title, description, og:image (první fotka).

### 3.3 Lead trigger (sdíleno s AUDIT-007a §3.3)

Implementace viz AUDIT-007a-plan.md sekce 3.3. Ne-duplicate work.

### 3.4 Anti-spam na inquiry form (P1, 2h)

**Možnosti:**
- **Cloudflare Turnstile** (zdarma, nejjednodušší)
- **hCaptcha** (zdarma do volumu)
- **Honeypot + rate limit** (nejjednodušší, bez 3rd party)

**Doporučeno:** honeypot + IP rate limit (5 requests / 15 min na IP) jako první vrstva, Turnstile pokud spam přesto přetrvá.

```ts
// lib/rate-limit.ts (NOVÝ, nebo use `@upstash/ratelimit` pokud Redis dostupný)
// app/api/listings/[id]/inquiry/route.ts — enforce
```

**Honeypot:** skryté pole `<input name="website" style="display:none">` — pokud vyplněno, silently drop submission.

## 4) Acceptance criteria

- [ ] Paywall audit dokumentován v `AUDIT-007b-impl.md` (stav A/B/C + rozhodnutí)
- [ ] `app/sitemap.ts` obsahuje dynamic listing URLs (limit 50k)
- [ ] Detail page má JSON-LD Vehicle schema + OG tags
- [ ] Google Rich Results Test passing: https://search.google.com/test/rich-results?url=https%3A%2F%2Finzerce.carmakler.cz%2F[test-listing]
- [ ] Lead trigger z `wantsBrokerHelp=true` vytvoří Lead entity (test přes curl POST listing)
- [ ] Inquiry form má honeypot + rate limit
- [ ] Admin queue funkční: manuální approve/reject flagged listingu
- [ ] `npm run build` + `npm run test` passing

## 5) Risk & open questions

### Risk
- **R1 (low):** Dynamic sitemap s 50k+ listingy může být pomalý při build time. **Mitigation:** lazy-generated sitemap (robots.txt + `/sitemap.xml` on-demand), nebo split do `/sitemap-listings-1.xml` chunks.
- **R2 (medium):** Anti-spam bez CAPTCHA může propustit botnet flood. **Mitigation:** začni honeypot+rate-limit, monitor Sentry; pokud spam → Turnstile do 1 hodiny.
- **R3 (low):** Structured data mismatch může zmást Google (např. VIN != 17 chars). **Mitigation:** Zod validace na VIN + fallback vynechat ze schema.

### Open questions pro Radima
1. **Premium listing:** zachovat option (future revenue) nebo vypnout úplně?
2. **Kontakt privacy**: zobrazit telefon + email přímo? Nebo skryté „Napište inzerentovi" formulář? (Gdpr + spam implications)
3. **Anti-spam**: OK s honeypot+rate limit prvně? Nebo rovnou Cloudflare Turnstile (vyžaduje přidat `NEXT_PUBLIC_TURNSTILE_SITE_KEY`)?
4. **Inzerát lifetime**: 30 dní default → auto EXPIRED? Prodloužení za 0 Kč nebo paywall?

## 6) Out of scope

- ❌ Duplicitní VIN cross-check mezi Listing + Vehicle (makléř) — řeší `DUPLICATE_VIN` flag v flagging, detail v AUDIT-018 code quality
- ❌ Foto galerie lightbox UX — P2
- ❌ Srovnávač vozů — P2
- ❌ Odběr nových inzerátů (email alert) — P2
- ❌ Kategorizace podle typu karoserie mimo existing filters — už v scope výše

---

**Verdict plánovače:** Nejblíže „ready to launch" ze všech 4 produktů. 2-3 dny dotaženou dynamic sitemap/structured data + captcha + lead trigger. Paywall audit je rychlý, pravděpodobně non-issue.
