# CAR Makléř - Multi-Web Project

**Automobilový makléř pro prémiová auta v Praze**

---

## 🚀 Quick Start

Pro detailní kontext projektu **ZAČNI VŽDY ZDE:**
👉 **[AI-CONTEXT.md](./AI-CONTEXT.md)** - Kompletní business kontext, tech stack, roadmapa

Pro vizualizaci timeline:
👉 **[timeline.html](./timeline.html)** - Otevři v browseru pro interaktivní timeline

---

## 📁 Struktura Projektu

```
CAR-Makler-App/
├── landing-klienti/     ← Landing page pro klienty (port 3000)
├── landing-makleri/     ← Landing page pro makléře (port 3001)
├── main-web/            ← Hlavní web carmakler.cz (port 3002)
├── aplikace/            ← CRM pro makléře (port 3003, TBD)
├── docs/                ← Marketing dokumenty (SEO, Copy, Content)
├── assets/              ← Brand assets (logo, fotky, ikony)
│
├── AI-CONTEXT.md        ← 🤖 START HERE - Kompletní kontext projektu
├── timeline.html        ← 📊 Vizualizace timeline a milestones
├── PROJECT-SPECIFICATION.md
└── TECHNICAL-DECISIONS.md
```

### Každá složka má vlastní README:
- [landing-klienti/README.md](./landing-klienti/README.md) - Landing pro prodej auta
- [landing-makleri/README.md](./landing-makleri/README.md) - Landing pro nábor makléřů
- [main-web/README.md](./main-web/README.md) - Corporate homepage
- [aplikace/README.md](./aplikace/README.md) - CRM systém (plán)
- [docs/README.md](./docs/README.md) - Marketing docs index
- [assets/README.md](./assets/README.md) - Brand guidelines

---

## 🎯 Co je CAR Makléř?

**Business model:**
- Automobilový makléř pro prémiová auta (500k-1.5mil Kč)
- Region: Praha + 50 km
- Revenue: 7,500 Kč base + upsells (fotografie, premium inzerce, express)
- Lead source: Infoexe.cz (100 leadů/den)
- Průměrná doba prodeje: **17 dní**

**Target audience:**
1. **Klienti** - Majitelé prémiových aut (BMW, Audi, Mercedes) kteří chtějí prodat
2. **Makléři** - Lidé, kteří chtějí vydělávat 30-150k/měsíc jako automobiloví makléři

---

## 🌐 Web Aplikace

### 1. Landing Page - Pro Klienty
**Port:** 3000
**URL:** http://localhost:3000
**Účel:** Získat leady od majitelů aut

```bash
cd landing-klienti
npm install
npm run dev
```

**Key features:**
- Hero: "Prodáme Vaše Auto Za 17 Dní"
- Calculator: Odhad ceny auta
- Process: 5 kroků jak to funguje
- Testimonials + FAQ
- Kontaktní formulář

### 2. Landing Page - Pro Makléře
**Port:** 3001
**URL:** http://localhost:3001
**Účel:** Nábor makléřů

```bash
cd landing-makleri
npm install
npm run dev
```

**Key features:**
- Provizní model (7,500 Kč + upsells)
- 100 leadů denně garantováno
- Výhody práce jako makléř
- Aplikační formulář

### 3. Main Web - Homepage
**Port:** 3002
**URL:** http://localhost:3002
**Účel:** Corporate site + SEO + Blog

```bash
cd main-web
npm install
npm run dev
```

**Key features:**
- Homepage s navigací
- Plánované stránky: /o-nas, /blog, /kontakt
- SEO optimalizace (480+ searches/měsíc keywords)
- Content marketing (8 článků Q1 2026)

### 4. Aplikace - CRM (Plánováno)
**Port:** 3003
**Status:** 🚧 Připraveno k vývoji

CRM systém pro makléře - lead management, sales pipeline, earnings dashboard.

---

## 📚 Marketing Dokumenty

V složce `/docs` najdeš:
- **BRANDING-GUIDELINES.md** - Brand identity, barvy (#16A085), fonts (Poppins, Inter)
- **SEO-OPTIMIZATION.md** - Keywords, schema markup, technical SEO
- **COPYWRITING-IMPROVEMENTS.md** - 3 varianty H1, CTA texty, testimonials
- **CONTENT-STRATEGY.md** - 8 blog článků Q1 2026 (TOFU/MOFU/BOFU)
- **CONVERSION-OPTIMIZATION.md** - Multi-step form, exit-intent, mobile CTA
- **TRUST-ELEMENTS.md** - Garance, press mentions, certifikace
- **PROJECT-SPECIFICATION-V2-REALISTIC.md** - Timeline, resources, costs

👉 **[docs/README.md](./docs/README.md)** pro detailní přehled

---

## 🗺️ Roadmapa (4 Fáze)

### Fáze 1: Quick Wins (Týden 1-2) - ✅ Ready to implement
- A/B test H1 headlines
- Trust badges pod hlavním CTA
- Multi-step formulář
- Mobile optimalizace
- **Očekávaný dopad:** +20-30% conversion rate

### Fáze 2: A/B Testing (Týden 3-4)
- Exit-intent popups
- Social proof real-time
- Chat widget optimization
- **Očekávaný dopad:** +15-25% conversion rate

### Fáze 3: SEO & Content (Měsíc 2-3)
- 8 blog článků
- Schema markup
- Technical SEO audit
- **Očekávaný dopad:** +200-300% organic traffic

### Fáze 4: Trust & Authority (Měsíc 4-6)
- Press mentions page
- Video testimonials
- Certifikace & garance
- **Očekávaný dopad:** +10-15% conversion rate

👉 **Otevři [timeline.html](./timeline.html)** pro vizualizaci

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Language:** TypeScript
- **Database:** Firebase Firestore (plán pro CRM)
- **Authentication:** Firebase Auth (plán pro CRM)
- **Analytics:** Google Analytics 4
- **Deployment:** Vercel

---

## 📊 Metriky & Cíle

**Aktuální stav:**
- Conversion rate: ~2.5%
- Návštěvnost: ~2000/měsíc
- Cost per lead: ~500 Kč

**Cíl po 6 měsících:**
- Conversion rate: **8-10%** (3x růst)
- Návštěvnost: **10k+/měsíc** (5x růst)
- Cost per lead: **~150 Kč** (66% pokles)

---

## 🚦 Milestones

- **VIP START (Leden 2026):** Zkušební provoz pro manažery a velké partnery - osahání systémů práce před oficiálním startem
- **FULL START (Březen 2026):** Oficiální spuštění pro veřejnost s 100 leady/den

---

## 👥 Tým & Role

**Required team:**
- 1x Developer (Full-stack, Next.js + Firebase)
- 1x Marketér (SEO, PPC, social media)
- 1x Content Writer (blog články)
- 3-5x Makléři (prodej aut)

**Budget estimate:**
- Development: ~150k Kč (one-time)
- Marketing: ~30k Kč/měsíc
- Content: ~15k Kč/měsíc
- Provize makléřů: variable (revenue share)

---

## 🔗 Quick Links

- **Notion Roadmapa:** [CAR makléř](https://www.notion.so/...) (pokud máš přístup)
- **Konkurence:**
  - [carmakler.cz](https://carmakler.cz) (existující, ale zastaralý)
  - [autorro.sk](https://autorro.sk) (slovenská konkurence)
- **Lead source:** [Infoexe.cz](https://infoexe.cz)

---

## 🤖 PRO AI ASISTENTY

**PŘED JAKOUKOLI PRACÍ NA TOMTO PROJEKTU:**

### 1. POVINNÁ ČETBA (v tomto pořadí):
1. **[AI-CONTEXT.md](./AI-CONTEXT.md)** ← START HERE! Kompletní kontext projektu
2. Otevři **[timeline.html](./timeline.html)** v browseru ← Vizualizace timeline
3. README konkrétní složky, na které budeš pracovat

### 2. Když uživatel řekne "uprav web/landing/aplikaci":

**✅ SPRÁVNĚ - Nejdřív se zeptej:**
- "Který web? (klienti/makléři/main-web?)"
- "Kterou sekci/komponent?"
- "Máme implementovat Quick Wins z Fáze 1?"
- "Je to založeno na datech nebo nový nápad?"

**❌ ŠPATNĚ - Nikdy nedělej:**
- Změny bez specifikace která aplikace/web
- Redesign celého webu najednou
- Přidání features mimo roadmapu bez ptaní
- Ignorování branding guidelines (barvy, fonts)

### 3. Základní pravidla:

**Pro landing pages (klienti, makléři):**
- Focus je na **CONVERSION**, ne jen design
- Mobile-first (60% trafficu)
- Jasné, jednoduché texty (ne tech žargon)
- A/B testing před full roll-outem

**Pro main-web:**
- Focus je na **SEO**, ne conversion
- Navigation je viditelná (ne jako landing page)
- Professional tone (ne přehnaně sales-y)
- Blog content podle `docs/CONTENT-STRATEGY.md`

**Pro aplikace (CRM):**
- Focus je na **EFFICIENCY**, ne marketing
- Simple & fast (makléři chtějí rychle updatovat)
- Mobile-first (makléři pracují v terénu)
- Firebase backend (Firestore + Auth)

### 4. File Structure Understanding:

```
Každá Next.js aplikace má:
/app
  /page.tsx          ← Homepage
  /layout.tsx        ← Root layout
  /(group)/          ← Route groups
/components          ← React komponenty
/lib                 ← Utility functions
/public              ← Statické soubory
```

### 5. Common Commands:

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server

# Code quality
npm run lint          # ESLint check
npm run type-check    # TypeScript check

# Deployment (Vercel)
vercel                # Deploy to preview
vercel --prod         # Deploy to production
```

### 6. Debugging Checklist:

**Když něco nefunguje:**
- [ ] Jsi ve správné složce? (`pwd` command)
- [ ] Běží správný dev server? (port 3000/3001/3002)
- [ ] Node modules jsou instalované? (`npm install`)
- [ ] TypeScript errors? (`npm run type-check`)
- [ ] ESLint errors? (`npm run lint`)
- [ ] Browser console errors? (F12 → Console)

### 7. Resources:

**Když nevíš jak něco udělat:**
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com
- Firebase: https://firebase.google.com/docs

**Pro marketing/content:**
- Vždy zkontroluj `/docs` folder před psaním copy
- SEO keywords jsou v `docs/SEO-OPTIMIZATION.md`
- Brand voice je v `docs/BRANDING-GUIDELINES.md`

### 8. Decision Making:

**Když si nejsi jistý:**
- ✅ Zeptej se uživatele (ne guessing)
- ✅ Zkontroluj docs/ (možná je to tam documented)
- ✅ Drž se roadmapy (Fáze 1-4)
- ❌ Nedělej velké architectural changes bez schválení

---

## 📝 Changelog

**2025-10-12:**
- ✅ Vytvořena složka struktura (3 weby + aplikace + docs + assets)
- ✅ Kompletní README v každé složce
- ✅ AI-CONTEXT.md s business kontextem
- ✅ Timeline HTML vizualizace
- ✅ Notion roadmapa (4 fáze)
- ✅ 7 marketing dokumentů v /docs
- 🚧 Ready to start Fáze 1 implementation

---

## Learn More

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn/ui Components:** https://ui.shadcn.com
- **Firebase:** https://firebase.google.com/docs

Pro otázky nebo feedback:
- GitHub Issues: (TBD)
- Email: (TBD)
