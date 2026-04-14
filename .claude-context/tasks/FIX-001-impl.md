# FIX-001 + FIX-002 — Implementace

**Datum:** 2026-04-14
**Autor:** implementátor
**Režim:** fix-as-you-go (bez plánovacího kroku — micro-fixes)

---

## FIX-001: F-012 Marketplace copy regulatorní fix

**Commit:** `98397ac`
**Soubor:** `app/(web)/marketplace/page.tsx` (18 insertions, 14 deletions)

### Změny
1. **Metadata** (L10-20):
   - `title`: `"Marketplace | Propojujeme realizátory a investory | CarMakléř"` (bylo „Investiční platforma pro flipping aut")
   - `description`: `"Propojujeme ověřené realizátory aut s investory. Transparentní spolupráce přes CarMakléř."` (bylo „Investujte do aut a vydělejte 15-25 % ročně...")
   - OG title + description: stejná neutralizace

2. **Hero H1** (L168-171):
   - `"Propojujeme ověřené realizátory s investory"` (bylo „Investujte do aut, vydělejte 15-25 % ročně")

3. **Risk disclaimer** (nový, L176-179, nad fold, v hero sekci):
   ```
   ⚠️ Upozornění na riziko
   Spolupráce na flippingu aut je podnikatelská činnost spojená s rizikem ztráty vložených prostředků.
   CarMakléř neposkytuje investiční poradenství a nepředstavuje veřejnou nabídku investičních nástrojů.
   ```

4. **Hero side card** (L215-225):
   - `"🤝 Transparentní spolupráce — realizátor · investor · CarMakléř"` (bylo „📈 +21% Průměrný roční výnos")

5. **Quick stats label** (L208):
   - `"Historický ROI (ø)"` (bylo „Průměrný ROI")
   - Číslo zachováno — je to faktická historická metrika z dokončených flipů, ne projekce

6. **Sekce příkladů** (L259-265):
   - Název: `"Ilustrativní příklady projektů"` (bylo „Příklady zhodnocení")
   - Podtitulek: `"Modelové kalkulace — nejsou zárukou budoucích výsledků"` (bylo „Reálné příklady flipů a jejich výnosnost")

### Grep po fixu
```
$ grep -n "15-25\|vydělejte\|Průměrný roční" app/\(web\)/marketplace/page.tsx
(žádné výsledky)
```

### Co **nebylo** opraveno (zůstává v repu)
- `docs/presentations/marketplace-investori.html:391` — „15-25%"
- `docs/presentations/marketplace-investori.html:588` — „průměrným ROI 15-25%"
- `docs/CARMAKLER-FULL-SPEC.md:1040,1062` — rizikové třídy s ROI procenty
- `_planning/**/*.md` — zastaralá vize (Radim potvrdil že legacy)
- `docs/11-inzerce-shop.md:428`, `docs/presentations/cenik-sluzeb.html:487` — ROI v kontextu marže / cenových úrovní (ne sliby investorům)

**Rozhodnutí:** nejsou live public routes, fáze 2. Prezentace `docs/presentations/*.html` jsou sales material — vyžadují stejný fix, ale mimo scope této micro-iterace.

### Regulatorní flag
**Disclaimer neřeší** plnou compliance. Dál nutné:
- ČNB / ZISIF / ECSP posouzení (je to kolektivní investování? collective investment undertaking? crowdfunding service provider?)
- Právník na AML, KYC pro investory
- Právník na smluvní dokumentaci mezi realizátorem, investorem a CarMakléř
- **Zůstává flag v GO-NO-GO** — full regulatorní audit nutný před produkcí

---

## FIX-002: F-005 Permissions-Policy

**Commit:** `9f1fee6`
**Soubor:** `next.config.ts:112` (1 insertion, 1 deletion)

### Změna
```diff
- { key: "Permissions-Policy", value: "camera=(), microphone=()" },
+ { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
```

### Důvod
- `camera=(self)` — broker PWA potřebuje fotit auto (13 exterior slots, commit d985efd)
- `geolocation=(self)` — záznam GPS při nabírání auta v terénu (lead dokumentace)
- `microphone=()` — ponecháno disabled, žádný voice notes feature

### Testovací scenario (pro kontrolora)
1. Otevřít `/makler` na sandboxu s povoleným JS
2. V DevTools → Network / Console → ověřit že navigator.mediaDevices.getUserMedia({video:true}) **neskončí s SecurityError "Permissions-Policy: camera is disabled"**
3. `curl -sI https://car.zajcon.cz/makler | grep -i permissions-policy` → `camera=(self), geolocation=(self), microphone=()`

---

## Build

`npm run build` prošel (jediný warning: `DATABASE_URL environment variable is not set` — očekávané v build env bez DB, nesouvisí s fixy). Žádné nové TypeScript errors, žádné nové lint warnings.

---

## FIX-LOG update

Commit: `54e6b14` — přidány řádky FIX-001 + FIX-002 do `.claude-context/tasks/FIX-LOG.md §2` + záznam v §5 (historie revizí).

---

## Handoff pro kontrolora

1. Sandbox deploy (team-lead nebo kontrolor)
2. Ověřit na `https://car.zajcon.cz/marketplace`:
   - View source / Network → meta tagy obsahují neutrální texty
   - Hero zobrazuje novou H1 + disclaimer
   - Žádné „15-25 %" / „vydělejte" v DOM
   - Side card „Transparentní spolupráce"
   - Sekce „Ilustrativní příklady projektů" + podtitulek o modelových kalkulacích
3. Ověřit hlavičku: `curl -sI https://car.zajcon.cz/ | grep -i permissions-policy`
4. Updatovat FIX-LOG §2 (sloupec „verifikováno na sandboxu" + „verdikt kontrolora") + GO-NO-GO F-012 a F-005

---

## Další v pořadí (P1, po ověření P0)

- **FIX-003:** `postinstall: prisma generate` v `package.json` (AUDIT-011-qa)
- **FIX-004:** `ecosystem.config.js` pro pm2 env_file persistence (AUDIT-003 recon)

Čekám na **ověření P0** a pokyn od team-lead na P1.
