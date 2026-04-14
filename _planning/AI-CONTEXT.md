# AI KONTEXT - CAR MAKLÉŘ PROJEKT

**Datum vytvoření:** 12. října 2025
**Poslední aktualizace:** 12. října 2025
**Účel:** Kompletní kontext pro AI asistenty, aby mohli okamžitě navázat na rozdělanou práci

---

## 🎯 O ČEM JE TENTO PROJEKT?

### Hlavní myšlenka
**CAR makléř** je automobilový makléřský servis, který pomáhá lidem prodat jejich prémiová auta (500k-1.5mil Kč) rychle a za férovou cenu. Místo toho, aby majitel auta musel:
- Inzerovat na portálech
- Komunikovat s desítkami zájemců
- Hádat se o cenu
- Obávat se podvodů

...makléř to udělá za něj. Majitel jen podepíše smlouvu a vybere peníze.

### Byznys model
- **Cena služby:** 7 500 Kč základní poplatek + upselly (fotodokumentace, premium inzerce, atd.)
- **Target zákazník:** Majitelé prémiových aut v Praze (BMW, Audi, Mercedes)
- **Lead source:** Infoexe.cz (100 leadů denně, Praha focus)
- **Průměrná doba prodeje:** 17 dní
- **Konkurenční výhoda:** Hájíme zájmy PRODÁVAJÍCÍHO (ne kupujícího jako autobazary)

### Klíčové milníky
- **VIP START (Leden 2026):** Zkušební provoz pro manažery a velké partnery - osahání systémů práce před oficiálním startem
- **PLNÝ START (Březen 2026):** Oficiální spuštění pro všechny zákazníky
- **Cíl Q2 2026:** Dominance na českém trhu automobilových makléřů

---

## 📁 STRUKTURA PROJEKTU

```
CAR-Makler-App/
├── docs/                           # Marketingové dokumenty
│   ├── BRANDING-GUIDELINES.md      # Brand identity, barvy, tón hlasu
│   ├── SEO-OPTIMIZATION.md         # SEO strategie (10k návštěv/měsíc)
│   ├── COPYWRITING-IMPROVEMENTS.md # Copy texty, CTA, testimonials
│   ├── CONTENT-STRATEGY.md         # 12-měsíční content plán
│   ├── CONVERSION-OPTIMIZATION.md  # CRO taktiky (2.5% → 8-10% CR)
│   ├── TRUST-ELEMENTS.md           # Trust building strategie
│   └── HYBRID-ARCHITECTURE-PLAN.md # 5-týdenní plán hybrid architektury
│
├── landing-klienti/                # Landing page pro zákazníky (localhost:3000)
│   └── app/page.tsx                # Next.js 15, Tailwind, Shadcn/ui
│
├── landing-makleri/                # Landing page pro makléře (localhost:3001)
│   └── app/page.tsx                # Nábor makléřů, provizní model
│
├── main-web/                       # Hlavní web carmakler.cz (localhost:3002)
│   ├── app/page.tsx                # Homepage
│   └── components/Navigation.tsx   # Sticky navigace
│
├── aplikace/                       # CRM Aplikace (localhost:3003) ✅ NOVÉ!
│   ├── app/
│   │   ├── (auth)/                 # Auth pages (login, logout)
│   │   ├── (dashboard)/            # Dashboard pages (leads, earnings)
│   │   └── api/                    # API routes (Raynet, AI, Cebia, eSign)
│   ├── components/                 # UI komponenty (LeadCard, PhotoGallery)
│   ├── lib/                        # Helpers (RaynetClient, Firebase)
│   ├── types/                      # TypeScript types
│   ├── CURRENT-STATUS.md           # Detailní status aplikace
│   ├── PWA-SETUP.md                # PWA instalace návod
│   └── README.md                   # Tech dokumentace
│
├── timeline.html                   # Vizualizace projektu (Říjen 25 - Červen 26)
├── AI-CONTEXT.md                   # Tento soubor
└── AI-CONTEXT-UPDATE.md            # Update pro budoucí AI asistenty
```

---

## 🔧 TECHNOLOGIE

### Frontend
- **Framework:** Next.js 15 (App Router, Turbopack)
- **React:** 18
- **Styling:** Tailwind CSS
- **UI komponenty:** Shadcn/ui
- **Jazyk:** TypeScript

### Backend (Hybrid Architecture)
- **CRM Backend:** Raynet CRM (outsourced) - lead management, activities
- **Auth:** Firebase Authentication (makléři only)
- **Storage:** Firebase Storage (photos only)
- **AI:** Google Gemini Flash 2.5 (price estimate, copywriter, photo check)
- **VIN Decoding:** Cebia API (~350 Kč/report)
- **eSignature:** Signi.com (pay-per-document)
- **Hosting:** Vercel (všechny 4 aplikace)

### Marketing & Analytics
- **Analytics:** Google Analytics 4
- **Heatmapy:** Hotjar nebo Microsoft Clarity
- **A/B Testing:** Google Optimize nebo VWO
- **SEO:** Ahrefs nebo SEMrush

---

## 📊 AKTUÁLNÍ STAV PROJEKTU

### ✅ HOTOVO (Říjen 2025)

1. **Branding & strategie**
   - Kompletní brand guidelines (barvy: modrá #2563eb, zelená #10b981, šedá)
   - Analýza konkurence (carmakler.cz, autorro.sk)
   - Research Infoexe lead generation

2. **Webové stránky (prototypy)**
   - Landing page pro klienty (`/landing-klienti`) - BĚŽÍ na port 3000
   - Landing page pro makléře (`/landing-makleri`) - BĚŽÍ na port 3001
   - Hlavní web homepage (`/main-web`) - BĚŽÍ na port 3002
   - Všechny 3 používají Next.js 15 + Tailwind + Shadcn/ui

3. **Marketingové dokumenty**
   - SEO strategie (keywords: "automobilový makléř praha" - 480 searches/měsíc)
   - Copywriting improvements (3 H1 varianty, 8 CTA variant)
   - Content strategy (8 blogových článků pro Q1 2026)
   - Conversion optimization (90-denní plán na 3-4x růst)
   - Trust elements (3-tier trust systém)

4. **Projektové řízení**
   - Notion roadmapa s 4 fázemi a checkboxy
   - Timeline vizualizace (timeline.html)
   - Tento AI kontext dokument

5. **CRM Aplikace - Extended Week 2 Complete! 🎉**
   - Next.js 15 projekt vytvořen (`/aplikace`) - BĚŽÍ na port 3003
   - Kompletní folder struktura (auth, dashboard, api, components)
   - TypeScript types pro všechny entity (Lead, User, Sale)
   - UI komponenty: StatsCard, LeadCard, PhotoGallery
   - Auth pages: /login, /logout (Firebase ready)
   - Dashboard pages: /, /leads, /earnings
   - API endpoints s mock daty:
     - `/api/raynet/leads` - Raynet integrace
     - `/api/ai/price-estimate` - Gemini AI odhad
     - `/api/ai/generate-ad` - Gemini copywriter (3 varianty)
     - `/api/ai/photo-check` - Gemini Vision
     - `/api/cebia/decode-vin` - VIN dekódování
     - `/api/esign/create-envelope` - Signi.com e-podpis
   - Helper libraries: RaynetClient, Firebase config
   - PWA support: manifest.json, service worker
   - Dokumentace: CURRENT-STATUS.md, PWA-SETUP.md, README.md
   - **Status:** ✅ Připraveno pro Week 3 (Real Integrations)

### 🔄 V PROCESU (Week 3 - Real Integrations)

**Připraveno k implementaci:**

1. **Firebase Auth** (2-3 hodiny)
   - Odkomentovat Firebase init
   - Implementovat login/logout flow
   - Auth middleware pro protected routes
   - User context provider

2. **Raynet API** (4-5 hodin)
   - Získat API credentials
   - Nahradit mock data real API calls
   - Webhook listener
   - Error handling

3. **Gemini AI** (3-4 hodiny)
   - Získat API key
   - Implementovat price-estimate
   - Implementovat generate-ad
   - Implementovat photo-check s Vision API

### ⏳ PENDING (Week 4-5)

1. **Cebia API Integration** (2-3 hodiny)
   - VIN dekódování
   - Cost tracking (~350 Kč/report)

2. **Signi.com Integration** (2-3 hodiny)
   - eSignature envelope creation
   - Webhook pro status updates

3. **Deployment & testing**

---

## 🗺️ ROADMAPA (4 FÁZE)

### **FÁZE 1: QUICK WINS** (Týden 1-2) - Říjen 2025
**Cíl:** +20-30% conversion rate
**Co se dělá:**
- Above-the-fold optimalizace (H1 A/B test, trust badges, lepší CTA)
- Multi-step formulář (2 kroky místo 1) → +40% completion rate
- Mobile optimalizace (sticky CTA, click-to-call)

**Proč je to důležité:**
60% návštěvníků je na mobilu. Tyhle úpravy přinesou nejvíc výsledků s nejmenší prací.

---

### **FÁZE 2: A/B TESTING** (Týden 3-4) - Listopad 2025
**Cíl:** +15-20% conversion rate
**Co se dělá:**
- Nastavit Google Optimize nebo VWO
- Nastavit GA4 tracking (events: form_submit, call_click, email_click)
- Hotjar/Clarity heatmapy
- Prioritní A/B testy (H1, CTA buttons)

**Proč je to důležité:**
Data-driven rozhodování místo hádání. Zjistíme, co opravdu funguje.

---

### **FÁZE 3: SEO & CONTENT** (Měsíc 2-3) - Prosinec 2025 - Leden 2026
**Cíl:** 10 000+ organických návštěv/měsíc do 6 měsíců
**Co se dělá:**
- On-page SEO (title tags, meta descriptions, schema markup)
- Google Business Profile optimalizace
- 8 blogových článků pro Q1 2026:
  - "Jak Prodat Auto v Roce 2026" (1900 searches/měsíc)
  - "Automobilový Makléř: Co To Je a Jak Funguje?"
  - "5 Chyb, Které Vás Stojí 100 000 Kč Při Prodeji Auta"
  - Atd.

**Proč je to důležité:**
Organický traffic je zdarma a dlouhodobě udržitelný. Po 6 měsících budeme dominovat ve vyhledávání.

---

### **FÁZE 4: TRUST & AUTHORITY** (Měsíc 4-6) - Únor - Duben 2026
**Cíl:** Etablovaná značka s autoritou
**Co se dělá:**
- Video content (explainer video 2-3 min, testimonial videa)
- Live activity feed ("Petr z Prahy právě získal odhad")
- Google Reviews automatizace
- Partnerství s autobazary
- Manažerská pěstírna (nábor a školení manažerů)

**Proč je to důležité:**
Trust = premium pricing. Klienti platí víc, když důvěřují značce.

---

## 💡 KLÍČOVÉ DECISION POINTS

### Proč jsme NEZVOLILI nový design webu?
**Původní situace:** Vytvořili jsme 3 prototypy landingů (klienti, makléři, homepage).

**Feedback uživatele:** "Přijde mi to dost obyčejný proti současnému carmakler.cz... málo na to, že hodláme zválcovat celý trh v ČR."

**Rozhodnutí:** Místo redesignu jsme vytvořili 5 profesionálních marketingových dokumentů s doporučeními, jak vylepšit EXISTUJÍCÍ web carmakler.cz. Důvod:
- Současný web je už profesionální
- Levnější a rychlejší než redesign from scratch
- Dokumenty můžou použít externe specialisté

### Proč 4 fáze místo "udělej všechno najednou"?
**Data-driven approach:** Každá fáze má měřitelný dopad. Pokud Fáze 1 nepřinese +40% conversion, nemá smysl pokračovat s Fází 2.

**Postupné učení:** Quick wins nám dají první data. A/B testy je vyhodnotí. SEO je long-term hra. Trust se buduje postupně.

### Proč VIP START před plným startem?
**Risk mitigation:** Manažeři a velcí partneři:
- Otestují systémy v reálném provozu
- Najdou chyby před masovým spuštěním
- Poskytnou feedback pro vylepšení
- Vytvoří první case studies pro marketing

**Timeline:**
- **Leden 2026:** VIP START (zkušební provoz)
- **Únor 2026:** Iterace na základě feedbacku
- **Březen 2026:** PLNÝ START (oficiální launch)

---

## 📈 METRIKY & CÍLE

### Conversion Rate Journey
- **Současnost:** 2.5%
- **Po Fázi 1 (Týden 2):** 3.5% (+40%)
- **Po Fázi 2 (Týden 4):** 5% (+100%)
- **Cíl Q2 2026:** 8-10% (+220-300%)

### Traffic Goals
- **Měsíc 1:** 2 000 návštěv (PPC + direct)
- **Měsíc 3:** 5 000 návštěv (+organic search)
- **Měsíc 6:** 10 000+ návštěv (50% organic)

### Business Impact
Při 10 000 návštěv/měsíc a 8% CR:
- 800 konverzí/měsíc
- Při 7 500 Kč základním poplatku = **6 000 000 Kč/měsíc** revenue
- Plus upselly (fotodokumentace, premium inzerce)

---

## 🎨 BRAND IDENTITY

### Barvy
- **Primární:** Modrá #2563eb (důvěra, profesionalita)
- **Sekundární:** Zelená #10b981 (úspěch, růst)
- **Neutrální:** Šedá #64748b (elegance)

### Tón hlasu
- **Profesionální, ale přátelský**
- **Ne technický žargon** - mluvíme pro běžné lidi
- **Transparentní** - žádné skryté poplatky, jasná cena
- **Důvěryhodný** - reálná čísla, konkrétní příklady

### Value Proposition
**Pro klienty:**
"Prodáme Vaše Auto Za 17 Dní. Vy Jen Podepíšete a Vyberete Peníze."

**Proti autobazarům:**
"Autobazar Chce Koupit Levně. My Hájíme VAŠE Zájmy."

**Bezpečnost:**
"Žádní Podvodníci. Žádné Hadry o Cenu. Jen Férový Prodej."

---

## 👥 TEAM & RESOURCES

### Potřebné role

1. **Web Developer** (5-10 hodin/týden v Fázi 1-2)
   - Implementace změn z marketingových dokumentů
   - A/B testing setup
   - GA4 integration

2. **Copywriter** (2 články/měsíc v Fázi 3)
   - Blog články dle content strategy
   - Landing page copy optimalizace

3. **Video Producer** (Fáze 4)
   - Explainer video (2-3 min)
   - Testimonial videa (3-5 klientů)

4. **Marketing Manager** (ongoing)
   - Koordinace všech fází
   - Analytics monitoring
   - A/B test vyhodnocování
   - Team lead

### Nástroje & Budget
- **Google Analytics 4:** Zdarma
- **Google Optimize / VWO:** $50-200/měsíc
- **Hotjar / Clarity:** $0-80/měsíc
- **Ahrefs / SEMrush:** $100-200/měsíc
- **CELKEM:** $150-480/měsíc na tools

---

## 🔗 KONKURENCE & INSPIRATION

### carmakler.cz (současný web)
**Co funguje:**
- Profesionální design
- Jasná value proposition
- Reálná čísla (17 dní průměr)
- Trust signals (recenze, počet prodaných aut)

**Co vylepšit:**
- Mobile experience (60% trafficu)
- Conversion rate (současně 2.5%, chceme 8-10%)
- SEO visibility (keywords ranking)
- Content marketing (blog neexistuje)

### autorro.sk (slovenská konkurence)
**Co funguje:**
- Multi-step formulář
- Výrazné CTA
- Video testimonials

**Co je slabé:**
- Generický stock foto design
- Pomalý web
- Špatné SEO

---

## 💬 COMMON PHRASES & TERMINOLOGY

### Český kontext
- **"Prodej auta"** - ne "car selling" (mluvíme česky)
- **"Makléř"** - ne "broker" (používáme český termín)
- **"Férový prodej"** - klíčová hodnota
- **"Hájíme VAŠE zájmy"** - diferenciace od autobazarů

### Tech žargon (pro AI/developers)
- **CR / Conversion Rate** - míra konverze (% návštěvníků → zákazníci)
- **CTA / Call To Action** - tlačítko/odkaz k akci
- **Above-the-fold** - část webu viditelná bez scrollování
- **Multi-step form** - formulář rozdělený na kroky
- **Sticky CTA** - CTA button, který zůstává viditelný při scrollování
- **Heatmapa** - vizualizace, kam lidé klikají na webu

---

## 🚀 JAK ZAČÍT PRACOVAT NA TOMTO PROJEKTU (NÁVOD PRO AI)

### 1. Přečti si klíčové dokumenty v tomto pořadí:

```
1. AI-CONTEXT.md (tento soubor)        ← Celkový kontext
2. docs/BRANDING-GUIDELINES.md         ← Brand identity
3. docs/CONVERSION-OPTIMIZATION.md     ← Prioritní akce
4. timeline.html                       ← Vizuální roadmapa
5. Notion roadmapa (link v projektu)   ← Task tracking
```

### 2. Zkontroluj běžící dev servery:

```bash
# Landing klienti - http://localhost:3000
cd landing-klienti && npm run dev

# Landing makléři - http://localhost:3001
cd landing-makleri && npm run dev

# Main web - http://localhost:3002
cd main-web && npm run dev
```

### 3. Pochop priority:

**NYNÍ (Říjen 2025):**
- Implementace Quick Wins z Fáze 1
- Focus na mobile (60% trafficu)
- Měřitelné výsledky do 2 týdnů

**PŘÍŠTÍ MĚSÍC (Listopad 2025):**
- A/B testing infrastructure
- Data collection & analysis

**LONG-TERM (Prosinec 2025+):**
- SEO & content marketing
- Trust & authority building

### 4. Když uživatel řekne "pokračuj v práci na CAR makléř":

**Zeptej se:**
- "Na které fázi chceš pracovat?" (1-4)
- "Máme dokončit Quick Wins nebo začít s A/B testingem?"
- "Potřebuješ implementaci nebo další plánování?"

**NIKDY nedělej:**
- Redesign without asking (máme hotové dokumenty s doporučeními)
- Velké změny bez potvrzení uživatele
- Technický žargon v copy textech (mluvíme pro běžné lidi)

### 5. Použij existující kód:

```typescript
// Všechny 3 projekty používají:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui komponenty

// Příklad struktury:
/app
  /page.tsx           ← Homepage
  /layout.tsx         ← Root layout
/components
  /Navigation.tsx     ← Sticky nav
  /ui/                ← Shadcn components
```

### 6. Když implementuješ změny:

**VŽDY:**
- Používej existující Tailwind utility classes
- Follow Next.js 15 best practices
- Responsive design (mobile-first)
- Accessibility (ARIA labels, semantic HTML)

**NIKDY:**
- Inline styles (použij Tailwind)
- jQuery nebo staré knihovny
- Neoptimalizované obrázky (použij next/image)

---

## 📝 CHANGELOG & HISTORIE

### 12. října 2025 - Initial Setup
- ✅ Vytvořena kompletní struktura projektu
- ✅ 3 webové prototypy (landing-klienti, landing-makleri, main-web)
- ✅ 5 marketingových dokumentů
- ✅ Notion roadmapa s 4 fázemi
- ✅ Timeline vizualizace (HTML)
- ✅ Tento AI kontext dokument
- ✅ Upravena terminologie VIP START (zkušební provoz pro manažery/partnery)

---

## 🆘 TROUBLESHOOTING

### "Port 3000/3001/3002 už je použitý"
```bash
# Najdi běžící proces
lsof -i :3000

# Zabij ho
kill -9 <PID>

# Nebo změň port v package.json
"dev": "next dev -p 3003"
```

### "Notion API nefunguje"
```bash
# Token je uložen v mém účtu
# Použij curl test:
curl -H "Authorization: Bearer <token>" \
  -H "Notion-Version: 2022-06-28" \
  https://api.notion.com/v1/users/me
```

### "Kam nahrát soubory?"
```
/docs              → Dokumentace (Markdown)
/public            → Statické soubory (obrázky, atd.)
/components        → React komponenty
/app               → Next.js pages (App Router)
```

---

## 🎓 LEARNING RESOURCES

### Pro pochopení byznysu:
- Google: "automobilový makléř jak to funguje"
- carmakler.cz (současný web)
- autorro.sk (slovenská konkurence)

### Pro technical implementation:
- Next.js 15 docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com

### Pro marketing:
- Všechno je v `/docs` složce
- Priorita: CONVERSION-OPTIMIZATION.md

---

## ✅ CHECKLIST PRO NOVOU AI

Před začátkem práce zkontroluj:

- [ ] Přečetl jsem celý AI-CONTEXT.md
- [ ] Vím, co je CAR makléř a jak funguje byznys model
- [ ] Rozumím rozdílu mezi VIP START a PLNÝM STARTEM
- [ ] Znám 4 fáze roadmapy a priority
- [ ] Vím, kde najít marketingové dokumenty
- [ ] Rozumím tech stacku (Next.js 15, Tailwind, Firebase)
- [ ] Vím, jak spustit dev servery (3x npm run dev)
- [ ] Chápu brand identity (barvy, tón hlasu, value prop)
- [ ] Vím, že NEDĚLÁME redesign (máme dokumenty s doporučeními)
- [ ] Rozumím metrikám (CR 2.5% → 8-10%, traffic 2k → 10k)

---

## 💡 FINÁLNÍ TIPY PRO AI

1. **Vždy se ptej, když si nejsi jistý** - uživatel preferuje otázky před akcí
2. **Používej konkrétní čísla** - "17 dní průměr", "7 500 Kč", "94% spokojenost"
3. **Mluvíme česky pro klienty** - tech žargon jen interně
4. **Mobile-first** - 60% trafficu je na mobilu
5. **Data-driven** - každé rozhodnutí má metriku
6. **Postupné kroky** - Quick Wins → A/B Testing → SEO → Trust
7. **Transparentnost** - jasné ceny, reálná čísla, žádné skryté poplatky
8. **Trust je #1 priorita** - lidé svěřují auto za 800k Kč, musí nám věřit

---

## 📞 KONTAKTY & LINKY

- **Notion roadmapa:** [Link v projektu]
- **Timeline visualizace:** `timeline.html` (otevři v prohlížeči)
- **Dev servery:** localhost:3000, 3001, 3002
- **Dokumentace:** `/docs` složka
- **Infoexe leads:** https://www.infoexe.cz

---

**Poslední slovo:**
Tento projekt má potenciál změnit způsob, jak Češi prodávají auta. Není to jen web - je to celý ekosystém důvěry, transparentnosti a profesionality. Každý detail má význam. Každá metrika se počítá. Pojďme na to! 🚀
