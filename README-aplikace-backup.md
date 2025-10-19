# Aplikace - CRM pro Makléře

**Status:** 🚧 Připraveno k vývoji (zatím prázdná složka)

## O této aplikaci

Interní CRM systém pro automobilové makléře CAR makléř. Hlavní nástroj pro práci s leady, správu prodejů a komunikaci s klienty.

## Účel

- **Lead management** - Pool 100 leadů denně z Infoexe.cz
- **Dashboard makléře** - Přehled aktivních prodejů, statistiky výdělků
- **Client communication** - Email templates, SMS notifikace
- **Sales tracking** - Od leadu po hotový prodej
- **Commission calculation** - Automatické počítání provizí (7,500 Kč + upselly)

## Plánované funkce

### Pro makléře:
1. **Lead Pool** - Seznam dostupných leadů (100/den z Infoexe)
2. **"Vezmu si tento lead"** - Přiřazení leadu k makléři
3. **Client profile** - Detail klienta (auto, kontakt, preference)
4. **Sales pipeline** - 5 stages (Nový → Kontaktován → Obhlídka → Jednání → Prodáno)
5. **Communication log** - Historie všech interakcí
6. **Document upload** - Fotky auta, TP, STK
7. **Earnings dashboard** - Tento měsíc, tento rok, celkem

### Pro adminy:
1. **Lead import** - Bulk upload z Infoexe CSV
2. **Makléř management** - Přidat/odebrat makléře, nastavit provize
3. **Analytics** - Conversion rates, průměrná doba prodeje
4. **Notification settings** - Email/SMS templates

## Tech Stack (plán)

- **Framework:** Next.js 15 (App Router)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage (fotky aut)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Language:** TypeScript
- **Email:** SendGrid nebo Resend
- **SMS:** Twilio (optional)

## Data Model (návrh)

### Collections:

**leads** - Lead z Infoexe
```typescript
{
  id: string
  status: 'available' | 'assigned' | 'contacted' | 'viewing' | 'negotiating' | 'sold' | 'lost'
  source: 'infoexe'

  // Client info
  firstName: string
  lastName: string
  phone: string
  email: string

  // Car info
  brand: string
  model: string
  year: number
  mileage: number
  estimatedPrice: number

  // Assignment
  assignedTo?: string  // maklerId
  assignedAt?: timestamp

  // Timestamps
  createdAt: timestamp
  updatedAt: timestamp
}
```

**makleri** - Makléř account
```typescript
{
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string

  // Stats
  totalSales: number
  totalEarnings: number
  conversionRate: number

  // Settings
  isActive: boolean
  commissionRate: number  // default 7500

  createdAt: timestamp
}
```

**sales** - Hotový prodej
```typescript
{
  id: string
  leadId: string
  maklerId: string

  // Sale details
  finalPrice: number
  baseCommission: 7500

  // Upsells
  photography: boolean  // +2000 Kč
  premiumAd: boolean    // +1500 Kč
  expressSale: boolean  // +3000 Kč

  totalCommission: number

  // Dates
  soldAt: timestamp
  daysToSale: number
}
```

## User Roles

### 1. Makléř (broker)
- Vidí lead pool
- Může si vzít lead (max 10 aktivních současně)
- Updatuje stage prodeje
- Uploaduje fotky a dokumenty
- Vidí své earnings

### 2. Admin
- Vidí všechny leady a makléře
- Importuje nové leady
- Spravuje makléře
- Vidí analytics celého systému

### 3. Super Admin (owner)
- Vše co Admin +
- Nastavení provizí
- Export dat

## Prioritní Features (Fáze 1 - MVP)

**Must-have pro launch:**
- [ ] Autentizace (Firebase Auth)
- [ ] Lead pool s filtry (nové, moje, všechny)
- [ ] "Vezmu si lead" button
- [ ] Client detail page (basic info)
- [ ] Stage management (5 stages)
- [ ] Earnings dashboard (simple stats)
- [ ] Admin: Lead import (CSV upload)

**Nice-to-have (Fáze 2):**
- [ ] Email templates
- [ ] SMS notifikace (Twilio)
- [ ] Photo upload & gallery
- [ ] Communication log
- [ ] Advanced analytics
- [ ] Export reports (PDF, CSV)

## Jak spustit (až bude vytvořeno)

```bash
cd aplikace
npm install
npm run dev
```

Port bude pravděpodobně: **3003** (aby nekolidoval s landing pages a main web)

## Integrace s Infoexe

**Infoexe.cz** poskytuje 100 leadů/den:
- Owners prémiových aut (500k-1.5mil Kč)
- Region: Praha + 50 km
- Export: CSV file (denně ráno)

**Import proces:**
1. Admin stáhne CSV z Infoexe dashboardu
2. Upload do aplikace (bulk import)
3. Systém vytvoří lead pro každý řádek
4. Makléři vidí nové leady v pool

## Security

- **Firebase Auth** - Email/password + 2FA (optional)
- **Firestore Rules** - Makléř vidí jen své leady (assigned)
- **Admin only** - Import leadů, mazání makléřů
- **Rate limiting** - Max 10 aktivních leadů per makléř
- **Data privacy** - Client data encrypted, GDPR compliant

---

## 🤖 PRO AI ASISTENTY

### Před prací na aplikaci MUSÍŠ přečíst:

1. **`../AI-CONTEXT.md`** - Kompletní business kontext (NEJDŮLEŽITĚJŠÍ!)
2. **`../docs/PROJECT-SPECIFICATION-V2-REALISTIC.md`** - Resource requirements & timeline
3. **`../timeline.html`** - Kdy začínáme práci na aplikaci

### Co musíš vědět:

- **Toto je interní CRM**, ne public facing website
- **Users jsou makléři** (ne klienti), takže UX musí být efektivní (ne marketing-y)
- **100 leadů/den** - systém musí zvládnout bulk import a zobrazit velké množství dat
- **Mobile-first** - Makléři pracují v terénu (iPhone při obhlídce auta)
- **Simple & fast** - Makléři chtějí rychle updatovat stage a jít na další lead

### Data flow:

```
Infoexe (CSV) → Admin import → Lead Pool → Makléř "vezme lead" →
Client contacted → Viewing → Negotiating → SOLD (+ commission calculated)
```

### Když uživatel řekne "vytvořit CRM aplikaci":

**✅ SPRÁVNĚ - Začni od:**
1. **Firebase setup** (projekt, Firestore, Auth)
2. **Next.js scaffold** (App Router, TypeScript)
3. **Auth pages** (login, register)
4. **Basic dashboard** (empty state s welcome message)
5. **Data model** (Firestore collections podle návrhu výše)

**❌ ŠPATNĚ - Nedělej:**
- Komplexní aplikaci najednou (začni MVP)
- Fancy design (simple Shadcn/ui komponenty stačí)
- Over-engineering (ne GraphQL, ne microservices, drž to simple)
- Marketing copy (toto není landing page, jen "Lead Pool", "Moje Prodeje" atd.)

### Fáze vývoje (doporučené):

**Week 1-2: MVP Core**
- Firebase setup (projekt + Firestore + Auth)
- Next.js scaffold
- Authentication (login/register)
- Lead pool (read-only list)
- "Vezmu si lead" button (update Firestore)

**Week 3-4: Sales Flow**
- Client detail page
- Stage management (drag-drop nebo select)
- Earnings dashboard (simple stats)
- Admin panel (lead import CSV)

**Week 5-6: Polish & Deploy**
- Mobile optimalizace
- Error handling
- Loading states
- Deploy to Vercel
- Firebase security rules

### File Structure (doporučená):

```
/aplikace
  /app
    /(auth)
      /login/page.tsx
      /register/page.tsx
    /(dashboard)
      /layout.tsx           ← Dashboard layout s sidebar
      /page.tsx             ← Dashboard home (stats)
      /leads/page.tsx       ← Lead pool
      /leads/[id]/page.tsx  ← Client detail
      /sales/page.tsx       ← Moje prodeje
      /earnings/page.tsx    ← Earnings dashboard
    /(admin)
      /leads/import/page.tsx  ← CSV import
      /makleri/page.tsx       ← Makléř management
  /components
    /LeadCard.tsx
    /StageSelector.tsx
    /EarningsChart.tsx
  /lib
    /firebase.ts          ← Firebase config
    /firestore.ts         ← Firestore queries
    /auth.ts              ← Auth helpers
```

### Firebase Firestore Rules (návrh):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Leads - makléř vidí jen assigned nebo available
    match /leads/{leadId} {
      allow read: if request.auth != null && (
        resource.data.status == 'available' ||
        resource.data.assignedTo == request.auth.uid
      );
      allow update: if request.auth != null && (
        resource.data.assignedTo == request.auth.uid ||
        resource.data.status == 'available'
      );
    }

    // Makléři - read own profile
    match /makleri/{maklerId} {
      allow read: if request.auth != null && request.auth.uid == maklerId;
    }

    // Sales - read own sales
    match /sales/{saleId} {
      allow read: if request.auth != null && resource.data.maklerId == request.auth.uid;
    }

    // Admin only (custom claim)
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Environment Variables (.env.local):

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Optional: Email & SMS
SENDGRID_API_KEY=xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
```

### Common Issues & Solutions:

**Issue:** "Firebase není nakonfigurovaný"
- **Fix:** Vytvoř nový Firebase projekt na console.firebase.google.com
- Enable Firestore, Authentication (Email/Password), Storage

**Issue:** "Makléř nevidí leady"
- **Fix:** Zkontroluj Firestore Rules (makléř musí mít read access na available leads)

**Issue:** "Lead import nefunguje"
- **Fix:** CSV musí mít správné columns (firstName, lastName, phone, email, brand, model, atd.)

**Issue:** "Slow loading (100+ leads)"
- **Fix:** Pagination (10-20 leadů per page), nebo infinite scroll

---

## Learn More

- **Firebase Docs:** https://firebase.google.com/docs
- **Next.js App Router:** https://nextjs.org/docs/app
- **Shadcn/ui Components:** https://ui.shadcn.com
