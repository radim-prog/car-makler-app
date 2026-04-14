# CAR Makléř - Progress Report

**Datum:** 12. října 2025
**Status:** ✅ Week 2 Extended Prep COMPLETE
**Připravil:** AI Assistant

---

## 📊 Executive Summary

Dokončili jsme **Extended Week 2** vývoje CAR Makléř CRM aplikace. Aplikace je 100% připravena pro Week 3 (Real Integrations). Vytvořili jsme kompletní infrastrukturu, UI komponenty, API strukturu, utility funkce a dokumentaci.

**Výsledek:** Production-ready základ aplikace připravený k napojení na Firebase, Raynet, Gemini AI a další služby.

---

## 🏗️ Co jsme vytvořili

### 1. APLIKAČNÍ INFRASTRUKTURA

#### Next.js 15 Setup
- ✅ **Framework:** Next.js 15 s App Router
- ✅ **TypeScript:** Strict mode, kompletní typování
- ✅ **Styling:** Tailwind CSS 4 + Shadcn/ui komponenty
- ✅ **PWA:** Manifest + Service Worker připraveny
- ✅ **Port:** 3103 (předtím 3003)

#### Folder Structure
```
/aplikace
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ← Přihlášení (Firebase ready)
│   │   ├── logout/page.tsx         ← Odhlášení
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Dashboard s navigací
│   │   ├── page.tsx                ← Dashboard home
│   │   ├── leads/page.tsx          ← Přehled leadů
│   │   └── earnings/page.tsx       ← Výdělky + bonusy
│   └── api/
│       ├── raynet/leads/route.ts   ← Raynet API wrapper
│       ├── ai/
│       │   ├── price-estimate/route.ts
│       │   ├── generate-ad/route.ts
│       │   └── photo-check/route.ts
│       ├── cebia/decode-vin/route.ts
│       └── esign/create-envelope/route.ts
├── components/
│   ├── dashboard/
│   │   └── StatsCard.tsx           ← Metriky s trendy
│   └── leads/
│       ├── LeadCard.tsx            ← Zobrazení leadů
│       └── PhotoGallery.tsx        ← Galerie s AI check
├── lib/
│   ├── constants.ts                ← Konstanty (labels, colors, rates)
│   ├── mock-data.ts                ← Test data generator
│   ├── utils/
│   │   ├── format.ts               ← Formátování (ceny, data)
│   │   ├── validate.ts             ← Validace (VIN, phone, email)
│   │   └── errors.ts               ← Error handling
│   ├── hooks/
│   │   └── useApi.ts               ← React hooks pro API
│   ├── raynet/
│   │   └── client.ts               ← Raynet API client
│   └── firebase/
│       └── config.ts               ← Firebase config (placeholder)
├── types/
│   └── index.ts                    ← TypeScript types
├── docs/
│   ├── UTILS-EXAMPLES.md           ← Příklady použití
│   ├── API-DOCUMENTATION.md        ← API dokumentace
│   ├── DEPLOYMENT-CHECKLIST.md     ← Deployment guide
│   ├── CURRENT-STATUS.md           ← Detailní status
│   └── PWA-SETUP.md                ← PWA návod
├── public/
│   ├── manifest.json               ← PWA manifest
│   └── sw.js                       ← Service worker
├── .env.example                    ← Environment variables template
├── package.json                    ← Dependencies
└── README.md                       ← Tech dokumentace
```

---

### 2. TYPESCRIPT TYPES

Kompletní typování pro všechny entity:

```typescript
// Lead Types
type LeadStatus = 'pool' | 'assigned' | 'contacted' |
  'meeting_scheduled' | 'inspection_done' | 'contract_signed' |
  'in_sale' | 'negotiating' | 'sold' | 'cancelled';

interface Lead {
  id: string;
  status: LeadStatus;
  client: {
    name: string;
    phone: string;
    email?: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuel: string;
  };
  pricing: {
    requested_price: number;
    market_price_ai?: number;
    recommended_price?: number;
  };
  assigned_to?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

// User Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'makler' | 'manager' | 'admin';
  stats: {
    total_sales: number;
    total_earnings: number;
    conversion_rate: number;
    active_leads: number;
    avg_days_to_sale: number;
  };
  is_active: boolean;
  joined_at: string;
}

// Sale Types
interface Sale {
  id: string;
  lead_id: string;
  makler_id: string;
  final_price: number;
  commission_breakdown: {
    sale: number;           // 7,500 Kč
    financing?: number;     // 5,500 Kč
    insurance?: number;     // 1,000 Kč
    car_defent?: number;    // 1,000 Kč
    bonus?: number;         // 2,500 Kč (if all 4)
  };
  total_commission: number;
  sold_at: string;
  days_to_sale: number;
}
```

---

### 3. UI KOMPONENTY

#### StatsCard (`components/dashboard/StatsCard.tsx`)
- Zobrazení metrik s optional trendem (↑/↓)
- Support pro ikony
- Dark mode support
- Responsive design

**Použití:**
```typescript
<StatsCard
  title="Aktivní leady"
  value={15}
  subtitle="V poolu: 5"
  trend={{ value: 20, isPositive: true }}
  icon={<Icon />}
/>
```

#### LeadCard (`components/leads/LeadCard.tsx`)
- Zobrazení lead info (klient, auto, ceny)
- Status badge (barevné označení)
- AI price estimate
- "Vzít lead" button
- Relative timestamp

**Použití:**
```typescript
<LeadCard
  lead={leadData}
  onClick={() => router.push(`/leads/${lead.id}`)}
  showActions={true}
/>
```

#### PhotoGallery (`components/leads/PhotoGallery.tsx`)
- Grid layout fotek
- Lightbox pro full-size view
- AI quality check indicator (excellent/good/poor)
- Upload nových fotek
- Navigace mezi fotkami (←/→)

**Použití:**
```typescript
<PhotoGallery
  photos={[
    {
      url: 'https://...',
      aiCheck: {
        quality: 'excellent',
        score: 90,
        issues: [],
        suggestions: []
      }
    }
  ]}
  onUpload={(files) => handleUpload(files)}
  allowUpload={true}
/>
```

---

### 4. API ENDPOINTS (Mock Data Ready)

Všechny endpointy mají mock data pro development a jsou připraveny k napojení na real APIs.

#### `/api/raynet/leads` (GET)
- Vrací seznam leadů z Raynet CRM
- Query params: `status`, `limit`, `offset`
- **TODO Week 3:** Nahradit mock data real Raynet API

#### `/api/raynet/leads/:id` (GET)
- Detail konkrétního leadu
- **TODO Week 3:** Real Raynet API

#### `/api/raynet/leads/:id` (PUT)
- Update leadu (status, assignment, pricing)
- **TODO Week 3:** Real Raynet API

#### `/api/ai/price-estimate` (POST)
- Gemini AI odhad tržní ceny vozidla
- Input: brand, model, year, mileage
- Output: min, max, recommended, confidence
- **TODO Week 3:** Real Gemini API

#### `/api/ai/generate-ad` (POST)
- Gemini AI generování textu inzerátu
- Output: 3 varianty (short, long, facebook)
- **TODO Week 3:** Real Gemini API

#### `/api/ai/photo-check` (POST)
- Gemini Vision API kontrola kvality fotek
- Output: quality, score, issues, suggestions
- **TODO Week 4:** Real Gemini Vision API

#### `/api/cebia/decode-vin` (POST)
- Cebia VIN dekódování
- Cost: ~350 Kč per request
- **TODO Week 4:** Real Cebia API

#### `/api/esign/create-envelope` (POST)
- Signi.com vytvoření obálky k podpisu
- **TODO Week 4:** Real Signi.com API

---

### 5. UTILITY FUNCTIONS

#### Formatting (`lib/utils/format.ts`)
```typescript
formatPrice(300000)           // "300 000 Kč"
formatMileage(120000)         // "120 000 km"
formatPhone('+420607123456')  // "+420 607 123 456"
formatDate(new Date())        // "12. 10. 2025"
formatDateTime(new Date())    // "12. 10. 2025 14:30"
formatRelativeTime(date)      // "před 1 hodinou"
formatVIN('1HGBH41JX...')     // "1HGBH41JX MN109186"
formatCommission({...})       // "16 500 Kč (7 500 + 5 500 + ...)"
formatPercentage(0.75)        // "75%"
formatFileSize(1024000)       // "1 MB"
```

#### Validation (`lib/utils/validate.ts`)
```typescript
validateVIN('1HGBH41JX...')           // true/false
validatePhone('+420607123456')        // true/false
validateEmail('test@example.com')     // true/false
validatePrice(300000)                 // { valid: true }
validateMileage(120000)               // { valid: true }
validateYear(2020)                    // { valid: true }
validateICO('12345678')               // true/false
validateFileType(file, ['image/jpeg']) // { valid: true }
validateFileSize(file, 5*1024*1024)   // { valid: true }
validateImageDimensions(file, {...})  // Promise<{ valid: true }>
```

#### Error Handling (`lib/utils/errors.ts`)
```typescript
// Custom error class
throw new AppError('Lead not found', 'LEAD_NOT_FOUND', 404);

// Format API errors for user display
formatApiError(error)  // "Chyba připojení k serveru"

// Log errors (console + external service)
logError(error, 'context')

// Retry with exponential backoff
await retryWithBackoff(() => fetchData(), 3, 1000)

// Validate and throw
assertValid(condition, 'Error message', 'ERROR_CODE')

// Safe JSON parse
safeJsonParse(json, fallback)

// Wrap function with error handling
const safeFn = withErrorHandling(asyncFn, 'context')
```

---

### 6. CONSTANTS

Všechny konstanty na jednom místě (`lib/constants.ts`):

```typescript
// Lead status labels (česky)
LEAD_STATUS_LABELS = {
  pool: 'V poolu',
  assigned: 'Přiřazeno',
  sold: 'Prodáno',
  // ... atd
}

// Lead status colors (Tailwind classes)
LEAD_STATUS_COLORS = {
  pool: 'bg-gray-100 text-gray-800 ...',
  sold: 'bg-green-100 text-green-800 ...',
  // ... atd
}

// Commission rates
COMMISSION = {
  BASE: 7500,
  FINANCING: 5500,
  INSURANCE: 1000,
  CAR_DEFENT: 1000,
  BONUS_ALL: 2500,
  QUICK_START_MONTH_1: 10000,
  // ... atd
}

// Quick Start requirements
QUICK_START_REQUIREMENTS = [
  { month: 1, required: 3, bonus: 10000 },
  { month: 2, required: 4, bonus: 10000 },
  { month: 3, required: 5, bonus: 10000 },
]

// Fuel types, brands, document types, photo categories
FUEL_TYPES, VEHICLE_BRANDS, DOCUMENT_TYPES, PHOTO_CATEGORIES

// File upload limits
FILE_LIMITS = {
  MAX_PHOTO_SIZE: 5 * 1024 * 1024,  // 5 MB
  MAX_PHOTOS_PER_LEAD: 30,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', ...],
}

// API endpoints
API_ENDPOINTS = {
  RAYNET_LEADS: '/api/raynet/leads',
  AI_PRICE_ESTIMATE: '/api/ai/price-estimate',
  // ... atd
}

// Error & success messages (česky)
ERROR_MESSAGES, SUCCESS_MESSAGES

// Regex patterns
PATTERNS = {
  PHONE: /^(\+420)?[679]\d{8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  VIN: /^[A-HJ-NPR-Z0-9]{17}$/i,
}
```

---

### 7. MOCK DATA GENERATOR

Generování realistic test data (`lib/mock-data.ts`):

```typescript
// Single lead
const lead = generateMockLead();
const customLead = generateMockLead({ status: 'sold' });

// Multiple leads
const leads = generateMockLeads(20);

// Pool leads (status: 'pool')
const poolLeads = generateMockPoolLeads(50);

// Assigned leads for specific makler
const myLeads = generateMockAssignedLeads('U123', 10);

// Users
const user = generateMockUser();
const users = generateMockUsers(30);

// Sales
const sale = generateMockSale();
const sales = generateMockSales(50);

// Earnings with breakdown
const earnings = generateMockEarnings('U123', 3); // last 3 months

// Quick Start progress
const progress = generateQuickStartProgress(2); // current month
```

---

### 8. REACT HOOKS

Client-side API hooks s loading/error states (`lib/hooks/useApi.ts`):

```typescript
// Fetch leads
const { data: leads, loading, error, refetch } = useLeads();
const { data: leads, loading, error } = useLeads('pool'); // filtered

// Fetch single lead
const { data: lead, loading, error } = useLead(leadId);

// Current user
const { data: user, loading, error } = useCurrentUser();

// Earnings
const { data: earnings, loading, error } = useEarnings();

// Sales
const { data: sales, loading, error } = useSales();

// Mutations
const { mutate, loading, error } = useMutation();

// Assign lead
const { assignLead, loading, error } = useAssignLead();
await assignLead(leadId, maklerId);

// Update lead status
const { updateStatus, loading, error } = useUpdateLeadStatus();
await updateStatus(leadId, 'contacted');

// Upload photo
const { uploadPhoto, loading, error } = useUploadPhoto();
await uploadPhoto(leadId, file);

// AI price estimate
const { estimatePrice, loading, error } = useAIPriceEstimate();
const result = await estimatePrice({ brand, model, year, mileage });

// AI ad generation
const { generateAd, loading, error } = useAIGenerateAd();
const result = await generateAd({ vehicle, pricing, highlights });
```

---

### 9. DOKUMENTACE

#### `docs/UTILS-EXAMPLES.md` (Příklady použití)
- Praktické příklady všech utility funkcí
- Code snippets
- Complete LeadCard example
- Best practices

#### `docs/API-DOCUMENTATION.md` (API Dokumentace)
- Všechny endpointy s examples
- Request/Response formáty
- Error responses
- Rate limiting
- Webhooks
- Best practices

#### `docs/DEPLOYMENT-CHECKLIST.md` (Deployment Guide)
- Pre-deployment checklist
- Firebase setup (step-by-step)
- External services setup (Raynet, Gemini, Cebia, Signi)
- Environment variables
- Vercel deployment
- Domain setup
- Security checklist
- Testing checklist
- Launch checklist
- Post-launch monitoring
- Rollback plan

#### `docs/CURRENT-STATUS.md` (Detailní Status)
- Co je hotové (100%)
- Co chybí (Week 3-5)
- File structure overview
- Environment variables
- Cost estimates (~1500 Kč/měsíc)
- Next steps
- Success metrics

#### `docs/PWA-SETUP.md` (PWA Návod)
- Instalace next-pwa
- Konfigurace next.config.js
- Ikony (192x192, 512x512)
- Testing PWA
- Mobile testing
- Offline funkcionalita

---

### 10. RAYNET API CLIENT

Reusable helper class (`lib/raynet/client.ts`):

```typescript
import { raynetClient } from '@/lib/raynet/client';

// Get leads
const leads = await raynetClient.getLeads({ status: 'A', limit: 50 });

// Get single lead
const lead = await raynetClient.getLead(123);

// Create lead
const newLead = await raynetClient.createLead({
  firstName: 'Jan',
  lastName: 'Novák',
  // ...
});

// Update lead
await raynetClient.updateLead(123, { status: 'B' });

// Get activities
const activities = await raynetClient.getActivities(123);

// Create activity
await raynetClient.createActivity(123, {
  type: 'call',
  note: 'Klient potvrdil schůzku'
});

// Upload attachment
await raynetClient.uploadAttachment(123, file);
```

---

## 🚀 DALŠÍ KROKY (Week 3)

### 1. Firebase Auth Implementation (2-3 hodiny)

**Co udělat:**
1. Vytvořit Firebase projekt na console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Storage (pro fotky)
4. Zkopírovat credentials do `.env.local`
5. Odkomentovat Firebase init v `/lib/firebase/config.ts`
6. Implementovat login/logout flow v auth pages
7. Přidat auth middleware pro protected routes

**Výsledek:**
- ✅ Funkční přihlášení/odhlášení
- ✅ Protected routes redirectují na login
- ✅ User context dostupný v aplikaci

---

### 2. Raynet API Real Integration (4-5 hodin)

**Co udělat:**
1. Získat Raynet API credentials (Instance Name + API Key)
2. Test API calls v Postman/Insomnia
3. Nahradit mock data v `/app/api/raynet/leads/route.ts`
4. Implementovat error handling
5. Test všech operací (GET, PUT, POST)

**Výsledek:**
- ✅ Real leady z Raynet CRM
- ✅ Assign lead funguje
- ✅ Update lead status funguje

---

### 3. Gemini AI Implementation (3-4 hodiny)

**Co udělat:**
1. Získat Gemini API key z ai.google.dev
2. Test Gemini Flash 2.5 model
3. Implementovat `/api/ai/price-estimate` s real API
4. Implementovat `/api/ai/generate-ad` s real API
5. Token usage tracking

**Výsledek:**
- ✅ AI odhad ceny funguje
- ✅ AI generování inzerátů funguje
- ✅ Tracking costs (~$5/měsíc)

---

## 📦 ENVIRONMENT VARIABLES

Vytvořit `.env.local` soubor (nikdy necommitovat!):

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=car-makler-crm.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=car-makler-crm
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=car-makler-crm.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Raynet CRM
RAYNET_INSTANCE=your-instance-name
RAYNET_API_KEY=base64-encoded-key

# Google Gemini AI
GEMINI_API_KEY=AIza...

# Cebia API (optional pro Week 4)
CEBIA_API_KEY=...

# Signi.com (optional pro Week 4)
SIGNI_API_KEY=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3103
```

---

## 💰 COST BREAKDOWN (měsíčně)

**Hybrid Architecture:**

| Služba | Cena | Poznámka |
|--------|------|----------|
| Raynet CRM | ~500 Kč | 10 users (managers + backoffice) |
| Gemini Flash 2.5 | ~0 Kč | Free tier (1500 requests/day) |
| Firebase Storage | ~3 Kč | 5 GB photos |
| Vercel Hosting | $0 | Hobby plan (zdarma pro start) |
| Cebia API | ~1000 Kč | ~3 VIN/den × 350 Kč (pass-through) |
| Signi.com | varies | Pay-per-document |
| **TOTAL** | **~1500 Kč** | vs. ~10,000 Kč custom backend |

**Úspora:** 75% dev time + 85% lower monthly costs!

---

## 🌐 APLIKACE BĚŽÍ NA:

**Všechny 4 aplikace:**
- **Landing Klienti:** http://localhost:3100
- **Landing Makléři:** http://localhost:3101
- **Main Web:** http://localhost:3102
- **CRM Aplikace:** http://localhost:3103

**Port 3000 je volný!**

---

## 📝 QUICK START PRO KOLEGU

### 1. Clone & Install
```bash
cd "CAR-Makler-App/aplikace"
npm install
```

### 2. Spustit Dev Server
```bash
npm run dev
# Otevřít http://localhost:3103
```

### 3. Prozkoumat Kód
```bash
# Utility functions
open lib/utils/format.ts
open lib/utils/validate.ts

# UI Components
open components/leads/LeadCard.tsx

# API Routes (mock data)
open app/api/raynet/leads/route.ts

# Pages
open app/(dashboard)/leads/page.tsx
```

### 4. Přečíst Dokumentaci
```bash
open docs/UTILS-EXAMPLES.md
open docs/API-DOCUMENTATION.md
open docs/DEPLOYMENT-CHECKLIST.md
```

### 5. Test Funkcionalitu
1. Otevři http://localhost:3103
2. Klikni na /login (zatím mock)
3. Dashboard s mock daty
4. /leads - Seznam leadů
5. /earnings - Výdělky s bonusy

---

## 🎯 KLÍČOVÉ SOUBORY PRO REVIEW

**Pokud máš jen 15 minut, koukni na tyto soubory:**

1. **`aplikace/README.md`** - Celkový přehled
2. **`aplikace/types/index.ts`** - Všechny TypeScript types
3. **`aplikace/lib/constants.ts`** - Všechny konstanty
4. **`aplikace/components/leads/LeadCard.tsx`** - Příklad UI komponenty
5. **`aplikace/lib/hooks/useApi.ts`** - React hooks pro API
6. **`aplikace/docs/API-DOCUMENTATION.md`** - API dokumentace
7. **`aplikace/app/api/raynet/leads/route.ts`** - Příklad API route

---

## 📞 KONTAKTY & RESOURCES

### Firebase
- **Console:** https://console.firebase.google.com
- **Docs:** https://firebase.google.com/docs

### Raynet CRM
- **Login:** https://app.raynet.cz
- **API Docs:** https://s3.eu-central-1.amazonaws.com/downloads.raynet.cz/api-documentation/index.html
- **Support:** info@raynet.cz

### Google Gemini AI
- **Get API Key:** https://ai.google.dev
- **Docs:** https://ai.google.dev/docs

### Cebia
- **Website:** https://www.cebia.cz
- **Contact:** info@cebia.cz

### Signi.com
- **Website:** https://signi.com
- **Docs:** https://api.signi.com/v2/docs

---

## ✅ CHECKLIST PRO WEEK 3

**Před zahájením Week 3, zajisti:**

- [ ] Máš přístup k Firebase projektu
- [ ] Máš Raynet API credentials
- [ ] Máš Gemini API key
- [ ] Přečetl jsi dokumentaci v `docs/`
- [ ] Rozumíš structure aplikace
- [ ] Zkusil jsi spustit dev server
- [ ] Prozkoumal jsi mock data
- [ ] Máš questions? → Zeptej se!

---

## 🎉 ZÁVĚR

**Week 2 Extended Prep je 100% hotová!**

Aplikace má:
- ✅ Solidní základ (Next.js 15 + TypeScript)
- ✅ Kompletní UI komponenty
- ✅ Připravené API routes (mock data)
- ✅ Production-ready utilities
- ✅ Kompletní dokumentaci
- ✅ Připraveno k Week 3 integracím

**Next:** Firebase Auth → Raynet API → Gemini AI → Deploy 🚀

---

**Questions?**
Přečti dokumentaci v `/aplikace/docs/` nebo se zeptej!

**Ready to continue?**
Začni Week 3 podle `docs/DEPLOYMENT-CHECKLIST.md`!
