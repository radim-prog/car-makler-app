# Marketing & Strategy Dokumentace

Tato složka obsahuje všechny strategické a marketingové dokumenty pro CAR makléř projekt.

## 📁 Obsah složky

### Branding & Design
- **`BRANDING-GUIDELINES.md`** - Brand identity, barvy, typografie, tone of voice
  - Logo guidelines
  - Barevná paleta (Zelenomodrá #16A085 + Tmavě šedá #2C3E50)
  - Písma (Inter, Poppins)
  - Visual style

### Marketing Strategie (4 fáze)
- **`SEO-OPTIMIZATION.md`** - SEO strategie pro organic traffic
  - Target keywords (automobilový makléř praha - 480/měsíc, atd.)
  - Schema markup (Organization, Service, FAQ, Review)
  - Technical SEO checklist
  - Link building strategie

- **`COPYWRITING-IMPROVEMENTS.md`** - Copy texty pro všechny stránky
  - 3 varianty H1 headlines pro A/B testing
  - Value propositions
  - CTA button texty
  - Testimonials template

- **`CONTENT-STRATEGY.md`** - Blog content plán Q1 2026
  - 8 článků (TOFU, MOFU, BOFU)
  - "Jak Prodat Auto v Roce 2026" (3500 slov, TOFU)
  - "Automobilový Makléř: Co To Je" (2500 slov, TOFU)
  - Model guides (BMW X5, Audi Q5, Mercedes GLE)

- **`CONVERSION-OPTIMIZATION.md`** - CRO taktiky
  - Multi-step formuláře (2 kroky)
  - Exit-intent popups
  - Mobile optimalizace (sticky CTA, click-to-call)
  - Social proof (real-time notifications)

- **`TRUST-ELEMENTS.md`** - Trust building
  - Garance (100% zpět, pokud neprodáno do 30 dní)
  - Press mentions
  - Certifikace a členství
  - Testimonials strategie

### Projektová dokumentace
- **`PROJECT-SPECIFICATION-V2-REALISTIC.md`** - Realistický projektový plán
  - Timeline (6 měsíců do plného provozu)
  - Resource requirements (1 dev, 1 marketér, 1 content writer)
  - Cost breakdown
  - Risk management

## 🎯 Použití

### Pro non-tech členy týmu:
Tyto dokumenty jsou psané srozumitelně pro každého v týmu. Obsahují:
- Konkrétní úkoly s prioritami
- Očekávané výsledky (metriky)
- Příklady a šablony

### Pro vývojáře:
- Každý dokument má sekci "Technical Implementation"
- Odkazy na příslušné komponenty v kódu
- Tracking codes (GA4, Hotjar)

### Pro marketéry:
- Copywriting šablony připravené k použití
- SEO keywords s objemy vyhledávání
- Content calendar s deadlines

## 📊 Metriky & Cíle

**Aktuální stav (před optimalizací):**
- Conversion rate: ~2.5%
- Návštěvnost: ~2000/měsíc
- Cost per lead: ~500 Kč

**Cíl po 6 měsících (po všech 4 fázích):**
- Conversion rate: 8-10% (3x růst)
- Návštěvnost: 10k+/měsíc (5x růst)
- Cost per lead: ~150 Kč (66% pokles)

## 🗓️ Roadmapa (4 fáze)

### Fáze 1: Quick Wins (Týden 1-2)
- A/B test H1 headlines
- Trust badges pod hlavním CTA
- Multi-step formulář
- Mobile optimalizace
- **Očekávaný dopad:** +20-30% conversion rate

### Fáze 2: A/B Testing & Personalizace (Týden 3-4)
- Exit-intent popups
- Social proof real-time
- Chat widget positioning
- Above-the-fold optimalizace
- **Očekávaný dopad:** +15-25% conversion rate

### Fáze 3: SEO & Content (Měsíc 2-3)
- 8 blog článků (TOFU/MOFU/BOFU)
- Schema markup na všech stránkách
- Internal linking structure
- Technical SEO audit & fix
- **Očekávaný dopad:** +200-300% organic traffic

### Fáze 4: Trust & Authority (Měsíc 4-6)
- Press mentions page
- Video testimonials (3 klienti + 2 makléři)
- Trust badges & certifikace
- "Proč nám věřit" page
- **Očekávaný dopad:** +10-15% conversion rate

## 🔗 Propojení s kódem

**Landing page pro klienty** (port 3000):
- Copy texty z: `COPYWRITING-IMPROVEMENTS.md`
- CRO taktiky z: `CONVERSION-OPTIMIZATION.md`
- Trust elementy z: `TRUST-ELEMENTS.md`

**Landing page pro makléře** (port 3001):
- Copy texty z: `COPYWRITING-IMPROVEMENTS.md` (sekce pro makléře)
- Trust elementy z: `TRUST-ELEMENTS.md` (testimonials makléřů)

**Main web - Homepage** (port 3002):
- SEO strategie z: `SEO-OPTIMIZATION.md`
- Content strategy z: `CONTENT-STRATEGY.md` (blog články)
- Branding z: `BRANDING-GUIDELINES.md`

---

## 🤖 PRO AI ASISTENTY

### Před prací s těmito dokumenty MUSÍŠ vědět:

**Kontext projektu:**
1. **Přečti:** `../AI-CONTEXT.md` - Kompletní business kontext (NEJDŮLEŽITĚJŠÍ!)
2. **Projdi:** `../timeline.html` - Timeline s fázemi a milestones

**Co je v této složce:**
- 7 strategických dokumentů (branding, SEO, copy, content, CRO, trust, spec)
- Každý dokument je self-contained (dá se číst samostatně)
- Ale všechny jsou propojené (odkazy na další dokumenty)

### Když uživatel řekne "uprav marketing dokumenty":

**✅ SPRÁVNĚ - Zeptej se:**
- "Který dokument? (SEO / Copywriting / Content / CRO / Trust / Branding)"
- "Jakou sekci v tom dokumentu?"
- "Máme upravit pro Fázi 1, 2, 3 nebo 4?"
- "Je to změna based on data nebo nový nápad?"

**❌ ŠPATNĚ - Nedělej:**
- Měnit více dokumentů najednou bez konzultace
- Přidávat nerealistické metriky (zůstaň konzervativní)
- Ignorovat propojení mezi dokumenty (všechny musí být konzistentní)
- Mazat sekce bez ptaní (možná jsou důležité pro někoho jiného v týmu)

### Struktura dokumentů:

Každý dokument má podobnou strukturu:
1. **Úvod** - Co je v dokumentu, proč je důležitý
2. **Strategie** - High-level přístup
3. **Taktiky** - Konkrétní akce (co udělat)
4. **Metriky** - Jak měřit úspěch
5. **Timeline** - Kdy to implementovat (Fáze 1-4)
6. **Technical Implementation** - Pro vývojáře

### Když čteš dokument:

**Hledej tyto sekce:**
- `## Fáze X:` - Časová priorita (co dělat kdy)
- `**Očekávaný dopad:**` - Metriky pro měření úspěchu
- `**Target keyword:**` - SEO klíčová slova (v SEO doc)
- `**Implementace:**` - Technical details (v CRO doc)

### Důležité principy:

1. **Data-driven decisions**: Každá změna musí mít metriku k měření
2. **Incremental improvements**: Neděláme redesign, děláme optimalizace
3. **Test before scaling**: Vždy A/B test před full roll-outem
4. **Mobile-first**: 60% trafficu je na mobilu
5. **User-centric**: Copy texty jsou pro běžné lidi, NE tech žargon

### Když updatuješ dokument:

**Musíš zkontrolovat konzistenci:**
- Pokud měníš headline v `COPYWRITING-IMPROVEMENTS.md`, zkontroluj jestli to sedí s `CONVERSION-OPTIMIZATION.md`
- Pokud měníš blog content v `CONTENT-STRATEGY.md`, zkontroluj SEO keywords v `SEO-OPTIMIZATION.md`
- Pokud měníš trust elementy v `TRUST-ELEMENTS.md`, zkontroluj jak jsou použity v landing pages

### Changelog dokumentů:

Každá změna v dokumentu by měla mít poznámku:
```markdown
---
**Poslední update:** 12.10.2025
**Změna:** Přidány 3 nové H1 varianty pro A/B test
**Důvod:** User feedback z prvních 100 návštěvníků
---
```

### Quick Reference:

**Kdy použít který dokument:**

| Potřebuji... | Otevři dokument... |
|--------------|---------------------|
| SEO keywords | `SEO-OPTIMIZATION.md` |
| Headline copy | `COPYWRITING-IMPROVEMENTS.md` |
| Blog článek | `CONTENT-STRATEGY.md` |
| Formulář optimalizace | `CONVERSION-OPTIMIZATION.md` |
| Testimonials | `TRUST-ELEMENTS.md` |
| Logo/barvy | `BRANDING-GUIDELINES.md` |
| Timeline/resources | `PROJECT-SPECIFICATION-V2-REALISTIC.md` |

### Debugging:

**Problém:** "Copy text se mi zdá divný/generický"
- **Řešení:** Zkontroluj `BRANDING-GUIDELINES.md` → Tone of Voice sekci

**Problém:** "Nevím kterou Fázi implementovat"
- **Řešení:** Otevři `../timeline.html` a zjisti aktuální datum

**Problém:** "Nevím jaké metriky trackovat"
- **Řešení:** V každém dokumentu je sekce "Metriky & Tracking"

**Problém:** "Dokumenty si odporují"
- **Řešení:** Označ nesrovnalost uživateli a navrhni unified approach

---

## Learn More

Pro více informací o projektu:
- `../AI-CONTEXT.md` - Kompletní business kontext
- `../timeline.html` - Timeline s vizualizací
- `../README.md` - (pokud existuje) Root README projektu
