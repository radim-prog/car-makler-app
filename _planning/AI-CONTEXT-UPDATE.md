# AI Context Update - Aplikace Development

**Datum:** 12. října 2025
**Aktualizace:** Extended Week 2 Complete

---

## 🎯 Pro budoucí AI asistenty

Pokud pracuješ na tomto projektu, **NEJDŘÍVE si přečti tyto soubory:**

### 1. Kontext Projektu
- **`AI-CONTEXT.md`** - Kompletní business kontext (NEJDŮLEŽITĚJŠÍ!)
- **`docs/HYBRID-ARCHITECTURE-PLAN.md`** - Hybrid architektura s Raynet
- **`timeline.html`** - Timeline celého projektu

### 2. Aktuální Stav Aplikace
- **`aplikace/CURRENT-STATUS.md`** - Detailní přehled připravenosti
- **`aplikace/README.md`** - Technická dokumentace
- **`aplikace/PWA-SETUP.md`** - PWA instalace návod

---

## 📊 Kde jsme teď (12. října 2025)

### ✅ HOTOVO (Extended Week 2)

#### Infrastruktura
- Next.js 15 projekt vytvořen na portu 3003
- TypeScript + Tailwind CSS + Dark mode
- Kompletní folder struktura (auth, dashboard, api, components)
- Responsive layout (desktop sidebar + mobile bottom nav)

#### UI Komponenty
- `StatsCard` - Metriky s trendy
- `LeadCard` - Lead zobrazení s detaily
- `PhotoGallery` - Galerie s AI analýzou + lightbox

#### Stránky
- `/login`, `/logout` - Auth pages (Firebase ready)
- `/` - Dashboard homepage
- `/leads` - Lead pool s mock daty
- `/earnings` - Výdělky s Quick Start bonusem

#### API Endpoints (všechny s mock daty)
- `/api/raynet/leads` - Raynet integrace
- `/api/ai/price-estimate` - Gemini AI odhad
- `/api/ai/generate-ad` - Gemini copywriter
- `/api/ai/photo-check` - Gemini Vision
- `/api/cebia/decode-vin` - VIN dekódování
- `/api/esign/create-envelope` - Signi.com e-podpis

#### Helpers & Config
- `RaynetClient` class
- Firebase config (placeholder)
- Complete TypeScript types
- PWA manifest + service worker

---

## 🔜 CO DĚLAT DÁLE (Week 3)

### 1. Firebase Auth Implementation
**Priorita:** VYSOKÁ
**Čas:** 2-3 hodiny

```typescript
// V /lib/firebase/config.ts odkomentovat:
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

**Úkoly:**
1. Vytvořit Firebase projekt v console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore
4. Enable Storage
5. Zkopírovat credentials do `.env.local`
6. Implementovat login/logout v auth pages
7. Vytvořit AuthContext provider
8. Protected routes middleware

### 2. Raynet API Real Integration
**Priorita:** VYSOKÁ
**Čas:** 4-5 hodin

**API Base:** `https://app.raynet.cz/api/v2`
**Auth:** Basic (X-Instance-Name + Authorization header)

**Úkoly:**
1. Získat Raynet API credentials
2. Testovat API v Postman
3. Nahradit mock data v `/api/raynet/leads/route.ts`
4. Implementovat error handling
5. Implementovat webhook listener
6. Testovat lead fetching

**Dokumentace:** https://s3.eu-central-1.amazonaws.com/downloads.raynet.cz/api-documentation/index.html

### 3. Gemini AI Implementation
**Priorita:** STŘEDNÍ
**Čas:** 3-4 hodiny

**Model:** gemini-2.5-flash (FREE tier stačí!)

**Úkoly:**
1. Získat API key z Google AI Studio
2. Implementovat `/api/ai/price-estimate` s real API
3. Implementovat `/api/ai/generate-ad` (3 varianty textu)
4. Implementovat `/api/ai/photo-check` s Vision API
5. Token usage tracking
6. Error handling pro rate limits

### 4. Cebia API (Week 4)
**Priorita:** NÍZKÁ
**Čas:** 2-3 hodiny
**Cena:** ~350 Kč per VIN decode

### 5. Signi.com (Week 4)
**Priorita:** NÍZKÁ
**Čas:** 2-3 hodiny
**Model:** Pay-per-document

---

## 🚨 DŮLEŽITÉ UPOZORNĚNÍ

### Hybrid Architecture
Tento projekt používá **hybrid architecture**:
- **Raynet CRM** = backend (leady, CRM data)
- **Custom App** = frontend + unique features (photos, AI, earnings)

**NEBUDUJ:**
- ❌ Custom CRM backend
- ❌ Custom lead management systém
- ❌ Custom document management

**BUDUJ:**
- ✅ Integraci s Raynet API
- ✅ Photo documentation feature
- ✅ AI assistants (Gemini)
- ✅ Earnings dashboard

### Makléři v systému
- **Makléři NEJSOU Raynet users** (ušetření 300 Kč/user)
- **Makléři mají Firebase Auth** (custom app)
- **V Raynetu jsou jen jako data** (custom field)
- **Raynet users:** Jen managers + backoffice (10 lidí)

### Cost Optimization
- **Gemini Flash 2.5** = FREE tier (ne Pro!)
- **Raynet** = ~500 Kč/měsíc (10 users)
- **Cebia** = ~1000 Kč/měsíc (~3 VIN/den)
- **Firebase** = FREE tier (jen photos)
- **TOTAL:** ~1500 Kč/měsíc

---

## 📁 Kde najít co

### Když potřebuješ:
- **Business kontext** → `AI-CONTEXT.md`
- **Hybrid architecture plán** → `docs/HYBRID-ARCHITECTURE-PLAN.md`
- **Aktuální stav aplikace** → `aplikace/CURRENT-STATUS.md`
- **Tech dokumentace** → `aplikace/README.md`
- **TypeScript types** → `aplikace/types/index.ts`
- **Raynet API client** → `aplikace/lib/raynet/client.ts`
- **Firebase config** → `aplikace/lib/firebase/config.ts`
- **PWA setup** → `aplikace/PWA-SETUP.md`

### Důležité API endpointy:
```
aplikace/app/api/
├── raynet/leads/route.ts        ← Raynet integration
├── ai/price-estimate/route.ts   ← Gemini odhad ceny
├── ai/generate-ad/route.ts      ← Gemini copywriter
├── ai/photo-check/route.ts      ← Gemini Vision
├── cebia/decode-vin/route.ts    ← VIN dekódování
└── esign/create-envelope/route.ts ← Signi.com e-podpis
```

---

## 🎓 Co se AI asistent musí naučit

### 1. Raynet API
- Struktura lead objektu v Raynet
- Jak vytvořit lead
- Jak updatovat lead status
- Jak uploadovat attachmenty
- Webhook events

### 2. Gemini API
- Text generation (price estimate, ad copy)
- Vision API (photo quality check)
- Token counting a cost tracking
- Rate limiting handling

### 3. Firebase
- Authentication flow (email/password)
- Storage (photo upload s WebP compression)
- Auth context v React
- Protected routes

### 4. TypeScript Types
Všechny types jsou v `aplikace/types/index.ts`:
- `Lead`, `LeadStatus`
- `User`, `UserRole`
- `Sale`, `EarningsBreakdown`
- `RaynetLead`, `GeminiPriceEstimate`

---

## ⚠️ Common Pitfalls

### 1. npm Cache Permissions
**Problem:** `npm install` vrací EACCES error
**Fix:** `sudo chown -R 502:20 "/Users/Radim/.npm"`

### 2. PWA Installation
**Problem:** next-pwa není nainstalován
**Fix:**
1. Oprav npm permissions (výše)
2. `npm install next-pwa`
3. Updatuj `next.config.js` podle `PWA-SETUP.md`

### 3. Mock Data vs. Real API
**Problem:** API vrací mock data místo real dat
**Fix:** Zkontroluj že máš API keys v `.env.local` a že jsi nahradil mock logic

### 4. Port Conflicts
**Problem:** Port 3003 je obsazený
**Info:** Běží 4 aplikace:
- 3000 = landing-klienti
- 3001 = landing-makleri
- 3002 = main-web
- 3003 = aplikace (CRM)

---

## 📞 API Credentials (kde získat)

### Firebase
1. Jdi na console.firebase.google.com
2. Create new project
3. Enable Authentication, Firestore, Storage
4. Project Settings → General → Your apps → Config

### Raynet
1. Přihlásit se do Raynet účtu
2. Nastavení → API → Generovat API klíč
3. Instance name = název účtu

### Gemini
1. Jdi na ai.google.dev
2. Get API key
3. Vyber gemini-2.5-flash model

### Cebia
1. Kontaktovat Cebia support
2. Požádat o API access
3. Developer documentation + API key

### Signi.com
1. Registrace na signi.com
2. Developer section → API keys
3. Pay-per-document pricing

---

## 🎯 Definition of Done (Week 3)

Aplikace je připravena k Week 4, když:

- [ ] Firebase Auth funguje (login/logout flow)
- [ ] Raynet API vrací real leady
- [ ] Gemini AI generuje price estimates
- [ ] Makléř může "vzít lead" z poolu
- [ ] Lead status se updatuje v Raynet
- [ ] Photos se uploadují do Firebase Storage
- [ ] Earnings dashboard zobrazuje real data
- [ ] Error handling funguje napříč API
- [ ] Loading states jsou implementovány

---

## 📚 Další Čtení

Když začínáš pracovat na Week 3:
1. Přečti `aplikace/CURRENT-STATUS.md` (tento soubor)
2. Přečti `docs/HYBRID-ARCHITECTURE-PLAN.md` (Week 3-5 sekce)
3. Zkontroluj `aplikace/README.md` (AI assistant section)
4. Prostuduj Raynet API docs (link výše)

---

**Důležité:** Tento soubor je living document. Aktualizuj ho po dokončení každé fáze!

**Příští aktualizace:** Po dokončení Week 3 (Firebase + Raynet + Gemini)
