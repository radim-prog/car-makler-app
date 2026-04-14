# TECHNICKÁ ROZHODNUTÍ A ŘEŠENÍ PROBLÉMŮ

**Projekt:** CAR Makléř App
**Účel:** Detailní záznam všech technických rozhodnutí, narazených problémů a jejich řešení.
**Pro:** Kontinuitu práce při přepínání AI nebo pokračování po přestávce

---

## 🎯 HLAVNÍ VÝZVY PROJEKTU

### 1. AI ANALÝZA TRŽNÍCH CEN
**Problém:** Gemini nemá přímý přístup k webům typu Sauto.cz nebo Mobile.de

**Řešení:**
```
VARIANTA A: Web Scraping (Puppeteer)
- Backend služba (Next.js API route nebo Firebase Function)
- Puppeteer/Playwright pro scraping
- Cache výsledků (24h)
- Rate limiting (nepřetížit servery)

Kód:
const scrapeCarPrices = async (brand, model, year) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Sauto.cz
  await page.goto(`https://www.sauto.cz/hledani?brand=${brand}&model=${model}&year=${year}`);
  const prices = await page.$$eval('.car-price', els =>
    els.map(el => parseInt(el.textContent.replace(/\D/g, '')))
  );

  return prices;
};

VARIANTA B: API integraci (preferováno, pokud dostupné)
- Mobile.de má developer API
- Autobazar.eu má feed
- Sauto.cz - kontakt na API přístup?

VARIANTA C: Hybridní
- API tam kde existuje
- Scraping jako fallback
- Gemini jen pro analýzu dat (ne scraping)
```

**Implementační rozhodnutí:**
- ✅ Začneme se scrapingem (rychlejší start)
- ✅ Firebase Functions pro scraping job
- ✅ Gemini dostane strukturovaná data → analýza
- ⏳ Později API integrace (když bude čas)

---

### 2. OPRÁVNĚNÍ A ROLE
**Problém:** Firestore Security Rules jsou složité pro multi-role systém

**Řešení:**
```javascript
// Struktura role v users collection
{
  role: "makler" | "manager" | "admin",
  manager_id: "...", // pro makléře
  team_ids: [...], // pro manažery
}

// Security Rules
match /leads/{leadId} {
  function isOwner() {
    return resource.data.assigned_to == request.auth.uid;
  }

  function isInPool() {
    return resource.data.status == 'pool';
  }

  function getRole() {
    return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
  }

  function isManager() {
    return getRole() in ['manager', 'admin'];
  }

  function isInTeam() {
    let user = get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    return resource.data.manager_id == request.auth.uid ||
           resource.data.manager_id in user.team_ids;
  }

  // Makléř vidí jen svoje leady a leady v bazénu
  allow read: if isOwner() || isInPool() || isManager();

  // Přiřazení leadu
  allow update: if isInPool() &&
                   request.resource.data.assigned_to == request.auth.uid &&
                   request.resource.data.status == 'assigned';

  // Manažer může cokoliv se svým týmem
  allow read, write: if isManager() && isInTeam();

  // Admin může vše
  allow read, write: if getRole() == 'admin';
}
```

**Implementační rozhodnutí:**
- ✅ Custom claims pro role (Firebase Auth)
- ✅ Middleware v Next.js pro ochranu API routes
- ✅ Client-side validation + server-side enforcement

---

### 3. FOTODOKUMENTACE - VELIKOST A OPTIMALIZACE
**Problém:** Makléř nafotí 50 fotek po 5 MB = 250 MB → pomalé nahrávání

**Řešení:**
```javascript
// Client-side komprese před uploadem
import imageCompression from 'browser-image-compression';

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5, // Max 500 KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg'
  };

  return await imageCompression(file, options);
};

// Upload do Firebase Storage
const uploadPhotos = async (leadId, photos) => {
  const uploadPromises = photos.map(async (photo, index) => {
    const compressed = await compressImage(photo);
    const ref = storageRef(storage, `leads/${leadId}/photo-${index}.jpg`);
    return uploadBytes(ref, compressed);
  });

  return Promise.all(uploadPromises);
};
```

**Implementační rozhodnutí:**
- ✅ Komprese na klientovi (browser-image-compression)
- ✅ Max 1920px, 500 KB per foto
- ✅ WebP formát (lepší než JPEG, -30% velikost)
- ✅ Lazy loading fotek v galerii
- ✅ Thumbnail verze (200px) pro seznamy

---

### 4. OFFLINE MODE (PWA)
**Problém:** Makléř je často na místě bez internetu (garáže, sklady)

**Řešení:**
```javascript
// Service Worker strategie
// 1. Network First (pro důležitá data)
workbox.routing.registerRoute(
  /\/api\/leads/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minut
      }),
    ],
  })
);

// 2. Cache First (pro statické assety)
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
  })
);

// 3. Offline queue pro POST/PUT
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('leadQueue', {
  maxRetentionTime: 24 * 60 // 24 hodin
});

workbox.routing.registerRoute(
  /\/api\/leads/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
```

**Implementační rozhodnutí:**
- ✅ next-pwa pro PWA setup
- ✅ IndexedDB pro offline data (Dexie.js)
- ✅ Background Sync pro upload fotek
- ⚠️ Offline mode jen pro čtení leadů (ne bazén)
- ✅ Indikátor "Pracujete offline"

---

### 5. REAL-TIME AKTUALIZACE
**Problém:** 2 makléři si přiřadí stejný lead současně

**Řešení:**
```javascript
// Firestore Transaction pro atomic operace
const assignLead = async (leadId, userId) => {
  const leadRef = doc(db, 'leads', leadId);

  try {
    await runTransaction(db, async (transaction) => {
      const leadDoc = await transaction.get(leadRef);

      if (!leadDoc.exists()) {
        throw "Lead neexistuje";
      }

      if (leadDoc.data().status !== 'pool') {
        throw "Lead už není v bazénu";
      }

      transaction.update(leadRef, {
        status: 'assigned',
        assigned_to: userId,
        assigned_at: serverTimestamp()
      });
    });

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Real-time listener v UI
useEffect(() => {
  const q = query(
    collection(db, 'leads'),
    where('status', '==', 'pool')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        // Lead zmizel z bazénu → někdo si ho vzal
        toast.info('Lead byl právě přiřazen jinému makléři');
      }
    });
  });

  return unsubscribe;
}, []);
```

**Implementační rozhodnutí:**
- ✅ Firestore Transactions pro kritické operace
- ✅ Real-time listeners na bazén (onSnapshot)
- ✅ Optimistic UI updates s rollback
- ✅ Toast notifikace při konfliktech

---

### 6. TIME TRACKING STAVŮ
**Problém:** Jak měřit čas v každém stavu když lead může být vrácen zpět?

**Řešení:**
```javascript
// State history v lead dokumentu
{
  state_history: [
    {
      state: 'pool',
      entered_at: '2025-10-12T10:00:00Z',
      exited_at: '2025-10-12T11:30:00Z',
      duration_seconds: 5400,
      user_id: null
    },
    {
      state: 'assigned',
      entered_at: '2025-10-12T11:30:00Z',
      exited_at: '2025-10-13T09:00:00Z',
      duration_seconds: 77400,
      user_id: 'makler_001'
    },
    {
      state: 'contacted',
      entered_at: '2025-10-13T09:00:00Z',
      exited_at: null, // ještě trvá
      duration_seconds: null,
      user_id: 'makler_001'
    }
  ],

  // Agregované časy (pro rychlé dotazy)
  total_time_in_states: {
    pool: 5400,
    assigned: 77400,
    contacted: 0 // aktualizuje se při změně stavu
  }
}

// Cloud Function pro automatický update
exports.updateStateTracking = functions.firestore
  .document('leads/{leadId}')
  .onUpdate((change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      // Uzavři předchozí stav
      const now = admin.firestore.FieldValue.serverTimestamp();
      const lastState = before.state_history[before.state_history.length - 1];

      lastState.exited_at = now;
      lastState.duration_seconds = calculateDuration(lastState.entered_at, now);

      // Přidej nový stav
      const newState = {
        state: after.status,
        entered_at: now,
        exited_at: null,
        duration_seconds: null,
        user_id: after.assigned_to
      };

      return change.after.ref.update({
        state_history: [...before.state_history.slice(0, -1), lastState, newState]
      });
    }
  });
```

**Implementační rozhodnutí:**
- ✅ State history jako pole v lead dokumentu
- ✅ Cloud Function pro automatický tracking
- ✅ Agregované časy pro reporty
- ✅ Alert pokud lead >3 dny v jednom stavu

---

### 7. AI PROMPT ENGINEERING - TRŽNÍ ANALÝZA

**Problém:** Jak dostat z Gemini konzistentní strukturovaný výstup?

**Řešení:**
```javascript
const analyzeMarketPrice = async (vehicleData, scrapedPrices) => {
  const prompt = `
Jsi AI expert na oceňování automobilů v České republice.

ZADÁNÍ:
Analyzuj tržní cenu následujícího vozidla:
- Značka: ${vehicleData.brand}
- Model: ${vehicleData.model}
- Rok výroby: ${vehicleData.year}
- Nájezd: ${vehicleData.mileage} km
- Palivo: ${vehicleData.fuel}
- Výkon: ${vehicleData.power} kW
- Požadovaná cena majitele: ${vehicleData.requested_price} Kč

TRŽNÍ DATA (poslední 30 dní):
${scrapedPrices.map(p => `- ${p.source}: ${p.price} Kč (${p.mileage} km, ${p.year})`).join('\n')}

ÚKOL:
1. Vypočítej průměrnou, medián a rozptyl tržních cen
2. Zohledni nájezd, stav, výbavu
3. Vyhodnoť realistiku požadované ceny (tolerance ±10%)
4. Urči skóre leadu 0-100 kde:
   - 90-100: Výborný lead (cena realistická, vysoká hodnota vozu)
   - 70-89: Dobrý lead (cena ok, slušná hodnota)
   - 40-69: Lead s výhradou (cena mírně nad trhem nebo nízká hodnota)
   - 0-39: Nedoporučeno (nereálná cena nebo příliš nízká hodnota vozu)

VÝSTUP:
Odpověz POUZE v tomto JSON formátu (bez markdown bloků):
{
  "market_avg": number,
  "market_median": number,
  "market_range": {"min": number, "max": number},
  "recommended_price": number,
  "price_difference_percent": number,
  "is_realistic": boolean,
  "lead_score": number,
  "recommendation": "DOPORUČENO" | "S VÝHRADOU" | "NEDOPORUČENO",
  "reason": "string (1-2 věty)",
  "commission_warning": boolean (true pokud provize >12% hodnoty vozidla)
}
`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  // Parse JSON z odpovědi
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI nevrátila validní JSON");

  return JSON.parse(jsonMatch[0]);
};
```

**Implementační rozhodnutí:**
- ✅ Strukturované prompty s přesnými instrukcemi
- ✅ JSON mode (Gemini 2.0+)
- ✅ Fallback parsing pokud AI vrátí markdown
- ✅ Validace výstupu (Zod schema)
- ✅ Retry logic (3x pokus)

---

### 8. PDF GENEROVÁNÍ - REPORT Z KONTROLY

**Problém:** Jak vytvořit pěkný PDF report s fotkami?

**Řešení:**
```javascript
// Knihovna: react-pdf/renderer nebo jsPDF

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const InspectionReport = ({ lead, inspection }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Image src="/logo.png" style={styles.logo} />
        <Text style={styles.title}>Kontrolní report vozidla</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Základní údaje</Text>
        <Text>{lead.vehicle.brand} {lead.vehicle.model}</Text>
        <Text>VIN: {lead.vehicle.vin}</Text>
        <Text>Datum kontroly: {formatDate(inspection.date)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Vyhodnocení (330 bodů)</Text>
        <Text>✅ OK: {inspection.summary.ok}</Text>
        <Text>⚠️ Drobné vady: {inspection.summary.minor}</Text>
        <Text>❌ Vážné vady: {inspection.summary.major}</Text>
      </View>

      {inspection.photos.map((photo, i) => (
        <View key={i} style={styles.photoSection}>
          <Image src={photo.url} style={styles.photo} />
          <Text>{photo.description}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text>CAR makléř s.r.o. | carmakler.cz</Text>
      </View>
    </Page>
  </Document>
);

// Generování na serveru (API route)
export async function POST(req) {
  const { leadId } = await req.json();
  const lead = await getLeadData(leadId);

  const stream = await renderToStream(<InspectionReport lead={lead} />);
  const blob = await streamToBlob(stream);

  // Upload do Firebase Storage
  const fileRef = ref(storage, `reports/${leadId}.pdf`);
  await uploadBytes(fileRef, blob);
  const url = await getDownloadURL(fileRef);

  return Response.json({ url });
}
```

**Implementační rozhodnutí:**
- ✅ react-pdf/renderer (React komponenty → PDF)
- ✅ Generování na serveru (Next.js API route)
- ✅ Upload do Firebase Storage
- ✅ Email s PDF přílohou (SendGrid)
- ✅ Watermark s logem CAR makléř

---

### 9. NOTIFIKACE A PŘIPOMÍNKY

**Problém:** Jak upozornit makléře na úkoly?

**Řešení:**
```javascript
// Collection: reminders
{
  lead_id: "L12345",
  user_id: "makler_001",
  type: "call_client" | "stk_expiry" | "follow_up",
  due_date: timestamp,
  message: "Zavolat klientovi ohledně schůzky",
  completed: false,
  created_at: timestamp
}

// Cloud Scheduled Function (každý den v 8:00)
exports.sendDailyReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('Europe/Prague')
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = await db.collection('reminders')
      .where('due_date', '<=', today)
      .where('completed', '==', false)
      .get();

    // Seskupit podle uživatele
    const byUser = {};
    reminders.forEach(doc => {
      const r = doc.data();
      if (!byUser[r.user_id]) byUser[r.user_id] = [];
      byUser[r.user_id].push(r);
    });

    // Poslat notifikace
    for (const [userId, userReminders] of Object.entries(byUser)) {
      await sendPushNotification(userId, {
        title: `Máte ${userReminders.length} připomínek`,
        body: userReminders.map(r => r.message).join(', ')
      });
    }
  });

// Push notifikace (Firebase Cloud Messaging)
const sendPushNotification = async (userId, { title, body }) => {
  const user = await db.collection('users').doc(userId).get();
  const token = user.data().fcm_token;

  if (!token) return;

  await admin.messaging().send({
    token,
    notification: { title, body },
    webpush: {
      notification: {
        icon: '/icon-192.png',
        badge: '/badge.png'
      }
    }
  });
};
```

**Implementační rozhodnutí:**
- ✅ Cloud Scheduled Functions (cron job)
- ✅ Firebase Cloud Messaging (push notifikace)
- ✅ In-app notifikace (toast)
- ⏳ Email notifikace (SendGrid) - fáze 2
- ⏳ SMS notifikace (Twilio) - pokud budget

---

### 10. DEPLOYMENT STRATEGIE

**Problém:** Jak nasadit a udržovat aplikaci?

**Řešení:**
```bash
# GitHub repository struktura
car-makler-app/
├── .github/
│   └── workflows/
│       ├── deploy-production.yml
│       └── deploy-staging.yml
├── app/ (Next.js App Router)
├── components/
├── lib/
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   └── functions/
├── public/
├── firebase.json
└── vercel.json

# Vercel deployment
- Main branch → production (app.carmakler.cz)
- Develop branch → staging (staging-app.carmakler.cz)
- Feature branches → preview URLs

# Firebase deployment
firebase deploy --only firestore:rules,storage:rules,functions

# Environment variables (Vercel)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- GEMINI_API_KEY (secret, server-only)

# CI/CD Pipeline
1. Push to branch
2. GitHub Actions: lint + build + test
3. Vercel: deploy preview
4. Review → merge to main
5. Auto-deploy to production
6. Firebase Functions deploy (manual)
```

**Implementační rozhodnutí:**
- ✅ Vercel pro Next.js hosting
- ✅ Firebase pro backend
- ✅ GitHub Actions pro CI/CD
- ✅ Staging environment pro testování
- ✅ Automatické preview URLs pro PR

---

## 🔧 TECH STACK FINÁLNÍ

### Frontend
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Forms:** React Hook Form + Zod
- **State:** Zustand (globální stav)
- **PWA:** next-pwa
- **Offline:** Dexie.js (IndexedDB wrapper)

### Backend
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Auth:** Firebase Authentication
- **Functions:** Firebase Cloud Functions (Node.js)
- **Scheduling:** Cloud Scheduler

### AI & APIs
- **LLM:** Google Gemini 2.5 Flash
- **Scraping:** Puppeteer (Cloud Functions)
- **OCR:** Gemini Vision API
- **PDF:** react-pdf/renderer

### DevOps
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics + Firebase Analytics
- **Errors:** Sentry

### External Services
- **Email:** SendGrid
- **Push:** Firebase Cloud Messaging
- **SMS (optional):** Twilio

---

## 📊 ODHAD NÁKLADŮ (měsíčně)

### Firebase
- **Firestore:** Free tier (1 GB, 50k reads/day) → $0
- **Storage:** 5 GB → $0.13
- **Functions:** 2M invocations → $0.40
- **Auth:** Unlimited → $0
**Celkem:** ~$1/měsíc (při malém provozu)

### Gemini API
- **Flash 2.5:** $0.075 / 1M input tokens
- Odhad: 1000 analýz měsíčně × 5000 tokenů → $0.38
**Celkem:** ~$0.50/měsíc

### Vercel
- **Hobby plan:** $0 (pro malé týmy)
- **Pro plan:** $20/měsíc (pokud >100 GB bandwidth)

### SendGrid (email)
- **Free tier:** 100 emailů/den → $0
- **Essentials:** 50k emailů → $20/měsíc

### Domain
- **carmakler.cz subdomain:** $0 (pokud už mají doménu)

**CELKOVÉ NÁKLADY: $2-5/měsíc** (při rozjezdu)
**S růstem (100 makléřů): ~$50-100/měsíc**

---

## ⚠️ RIZIKA A MITIGACE

### 1. Scraping může přestat fungovat
**Riziko:** Sauto.cz změní strukturu HTML
**Mitigace:**
- Fallback na manuální vložení cen
- Email alert když scraping failuje
- Diverzifikace zdrojů (více webů)

### 2. GDPR compliance
**Riziko:** Ukládáme osobní data klientů
**Mitigace:**
- Souhlasy v aplikaci (checkbox)
- Data retention policy (smazat po 2 letech)
- Možnost exportu dat (GDPR právo)
- Šifrování citlivých dat

### 3. Konkurence zkopíruje
**Riziko:** Nápad není patentovatelný
**Mitigace:**
- Rychlé uvedení na trh (first-mover advantage)
- Kvalita > features
- Vendor lock-in (data v našem systému)

### 4. Škálovatelnost
**Riziko:** Firebase free tier nestačí
**Mitigace:**
- Monitoring limitů
- Optimalizace dotazů (indexy)
- Caching (Redis pokud potřeba)
- Migrace na Blaze plan ($0.06/100k reads)

---

## 📚 UŽITEČNÉ ZDROJE

### Dokumentace
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)

### Tutoriály
- [Firebase Auth v Next.js](https://firebase.google.com/docs/auth/web/start)
- [PWA s next-pwa](https://github.com/shadowwalker/next-pwa)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Community
- Next.js Discord
- Firebase Google Group
- r/webdev, r/nextjs (Reddit)

---

## 🚀 DALŠÍ KROKY

1. ✅ Specifikace hotova
2. ⏳ Inicializace projektu
3. ⏳ Firebase setup
4. ⏳ Gemini API test
5. ⏳ První prototyp UI

---

**Poslední update:** 2025-10-12
**Verze dokumentu:** 1.0
