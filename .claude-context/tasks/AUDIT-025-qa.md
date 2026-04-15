# AUDIT-025 — PWA Audit (Carmakler)
**Datum:** 2026-04-14
**Auditor:** QA agent (claude-sonnet-4-6)
**Sandbox:** https://car.zajcon.cz
**Kategorie:** PWA / Service Worker / Offline

---

## PWA Checklist

| Položka | Stav | Poznámka |
|---------|------|----------|
| Manifest (name, short_name) | ✅ | `CarMakléř Pro` / `CarMakléř` |
| Manifest (icons 192+512px) | ✅ | 4 ikony: any 192/512 + maskable 192/512 |
| Manifest (start_url) | ✅ | `/makler/dashboard` |
| Manifest (display: standalone) | ✅ | Nastaveno |
| Manifest dostupný na sandboxu | ❌ | `/manifest.json` vrací HTTP 502 Bad Gateway |
| `<link rel="manifest">` v HTML | ✅ | Next.js `metadata.manifest` injektuje automaticky |
| SW soubor dostupný (sw.js) | ✅ | HTTP 200, 121 KB |
| SW cache-control | ⚠️ | `max-age=0` — SW se nechachuje, OK dle spec, ale chybí `no-store` |
| SW registrace | ✅ | Serwist `@serwist/next` — automatická registrace přes wrapper |
| Offline fallback stránka | ⚠️ | Existuje `/makler/offline` pro (pwa), ale chybí pro (pwa-parts) |
| Offline funguje (Playwright test) | ❌ | `net::ERR_FAILED` — bez předchozí návštěvy SW nic nenachachoval |
| Install prompt (beforeinstallprompt) | ❌ | Nenalezeno v kódu |
| Push notifikace (PushManager) | ❌ | Nenalezeno v kódu |
| Background Sync | ⚠️ | Handler v SW existuje (sync-vehicles, sync-contacts...), ale syncContacts() je stub |

---

## Detailní nálezy

---

### F-PWA-01: Manifest 502 na sandboxu
**Závažnost:** KRITICKÁ  
**Oblast:** Manifest / Deployment

`/manifest.json` vrací HTTP 502 Bad Gateway na sandboxu `car.zajcon.cz`. Přitom soubor fyzicky existuje v `/root/Projects/car-makler-app/public/manifest.json`.

**Příčina:** Sandbox Next.js app (`pm2: car-zajcon`, port 3030) pravděpodobně neslouží statické soubory, nebo nginx reverse proxy selže před aplikací. Root layout správně exportuje `manifest: "/manifest.json"`, Next.js vygeneruje `<link rel="manifest">` do HTML — ale samotný soubor není dostupný.

**Dopad:** Prohlížeč nemůže stáhnout manifest → PWA instalace (Add to Home Screen) nefunguje, Lighthouse PWA skóre selže.

---

### F-PWA-02: SW cache-control chybí `no-store`
**Závažnost:** NÍZKÁ  
**Oblast:** Service Worker / HTTP Headers

`/sw.js` má `cache-control: public, max-age=0`. Dle best practices by měl SW soubor mít `Cache-Control: no-cache` nebo `no-store` aby si prohlížeč vždy stáhl aktuální verzi. `max-age=0` funguje, ale `no-store` je explicitnější a doporučovaný.

**Poznámka:** Serwist `skipWaiting: true` + `clientsClaim: true` minimalizuje riziko zastaralého SW.

---

### F-PWA-03: Offline fallback chybí pro (pwa-parts)
**Závažnost:** STŘEDNÍ  
**Oblast:** Offline UX

PWA pro makléře (`app/(pwa)/makler/offline/`) má offline stránku s kompletním UI (pending actions, sync button, online/offline detektor via `navigator.onLine`). PWA pro dodavatele dílů (`app/(pwa-parts)/`) **nemá žádnou offline stránku**.

Obě PWA sdílejí `OnlineStatusProvider` a `OfflineBanner`, takže banner o offline stavu zobrazí, ale uživatel nemá žádnou dedikovanou stránku pro správu pending akcí.

---

### F-PWA-04: Offline test selhal — SW bez cached dat
**Závažnost:** INFORMAČNÍ  
**Oblast:** Offline funkčnost

Playwright test s kompletně blokovanou sítí vrátil `net::ERR_FAILED`. Toto je **očekávané chování** pro první návštěvu (cold start) — SW potřebuje alespoň jednu normální návštěvu aby precachoval shell aplikace. Test neproběhl na skutečně nainstalované PWA s existující cache.

**Co test prokázal:** SW není schopen posloužit stránku při studeném startu bez internetu (žádný server-side precache fallback jako Next.js `generateStaticParams`).

---

### F-PWA-05: Chybí `beforeinstallprompt` / install prompt
**Závažnost:** STŘEDNÍ  
**Oblast:** Instalovatelnost

V celém `app/` adresáři není žádná implementace `beforeinstallprompt` event handleru. Bez něj aplikace nespolehlivě zobrazuje výzvu k instalaci — záleží čistě na prohlížeči, kdy (a zda) automaticky zobrazí install banner.

Pro PWA zaměřenou na makléře (mobilní terénní práce) je instalovatelnost klíčová. Doporučeno: přidat `InstallPromptBanner` komponentu do `(pwa)/layout.tsx`.

---

### F-PWA-06: Push notifikace nejsou implementovány
**Závažnost:** STŘEDNÍ  
**Oblast:** Engagement / Notifikace

`PushManager.subscribe()`, `Notification.requestPermission()` ani žádný push endpoint v `app/api/` nebyl nalezen. Pro makléřskou PWA (nové zakázky, schválení vozidla BackOffice) jsou push notifikace relevantní funkce.

**Poznámka:** Není jasné zda jsou push notifikace v roadmapě (fáze 1 vs fáze 2).

---

### F-PWA-07: Jedna SW pro dvě PWA (sdílený manifest)
**Závažnost:** INFORMAČNÍ  
**Oblast:** Architektura

Projekt má **dvě PWA role** (`(pwa)` pro makléře, `(pwa-parts)` pro dodavatele dílů), ale **sdílí jediný SW** (`public/sw.js`) a **jediný manifest** (`public/manifest.json`).

Manifest je nakonfigurován pro makléře (`name: "CarMakléř Pro"`, `start_url: "/makler/dashboard"`). Dodavatel dílů (`/parts/...`) se při instalaci jako PWA přihlásí do makléřského dashboardu.

**Možná řešení (pro fázi 2):**
- Separate manifests: `/manifest-parts.json` s `start_url: "/parts/dashboard"` 
- Dynamic manifest via API route `/api/manifest`
- Nebo ponechat jako je, pokud role dodavatele dílů nevyžaduje PWA instalaci

---

### F-PWA-08: Background Sync handlery jsou stub
**Závažnost:** STŘEDNÍ  
**Oblast:** Offline Sync

SW registruje 4 sync tagy: `sync-vehicles`, `sync-images`, `sync-contracts`, `sync-contacts`. Pouze `sync-contacts` má reálnou implementaci (`syncContacts()` s IndexedDB + fetch). Ostatní tři tagy mají pouze `console.log` a žádnou logiku.

```typescript
// sw.ts — stub handlery
if (syncEvent.tag === "sync-vehicles") {
  console.log("[SW] Background sync: vehicles");  // ← žádná implementace
}
```

---

## Serwist konfigurace (Bod 1)

**Soubor:** `next.config.ts`, `app/sw.ts`

```typescript
withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",   // ← SW vypnut v dev
})
```

**Caching strategie:**
- `precacheEntries: self.__SW_MANIFEST` — Serwist automaticky precachuje všechny statické assety z Next.js buildu (JS chunks, CSS, obrázky v `/public`)
- `defaultCache` z `@serwist/next/worker` — výchozí runtime caching strategie zahrnující:
  - **Network First** pro API routes a HTML navigace
  - **Cache First** pro statické assety (JS/CSS s contenthash)
  - **Stale-While-Revalidate** pro obrázky
- `navigationPreload: true` — paralelní fetch stránky během SW bootu (výkon)
- `skipWaiting: true` + `clientsClaim: true` — okamžitá aktivace nového SW

**URL patterns:** Nejsou definovány vlastní runtime cache pravidla — vše přes `defaultCache`. Makléřské API endpoints (`/api/vehicles`, `/api/contacts`) nejsou explicitně cachované.

---

## Manifest validace (Bod 2)

**Soubor:** `public/manifest.json`

| Pole | Hodnota | Validní? |
|------|---------|---------|
| name | "CarMakléř Pro" | ✅ |
| short_name | "CarMakléř" | ✅ |
| description | Přítomno | ✅ |
| start_url | "/makler/dashboard" | ✅ |
| display | "standalone" | ✅ |
| background_color | "#F9FAFB" | ✅ |
| theme_color | "#F97316" | ✅ |
| scope | "/" | ✅ |
| icons 192px any | ✅ | ✅ |
| icons 512px any | ✅ | ✅ |
| icons 192px maskable | ✅ | ✅ |
| icons 512px maskable | ✅ | ✅ |
| lang | "cs" | ✅ |
| categories | ["business","lifestyle"] | ✅ |

**Závěr:** Manifest je validní pro PWA instalaci. Fyzické ikony existují v `public/icons/`.  
**Problém:** Soubor není dostupný na sandboxu (F-PWA-01).

---

## Service Worker registrace (Bod 3)

Registrace probíhá automaticky přes `@serwist/next` wrapper (`withSerwistInit`). Není potřeba manuální `navigator.serviceWorker.register()` — Serwist to injektuje do Next.js runtime.

`app/sw.ts` je zdrojový soubor, builduje se do `public/sw.js` (121 KB minified). SW je dostupný na sandboxu (`HTTP 200`).

---

## Offline fallback (Bod 4)

**Nalezeno:** `app/(pwa)/makler/offline/page.tsx`

Kompletní offline UI pro makléře:
- Detekce online/offline stavu (`navigator.onLine` + event listeners)
- Načítání pending actions z IndexedDB (`offlineStorage.getDrafts()`, `getPendingActions()`)
- `SyncButton` pro manuální sync
- `PendingItem` seznam čekajících položek
- Loading skeleton

**Chybí:** Offline stránka pro `(pwa-parts)` — viz F-PWA-03.

**Playwright test:** Studeným startem bez SW cache → `net::ERR_FAILED` (očekávané, viz F-PWA-04).

---

## Push notifikace + Install prompt (Bod 5)

Grep na `requestPermission`, `PushManager`, `beforeinstallprompt`, `installPrompt` v celém `app/` adresáři — **žádné výsledky**.

Viz F-PWA-05 a F-PWA-06.

---

## Dvě PWA nebo jedna? (Bod 6)

**Dvě PWA role, jeden SW a jeden manifest.**

- `(pwa)/layout.tsx` — makléřský layout: TopBar, BottomNav, AiAssistant, OfflineBanner
- `(pwa-parts)/layout.tsx` — dodavatelský layout: SupplierTopBar, SupplierBottomNav, OfflineBanner
- Sdílený: `OnlineStatusProvider`, `OfflineBanner`, `public/sw.js`, `public/manifest.json`

Manifest `start_url: "/makler/dashboard"` je specifický pro makléře. Viz F-PWA-07.

---

## SW na sandboxu (Bod 7)

```
HTTP/2 200
content-type: application/javascript; charset=UTF-8
content-length: 121150
cache-control: public, max-age=0
```

SW je dostupný a deployed. Obsah odpovídá buildnutému Serwist bundlu (minified, 121 KB).

**Pozitiva:**
- Správný MIME type (`application/javascript`)
- HTTPS (HSTS header přítomen)
- CSP `worker-src 'self'` povoluje SW

**Problém:** `cache-control: public, max-age=0` místo doporučeného `no-store` (viz F-PWA-02).

---

## Souhrn nálezů

| ID | Nález | Závažnost |
|----|-------|-----------|
| F-PWA-01 | Manifest 502 na sandboxu — PWA nelze nainstalovat | KRITICKÁ |
| F-PWA-02 | SW cache-control: doporučeno `no-store` místo `max-age=0` | NÍZKÁ |
| F-PWA-03 | Chybí offline stránka pro `(pwa-parts)` | STŘEDNÍ |
| F-PWA-04 | Offline cold start bez SW cache selže (očekávané) | INFORMAČNÍ |
| F-PWA-05 | Chybí `beforeinstallprompt` install prompt handler | STŘEDNÍ |
| F-PWA-06 | Push notifikace nejsou implementovány | STŘEDNÍ |
| F-PWA-07 | Sdílený manifest pro 2 PWA role (makléř vs dodavatel) | INFORMAČNÍ |
| F-PWA-08 | Background Sync handlery sync-vehicles/images/contracts jsou stub | STŘEDNÍ |

**Blokující pro produkci:** F-PWA-01 (manifest 502 znemožňuje instalaci PWA).  
**Doporučeno před launchem:** F-PWA-05 (install prompt), F-PWA-08 (sync stubs).  
**Fáze 2:** F-PWA-06 (push notifikace), F-PWA-07 (oddělené manifesty).
