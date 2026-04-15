# AUDIT-007d — Plán: Marketplace investic (VIP, regulatorně kritický)

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** 🔴 **P0 BLOCKER** — regulatorní risk 8/10, launch bez právní mitigace = criminal risk pro Carmakler s.r.o.
**Odhadovaná práce implementátora:** **nelze odhadnout bez ČNB klarifikace**
**Depends on:** externí právní posudek (ČNB licence) + AUDIT-024 GDPR

---

## 1) Recon výstup (stav 2026-04-14)

**Odhad completion:** ~60 % **technicky**, **0 %** právně/compliance.

**Kompletní (technická vrstva):**
- Middleware: subdomain `marketplace.carmakler.cz` → `app/(web)/marketplace/`
- Routy: `/apply` (veřejný formulář), `/dealer/` (VERIFIED_DEALER), `/investor/` (INVESTOR), `/dealer/nova/` (wizard)
- Prisma modely:
  - `FlipOpportunity`: id/dealerId/brand/model/year/mileage/vin/condition/purchasePrice/repairCost/estimatedSalePrice/repairDescription/actualSalePrice/soldAt, **status 9-state machine:** PENDING_APPROVAL→FUNDING→FUNDED→IN_REPAIR→FOR_SALE→SOLD→PAYOUT_PENDING→COMPLETED (+CANCELLED), fundedAmount, adminNotes, rejectionReason
  - `Investment`: id/investorId/opportunityId/amount/paymentStatus (PENDING/CONFIRMED/REFUNDED)/paymentReference/returnAmount/paidOutAt
  - `MarketplaceApplication`: contact info + role + companyName + ico + investmentRange (4 pásma) + gdprConsent + status (NEW→CONTACTED→APPROVED→REJECTED→SPAM) + ipAddress + userAgent
- Deal pipeline API endpoints: `/api/marketplace/opportunities/[id]/approve`, `/investments` (POST), `/investments/[id]/confirm-payment`, `/opportunities/[id]/payout`
- Payout matematika 40/40/20 validovaná (split na 40 % investor proporčně, 40 % dealer, 20 % Carmakler). Negativní zisk = refund vkladu.
- Dashboard investora základní (totalInvested, activeInvestments, totalReturns, opportunity list)
- Stripe Connect Express backend existuje (commit `2bf0657`), ale **není integrován s marketplace** — jen broker payout flow

**Chybí (kritické):**
- ❌ **KYC dokumenty** — žádný model `KycDocument`, žádný upload flow, žádná integrace (Jumio / Onfido / Ondato)
- ❌ **AML check** — žádný flag/screening
- ❌ **Accreditation / kvalifikace investora** — `investmentRange` v formu je informativní, ne validace; žádné prohlášení o rizikovém profilu
- ❌ **Escrow / custody** — peníze se posílají na účet Carmakler s.r.o. **manuálním bankovním převodem**, admin potvrzuje. Žádný Platform-managed funds (Stripe Connect Custom), žádný hold + release logic.
- ❌ **Smluvní dokumenty** — žádná investiční smlouva template. Investor podepíše jen `gdprConsent: true` checkbox v aplikaci.
- ❌ **Payout přes Stripe Transfer** — všechno manuální bankovní převod.
- ❌ **ZoKES disclaimer** („tato služba není investiční služba dle ZoKCP / ZPKI")
- ❌ **ČNB licence info** v footer / o nás / statutu služby
- ❌ Investor risk profile questionnaire
- ❌ Marketing copy je **invests language** („Investujte do aut, vydělejte 15-25 % ročně") — bez risk warning

## 2) Regulatorní risk assessment

**Score: 8/10** (very high).

**Právní rámec k posouzení (nutné právník):**

| Predikát | Pravděpodobnost aplikace | Důsledek |
|---|---|---|
| **Crowdfunding per Nařízení EU 2020/1503** | Možné pokud > 1M EUR/rok nebo > 100 osob | Povinná ČNB registrace CSP, statut služby, prospectus |
| **Investiční zprostředkovatel (ZPKI §29)** | Nepravděpodobné pro nákup/prodej auta jako physical asset | ČNB licence |
| **Kolektivní investování (ZoKCP)** | Možné pokud struktura = „fond" (pooling 100+ investorů, správa) | Licence SICAV / fond kvalifikovaných investorů |
| **Spotřebitelský úvěr / finanční služba (zák. 257/2016)** | Nízké (toto není půjčka) | N/A |
| **AML/CFT (zák. 253/2008)** | **Vysoká** — přijímání peněz od fyzických osob | KYC povinné bez ohledu na jiné licence |
| **GDPR** | **Vysoká** — Art. 9 „sensitive data" pokud financial records | DPA + retention plán (→ AUDIT-024) |
| **Zákon o ochraně spotřebitele** | Vysoká | Risk disclaimer povinný |

**Mitigation strategy možnosti (k rozhodnutí s právníkem):**

- **A)** **„Podpultovka" model** — strict invite-only, < 100 investorů, < 1M EUR/rok, bez public marketing. Možná pod regulatorním radarem. **Risk:** precedenty ČNB ukazují, že i malý operátor může dostat pokutu pokud používá slova „investice"/„výnos"/„zisk" ve veřejné komunikaci.
- **B)** **„Spolumajitelský model"** — investor nenakupuje investiční nástroj, ale **spoluvlastní konkrétní vůz** (physical asset) → aplikuje se občanský zákoník (spolumajitelství movitých věcí §1115+), NE investiční legislativa. Licence: žádná.
- **C)** **ČNB Crowdfunding registrace** — 6-12 měsíců, 500k-1M Kč náklady, ale legal certainty. Pro scale-up adekvátní.

**Doporučení plánovače:** varianta **B** (spolumajitelství) je nejrychlejší a nejčistší právní konstrukce. **Vyžaduje ale**: přepis smluvní dokumentace (neni investor, je „spolumajitel podílu na vozidle"), úprava marketingu (žádné slovo „investice"), technická změna (Investment → Co-ownership model?).

## 3) Cíle AUDIT-007d (pokud Radim pokračuje)

### Fáze 0 — PAUSE (aktuálně doporučeno)

**NELAUNCHOVAT** marketplace dokud:
1. Právní posudek ČNB-kvalifikovaným advokátem (specialista na finanční právo, ne obecný korporátník)
2. Rozhodnutí o modelu (A/B/C výše)
3. Implementace kritické compliance vrstvy dle zvolené varianty

### Fáze 1 — Compliance hardening (8-15 dní práce, blokuje launch)

Pokud model **B (spolumajitelství)** — preferovaný:

1. **Smluvní template** „Smlouva o spoluvlastnictví vozidla k účelu jeho dalšího prodeje":
   - Investor = spoluvlastník podílu na konkrétním VIN
   - Dealer = správce vozu (opravy, nabídka k prodeji)
   - Carmakler = organizátor, vystupuje jako zástupce spoluvlastníků
   - E-signing (např. Signi nebo SignNow integrace)
2. **KYC minimální:**
   - Upload dokladu totožnosti (OP/pas)
   - Ověření Ares/RES (pro fyzické osoby podnikající)
   - Ondato nebo Jumio mini-check (livenes + ID scan)
   - Model `KycDocument` v Prisma: userId, type (ID_CARD/PASSPORT/UTILITY_BILL), url (encrypted), status (PENDING/APPROVED/REJECTED), reviewedBy, reviewedAt
3. **AML screening:**
   - Sanctions list check (EU sanctions, UN, OFAC) — API npm `@sanctions-list/node` nebo Chainalysis
   - PEP check (politicky exponované osoby)
   - Model `AmlCheck`: userId, sanctionsHit (Boolean), pepHit, checkDate, details JSON
4. **Risk disclaimer** všude:
   - Landing page: „Tato služba není investiční službou dle zákona 256/2004. Spoluvlastnictví vozidla je soukromoprávní vztah dle §1115 OZ. Možná ztráta celého vloženého kapitálu."
   - Před každou „investicí" (confirm modal)
   - V patičce všech marketplace stránek
5. **Accreditation questionnaire** (pro variantu B volitelné, pro A/C povinné):
   - Testování suitability & appropriateness (MiFID II style)
   - Blokace investice při nedostatečné kvalifikaci
6. **ZoKES documentation:**
   - `docs/ZOKES.md` — statut služby, risk factors, complaint procedure
   - `/marketplace/podminky` stránka s veřejným statutem
7. **Escrow — fáze 1 (manuální, ale transparent):**
   - Peníze na segregovaný účet Carmakler („escrow" account), ne provozní
   - Statement každý měsíc pro každého investora
   - `EscrowLedger` model: investorId, amount, type (DEPOSIT/WITHDRAWAL/INVESTMENT/PAYOUT), balanceAfter, proofDocumentUrl

### Fáze 2 — Technical hardening (po compliance, 5-7 dní)

8. **Stripe Connect Custom integrace** pro escrow (nahradit manuální převody):
   - Platform-managed balances per investor
   - Hold until deal confirmation
   - Transfer at payout
   - Fee extraction (20 % Carmakler) automatizován
9. **Payout mechanism** přes Stripe Transfer API (ne manuální)
10. **Investment analytics** dashboard rozšíření (historical ROI, risk metrics)

### Fáze 3 — Launch readiness

11. Právní review finálních textů
12. Penetration test escrow flow
13. Soft launch (5 invite-only investoři) → 30 dní observation → open launch

## 4) Acceptance criteria (pro Fázi 0/1)

- [ ] Právní posudek ČNB-kvalifikovaným advokátem v písemné formě (Radim si objedná)
- [ ] Rozhodnutí o modelu A/B/C dokumentováno
- [ ] (Pokud B) smluvní template + 3 fáze compliance dokončeny před jakýmkoli live investorem
- [ ] Risk disclaimer viditelný na všech marketplace stránkách
- [ ] KYC + AML check funguje end-to-end (test investor projde)
- [ ] Escrow ledger audituje každý pohyb
- [ ] ZoKES stránka publikována

## 5) Risk & open questions

### Risk
- **R1 (kritický):** Launch bez právní klarifikace → ČNB pokuta 1-50M Kč + reputační damage.
- **R2 (high):** Bez KYC/AML → trestní odpovědnost statutárů (AML zákon).
- **R3 (medium):** Marketing „výnos 15-25 % ročně" bez disclaimer → správní řízení dle zák. o ochraně spotřebitele.
- **R4 (medium):** Žádný escrow → fraud risk (dealer zmizí s penězi po FUNDED stavu) → civilní spory od investorů.

### Open questions pro Radima (P0, přes team-lead)
1. **MÁŠ PRÁVNÍKA** specializovaného na finanční právo? Pokud ne: **NELAUNCHUJ** dokud nebude. Kontakt: např. Allen & Overy ČR, PRK Partners, Havel Partners — cena cca 30-100k Kč za úvodní posudek.
2. **Jaký model preferuješ** — A/B/C (viz sekce 2)?
3. **Kolik investorů plánuješ** v prvních 6 měsících? Max EUR volume/year?
4. **Veřejný marketing** marketplace ano/ne? (invite-only vs public campaign)
5. **Je Carmakler s.r.o.** správně strukturována pro tuto činnost? (ŽL rozsah, bankovní účet na firmu)
6. **Bankovní vztah** — který účet = „escrow"? Máš smluvně ošetřeno s bankou že je to třetí-stranový účet?

## 6) Out of scope

- ❌ Aktivní development před právní klarifikací (waste pokud se model změní)
- ❌ Marketing landing page rewrite — počká na finální pozici
- ❌ Loyalty program / investor tiers — P3

---

**🚨 Verdict plánovače:**

**DOPORUČUJI HALT** na marketplace launch do:
1. Právní posudek
2. Rozhodnutí modelu
3. Fáze 1 compliance hardening (KYC, AML, smlouvy, disclaimer)

**Technický kód je slušný** (deal pipeline, payout math), ale **živý investor bez compliance vrstvy = right now, today = criminal & civil exposure** pro Carmakler s.r.o. a statutárních orgánů.

Tohle NENÍ „chceme rychle na trh a pak doladíme". Tohle **je** ten 20 % kódu který drží 80 % právního rizika celé platformy. Doporučuji Radimovi: marketplace launch = Q3 2026, ne launch s ostatními 3 produkty.

Ostatní 3 produkty (makléř, inzerce, shop) **mohou launch nezávisle** — marketplace není blocker pro ně.
