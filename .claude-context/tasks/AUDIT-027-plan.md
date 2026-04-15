# AUDIT-027 — Plán: Permissions-Policy inventář + rozšíření

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P0 (PWA broker v terénu + Stripe Connect flow)
**Odhadovaná práce implementátora:** 1-2 hodiny
**Depends on:** FIX-002 (done — `camera=(self), geolocation=(self), microphone=()`)
**Navazuje:** AUDIT-003 (CSP), AUDIT-025 (PWA Service Worker)

---

## 0) Kontext — co už je hotovo

**FIX-002 (commit `9f1fee6`)** fixnul původní `camera=(), microphone=()` blocker. Aktuální hlavička v `next.config.ts:112`:

```ts
{ key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
```

To odblokovalo **broker PWA foto + GPS** (F-005 RESOLVED). Tento AUDIT-027 navazuje:
- Inventarizuje všechny Web APIs které reálně používáme
- Explicitně povolí/zakáže zbývající APIs (default-allow → default-deny mindset)
- Connects with Stripe Connect payment flow (FUTURE AUDIT-014)
- Prepares for iframe embeds (partnerské weby, autobazar integrace)

## 1) Recon — Web APIs inventář

### 1.1 Kamera (camera) — POVOLIT

**Kde:** PWA broker — focení auta při nabírání, foto dokumentů (OP, TP).

**Files:**
- `lib/hooks/useCamera.ts` — `navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})`
- `components/pwa/vehicles/new/PhotoGuide.tsx` — guided photo capture
- `components/pwa/vehicles/quick/QuickStep1.tsx` — quick VIN foto

**Verdict:** ✅ keep `camera=(self)`

### 1.2 Geolokace (geolocation) — POVOLIT

**Kde:** PWA broker navigace k autu (Mapy.cz link), lokace makléřů pro matching, regionální filtr.

**Files:** TBD audit (grep `navigator.geolocation` nic nenašel — možná přes `next/navigation` link-out?), ale **LP broker má "aut v tvém okolí" fallback**.

**Verdict:** ✅ keep `geolocation=(self)` — i kdyby zatím nepoužité, Serwist PWA to vyžaduje pro V2 feature (broker radius matching).

### 1.3 Mikrofon (microphone) — ZAKÁZAT

**Kde:** Nikde. Žádné voice notes, žádné AI voice input.

**Verdict:** ✅ keep `microphone=()` — explicit deny.

### 1.4 Platby (payment) — POVOLIT pro Stripe Connect

**Kde:** `components/admin/partners/StripeOnboardingCard.tsx`, `app/api/stripe/webhook/route.ts`, marketplace investor payouts (FUTURE), dílenský eshop checkout.

**Payment Request API** (W3C `PaymentRequest`) a **Apple Pay / Google Pay** button rendered via Stripe Elements vyžadují `payment=(self)` feature policy. Bez toho Stripe v iframe selže s **"The PaymentRequest API is disallowed by feature policy"** chybou.

**Dnes to blokujeme** (defaultně `payment=()` když není v hlavičce).

**Verdict:** ➕ ADD `payment=(self)`

### 1.5 Fullscreen — POVOLIT (volitelné)

**Kde:** Galerie fotek auta (lightbox), možná VIN scanner (kamera fullscreen).

**Verdict:** ➕ ADD `fullscreen=(self)` — low-risk, UX benefit.

### 1.6 Clipboard-write — POVOLIT

**Kde:** "Zkopírovat VIN", "Zkopírovat link inzerátu", sdílení makléřského QR kódu.

**Verdict:** ➕ ADD `clipboard-write=(self)` — už funguje default v Chrome, ale explicitní vyhlášení je best practice.

### 1.7 Notifications (Push API) — mimo Permissions-Policy

**Kde:** PWA broker push notif (Pusher + Service Worker), `components/pwa/dashboard/NotificationsList.tsx`.

**Pozn.:** Push notifications **NEJSOU v Permissions-Policy** (řídí se přes user prompt + Notifications API + SW scope). Žádná změna headeru.

### 1.8 ZAKÁZAT všechny ostatní (default-deny)

Seznam APIs které **nepoužíváme** a chceme explicitně vypnout (pro iframe-embeds a security hardening):

| Feature | Hodnota | Proč zakázat |
|---------|---------|--------------|
| `accelerometer` | `()` | Nepoužíváme, fingerprinting vektor |
| `autoplay` | `()` | Nemáme auto-play video |
| `battery` | `()` | Fingerprinting |
| `bluetooth` | `()` | Nepoužíváme |
| `display-capture` | `()` | Nepoužíváme screen share |
| `document-domain` | `()` | Deprecated, security risk |
| `encrypted-media` | `()` | Nemáme DRM video |
| `gyroscope` | `()` | Nepoužíváme, fingerprinting |
| `magnetometer` | `()` | Nepoužíváme |
| `midi` | `()` | Nepoužíváme |
| `usb` | `()` | Nepoužíváme |
| `xr-spatial-tracking` | `()` | Nepoužíváme AR/VR |
| `idle-detection` | `()` | Privacy-sensitive, nepotřebujeme |
| `serial` | `()` | Nepoužíváme |
| `hid` | `()` | Nepoužíváme |
| `ambient-light-sensor` | `()` | Fingerprinting |
| `screen-wake-lock` | `()` | Zvaž `self` pokud makléř bude mít dlouhý foto session — aktuálně ne |
| `picture-in-picture` | `()` | Nemáme video content |
| `sync-xhr` | `()` | Deprecated API |

## 2) Cílová hlavička

```ts
// next.config.ts:112
{
  key: "Permissions-Policy",
  value: [
    // Povoleno pro self (PWA + web app)
    "camera=(self)",
    "geolocation=(self)",
    "payment=(self)",
    "fullscreen=(self)",
    "clipboard-write=(self)",
    // Explicit deny (anti-fingerprinting + unused APIs)
    "microphone=()",
    "accelerometer=()",
    "autoplay=()",
    "battery=()",
    "bluetooth=()",
    "display-capture=()",
    "document-domain=()",
    "encrypted-media=()",
    "gyroscope=()",
    "magnetometer=()",
    "midi=()",
    "usb=()",
    "xr-spatial-tracking=()",
    "idle-detection=()",
    "serial=()",
    "hid=()",
    "ambient-light-sensor=()",
    "screen-wake-lock=()",
    "picture-in-picture=()",
    "sync-xhr=()",
  ].join(", "),
},
```

**Délka hlavičky:** ~400 chars — under nginx default limit (8kB). OK.

## 3) Task breakdown

| ID | Task | Effort | Depends | Parallel |
|----|------|--------|---------|----------|
| T-027-001 | Grep audit `navigator.mediaDevices`, `navigator.geolocation`, `PaymentRequest` v `app/`, `components/`, `lib/` — confirm inventář | 15 min | — | ✅ |
| T-027-002 | Update `next.config.ts:112` s novou hlavičkou (array.join pattern pro readability) | 15 min | T-027-001 | — |
| T-027-003 | Smoke test na sandboxu: `curl -sI https://car.zajcon.cz/makler \| grep -i permissions-policy` | 10 min | T-027-002 | — |
| T-027-004 | Manuální test v Chrome DevTools → Application → Frame details → Permissions-Policy panel (ověř všechny directives) | 15 min | T-027-003 | — |
| T-027-005 | Test `lib/hooks/useCamera.ts` — `getUserMedia` NE throw `NotAllowedError: permission policy` | 10 min | T-027-004 | — |
| T-027-006 | Test Stripe Connect flow — embed iframe na `/admin/partners/*/onboarding` renderuje bez `PaymentRequest` policy chyby | 20 min | T-027-004 | ✅ with T-027-005 |
| T-027-007 | Test clipboard: "Zkopírovat VIN" v detailu auta funguje v Safari + Chrome | 10 min | T-027-004 | ✅ |
| T-027-008 | E2E Playwright test `tests/e2e/security-headers.spec.ts` — assert Permissions-Policy obsahuje všechny required directives | 30 min | T-027-002 | ✅ |
| T-027-009 | Update `FIX-LOG.md` + `GO-NO-GO-REPORT.md` záznam (FIX-027 nový) | 10 min | T-027-003 | — |
| T-027-010 | Commit `🔒 AUDIT-027: Permissions-Policy explicit allow/deny inventář` + push | 5 min | všechny | — |

**Total:** ~2h15 (conservative). 1h s paralelizací T-005/006/007/008.

## 4) Acceptance criteria

- [ ] `next.config.ts` obsahuje novou hlavičku s minimálně: `camera=(self), geolocation=(self), payment=(self), fullscreen=(self), clipboard-write=(self), microphone=()`
- [ ] `curl -sI https://car.zajcon.cz/makler | grep -i permissions-policy` vrací všech 24+ directives
- [ ] Chrome DevTools Permissions-Policy panel ukazuje zelené checkboxy pro allowed, křížky pro denied
- [ ] Broker PWA: `navigator.mediaDevices.getUserMedia({video:true})` NE throw
- [ ] Broker PWA: `navigator.geolocation.getCurrentPosition()` NE throw
- [ ] Partner admin: Stripe onboarding iframe renderuje bez "disallowed by feature policy" console erroru
- [ ] Clipboard copy VIN funguje v Chrome + Safari + Firefox
- [ ] E2E test security-headers.spec.ts passing
- [ ] `npm run build` + `npm run lint` clean

## 5) Risks & rollback

### Risk R1 (low): Stripe breaks on Safari

**Popis:** Safari může mít odlišnou interpretaci `payment=(self)` vs Chrome. Apple Pay button v Stripe Elements vyžaduje `payment=(self "https://js.stripe.com")` podle některých zdrojů.

**Mitigation:** Test na Safari 17+. Pokud Apple Pay selže, rozšíř na `payment=(self "https://js.stripe.com" "https://hooks.stripe.com")`. Neblokuje merge — Stripe Elements má fallback přes redirect.

**Rollback:** revert commit → `camera=(self), geolocation=(self), microphone=()`.

### Risk R2 (low): Permissions-Policy length

**Popis:** ~400 char hlavička může přesáhnout default proxy/CDN limits na starších setupech.

**Mitigation:** Test end-to-end přes Cloudflare / direct pm2. Aktuálně car.zajcon.cz nemá CDN, low risk.

### Risk R3 (medium): Future iframe embeds

**Popis:** Pokud Carmakler někdy umožní **embedded widgets** (auto-gallery iframe na partnerský web), `self` directives budou blokovat. Musí přejít na `self "https://partner1.cz" "https://partner2.cz"`.

**Mitigation:** Zatím out-of-scope. AUDIT-027 targets hlavní doménu. Budoucí embed task bude samostatný.

### Risk R4 (low): Old browsers

**Popis:** Unknown Permissions-Policy directive nepadá (graceful degrade), browsery ignorují neznámé tokeny. IE11 nic nehlásí.

**Mitigation:** Žádná, stejný jako dnes.

## 6) Test plán

### 6.1 Automated (E2E)

```ts
// tests/e2e/security-headers.spec.ts
test("Permissions-Policy header present + correct", async ({ request }) => {
  const response = await request.get("/");
  const header = response.headers()["permissions-policy"];
  expect(header).toContain("camera=(self)");
  expect(header).toContain("geolocation=(self)");
  expect(header).toContain("payment=(self)");
  expect(header).toContain("microphone=()");
  expect(header).toContain("bluetooth=()");
});
```

### 6.2 Manuální

1. **Chrome DevTools:** F12 → Application → Frame → Main → Permissions Policy → sanity check
2. **Console test:**
   ```js
   // Povolené
   await navigator.mediaDevices.getUserMedia({video:true}); // OK
   await navigator.geolocation.getCurrentPosition(p => {}); // OK

   // Zakázané
   navigator.bluetooth.requestDevice(); // "Permissions policy violation"
   ```
3. **Stripe Connect:** Onboarding iframe na `/admin/partners/test/stripe` → DevTools Console → 0 policy errors
4. **Clipboard:** "Zkopírovat VIN" na detailu auta → paste do textu → OK
5. **Cross-browser:** Chrome 129+, Safari 17+, Firefox 130+

### 6.3 Regression sanity

- `FIX-002` scenario (from `FIX-001-impl.md:82`): broker PWA fotí → stále funguje
- AUDIT-001 load test: po deploy neroste error rate na /api/\*

## 7) Interakce s ostatními AUDITy

- **AUDIT-003 (CSP + Sentry + pm2):** nezávislý, CSP je separátní hlavička. Mohou běžet paralelně.
- **AUDIT-025 (PWA Service Worker):** Serwist + `public/sw.js` nevyžaduje žádné Permissions-Policy změny (SW nepoužívá sensor APIs).
- **AUDIT-014 (Stripe Connect Express):** blokováno bez `payment=(self)`. AUDIT-027 je **prerekvizita** pro AUDIT-014 full rollout.
- **AUDIT-028 (Ekosystém LP):** žádná interakce.

## 8) Out of scope

- ❌ CSP `frame-ancestors` tightening — patří do AUDIT-002 / AUDIT-003
- ❌ Cross-origin isolation (`COEP`, `COOP`) — samostatná decision, vyžaduje SharedArrayBuffer usage (nemáme)
- ❌ Feature-Policy legacy header (Firefox < 74) — Firefox 130+ podporuje nové Permissions-Policy, legacy skip
- ❌ Per-route Permissions-Policy (strictnější pro `/admin/*`) — low value, overhead

## 9) Reference

- W3C Permissions Policy spec: https://www.w3.org/TR/permissions-policy-1/
- MDN directive catalog: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
- Stripe payment feature requirements: https://docs.stripe.com/security/guide#content-security-policy (SCP sekce také zmiňuje PP)
- Chrome DevTools Permissions-Policy panel: chrome://flags#enable-experimental-web-platform-features

---

**Verdict plánovače:** Malý, nízko-rizikový cleanup s velkým strategickým přínosem:
- Odblokuje `payment=(self)` pro Stripe (AUDIT-014 prerekvizita)
- Security hardening přes default-deny na 20+ nepoužívaných APIs
- Anti-fingerprinting win (accelerometer, gyroscope, battery, ambient-light)
- Zero UX dopad (všechno co dnes funguje, funguje dál)

Implementátor: 1-2h. Paralelně s AUDIT-003, AUDIT-031. Ready pro T-027-001.
