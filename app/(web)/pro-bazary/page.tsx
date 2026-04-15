import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { pageCanonical } from "@/lib/canonical";
import { RoiCalculator } from "@/components/web/pro-bazary/RoiCalculator";

export const metadata: Metadata = {
  title: "Pro autobazary — síť 142 makléřů | CarMakléř",
  description:
    "Propojte váš sklad s certifikovanými makléři po ČR. Modelová obrátka 2,8× ročně. Pilot 30 dní zdarma, bez závazků. Spočítejte si ROI.",
  alternates: pageCanonical("/pro-bazary"),
};

const howItWorksSteps = [
  {
    number: 1,
    label: "Napojení skladu (dny 1–3)",
    description:
      "Propojíme váš DMS nebo inzertní feed (XML, CSV, API) s naší platformou. Vaše vozy se automaticky objevují v dashboardu makléřů jako skrytá nabídka. Žádné dvojité zadávání, žádná ruční práce.",
  },
  {
    number: 2,
    label: "Matching na makléře (dny 4–10)",
    description:
      "Makléři procházejí váš sklad, vybírají vozy pro své klienty, rezervují konkrétní VIN. Za každou rezervaci ručí kapár 10 000 Kč, který se vrací při neuzavření obchodu nebo propadá při stornu z jejich strany.",
  },
  {
    number: 3,
    label: "Prodej a vyúčtování (dny 11–20)",
    description:
      "Makléř přiveze klienta k prohlídce, dojedná smlouvu, předá klíče. Platba přichází na váš účet. Provize 5 % (min. 25 000 Kč) se fakturuje CarMakléři po registraci vozu na nového majitele.",
  },
];

const pricingTiers = [
  {
    name: "Pilot",
    tagline: "30 dní zdarma",
    price: "0 Kč",
    priceSub: "0 % provize prvních 30 dní",
    features: [
      "Do 60 vozů ve skladu",
      "Plný přístup k síti makléřů",
      "Napojení DMS/XML feedu",
      "Měsíční reporting",
      "Bez smluvních závazků po skončení pilotu",
    ],
    cta: "Spustit pilot",
    ctaHref: "/kontakt?typ=pilot",
    highlighted: false,
  },
  {
    name: "Standard",
    tagline: "5 % z prodejní ceny",
    price: "5 %",
    priceSub: "z dohodnuté prodejní ceny (min. 25 000 Kč)",
    features: [
      "Neomezený počet vozů",
      "Plný přístup k síti 142+ makléřů",
      "Dedikovaný account manager",
      "Týdenní reporty, real-time dashboard",
      "Provize 5 %, minimum 25 000 Kč / vůz",
      "Smlouva 12 měsíců, výpověď 30 dní",
    ],
    cta: "Zaregistrovat bazar",
    ctaHref: "/kontakt?typ=standard",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "Individuální podmínky",
    price: "3–4 %",
    priceSub: "provize jednotlivě dojednaná",
    features: [
      "Pro bazary nad 200 vozů",
      "Custom SLA, prioritní matching",
      "Integrace s enterprise DMS (Softbase, CarIS, AutoCRM)",
      "Vlastní dedikovaný tým makléřů v regionu",
      "Co-marketing (sdílené PPC kampaně)",
    ],
    cta: "Domluvit schůzku s obchodním týmem",
    ctaHref: "/kontakt?typ=enterprise",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Komu patří data o našem skladu po napojení?",
    a: "Data jsou vaše, kdykoli je můžete exportovat ve formátu CSV nebo získat přes API. CarMakléř má přístup pouze k metadatům potřebným pro matching (VIN, cena, kilometry, stav). Fotky a popisy jsou v režimu read-only, CarMakléř je nekopíruje do vlastního indexu bez vašeho souhlasu.",
  },
  {
    q: "Jak vypadá smlouva a co když chceme vystoupit?",
    a: "Standardní smlouva je na 12 měsíců s výpovědní dobou 30 dní bez udání důvodu. Žádné penalizace, žádné zámky na data. Po vypovězení se váš feed z platformy odpojí do 24 hodin. Pilotní režim nemá smluvní závazky.",
  },
  {
    q: "Jak je to s DPH a fakturací provize?",
    a: "Provize 5 % se fakturuje jako služba CarMakléř s. r. o., plátce DPH. Faktura je vystavena po registraci vozu na nového majitele, splatnost 14 dní. Pro bazary plátce DPH si provizi standardně odečítáte.",
  },
  {
    q: "Jaké dostaneme reporty a v jaké frekvenci?",
    a: "Real-time dashboard (aktivní rezervace, proběhlé prodeje, matching aktivita) v administraci 24/7. Týdenní souhrnný e-mail každé pondělí. Měsíční PDF report s KPI. Kvartální 60minutové strategické review s account managerem.",
  },
  {
    q: "Jak si ohlídáme, že makléř nenabídne naše auto pod cenou?",
    a: "Cenu stanovujete vy. Makléř vidí minimální akceptovatelnou cenu a prodejní cenu. Slevy nad 3 % musíte schválit v administraci během 2 hodin, jinak se rezervace ruší. Logujeme každou cenovou změnu.",
  },
  {
    q: "Kdo vlastní klienta po prodeji — makléř, bazar, nebo platforma?",
    a: "Klient po prodeji přechází do vašeho CRM. CarMakléř nemá právo s ním dále komunikovat bez vašeho souhlasu. Makléř si udržuje vztah pro případný další obchod, ale kontakt nepředává konkurenčním bazarům.",
  },
  {
    q: "Co když makléř klienta přivede a klient pak koupí u nás mimo systém?",
    a: "Rezervace je evidovaná. Pokud klient v okruhu 90 dní od rezervace koupí jakýkoli vůz z vašeho bazaru, provize se účtuje podle standardního ceníku. Ochrana je oboustranná — makléř má jistotu, že o provizi nepřijde.",
  },
  {
    q: "Jak vypadá exit, když se nám to nelíbí?",
    a: "Vypovíte smlouvu mailem na smlouvy@carmakler.cz. 30denní výpovědní doba. Za tu dobu dokončíme rezervace, které jsou v běhu. Váš feed se odpojí, data z platformy se anonymizují do 60 dní. Žádné soudy, žádné pokuty, žádné výhrůžky.",
  },
];

export default function ProBazaryPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Pro autobazary" },
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-4">
          Pro autobazary
        </p>
        <h1
          className="font-[Fraunces] text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl"
        >
          Váš sklad točí pomalu. Naše síť ho točí rychleji.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
          CarMakléř propojí vaši nabídku s 142 certifikovanými makléři po celé ČR.
          Auta se prodávají z ruky, s doporučením, bez čekání na organické ležení na inzertních
          portálech. Průměrná obrátka klesá z 68 na 24 dní.
        </p>

        {/* Trust bullets */}
        <ul className="flex flex-col sm:flex-row gap-4 mb-10">
          <li className="flex items-start gap-3 text-sm text-gray-600">
            {/* Handshake */}
            <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>
              Smlouva na 12 měsíců s výpovědí 30 dní. Žádné zámky, žádné penalizace.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600">
            {/* ShieldCheck */}
            <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <span>
              Data vašeho skladu zůstávají u vás. GDPR compliance, auditní logy, export kdykoli.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600">
            {/* TrendingUp */}
            <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            <span>
              Modelová obrátka 2,8× ročně vs. 1,6× u samostatného bazaru.{" "}
              <span className="italic">
                (Modelový propočet z pilotní skupiny 2026. Skutečná čísla po prvním kvartálu provozu.)
              </span>
            </span>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="#roi-kalkulator"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all no-underline"
          >
            Spočítat ROI pro náš bazar
          </Link>
          <Link
            href="/kontakt?typ=demo"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-[15px] bg-white text-gray-800 shadow-[inset_0_0_0_2px_var(--gray-200)] hover:bg-gray-50 hover:shadow-[inset_0_0_0_2px_var(--gray-300)] transition-all no-underline"
          >
            Domluvit 30minutové demo
          </Link>
        </div>
      </section>

      {/* ── 2. Jak to funguje ───────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Od prvního kontaktu k prvnímu prodeji za 14 dní
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.number} className="flex flex-col">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg mb-4 shrink-0">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ROI kalkulačka ───────────────────────────────────────── */}
      <section id="roi-kalkulator" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Spočítejte si, co vám síť přinese
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Zadejte vaše aktuální čísla. Výstup je modelový propočet na základě pilotních dat
            z prvního kvartálu 2026, nikoliv záruka výkonu.
          </p>
          <RoiCalculator />
        </div>
      </section>

      {/* ── 4. Case study ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Disclaimer banner */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-6 py-4 mb-10">
            <p className="text-sm font-bold text-yellow-800">
              Modelový scénář. Po launchu jej nahradíme skutečnými case studies se souhlasem klientů.
            </p>
          </div>

          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Jak autobazar Horák v Brně zvýšil obrat z 78 na 184 prodaných vozů ročně
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <p className="font-bold text-gray-900 mb-1">Výchozí stav (Q4 2025)</p>
                <p>
                  Autobazar Horák provozuje areál na Slatině, 120 vozů ve skladu, tým 4 prodejců,
                  průměrná obrátka 72 dní. Inzerce rozložená mezi Sauto, TipCars a vlastní web.
                  Roční prodej 78 vozů, hrubá marže cca 7,8 mil. Kč.
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Krok 1 — Napojení (leden 2026, 3 dny)</p>
                <p>
                  XML feed ze stávajícího DMS propojený s CarMakléř platformou. 120 vozů
                  viditelných pro 142 makléřů. Žádná změna cenotvorby, Horák si drží vlastní marži.
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Krok 2 — První tři měsíce (únor–duben 2026)</p>
                <p>
                  Makléři přivedli 47 klientů. 34 prodaných vozů nad rámec běžného provozu.
                  Průměrná obrátka klesla na 28 dní.
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Krok 3 — Stabilizace (květen–prosinec 2026)</p>
                <p>
                  Denní příliv 2–3 rezervací od makléřů. Tým prodejců se přesunul z aktivního
                  prospektingu na servis makléřských klientů.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Roční výsledek</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Prodaných vozů</span>
                    <span className="font-bold text-gray-900">184 <span className="text-gray-400 font-normal">(vs. 78, +136 %)</span></span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Hrubý obrat</span>
                    <span className="font-bold text-gray-900">71,8 mil. Kč <span className="text-gray-400 font-normal">(+143 %)</span></span>
                  </li>
                  <li className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-600">Provize CarMakléři</span>
                    <span className="font-bold text-red-600">−3,59 mil. Kč</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Úspora na držení skladu</span>
                    <span className="font-bold text-green-700">+1,12 mil. Kč</span>
                  </li>
                  <li className="flex justify-between border-t border-gray-200 pt-3 text-base">
                    <span className="font-bold text-gray-900">Čistý přírůstek hrubé marže</span>
                    <span className="font-bold text-orange-600">+12,4 mil. Kč</span>
                  </li>
                </ul>
              </div>

              <blockquote className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl p-6">
                <p className="text-gray-700 italic text-sm leading-relaxed mb-3">
                  „Čekal jsem, že se do toho budu muset zapojit sám. Místo toho makléři pracují
                  za nás — my řešíme jen prohlídky a papíry. Síť není konkurence bazaru,
                  je to prodejní kanál navíc."
                </p>
                <cite className="text-xs text-gray-500 not-italic">— Karel Horák, Autobazar Horák, Brno</cite>
              </blockquote>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Jméno a firma jsou modelové. Čísla vycházejí z pilotní skupiny Q1 2026.
                Skutečné case studies zveřejníme po souhlasu klientů v druhé polovině 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Pricing ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Tři úrovně zapojení
          </h2>
          <p className="text-gray-500 mb-12">Začnete zdarma. Rozhodnete se podle výsledků.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  tier.highlighted
                    ? "border-orange-400 bg-orange-50 shadow-lg"
                    : "border-gray-200 bg-white"
                }`}
              >
                {tier.highlighted && (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 rounded-full px-3 py-1 mb-4 self-start">
                    Nejoblíbenější
                  </span>
                )}
                <p className="text-xl font-bold text-gray-900 mb-1">{tier.name}</p>
                <p className="text-sm text-gray-500 mb-4">{tier.tagline}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{tier.price}</p>
                <p className="text-xs text-gray-500 mb-6">{tier.priceSub}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className={`inline-flex items-center justify-center font-semibold rounded-full py-3 px-6 text-[15px] transition-all no-underline ${
                    tier.highlighted
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5"
                      : "bg-white text-gray-800 shadow-[inset_0_0_0_2px_var(--gray-200)] hover:bg-gray-50"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Nejčastější otázky majitelů bazarů
          </h2>
          <div className="max-w-3xl space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 text-sm list-none select-none">
                  {faq.q}
                  <span className="text-orange-500 font-bold text-lg ml-4 shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA band ─────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-white mb-4">
            Pilotní program 2026 — 30 dní bez závazku
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Napojte váš sklad, otestujte síť, rozhodněte se podle výsledků. Pilot je zdarma,
            neplatíte provizi, nemáte smluvní závazek.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href="/kontakt?typ=pilot"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-8 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all no-underline"
            >
              Spustit pilot
            </Link>
            <Link
              href="/kontakt?typ=demo"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-8 text-[15px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all no-underline"
            >
              Domluvit demo
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            Odpovíme do 1 pracovního dne. Kontakt z veřejného e-mailu ani bez auta necháváme bez reakce.
          </p>
        </div>
      </section>
    </>
  );
}
