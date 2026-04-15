// AUDIT-028d — B2B Pitch Deck HTML/CSS template (Designer lane, 2026-04-15)
//
// Self-contained React server component renderující 10 slide-ů ve formátu
// A4 landscape (297×210 mm). Implementátor napojí na Puppeteer render pipeline
// v rámci AUDIT-029 Fáze 1 — API route /api/pitch-deck/generate.
//
// Styly jsou oddělené v pitchDeckStyles.ts (string konstanta DECK_CSS),
// vkládají se do <style> tagu jako plain children. Prefix .deck-scope chrání
// layout před kolizemi s Tailwindem pro případ, že admin UI renderuje deck
// v preview iframe mimo Puppeteer.
//
// Personalizace: props naplní obchodní zástupce / CRM webhook. Bez props
// renderuje generická placeholder verze (carmakler.cz/pro-bazary download).

import type { ReactNode } from "react";
import { DECK_CSS } from "./pitchDeckStyles";

export interface PitchDeckProps {
  companyName?: string;
  contactPerson?: string;
  presentedDate?: string;
  salesRepName?: string;
  salesRepRole?: string;
  salesRepEmail?: string;
  salesRepPhone?: string;
  bookingUrl?: string;
  logoUrl?: string;
  qrCodeUrl?: string;
}

const DEFAULTS: Required<Omit<PitchDeckProps, "logoUrl" | "qrCodeUrl">> = {
  companyName: "[Název firmy]",
  contactPerson: "[Jméno kontaktu]",
  presentedDate: "[DD.MM.YYYY]",
  salesRepName: "[Obchodní zástupce]",
  salesRepRole: "Account Manager",
  salesRepEmail: "obchod@carmakler.cz",
  salesRepPhone: "+420 XXX XXX XXX",
  bookingUrl: "https://carmakler.cz/schuzka",
};

export function PitchDeckTemplate(props: PitchDeckProps = {}) {
  const p = { ...DEFAULTS, ...props };
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <title>CarMakléř — partnerský přehled</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700;900&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
        <style>{DECK_CSS}</style>
      </head>
      <body className="deck-scope">
        <SlideCover {...p} />
        <SlideProblem />
        <SlideInsight />
        <SlideSolution />
        <SlideHowItWorks />
        <SlideEcosystem />
        <SlidePavelCase />
        <SlideROI />
        <SlidePilotPackage />
        <SlideCTA {...p} />
      </body>
    </html>
  );
}

/* ========================================================================
 * SLIDE 1 — Cover
 * ====================================================================== */

function SlideCover({
  companyName,
  contactPerson,
  presentedDate,
  salesRepName,
  salesRepEmail,
  salesRepPhone,
  logoUrl,
}: Required<Omit<PitchDeckProps, "qrCodeUrl" | "logoUrl" | "bookingUrl" | "salesRepRole">> & {
  logoUrl?: string;
}) {
  return (
    <Slide className="slide-cover">
      <div className="cover-top">
        {logoUrl ? (
          <img src={logoUrl} alt="CarMakléř" className="cover-logo-img" />
        ) : (
          <div className="cover-logo-text">CarMakléř</div>
        )}
      </div>

      <div className="cover-main">
        <h1 className="cover-headline">
          Platforma, která prodá víc aut za méně dní.
        </h1>
        <div className="cover-accent-line" />
        <p className="cover-subhead">
          Partnerský přehled pro {companyName} — důvěrné
        </p>
      </div>

      <footer className="cover-footer">
        <div className="cover-footer-left">
          <div className="cover-footer-label">Připraveno pro</div>
          <div className="cover-footer-value">
            {contactPerson}, {companyName}
          </div>
        </div>
        <div className="cover-footer-mid">
          <div className="cover-footer-label">Kontakt</div>
          <div className="cover-footer-value">{salesRepName}</div>
          <div className="cover-footer-meta">
            {salesRepEmail} · {salesRepPhone}
          </div>
        </div>
        <div className="cover-footer-right">
          <div className="cover-footer-label">Datum</div>
          <div className="cover-footer-value">{presentedDate}</div>
        </div>
      </footer>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 2 — Problém
 * ====================================================================== */

function SlideProblem() {
  const rows: { icon: ReactNode; claim: ReactNode; detail: string }[] = [
    {
      icon: <IconTrendingDown />,
      claim: (
        <>
          Doba obratu se prodlužuje. Dnes <span className="accent">54 dní</span>{" "}
          oproti 38 dnům v roce 2019.
        </>
      ),
      detail:
        "Každý den navíc znamená financování z vlastního kapitálu a větší riziko poklesu ceny.",
    },
    {
      icon: <IconChevronDown />,
      claim: (
        <>
          Marže klesají <span className="accent">o 4–7 % meziročně</span>.
        </>
      ),
      detail:
        "Carvago, Auto1 a agregátoři zatlačili prodejní ceny dolů. Kupci srovnávají online ještě před první návštěvou.",
    },
    {
      icon: <IconMousePointer />,
      claim: (
        <>
          Cena kliku na Sauto vzrostla o{" "}
          <span className="accent">22 % (2023–2025)</span>.
        </>
      ),
      detail:
        "Konverzní poměr z inzerce zůstává pod 2 %. Náklady na leady rostou rychleji než ceny vozů.",
    },
    {
      icon: <IconUserMinus />,
      claim: (
        <>
          Kvalitní prodejci rotují každých{" "}
          <span className="accent">14 měsíců</span>.
        </>
      ),
      detail:
        "Obchodník se skvělou sítí kontaktů si otevírá vlastní firmu nebo přechází do financování.",
    },
  ];

  return (
    <Slide className="slide-problem">
      <SlideHeader eyebrow="Problém" />
      <h2 className="slide-headline">
        Autobazar v roce 2026 čelí čtyřem trendům najednou.
      </h2>
      <p className="slide-subhead">A žádný z nich netlačí ceny nahoru.</p>

      <div className="problem-rows">
        {rows.map((row, i) => (
          <div key={i} className="problem-row">
            <div className="problem-icon">{row.icon}</div>
            <div className="problem-text">
              <div className="problem-claim">{row.claim}</div>
              <div className="problem-detail">{row.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <footer className="slide-source">
        Zdroje: SČMSD 2019–2025 · Sauto.cz ceník 2023/2025 · Interní průzkum
        CarMakléř Q4 2025 (n=23 partnerských bazarů).
      </footer>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 3 — Insight (datový)
 * ====================================================================== */

function SlideInsight() {
  const rows = [
    { metric: "Podíl kupců začínajících online", y2020: "41 %", y2025: "65 %", delta: "+24 p.b.", positive: true },
    { metric: "Důvěra B2C kupce v soukromý bazar", y2020: "51 %", y2025: "34 %", delta: "−17 p.b.", positive: false },
    { metric: "Průměrná doba obratu ojetiny", y2020: "38 dní", y2025: "54 dní", delta: "+42 %", positive: false },
    { metric: "Podíl prodejů přes síť / zprostředkovatele", y2020: "18 %", y2025: "29 %", delta: "+11 p.b.", positive: true },
  ];

  return (
    <Slide className="slide-dark slide-insight">
      <SlideHeader eyebrow="Insight" inverted />
      <h2 className="slide-headline inverted">
        Český trh aut se za pět let zásadně přepsal.
      </h2>
      <p className="slide-subhead inverted">
        Kdo se nepřizpůsobil distribučnímu modelu, prohrává marži.
      </p>

      <div className="insight-panel">
        <table className="insight-table">
          <thead>
            <tr>
              <th className="col-metric">Ukazatel</th>
              <th className="col-year">2020</th>
              <th className="col-year">2025</th>
              <th className="col-delta">Změna</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="col-metric">{r.metric}</td>
                <td className="col-year mono">{r.y2020}</td>
                <td className="col-year mono">{r.y2025}</td>
                <td className={`col-delta mono ${r.positive ? "delta-pos" : "delta-neg"}`}>
                  {r.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="insight-body">
        Kupci hledají online, ale pouhá inzerce jim nestačí. Chtějí doporučení
        od zprostředkovatele s reputací. Segment nakupujících přes síť roste
        nejrychleji — a autobazary, které prodávají výhradně přes vlastní
        inzerci, ho ztrácejí.
      </p>

      <footer className="slide-source inverted">
        GfK CZ: nákupní chování ojetin 2020/2025 (n=2 000) · SČMSD výroční
        statistika · CarMakléř interní analýza Q4 2025.
      </footer>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 4 — Řešení (3 pilíře)
 * ====================================================================== */

function SlideSolution() {
  const pillars = [
    {
      icon: <IconHandshake />,
      title: "Síť makléřů",
      body: (
        <>
          <strong>142 certifikovaných makléřů</strong> s vlastními kontakty na
          kupce. Makléř přebírá auto z vašeho skladu do poptávkového systému.
          Platíte 5 % z prodejní ceny — <em>až po prodeji</em>. Nulové měsíční
          náklady.
        </>
      ),
    },
    {
      icon: <IconRefreshCw />,
      title: "Uzavřený ekosystém",
      body: (
        <>
          Neprodané auto neznamená ztrátu. CarMakléř ho odkoupí na rozebrání do{" "}
          <strong>Shopu autodílů</strong>. Investorský Marketplace přivádí
          kapitál na hromadné nákupy. Bazar je středem ekosystému, ne
          periferií.
        </>
      ),
    },
    {
      icon: <IconLayoutDashboard />,
      title: "Technologie",
      body: (
        <>
          Centralizovaný dashboard pro správu inventáře, real-time stav
          každého vozu v síti, automatická inzerce napříč platformou.{" "}
          <strong>Bez papírování</strong>, bez telefonátů makléři o stavu auta.
        </>
      ),
    },
  ];

  return (
    <Slide className="slide-dark slide-solution">
      <SlideHeader eyebrow="Řešení" inverted />
      <h2 className="slide-headline inverted">
        CarMakléř: B2B platforma propojující{" "}
        <span className="accent">142 makléřů</span> s autobazary.
      </h2>
      <p className="slide-subhead inverted">
        Tři pilíře, které autobazar sám nevybuduje.
      </p>

      <div className="solution-grid">
        {pillars.map((pillar, i) => (
          <div key={i} className="pillar-card">
            <div className="pillar-icon">{pillar.icon}</div>
            <h3 className="pillar-title">{pillar.title}</h3>
            <p className="pillar-body">{pillar.body}</p>
            <div className="pillar-accent-strip" />
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 5 — Jak to funguje (3 kroky)
 * ====================================================================== */

function SlideHowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Nahrajete inventář",
      body:
        "Vyberete vozy, které chcete prodat přes síť CarMakléř. Vyplníte základní data (VIN, cena, stav). Fotky přes aplikaci. Čas: 5 minut na auto.",
    },
    {
      n: "02",
      title: "Síť makléřů vidí a prodává",
      body:
        "142 makléřů dostane notifikaci. Aktivní makléř auto přebere do své nabídky a prodává z vlastní sítě kupců. Vy vidíte v dashboardu, kdo pracuje na jakém voze.",
    },
    {
      n: "03",
      title: "Auto se prodá, platíte provizi",
      body:
        "Makléř dohodne kupce, CarMakléř zpracuje smlouvu. Obdržíte platbu od kupce minus 5 % provize. Průměrná doba od nahrání k prodeji: 25 dní.*",
    },
  ];

  return (
    <Slide className="slide-how">
      <SlideHeader eyebrow="Jak to funguje" />
      <h2 className="slide-headline">Tři kroky od vašeho skladu k prodeji.</h2>
      <p className="slide-subhead">
        Žádné měsíční poplatky. Platíte jen z prodaných aut.
      </p>

      <div className="how-steps">
        {steps.map((s, i) => (
          <div key={i} className="how-step">
            <div className="how-step-number">{s.n}</div>
            <div className="how-step-content">
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-body">{s.body}</p>
            </div>
            {i < steps.length - 1 && <IconArrowDown className="how-step-arrow" />}
          </div>
        ))}
      </div>

      <div className="how-pill">5 % z prodaných vozů — žádné jiné poplatky.</div>

      <p className="how-disclaimer">
        * Modelový výpočet na základě pilotních partnerů Q4 2025. Individuální
        výsledky se mohou lišit.
      </p>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 6 — Ekosystém
 * ====================================================================== */

function SlideEcosystem() {
  return (
    <Slide className="slide-dark slide-ecosystem">
      <SlideHeader eyebrow="Ekosystém" inverted />
      <h2 className="slide-headline inverted">
        Čtyři hráči. Jeden uzavřený cyklus.{" "}
        <span className="accent">Každý vydělává.</span>
      </h2>
      <p className="slide-subhead inverted">
        Autobazar je zdrojem vozů i příjemcem kapitálu — zároveň.
      </p>

      <div className="ecosystem-grid">
        <div className="ecosystem-diagram">
          <EcosystemDiagram />
        </div>

        <div className="ecosystem-legend">
          <h3 className="ecosystem-legend-title">Role v ekosystému</h3>
          <LegendRow color="var(--deck-investor)" label="Investor" desc="poskytuje kapitál přes Marketplace" />
          <LegendRow color="var(--deck-broker)" label="Autobazar / autíčkář" desc="dodává nebo kupuje za kapitál" />
          <LegendRow color="var(--deck-makler)" label="Makléř" desc="prodává, 5 % provize (min. 25 000 Kč)" />
          <LegendRow color="var(--deck-buyer)" label="Kupec" desc="ověřený koncový zákazník" />
          <LegendRow color="var(--deck-shop)" label="Shop" desc="odkupuje neprodané, prodává díly" />

          <div className="ecosystem-flow">
            <h4>Tok zisku u dealerské transakce</h4>
            <div className="flow-row">
              <span className="flow-dot" style={{ background: "var(--deck-investor)" }} />
              <span className="flow-label">Investor</span>
              <span className="flow-pct mono">40 %</span>
            </div>
            <div className="flow-row">
              <span className="flow-dot" style={{ background: "var(--deck-broker)" }} />
              <span className="flow-label">Autobazar / autíčkář</span>
              <span className="flow-pct mono">40 %</span>
            </div>
            <div className="flow-row">
              <span className="flow-dot" style={{ background: "#E4E9F2" }} />
              <span className="flow-label">CarMakléř platforma</span>
              <span className="flow-pct mono">20 %</span>
            </div>
            <div className="flow-footnote">
              Makléř obdrží 5 % z prodejní ceny (min. 25 000 Kč) z podílu
              autobazaru.
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

function LegendRow({ color, label, desc }: { color: string; label: string; desc: string }) {
  return (
    <div className="legend-row">
      <span className="legend-dot" style={{ background: color }} />
      <span className="legend-label">{label}</span>
      <span className="legend-desc">{desc}</span>
    </div>
  );
}

/* ========================================================================
 * SLIDE 7 — Případ Pavel (modelový)
 * ====================================================================== */

function SlidePavelCase() {
  const timeline = [
    {
      day: "Den 1",
      title: "Příležitost",
      body:
        "Pavel narazil na nabídku leasingové firmy — 10 vozů Škoda Octavia za 2 050 000 Kč. Odhadovaná marže 280–350 000 Kč. Problém: hotovost.",
    },
    {
      day: "Den 1–4",
      title: "Financování",
      body:
        "Pavel vystavil příležitost na Marketplace. Investor Tomáš (Praha) financoval 2 100 000 Kč za 40% podíl ze zisku.",
    },
    {
      day: "Den 5–75",
      title: "Prodej sítí",
      body:
        "Tři makléři (Kolín, Pardubice, Praha) dostali vozy do nabídky. Výsledek: 8 z 10 vozů prodáno za 2 720 000 Kč. Provize makléřů 136 000 Kč (5 %).",
    },
    {
      day: "Den 76–90",
      title: "Zbytek do Shopu",
      body:
        "2 vozy (bouračka + motor) odkoupil Shop CarMakléř za 75 000 Kč. Za 30 dní prodáno 62 % dílů s marží 35 %.",
    },
  ];

  const split = [
    { label: "Pavel (autíčkář, 40 %)", value: "293 600 Kč", emphasis: true, meta: "" },
    { label: "Tomáš (investor, 40 %)", value: "213 600 Kč", emphasis: false, meta: "annualized ROI 40,7 %" },
    { label: "CarMakléř (platforma, 20 %)", value: "268 800 Kč", emphasis: false, meta: "vč. provize a Shop marže" },
    { label: "Tři makléři", value: "136 000 Kč", emphasis: false, meta: "rozdělených" },
  ];

  return (
    <Slide className="slide-pavel">
      <DisclaimerBar>
        <strong>Modelový případ.</strong> Níže uvedená čísla jsou ilustrativní,
        sestavená na základě typických parametrů transakcí v síti CarMakléř.
        Individuální výsledky se mohou zásadně lišit v závislosti na stavu
        vozů, tržní situaci a aktivitě makléřů.
      </DisclaimerBar>

      <SlideHeader eyebrow="Případová studie (modelová)" />
      <h2 className="slide-headline">
        Jak 10 Octavií přineslo čtyřem stranám přes{" "}
        <span className="accent">půl milionu korun</span> za 90 dní.
      </h2>
      <p className="slide-subhead">
        Autíčkář Pavel, Kolín — leden–duben 2026 (modelový scénář).
      </p>

      <div className="pavel-grid">
        <div className="pavel-timeline">
          {timeline.map((t, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot">
                <IconClock />
              </div>
              <div className="timeline-body">
                <div className="timeline-day">{t.day}</div>
                <div className="timeline-title">{t.title}</div>
                <div className="timeline-desc">{t.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pavel-split">
          <h3 className="pavel-split-title">Finální rozdělení zisku</h3>
          <div className="split-table">
            {split.map((s, i) => (
              <div key={i} className={`split-row ${s.emphasis ? "emphasis" : ""}`}>
                <div className="split-label">{s.label}</div>
                <div className="split-value mono">{s.value}</div>
                {s.meta && <div className="split-meta">{s.meta}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 8 — ROI modelový pro autobazar
 * ====================================================================== */

function SlideROI() {
  const rows = [
    { metric: "Vozy prodané / měsíc", current: "50", withNetwork: "68", delta: "+18 aut", kind: "pos" },
    { metric: "Průměrná doba obratu", current: "54 dní", withNetwork: "25 dní", delta: "−29 dní", kind: "pos" },
    { metric: "Průměrná prodejní cena", current: "350 000 Kč", withNetwork: "350 000 Kč", delta: "beze změny", kind: "neutral" },
    { metric: "Hrubé tržby / měsíc", current: "17 500 000 Kč", withNetwork: "23 800 000 Kč", delta: "+6 300 000 Kč", kind: "pos" },
    { metric: "Provize CarMakléř (5 % z extra)", current: "—", withNetwork: "−315 000 Kč", delta: "náklad", kind: "neg" },
  ];

  return (
    <Slide className="slide-roi">
      <DisclaimerBar>
        <strong>Modelový výpočet.</strong> Hodnoty jsou ilustrace sestavené na
        základě průměrných parametrů pilotních partnerů CarMakléř (Q4 2025).
        Skutečné výsledky závisí na stavu trhu, struktuře inventáře a cenové
        strategii. CarMakléř neposkytuje obchodní záruku konkrétních výsledků.
      </DisclaimerBar>

      <SlideHeader eyebrow="ROI modelový" />
      <h2 className="slide-headline">Co by to znamenalo pro váš bazar?</h2>
      <p className="slide-subhead">
        Zadejte vlastní čísla na schůzce nebo na{" "}
        <span className="underline">carmakler.cz/pro-bazary</span>.
      </p>

      <div className="roi-grid">
        <div className="roi-table-wrap">
          <table className="roi-table">
            <thead>
              <tr>
                <th>Ukazatel</th>
                <th>Současný stav</th>
                <th>Se sítí CarMakléř</th>
                <th>Rozdíl</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.metric}</td>
                  <td className="mono">{r.current}</td>
                  <td className="mono">{r.withNetwork}</td>
                  <td className={`mono delta-${r.kind}`}>{r.delta}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>Čistý nárůst tržeb / měsíc</td>
                <td className="mono">—</td>
                <td className="mono strong">5 985 000 Kč</td>
                <td />
              </tr>
              <tr className="total-row strong">
                <td>Čistý nárůst tržeb / rok</td>
                <td className="mono">—</td>
                <td className="mono strong">71 820 000 Kč</td>
                <td />
              </tr>
            </tbody>
          </table>

          <p className="roi-assumptions">
            Model předpokládá: 100 % vozů nahraných do sítě · konverzní poměr
            sítě 36 % · beze změny průměrné prodejní ceny.
          </p>
        </div>

        <div className="roi-hero">
          <div className="roi-hero-number mono">71,8 mil. Kč</div>
          <div className="roi-hero-label">
            modelový roční nárůst hrubých tržeb
          </div>
          <div className="roi-hero-cta">
            ROI kalkulačka k vlastním číslům:
            <br />
            <span className="underline">carmakler.cz/pro-bazary</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 9 — Zkušební balíček
 * ====================================================================== */

function SlidePilotPackage() {
  const tiers = [
    {
      name: "PILOT",
      tagline: "Zdarma 30 dní",
      price: "0 Kč",
      priceNote: "žádný závazek",
      featured: true,
      rows: [
        { label: "Počet vozů", value: "až 10" },
        { label: "Závazek", value: "žádný" },
        { label: "Dashboard", value: "ano" },
        { label: "Dedikovaný manažer", value: "sdílený" },
        { label: "Podpora", value: "e-mail" },
        { label: "Vhodné pro", value: "první test" },
      ],
    },
    {
      name: "STANDARD",
      tagline: "5 % z prodaných",
      price: "5 %",
      priceNote: "z prodejní ceny",
      featured: false,
      rows: [
        { label: "Počet vozů", value: "neomezeno" },
        { label: "Závazek", value: "výpověď 30 dní" },
        { label: "Dashboard", value: "ano" },
        { label: "Dedikovaný manažer", value: "sdílený" },
        { label: "Podpora", value: "e-mail + telefon" },
        { label: "Vhodné pro", value: "stabilní spolupráce" },
      ],
    },
    {
      name: "ENTERPRISE",
      tagline: "Individuální",
      price: "—",
      priceNote: "smluvní podmínky",
      featured: false,
      rows: [
        { label: "Počet vozů", value: "200+ / měsíc" },
        { label: "Závazek", value: "smluvní" },
        { label: "Dashboard", value: "ano + API" },
        { label: "Dedikovaný manažer", value: "osobní" },
        { label: "Podpora", value: "SLA 24/7" },
        { label: "Vhodné pro", value: "velké bazary, sítě" },
      ],
    },
  ];

  return (
    <Slide className="slide-pilot">
      <SlideHeader eyebrow="Zkušební balíček" />
      <h2 className="slide-headline">
        Začněte bez rizika. Výsledky uvidíte za 30 dní.
      </h2>
      <p className="slide-subhead">
        Tři úrovně spolupráce. Doporučujeme začít Pilotem.
      </p>

      <div className="pilot-grid">
        {tiers.map((t, i) => (
          <div key={i} className={`tier-card ${t.featured ? "featured" : ""}`}>
            {t.featured && <div className="tier-badge">Doporučujeme</div>}
            <div className="tier-name">{t.name}</div>
            <div className="tier-tagline">{t.tagline}</div>
            <div className="tier-price-block">
              <div className="tier-price mono">{t.price}</div>
              <div className="tier-price-note">{t.priceNote}</div>
            </div>
            <div className="tier-rows">
              {t.rows.map((r, j) => (
                <div key={j} className="tier-row">
                  <span className="tier-row-label">{r.label}</span>
                  <span className="tier-row-value">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="pilot-footer">
        <strong>Pilot spustíme do 48 hodin</strong> od podpisu zkušební dohody.
        Bez smlouvy na rok, bez měsíčních poplatků, exit kdykoliv.
      </p>
    </Slide>
  );
}

/* ========================================================================
 * SLIDE 10 — CTA + kontakt
 * ====================================================================== */

function SlideCTA({
  salesRepName,
  salesRepRole,
  salesRepEmail,
  salesRepPhone,
  bookingUrl,
  qrCodeUrl,
}: {
  salesRepName: string;
  salesRepRole: string;
  salesRepEmail: string;
  salesRepPhone: string;
  bookingUrl: string;
  qrCodeUrl?: string;
} & Partial<PitchDeckProps>) {
  const initials = salesRepName
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Slide className="slide-dark slide-cta">
      <div className="cta-left">
        <SlideHeader eyebrow="Další krok" inverted />
        <h2 className="slide-headline inverted">
          Naplánujme 30 minut. Spočítáme to s{" "}
          <span className="accent">vašimi čísly</span>.
        </h2>
        <p className="slide-subhead inverted">
          Žádná prezentace. Jen kalkulačka a vaše data.
        </p>
        <p className="cta-body">
          Zadáme vaše reálné údaje (obrat, průměrná cena, doba obratu) do ROI
          kalkulačky a uvidíte, co CarMakléř znamená pro váš konkrétní bazar.
        </p>

        <div className="cta-button-row">
          <div className="cta-button">Domluvit schůzku online</div>
          <div className="cta-url">{bookingUrl}</div>
        </div>
      </div>

      <div className="cta-right">
        <div className="contact-card">
          <div className="contact-avatar">{initials || "CM"}</div>
          <div className="contact-name">{salesRepName}</div>
          <div className="contact-role">{salesRepRole}</div>
          <div className="contact-company">CarMakléř, s.r.o.</div>

          <div className="contact-divider" />

          <div className="contact-row">
            <IconMail />
            <span>{salesRepEmail}</span>
          </div>
          <div className="contact-row">
            <IconPhone />
            <span>{salesRepPhone}</span>
          </div>

          <div className="qr-wrap">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Rezervace schůzky" className="qr-image" />
            ) : (
              <div className="qr-placeholder">
                <div className="qr-placeholder-label">QR kód — booking</div>
              </div>
            )}
            <div className="qr-caption">Skenujte pro rezervaci termínu</div>
          </div>
        </div>
      </div>

      <footer className="cta-footer">
        CarMakléř, s.r.o. · IČO 21957151 · DIČ CZ21957151 · Školská 660/3, 110
        00 Praha · carmakler.cz
      </footer>
    </Slide>
  );
}

/* ========================================================================
 * Shared primitives
 * ====================================================================== */

function Slide({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`slide ${className}`}>{children}</section>;
}

function SlideHeader({ eyebrow, inverted = false }: { eyebrow: string; inverted?: boolean }) {
  return (
    <header className={`slide-header ${inverted ? "inverted" : ""}`}>
      <span className="eyebrow-line" />
      <span className="eyebrow-text">{eyebrow}</span>
      <span className="eyebrow-brand">CarMakléř</span>
    </header>
  );
}

function DisclaimerBar({ children }: { children: ReactNode }) {
  return <div className="disclaimer-bar">{children}</div>;
}

/* ========================================================================
 * Inline SVG icons (Lucide-style, no runtime dep)
 * ====================================================================== */

function BaseIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="24"
      height="24"
    >
      {children}
    </svg>
  );
}

function IconTrendingDown() {
  return (
    <BaseIcon>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </BaseIcon>
  );
}

function IconChevronDown() {
  return (
    <BaseIcon>
      <polyline points="6 9 12 15 18 9" />
    </BaseIcon>
  );
}

function IconMousePointer() {
  return (
    <BaseIcon>
      <path d="m9 9 5 12 1.8-5.2L21 14Z" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="m5.1 8-2.9-.8" />
      <path d="M14 4.1 12 6" />
      <path d="m6 12-1.9 2" />
    </BaseIcon>
  );
}

function IconUserMinus() {
  return (
    <BaseIcon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </BaseIcon>
  );
}

function IconHandshake() {
  return (
    <BaseIcon>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </BaseIcon>
  );
}

function IconRefreshCw() {
  return (
    <BaseIcon>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </BaseIcon>
  );
}

function IconLayoutDashboard() {
  return (
    <BaseIcon>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </BaseIcon>
  );
}

function IconArrowDown({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </BaseIcon>
  );
}

function IconClock() {
  return (
    <BaseIcon>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </BaseIcon>
  );
}

function IconMail() {
  return (
    <BaseIcon>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </BaseIcon>
  );
}

function IconPhone() {
  return (
    <BaseIcon>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </BaseIcon>
  );
}

/* ========================================================================
 * Ekosystém SVG diagram (Slide 6)
 * ====================================================================== */

function EcosystemDiagram() {
  return (
    <svg viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg" className="ecosystem-svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <g stroke="#5C7194" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" opacity="0.6">
        <path d="M 130 110 Q 260 140 260 200" />
        <path d="M 390 110 Q 260 140 260 200" />
        <path d="M 260 260 L 130 330" />
        <path d="M 260 260 L 390 330" />
        <path d="M 130 110 Q 70 220 130 330" />
      </g>

      <EcoNode cx={130} cy={90} label="Investor" color="#6366F1" />
      <EcoNode cx={390} cy={90} label="Autobazar / Autíčkář" color="#F97316" small />
      <EcoNode cx={260} cy={230} label="Makléř" color="#F97316" badge="5 %" />
      <EcoNode cx={130} cy={350} label="Kupec" color="#94A3BE" />
      <EcoNode cx={390} cy={350} label="Shop" color="#10B981" />
    </svg>
  );
}

function EcoNode({
  cx,
  cy,
  label,
  color,
  badge,
  small = false,
}: {
  cx: number;
  cy: number;
  label: string;
  color: string;
  badge?: string;
  small?: boolean;
}) {
  const r = small ? 44 : 50;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={color} strokeWidth="3" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontFamily="Outfit, sans-serif" fontWeight="600" fontSize="13">
        {label}
      </text>
      {badge && (
        <g>
          <rect x={cx + 28} y={cy - 48} width="34" height="20" rx="10" fill="white" />
          <text x={cx + 45} y={cy - 34} textAnchor="middle" fill={color} fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="11">
            {badge}
          </text>
        </g>
      )}
    </g>
  );
}
