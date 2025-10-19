# CAR MAKLÉŘ - Kompletní aplikace pro automobilové makléře

**Datum založení projektu:** 12. října 2025
**Klient:** CAR makléř s.r.o. (carmakler.cz)
**Technologie:** Next.js + Firebase + Gemini AI

---

## 📋 EXECUTIVE SUMMARY

Komplexní webová/mobilní aplikace (PWA) pro automobilové makléře společnosti CAR makléř s.r.o.
Aplikace pokrývá celý životní cyklus zakázky od příjmu leadu až po prodej vozidla.

**Klíčové konkurenční výhody:**
- AI analýza trhu a oceňování vozidel (Gemini 2.5 Flash)
- Automatizovaný lead management s inteligentním filtrem
- Kompletní fotodokumentace a kontrola vozidla (330+ bodů)
- Řízení oprávnění (makléř / manažer / admin)
- Detailní tracking všech akcí pro reporting

---

## 🎯 BUSINESS LOGIKA

### Cenová strategie CAR makléř:
- **Provize:** 5% z ceny vozidla
- **Minimum:** 25 000 Kč + DPH (~30 750 Kč s DPH)

### Problém:
Na vozidle za **200 000 Kč** je provize **30 750 Kč** (15,4% z ceny).
Pokud je navíc reálná tržní cena jen **170 000 Kč**, je těžké klientovi vysvětlit hodnotu služby.

### Řešení:
**AI předfiltrování leadů** - automatická analýza, zda:
1. Požadovaná cena odpovídá trhu (tolerance ±10%)
2. Hodnota vozidla umožňuje rozumnou provizi
3. Lead má potenciál pro zisk

---

## 👥 ROLE A OPRÁVNĚNÍ

### 1. MAKLÉŘ (základní uživatel)
✅ Vidí dostupné leady v "bazénu"
✅ Přiřazuje si leady do vlastní správy
✅ Vrací leady zpět do bazénu
✅ Fotodokumentace a kontrola vozidel
✅ Evidence komunikace s klientem
✅ Generování reportů pro klienty
✅ Přístup k externím nástrojům (Cebia, pojištění)
❌ Nevidí leady/auta ostatních makléřů
❌ Nemůže editovat kritická data (ceny, stavy vyžadující schválení)

### 2. MANAŽER
✅ Vše co makléř
✅ Vidí všechny makléře ve svém týmu
✅ Přehled o výkonu makléřů (reporty, statistiky)
✅ Může editovat/schvalovat kritické změny
✅ Může přeřazovat leady mezi makléři
✅ Přístup k časové analýze stavů leadů
❌ Nemůže měnit systémové nastavení

### 3. ADMINISTRÁTOR
✅ Plný přístup ke všemu
✅ Správa uživatelů a oprávnění
✅ Import/export dat
✅ Nastavení AI parametrů
✅ Systémové konfigurace
✅ Audit logy všech akcí

---

## 🔄 LEAD LIFECYCLE - Kompletní proces

### FÁZE 1: PŘÍJEM A ANALÝZA LEADU

#### 1.1 Import leadů
- Manuální vložení (formulář)
- CSV import (hromadné)
- API integrace (budoucí)

**Povinná data:**
- Jméno majitele
- Telefon / email
- Značka, model, rok výroby
- VIN (pokud dostupný)
- Požadovaná cena
- Lokace (область působnosti)

#### 1.2 AI Analýza (Gemini 2.5 Flash)
**Automaticky po vložení leadu:**

```
ÚKOL PRO AI:
1. Analyzuj tržní ceny vozidla:
   - Sauto.cz
   - Tipcars.cz
   - Autobazar.eu
   - Mobile.de (Německo)
   - Otomoto.pl (Polsko)
   - Autobazar.sk (Slovensko)
   - Belgie/Dánsko/Nizozemí (burzy)

2. Vypočítej:
   - Průměrná tržní cena
   - Medián
   - Rozptyl (min/max)
   - Doporučená prodejní cena

3. Vyhodnoť:
   - Je požadovaná cena realistická? (±10% tolerance)
   - Je hodnota vozidla dostatečná pro provizi? (min 150k Kč)
   - SKÓRE LEADU: 0-100 bodů

4. Vygeneruj doporučení:
   - "DOPORUČENO" (skóre 70+)
   - "S VÝHRADOU" (skóre 40-69)
   - "NEDOPORUČENO" (skóre 0-39)
```

**Výstup AI:**
```json
{
  "analysis_date": "2025-10-12",
  "requested_price": 200000,
  "market_avg": 175000,
  "market_median": 172000,
  "market_range": {"min": 155000, "max": 195000},
  "recommended_price": 175000,
  "price_difference_percent": 14.3,
  "is_realistic": false,
  "lead_score": 35,
  "recommendation": "NEDOPORUČENO",
  "reason": "Požadovaná cena je 14% nad trhem. Reálná provize by byla 26 250 Kč (15% z hodnoty vozidla).",
  "sources": [
    {"site": "Sauto.cz", "count": 12, "avg": 173000},
    {"site": "Mobile.de", "count": 45, "avg": 178000}
  ]
}
```

#### 1.3 Lead dostupný v "bazénu"
- Všichni makléři vidí nové leady
- Filtry: skóre, lokace, značka, datum přidání
- Barevné označení podle doporučení AI

---

### FÁZE 2: PŘIŘAZENÍ LEADU MAKLÉŘI

#### 2.1 Makléř si vybírá lead
**Akce:** Tlačítko "Přiřadit k sobě"

**Systém zaznamená:**
```json
{
  "action": "lead_assigned",
  "lead_id": "L12345",
  "assigned_to": "makler_id_001",
  "assigned_by": "makler_id_001",
  "timestamp": "2025-10-12T10:30:00Z",
  "previous_state": "pool",
  "new_state": "assigned"
}
```

#### 2.2 Stavy leadu

| Stav | Popis | Může změnit |
|------|-------|-------------|
| `pool` | V bazénu, k dispozici | Systém |
| `assigned` | Přiřazen makléři | Makléř |
| `contacted` | První kontakt proběhl | Makléř |
| `meeting_scheduled` | Schůzka domluvena | Makléř |
| `inspection_done` | Kontrola vozidla provedena | Makléř |
| `contract_signed` | Smlouva podepsána | Makléř/Manažer |
| `in_sale` | Aktivně inzerováno | Makléř |
| `negotiating` | Probíhá vyjednávání s kupcem | Makléř |
| `sold` | Prodáno | Manažer |
| `cancelled` | Zrušeno (klient odmítl) | Makléř/Manažer |
| `returned_to_pool` | Vráceno do bazénu | Makléř |

**Time tracking:**
- Systém měří čas v každém stavu
- Alert pokud lead stojí >3 dny bez pohybu
- Report pro manažera: průměrná doba v každém stavu

---

### FÁZE 3: KOMUNIKACE S KLIENTEM

#### 3.1 Evidence komunikace
**Záznamy:**
- Datum a čas
- Typ (telefonát, email, SMS, osobní schůzka)
- Poznámka (co bylo řečeno)
- Další kroky (follow-up)

**Připomínky:**
- Automatické notifikace
- "Zavolat klientovi za 2 dny"
- "STK vyprší za měsíc"

#### 3.2 Makléř dělá záznamy
**Pole pro poznámky:**
- Obecné poznámky
- Technický stav vozidla (před inspekcí)
- Požadavky klienta
- Připomínky

---

### FÁZE 4: SCHŮZKA A PREZENTACE

#### 4.1 Prezentační materiály v aplikaci
**Sekce: "Prezentace pro klienta"**

📄 **Materiály:**
- Co je CAR makléř a jak pracujeme
- Výhody naší služby
- Cenová kalkulačka (ukázat provizi)
- Reference a úspěšné prodeje
- Proces prodeje krok za krokem

**Interaktivní:**
- Tablet/mobil mode (zobrazit klientovi)
- PDF export prezentace

#### 4.2 Kontrola vozidla (jako CarAudit)

**330+ kontrolních bodů rozděleno do kategorií:**

##### A) EXTERIÉR (80 bodů)
- Karoserie (lak, rýhy, promáčkliny) - 30 bodů
- Skla (praskliny, kamínky) - 10 bodů
- Světla (funkčnost, zamlžení) - 10 bodů
- Pneumatiky (vzorek, rok výroby) - 15 bodů
- Ráfky (poškození, koroze) - 10 bodů
- Podvozek (rez, úniky olejů) - 5 bodů

##### B) INTERIÉR (70 bodů)
- Sedadla (opotřebení, skvrny) - 20 bodů
- Volant a ovládání - 10 bodů
- Palubní deska - 10 bodů
- Čalounění dveří - 10 bodů
- Koberečky a podlaha - 10 bodů
- Vůně (kouř, zatuchlina) - 10 bodů

##### C) MOTOR A MECHANIKA (100 bodů)
- Startování motoru - 10 bodů
- Zvuky motoru (klepání, svist) - 20 bodů
- Úniky tekutin - 15 bodů
- Brzdy (funkčnost, vůle) - 20 bodů
- Řízení (vůle, reakce) - 15 bodů
- Převodovka (řazení, třaskání) - 20 bodů

##### D) ELEKTRONIKA (50 bodů)
- Centrální zamykání - 5 bodů
- Okna (elektrická) - 5 bodů
- Klimatizace/topení - 10 bodů
- Rádio/navigace - 5 bodů
- Senzory parkování - 5 bodů
- Kamery - 5 bodů
- Další asistenty - 15 bodů

##### E) DOKUMENTACE (30 bodů)
- Velký TP - 5 bodů
- Malý TP - 5 bodů
- Servisní knížka - 10 bodů
- Faktura od dovozce - 5 bodů
- Druhá sada klíčů - 5 bodů

**Každý bod:**
- ✅ OK
- ⚠️ Drobná vada (popis + foto)
- ❌ Vážná vada (popis + foto)

**Fotodokumentace:**
- Multi-upload (10-50 fotek)
- Automatické značení (exteriér, interiér, motor...)
- Zoom/anotace (označit poškození)
- Časové razítko a GPS

**AI asistent při kontrole:**
- Hlasový vstup: "Prasklý pravý přední světlomet" → AI zapíše + navrhne kategorii
- Rozpoznání poškození z fotky (Gemini Vision)

#### 4.3 Generování PDF reportu
**Po dokončení kontroly:**
- Automatický PDF report
- Logo CAR makléř
- Barevné vyhodnocení (zelená/žlutá/červená)
- Všechny fotky
- Doporučení (co opravit před prodejem)
- Ocenění vozidla

**Odeslání:**
- Email klientovi
- SMS s linkem
- Tisk v aplikaci

---

### FÁZE 5: SMLOUVA A DOKUMENTY

#### 5.1 Generování smlouvy
**Šablony:**
- Smlouva o zprostředkování prodeje
- Kupní smlouva (pro kupce)
- Plná moc (pro přepis)

**Automatické vyplnění:**
- Data z leadu (jméno, adresa, vozidlo)
- Cena a provize
- Datum a podpisy

#### 5.2 Elektronický podpis (budoucí)
- Integrace s eIDAS (elektronické podpisy)
- Aktuálně: Tisk + sken zpět do aplikace

---

### FÁZE 6: EXTERNÍ SLUŽBY (PROKLIKY)

**Účel:** Makléř potřebuje rychlý přístup k externím nástrojům, ale nebudeme je duplikovat.

#### 6.1 Cebia
- 🔗 Proklik na www.cebia.cz
- Info: "Přihlaš se svým účtem a vytáhni report pro vozidlo"
- VIN se automaticky zkopíruje do schránky

#### 6.2 Pojištění
- 🔗 Proklik na srovnávače (Srovnátor, Finance.cz)
- Info: Parametry vozidla pro kalkulačku

#### 6.3 Financování
- 🔗 Proklik na kalkulačky úvěrů
- Info: Doporučené částky podle ceny vozidla

#### 6.4 Přepis vozidla
- 🔗 Link na ePodatelnu
- Info: Checklist co klient potřebuje

#### 6.5 STK a Emise
- 🔗 Link na kalendář STK stanic
- Info: Termíny v okolí

**UI v aplikaci:**
```
┌─────────────────────────────┐
│ 🛠️ UŽITEČNÉ NÁSTROJE        │
├─────────────────────────────┤
│ 📊 Cebia report             │
│    VIN: WVWZZ... [Kopírovat]│
│    [Otevřít Cebia.cz] →     │
├─────────────────────────────┤
│ 🛡️ Pojištění vozidla        │
│    [Srovnávače] →           │
├─────────────────────────────┤
│ 💰 Kalkulačka financování   │
│    [Kalkulačky úvěrů] →     │
└─────────────────────────────┘
```

---

### FÁZE 7: INZERCE A PRODEJ

#### 7.1 Generování inzerátu
**AI asistent (Gemini):**
```
PROMPT:
"Vytvoř atraktivní popis inzerátu pro:
- Značka: Škoda Octavia
- Rok: 2018
- Motor: 2.0 TDI, 110 kW
- Výbava: Ambition
- Stav: velmi dobrý (report z kontroly)
- Klady: servisní knížka, 1 majitel
- Zápory: drobné rýhy na dveřích

Styl: profesionální, důvěryhodný, pro český trh"
```

**Výstup:**
```
Nabízíme pěknou Škodu Octavia 2.0 TDI v provedení Ambition.
Vozidlo má servisní knížku, byl pouze jeden předchozí majitel.
Motor běží ticho, převodovka řadí přesně. Interiér je čistý
a pečlivě udržovaný. Na zadních dveřích jsou drobné rýhy od
parkování, jinak bez vad. Perfektní rodinné auto pro dlouhé
cesty s nízkou spotřebou. K vidění v ...
```

**Export:**
- Copy/paste do Sauto.cz, Tipcars atd.
- (Budoucí: Automatický multi-listing)

#### 7.2 Evidence zájemců
**Když zavolá zájemce:**
- Jméno, telefon
- Co ho zajímá
- Poznámky z hovoru
- Stav: nový / ozvěme se / nezájem

#### 7.3 Stav "in_sale"
- Kde je inzerováno (zaškrtávátka)
- Kolik lidí volalo
- Plánované prohlídky

---

### FÁZE 8: PRODEJ A UZAVŘENÍ

#### 8.1 Vyjednávání
**Stav:** `negotiating`
- Jméno kupce
- Nabízená cena
- Poznámky
- Stav vyjednávání

#### 8.2 Prodáno
**Stav:** `sold`
- Finální cena
- Datum prodeje
- Provize (auto-výpočet)
- Kupní smlouva (upload)

**Statistiky:**
- Čas od přiřazení do prodeje
- Kolik leadů makléř uzavřel
- Průměrná provize

#### 8.3 Zrušeno / Vráceno
**Stav:** `cancelled` nebo `returned_to_pool`

**Důvod:**
- Klient změnil názor
- Nepodařilo se domluvit cenu
- Jiný důvod (poznámka)

**Akce:**
- Záznam do historie
- Lead jde zpět do bazénu (pokud returned_to_pool)

---

## 📊 DASHBOARD A REPORTY

### Makléř vidí:
- **Moje aktivní leady** (přehled stavů)
- **Připomínky** (co dnes udělat)
- **Statistiky:**
  - Počet leadů v práci
  - Průměrná doba prodeje
  - Celková provize tento měsíc

### Manažer vidí:
- **Přehled týmu:**
  - Každý makléř: aktivní leady, uzavřené, zrušené
  - Time tracking (jak dlouho leady stojí)
- **Reporty:**
  - Nejúspěšnější makléři
  - Problematické leady (dlouho v jednom stavu)
  - Conversion rate (kolik leadů → prodej)

### Administrátor vidí:
- **Celkové statistiky firmy**
- **Audit log** (kdo co kdy udělal)
- **AI performance** (jak přesné byly odhady)

---

## 🤖 AI FUNKCE (Gemini 2.5 Flash)

### 1. Analýza tržní ceny
- Scraping nebo API integraci (Sauto, Mobile.de...)
- Statistické vyhodnocení
- Skóre leadu

### 2. OCR - rozpoznání dokumentů
- Tech. průkaz → auto-fill dat
- Občanka → kontaktní údaje
- Faktura → cena, datum

### 3. Analýza fotek vozidla
- Rozpoznání poškození (Vision API)
- Automatické kategorizace (exteriér/interiér)

### 4. Generování textů
- Popisy inzerátů
- Emaily pro klienty
- Reporty z kontrol

### 5. Chatbot (budoucí)
- FAQ pro klienty
- Info o vozidlech
- Booking schůzek

### 6. Hlasový asistent
- Diktování poznámek během kontroly
- Speech-to-text pro rychlé záznamy

---

## 🗄️ DATABÁZOVÝ MODEL (Firebase Firestore)

### Collection: `leads`
```javascript
{
  id: "L12345",
  status: "assigned", // pool, assigned, contacted, ...
  created_at: timestamp,
  updated_at: timestamp,

  // Klientská data
  client: {
    name: "Jan Novák",
    phone: "+420123456789",
    email: "jan@novak.cz",
    address: "Praha 5"
  },

  // Vozidlo
  vehicle: {
    vin: "WVWZZ...",
    brand: "Škoda",
    model: "Octavia",
    year: 2018,
    mileage: 120000,
    fuel: "diesel",
    engine: "2.0 TDI",
    power: 110, // kW
    transmission: "manual",
    color: "černá"
  },

  // Ceny
  pricing: {
    requested_price: 200000,
    recommended_price: 175000,
    final_price: null, // vyplní se po prodeji
    commission: 30750
  },

  // AI analýza
  ai_analysis: {
    analyzed_at: timestamp,
    lead_score: 35,
    recommendation: "NEDOPORUČENO",
    market_data: {...},
    reason: "Požadovaná cena je 14% nad trhem..."
  },

  // Přiřazení
  assigned_to: "makler_id_001", // null když v poolu
  assigned_at: timestamp,
  manager_id: "manager_id_001",

  // Kontrola vozidla
  inspection: {
    done: true,
    date: timestamp,
    checklist: {...}, // 330 bodů
    photos: [...], // Firebase Storage URLs
    report_url: "https://..."
  },

  // Dokumenty
  documents: {
    contract_url: "...",
    purchase_agreement_url: "...",
    other: [...]
  },

  // Tracking
  state_history: [
    {state: "pool", timestamp: "...", duration_seconds: 3600},
    {state: "assigned", timestamp: "...", duration_seconds: 86400}
  ],

  // Poznámky a komunikace
  notes: [...],
  reminders: [...]
}
```

### Collection: `users`
```javascript
{
  id: "makler_id_001",
  role: "makler", // makler, manager, admin
  name: "Petr Svoboda",
  email: "...",
  phone: "...",
  manager_id: "manager_id_001", // pokud je makléř
  active_leads: ["L12345", "L67890"],
  stats: {
    total_leads: 50,
    sold: 12,
    cancelled: 5,
    total_commission: 450000
  }
}
```

### Collection: `actions_log`
```javascript
{
  timestamp: timestamp,
  user_id: "makler_id_001",
  lead_id: "L12345",
  action: "lead_assigned",
  details: {...},
  ip: "...",
  user_agent: "..."
}
```

---

## 🔒 SECURITY RULES (Firestore)

```javascript
match /leads/{leadId} {
  // Makléř vidí jen svoje leady a leady v poolu
  allow read: if
    request.auth != null && (
      resource.data.assigned_to == request.auth.uid ||
      resource.data.status == 'pool' ||
      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin']
    );

  // Makléř může přiřadit lead sobě
  allow update: if
    request.auth != null &&
    resource.data.status == 'pool' &&
    request.resource.data.assigned_to == request.auth.uid;

  // Manažer vidí/edituje všechny leady svého týmu
  allow read, write: if
    request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin'];
}
```

---

## 🎨 TECHNOLOGIE A STACK

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + Shadcn/ui
- **PWA:** next-pwa plugin
- **Forms:** React Hook Form + Zod validation
- **State:** Zustand nebo Jotai

### Backend
- **BaaS:** Firebase (Firestore, Storage, Auth)
- **AI:** Google Gemini 2.5 Flash API
- **File uploads:** Firebase Storage (fotky, dokumenty)

### AI a External APIs
- **Gemini API:** Analýza cen, OCR, generování textů
- **Web scraping:** Puppeteer (pro tržní ceny)
- **Notifikace:** Firebase Cloud Messaging

### Deployment
- **Hosting:** Vercel (Next.js optimalizovaný)
- **Domain:** carmakler.cz/app nebo app.carmakler.cz
- **SSL:** Automaticky (Vercel)

---

## 📱 UI/UX WIREFRAME

### Makléř - Hlavní obrazovka
```
┌────────────────────────────────────┐
│ 🚗 CAR MAKLÉŘ     [Petr S.] [≡]   │
├────────────────────────────────────┤
│ 📊 DASHBOARD                       │
├────────────────────────────────────┤
│ Moje leady:        7 aktivních     │
│ Připomínky dnes:   3 ⚠️            │
│ Tento měsíc:       2 prodeje       │
├────────────────────────────────────┤
│ 🎯 DOSTUPNÉ LEADY (bazén)          │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ 🟢 Škoda Octavia 2018        │   │
│ │ 175k Kč | Praha | Skóre: 85 │   │
│ │ [Přiřadit k sobě]            │   │
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ 🟡 VW Passat 2015            │   │
│ │ 220k Kč | Brno | Skóre: 55   │   │
│ │ [Přiřadit k sobě]            │   │
│ └──────────────────────────────┘   │
├────────────────────────────────────┤
│ 📋 MOJE AKTIVNÍ LEADY              │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ BMW 320d 2017                │   │
│ │ Stav: Schůzka domluvena      │   │
│ │ Zítra 10:00 🕐               │   │
│ │ [Detail] [Kontakt]           │   │
│ └──────────────────────────────┘   │
└────────────────────────────────────┘
```

### Detail leadu
```
┌────────────────────────────────────┐
│ ← Zpět    BMW 320d 2017            │
├────────────────────────────────────┤
│ Stav: [Meeting scheduled ▼]        │
│ Klient: Jan Novák                  │
│ 📞 +420123456789                   │
│ ✉️ jan@novak.cz                    │
├────────────────────────────────────┤
│ 🤖 AI ANALÝZA                      │
│ Tržní cena: 285-310k Kč            │
│ Doporučeno: 295k Kč                │
│ Požadavek: 300k Kč ✅              │
│ Skóre: 85/100 🟢                   │
├────────────────────────────────────┤
│ [📸 Kontrola vozidla]              │
│ [📄 Generovat smlouvu]             │
│ [🛠️ Užitečné nástroje]             │
├────────────────────────────────────┤
│ 📝 POZNÁMKY                        │
│ [Přidat poznámku...]               │
├────────────────────────────────────┤
│ 🔔 PŘIPOMÍNKY                      │
│ [Přidat připomínku...]             │
└────────────────────────────────────┘
```

---

## ⚙️ IMPLEMENTAČNÍ FÁZE

### FÁZE 1: MVP (2-3 týdny)
✅ Autentizace (Firebase Auth)
✅ Lead management (bazén, přiřazení)
✅ Stavy leadů
✅ Role a oprávnění
✅ Dashboard (základní)
✅ AI analýza cen (Gemini API)

### FÁZE 2: Kontrola vozidel (1 týden)
✅ Checklist 330 bodů
✅ Fotodokumentace
✅ PDF report

### FÁZE 3: CRM features (1 týden)
✅ Poznámky a komunikace
✅ Připomínky
✅ Time tracking stavů

### FÁZE 4: Dokumenty a externí nástroje (3 dny)
✅ Šablony smluv
✅ Prokliky na Cebia, pojištění atd.

### FÁZE 5: AI pokročilé funkce (1 týden)
✅ OCR tech. průkazu
✅ Generování inzerátů
✅ Hlasový asistent

### FÁZE 6: Reporty a statistiky (3 dny)
✅ Manažerský dashboard
✅ Audit log

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Firebase projekt vytvořen
- [ ] Gemini API klíč
- [ ] Next.js projekt inicializován
- [ ] Vercel propojeno s GitHub
- [ ] Custom doména nastavena
- [ ] SSL certifikát
- [ ] PWA manifest a service worker
- [ ] Firebase Security Rules nasazeny
- [ ] Testovací data v DB
- [ ] První uživatelé (admin, manager, makléř)

---

## 📝 POZNÁMKY K ROZHODNUTÍM

### Proč PWA místo native app?
- ✅ Rychlejší vývoj
- ✅ Žádné poplatky za obchody
- ✅ Okamžité aktualizace
- ✅ Funguje offline (service worker)
- ✅ Jedna codebase pro web i mobil

### Proč Firebase?
- ✅ Rychlý start (BaaS)
- ✅ Real-time sync
- ✅ Skvělá integrace s Gemini (Google)
- ✅ Levné (free tier až 1 GB dat)

### Proč Gemini 2.5 Flash?
- ✅ Nejrychlejší Google AI model
- ✅ Multimodální (text + obrázky)
- ✅ Levný ($0.075 / 1M tokenů)
- ✅ 1M kontext window

---

## 🔮 BUDOUCÍ ROZŠÍŘENÍ

- [ ] Multi-listing (automatický export inzerátů)
- [ ] Elektronický podpis
- [ ] Integrace s účetním systémem
- [ ] Mobilní app (React Native)
- [ ] Chatbot pro klienty na webu
- [ ] SMS notifikace
- [ ] Propojení s Cebia API
- [ ] Video call integrace (pro virtuální prohlídky)

---

## 📄 ZMĚNOVÝ LOG

| Datum | Změna | Důvod |
|-------|-------|-------|
| 2025-10-12 | Iniciální specifikace | Brainstorming s klientem |

---

**Konec dokumentu - v1.0**
