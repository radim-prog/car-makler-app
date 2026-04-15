# AUDIT-028 Breakdown Review — Kontrolor verdikt
**Autor:** radim-kontrolor  
**Datum:** 2026-04-15  
**Podklady:** AUDIT-028a-design-findings.md, AUDIT-028b-ecosystem-strategy.md, AUDIT-028c-copy-rewrite.md, AUDIT-028d-b2b-deck-outline.md  
**Task:** #9

---

## Verdikt: ✅ APPROVED s 2 poznámkami

---

## Checklist dle zadání task #9

### (a) F-020 (4 nové B2B landing pages) — ✅ PŘÍTOMNO

AUDIT-028c obsahuje kompletní copy pro všechny 4 stránky:

| Sekce | URL | Status |
|-------|-----|--------|
| 1 | `/pro-bazary` | ✅ hero, jak to funguje, ROI kalkulačka, case study Horák, pricing tiers, FAQ, CTA |
| 2 | `/pro-autickare` | ✅ hero, ekosystém napojení, Pavel z Kolína (s disclaimery), ROI kalkulačka, ověřovací protokol, waitlist |
| 3 | `/pro-investory` | ✅ sekce 3, L416 — waitlist gate, risk disclaimery |
| 4 | `/pro-makleri` | ✅ sekce 4, L555 — kariéra, provize, oblastní rozdělení |

**Poznámka:** AUDIT-028b a 028c používají `/pro-autickare` (bez háčku v URL), zatímco LAUNCH-CHECKLIST C4 říká `/pro-auticare`. Implementátor musí zvolit jeden slug a být konzistentní.

---

### (b) F-023 hero leasing copy — ✅ ŘEŠENO

AUDIT-028b sekce 1.1 explicitně identifikuje problem:
> "Pod hero leasingové segmenty 'Zaměstnanec / OSVČ od 3 měsíců / Důchodce' (B2C úvěrový jazyk)"

Nová homepage direction (028b) tuto kopii nahrazuje ekosystémovým HUBem s B2B pitchem. **LAUNCH-CHECKLIST C2 je ✅** (grep → 0, ověřeno task #10).

---

### (c) F-026 Top makléři REFRAMING — ✅ ŘEŠENO, VETO COMPLIANCE OK

LAUNCH-CHECKLIST C11 je ✅ (VETO compliance confirmed, task #10). AUDIT-028 breakdown SPRÁVNĚ F-026 NEROZEBÍRÁ — to bylo vyřešeno jako samostatný FIX-013. Breakdown ho nemá přepisovat, správně zachovává stávající stav "servisní vrstva" bez odstranění sekce.

---

### (d) Radimovy literální požadavky — acceptance criteria — ✅ PŘÍTOMNO

| Požadavek | Kde v 028 | Stav |
|-----------|-----------|------|
| Profesionální vzhled | 028b sekce 2: midnight palette, Fraunces/Outfit, zero emoji, generous whitespace | Implementováno FIX-022 → C8 ✅ |
| B2B primary | 028b sekce 1.2: "Přepsat homepage na ekosystémový HUB s editorial B2B aesthetic" | Copy v 028c ✅, implementace pending (C3-C6 ⏳) |
| Ekosystémový story | 028b sekce 3: "uzavřený cyklus auto → kapitál → prodej → díly → loop" s vizuálním diagramem | Strategie ✅, vizuální cyklus CHYBÍ v kódu (C7 🟡) |

**Design systém acceptance criteria (028b sekce 2.4):**
- midnight-700 jako hero background ✅ (verifikováno FIX-022)
- orange-500 pouze CTA + accent, max 15% plochy ✅
- Fraunces serif pro headlines ✅
- Outfit pro body ✅  
- Lucide ikony, zero emoji ✅

---

## Poznámky pro implementátora (neopravuje APPROVED status)

### P1 — Pavel z Kolína disclaimer (B8 → ⏳ → ✅ po deployi)
AUDIT-028c sekce 2.3 má **dvojí disclaimer** pro Pavel case study:
- L262: banner před sekcí: *"Modelový scénář. Po launchu nahradíme skutečnými case studies se souhlasem klientů."*
- L309-310: disclaimer pod celým příběhem: *"Modelový scénář vytvořený na základě průměrných dat..."*

Toto splňuje B8 requirement "prominent disclaimer". **Jakmile implementátor nasadí /pro-autickare, B8 může být překlopeno ✅.**

### P2 — C7 homepage ekosystém vizuální cyklus (🟡 → implementátor)
AUDIT-028b sekce 3.2 popisuje vizuální diagram s 4 produkty a šipkami. Tento diagram **chybí v kódu** — homepage má stats panel a "součást ekosystému" text, ale vizuální flow cycle není implementován. Toto je samostatný C7 scope pro implementátora.

### P3 — URL slug inconsistency
- LAUNCH-CHECKLIST C4: `/pro-auticare`
- AUDIT-028c/028b: `/pro-autickare`

Implementátor musí zvolit canonical slug a konzistentně použít v kódu i v checklist.

---

## Závěr

AUDIT-028 breakdown jako celek (028a+b+c+d) ✅ APPROVED pro předání implementátorovi:

- F-020 ✅ — všechny 4 B2B stránky mají kompletní copy v 028c
- F-021 ✅ — ekosystémová strategie v 028b s wireframe a komponentovým plánem
- F-023 ✅ — leasing copy identifikována a nová homepage copy ji vylučuje (C2 ✅)
- F-026 ✅ — VETO compliance zachován, breakdown ho správně netouches
- Radimovy požadavky ✅ — acceptance criteria definována v 028b sekce 2+3

**Zbývá:** implementace (C3-C6 ⏳, C7 🟡) — to je na implementátorovi, ne na breakdown.
