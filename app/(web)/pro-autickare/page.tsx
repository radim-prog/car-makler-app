import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { EcosystemCycle } from "@/components/illustrations/EcosystemCycle";
import { RoiCalculator } from "@/components/web/pro-autickare/RoiCalculator";
import { WaitlistForm } from "@/components/web/pro-autickare/WaitlistForm";
import { pageCanonical } from "@/lib/canonical";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pro autíčkáře — kapitál + prodejní kanál | CarMakléř",
  description:
    "Investor financuje nákup, makléři prodávají. Dělení zisku 40/40/20. Marketplace v invite-only beta, registrace k ranému přístupu.",
  alternates: pageCanonical("/pro-autickare"),
};

const verificationSteps = [
  {
    n: 1,
    title: "Registrace a KYC (den 1–2)",
    desc: "Vyplníte formulář, nahrajete živnostenský list, 2 poslední daňová přiznání, výpisy z firemního účtu za 12 měsíců. KYC proběhne přes Onfido + manuální kontrola backoffice.",
  },
  {
    n: 2,
    title: "Reference (den 3–5)",
    desc: "Uvedete 2 reference: autobazar, dealer, servis, leasingovka, nebo předchozí investor. Zavoláme je a ověříme vaši historii obchodů.",
  },
  {
    n: 3,
    title: "Pohovor (den 6–10)",
    desc: "45minutový video-call s account managerem. Probereme vaši specializaci (značky, segmenty, regiony), průměrný objem, zdroje vozů, prodejní kanály. Není to zkouška, je to mapování.",
  },
  {
    n: 4,
    title: "Pilotní deal (den 11–60)",
    desc: "První příležitost na Marketplace s limitem kapitálu max. 500 000 Kč. Investor i autíčkář procházejí full procesem v kontrolovaném rozsahu. Po úspěšném ukončení (prodej + vyúčtování) se otevírá plný přístup.",
  },
  {
    n: 5,
    title: "Full access",
    desc: "Bez limitu kapitálu. Prioritní matching. Vlastní dashboard s historií dealů, rating od investorů, viditelnost v síti makléřů. Po 5 úspěšných dealech získáváte status \"Verified Dealer\" — zviditelnění v nabídkách a lepší podmínky financování.",
  },
];

const faqs = [
  {
    q: "Co se stane, když se vozy neprodají do 90 dní?",
    a: "Standardní smlouva má 90denní cyklus. Po jeho uplynutí se neprodané vozy nabízejí Shopu za odkup na díly (typicky 15–25 % nákupní ceny), nebo se cyklus prodlužuje o 30 dní po dohodě s investorem. Investor má právo odmítnout prodloužení a požadovat odkup za dohodnutou fallback cenu.",
  },
  {
    q: "Co když investor odstoupí uprostřed dealu?",
    a: "Smlouva §1115 OZ je oboustranně závazná. Investor může odstoupit jen při prokazatelném porušení podmínek ze strany autíčkáře (např. falešné údaje o vozech, nečerpání kapitálu na účel). Standardní procedura — mateřská platforma nastoupí jako zajištěný věřitel a dokončí prodej, aby investor dostal zpět kapitál.",
  },
  {
    q: "Jaké je pojištění během doby, kdy jsou vozy v přípravě?",
    a: "Každý vůz v síti je pojištěn CarMakléřem přes Allianz (povinné ručení + havárie + krádež), náklady jsou součástí 20 % platformové marže. Pojištění platí od okamžiku podpisu smlouvy o spolumajitelství do registrace na nového majitele.",
  },
  {
    q: "DPH — jak se to účtuje?",
    a: "Autíčkář je plátce DPH. Nákup i prodej vozů probíhá standardně — jste vlastníkem vozu (spolumajitelem s investorem). DPH z prodejní ceny odvádíte vy, faktura od CarMakléře za 20 % marži je přijatá faktura, kterou si odečítáte. Zisk po DPH se dělí 40/40/20.",
  },
  {
    q: "Jak je to s přepravou vozů mezi regiony?",
    a: "Platforma má smlouvu s dopravcem (Trans.eu partnerská síť). Přeprava jednoho vozu v rámci ČR stojí 2 500–4 500 Kč podle vzdálenosti, je účtovaná jako operativní náklad (před rozdělením zisku). Pro velké balíky (5+ vozů najednou) platí zvýhodněný tarif.",
  },
  {
    q: "Exit — co když chci ze sítě odejít?",
    a: "Neexistuje smluvní závazek vás držet. Ukončíte po dokončení posledního dealu, váš profil se archivuje (pro audit a ochranu investora 10 let), waitlist se zavírá. Pokud jste ve stavu \"Verified Dealer\" po 5+ dealech, získáte doporučení pro jinou platformu / banku, pokud o něj požádáte.",
  },
];

const pavlovTimeline = [
  {
    den: "Den 1",
    title: "Příležitost",
    desc: "Pavel se doslechl, že leasingová firma ALD odprodává 10 kusů Škoda Octavia 2020–2021 z firemního fleetu. Balíková cena 2 050 000 Kč (205 000 Kč / ks). Tržní hodnota po servisu a přípravě odhadem 280 000 Kč / ks. Marže potenciál cca 750 000 Kč, náklady na přípravu odhad 220 000 Kč. Pavel má na účtu 180 000 Kč. Potřebuje 1,9 mil. Kč.",
  },
  {
    den: "Den 2",
    title: "Založení příležitosti na Marketplace",
    desc: `Pavel vyplní formulář: 10× Škoda Octavia, VIN listy, fotky ze showroomu leasingové firmy, nákupní cena, odhadovaný prodej, časový plán 90 dní, ROI projekce. Platforma ověří VIN v registrech (NHTSA + vindecoder.eu) a založí nabídku jako \u201EPending verification\u201C.`,
  },
  {
    den: "Den 3–4",
    title: "Ověření a publikace",
    desc: 'Backoffice CarMakléře ověří Pavlovu historii (předchozí 4 dealy, reference od 2 makléřů, KYC z daňového přiznání 2024). Nabídka publikována na Marketplace jako \u201EVerified, 2 050 000 Kč, ROI proj. 35\u201345 % p. a.\u201C.',
  },
  {
    den: "Den 5–8",
    title: "Investor se přihlásí",
    desc: 'Tomáš z Prahy, investor v síti od prosince 2025, nabídku najde přes filtr \u201Edo 3 mil. Kč, Škoda, 60–90 dní\u201C. Proběhne video-call (Pavel + Tomáš + account manager CarMakléř, 30 minut). Tomáš odsouhlasí financování 2 100 000 Kč (včetně rezervy na opravy). Smlouva podepsaná elektronicky (§1115 OZ spolumajitelský model).',
  },
  {
    den: "Den 9",
    title: "Peníze na účtě",
    desc: "2 100 000 Kč na Pavlově firemním účtu. Pavel vyjede na Kladno, uhradí ALD, převezme klíče a TP 10 vozů. Odveze je do servisu.",
  },
  {
    den: "Den 10–35",
    title: "Příprava",
    desc: 'STK, servis, detail, drobné opravy (průměr 22 000 Kč / vůz). Fotografie v profesionálním studiu (Cloudinary upload přes PWA). Vozy označené VIN hláškou v CarMakléř dashboardu jako \u201EReady to sell\u201C.',
  },
  {
    den: "Den 36",
    title: "Předání makléřům",
    desc: "4 vozy jdou makléři Petr Malá (Praha), 3 vozy makléři Jan Dvořák (Kolín + Kutná Hora), 3 vozy makléři Lukáš Novák (Pardubice). Makléři vozy přebírají fyzicky (smlouva o prodeji v komisi, čeká na podpis kupní smlouvy).",
  },
  {
    den: "Den 40–80",
    title: "Prodej",
    desc: "Makléři prodávají průběžně. Průměrná cena 340 000 Kč / vůz (nad původní odhad díky silné sezóně). 8 z 10 vozů prodáno do 75. dne. 2 vozy zůstaly — u jednoho se během přípravy zjistila skrytá závada převodovky, druhý nebyl atraktivní barvou (vínová).",
  },
  {
    den: "Den 85",
    title: "Shop odkupuje zbylá dvě auta",
    desc: "CarMakléř Shop nabídne odkup za 75 000 Kč (za oba vozy dohromady, na díly). Pavel přijímá. Cash-out za 90 dní od startu.",
  },
  {
    den: "Den 90",
    title: "Vyúčtování",
    desc: "Hrubý prodej 8 vozů + odkup 2 vozů Shopem. Viz tabulka níže.",
  },
];

export default function ProAutickare() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Pro autíčkáře" },
        ]}
      />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-b from-gray-950 to-gray-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-4">
            Pro autíčkáře
          </p>
          <h1 className="font-fraunces text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Najděte investora. Prodejte přes makléře. Nechte si víc.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
            CarMakléř propojuje autíčkáře s investory, kteří financují nákup vozů, a s makléři,
            kteří je prodávají. Místo Sauto, hotovosti a telefonátů máte platformu, která řeší
            kapitál i prodejní kanál.
          </p>

          {/* Trust bullets */}
          <ul className="space-y-3 mb-10 max-w-xl">
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-lg mt-0.5 shrink-0">💰</span>
              <span className="text-gray-200 text-sm">
                <strong className="text-white">Kapitál od 200 000 do 3 000 000 Kč</strong> na
                jeden deal. Splatnost po prodeji vozu.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-lg mt-0.5 shrink-0">👥</span>
              <span className="text-gray-200 text-sm">
                <strong className="text-white">Síť 142 makléřů</strong> prodává vaše auta za vás.
                Průměrná doba prodeje 24 dní.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-lg mt-0.5 shrink-0">⚖️</span>
              <span className="text-gray-200 text-sm">
                <strong className="text-white">Dělení zisku 40/40/20</strong> — vy, investor,
                platforma. Transparentní smlouva, auditní stopa.
              </span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#waitlist"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-center no-underline"
            >
              Registrovat se do Marketplace (waitlist)
            </a>
            <a
              href="#pavel"
              className="inline-block border border-white/30 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-center no-underline"
            >
              Prohlédnout si příběh Pavla
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. EKOSYSTÉM ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dva produkty, jeden ekosystém
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl leading-relaxed">
            Schematický diagram ukazuje tok kapitálu a vozů mezi investorem, autíčkářem a makléři.
            Investor vloží kapitál na Marketplace, autíčkář za něj nakoupí vozy, makléři je prodají
            koncovým zákazníkům, zisk se rozdělí v poměru 40 % autíčkář, 40 % investor, 20 %
            CarMakléř (z čehož 5 % jde makléři jako provize).
          </p>

          <div className="flex justify-center mb-12">
            <EcosystemCycle />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 text-lg">📈</span>
                <h3 className="font-bold text-gray-900">Marketplace</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dá vám kapitál. Založíte příležitost (nákup 5–15 vozů z konkrétní aukce,
                leasingové firmy nebo dovozu), investor ji zafinancuje. Peníze dostanete přímo na
                firemní účet během 72 hodin od podpisu.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 text-lg">🤝</span>
                <h3 className="font-bold text-gray-900">Makléřská síť</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Prodá vaše vozy. Autíčkář není sám na inzerci na Sauto. Vaše vozy předáte 2–3
                makléřům ve vybraném regionu, oni prodávají svým klientům. Vy řešíte nákup, opravy
                a logistiku, makléři řeší prodej.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 text-lg">🚀</span>
                <h3 className="font-bold text-gray-900">Po prodeji</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kapitál se vrací investorovi, zisk se dělí 40/40/20. Z 20 % CarMakléř odvádí 5 %
                makléři jako provizi, 15 % zůstává platformě za operaci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MODELOVÝ PŘÍBĚH PAVLA ── */}
      <section id="pavel" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Disclaimer banner */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-3 mb-10 flex items-start gap-3">
            <span className="text-yellow-600 text-lg leading-none mt-0.5">⚠</span>
            <p className="text-sm text-yellow-800 font-medium">
              Modelový scénář. Po launchu nahradíme skutečnými case studies se souhlasem klientů.
            </p>
          </div>

          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            10 Octavií, 90 dní, 534 000 Kč hrubého zisku
          </h2>

          {/* Timeline */}
          <div className="space-y-0 mb-12">
            {pavlovTimeline.map((item, i) => (
              <div key={i} className="flex gap-6 relative">
                {/* Left column */}
                <div className="w-24 shrink-0 pt-4 text-right">
                  <span className="text-xs font-bold text-orange-500 whitespace-nowrap">
                    {item.den}
                  </span>
                </div>
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-5 shrink-0" />
                  {i < pavlovTimeline.length - 1 && (
                    <div className="w-0.5 bg-orange-200 flex-1 my-1" />
                  )}
                </div>
                {/* Right column */}
                <div className="pb-8 pt-3 flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Vyúčtování tabulka */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gray-900 text-white px-6 py-4">
              <h3 className="font-bold text-lg">Den 90 — Vyúčtování</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Hrubý prodej vozů</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">2 720 000 Kč (8 vozů)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Odkup Shop</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">75 000 Kč (2 vozy)</td>
                </tr>
                <tr className="border-b border-gray-200 bg-orange-50">
                  <td className="px-6 py-3 font-bold text-gray-900">Celkem výnos</td>
                  <td className="px-6 py-3 text-right font-bold text-orange-600">2 795 000 Kč</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Vrácený kapitál investorovi</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">2 100 000 Kč</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Provize makléřům (5 %)</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">136 000 Kč</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Platforma (20 % ze zisku po splacení kapitálu)</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">106 800 Kč</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Náklady na opravy</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">220 000 Kč</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-3 font-bold text-gray-900">Zbývající zisk k rozdělení</td>
                  <td className="px-6 py-3 text-right font-bold text-gray-900">534 000 Kč</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Finální rozdělení */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-orange-500 text-white rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-80">Pavel (40 % zisku + náklady)</p>
              <p className="text-2xl font-extrabold">293 600 Kč</p>
              <p className="text-sm opacity-80 mt-1">za 90 dní práce</p>
            </div>
            <div className="bg-gray-800 text-white rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-80">Tomáš — investor (40 %)</p>
              <p className="text-2xl font-extrabold">213 600 Kč</p>
              <p className="text-sm opacity-80 mt-1">annualized ROI cca 40,7 %</p>
            </div>
            <div className="bg-gray-100 text-gray-900 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">CarMakléř (20 % + provize)</p>
              <p className="text-2xl font-extrabold">242 800 Kč</p>
              <p className="text-sm text-gray-500 mt-1">z toho 136 000 Kč makléřům</p>
            </div>
          </div>

          {/* Quote box */}
          <blockquote className="border-l-4 border-orange-500 pl-5 py-2 mb-6 bg-white rounded-r-xl">
            <p className="text-gray-700 italic text-sm leading-relaxed">
              „Měl jsem auta, věděl jsem kde nakoupit, ale chyběl mi kapitál a čas na inzerci.
              Marketplace mi dal oboje — do 9 dní od registrace jsem měl 2,1 milionu na účtu
              a tři makléře, kteří prodávali za mě."
            </p>
            <footer className="mt-2 text-xs text-gray-400">— Modelová citace, autíčkář z Kolína</footer>
          </blockquote>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3">
            <p className="text-xs text-yellow-800 leading-relaxed">
              <strong>Disclaimer:</strong> Modelový scénář vytvořený na základě průměrných dat z
              pilotní skupiny Q1 2026. Skutečné výnosy závisí na tržních podmínkách, kvalitě nákupu
              a rychlosti prodeje. Není to slib ani projekce zisku — je to ilustrace, jak platforma
              funguje. První verifikované case studies zveřejníme v H2 2026.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. ROI KALKULAČKA ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Co kdybyste jich měli 100 ročně?
          </h2>
          <p className="text-gray-500 mb-8 max-w-2xl">
            Modelový propočet na základě Pavlova případu škálovaný na 12 měsíců.
          </p>
          <RoiCalculator />
        </div>
      </section>

      {/* ── 5. OVĚŘOVACÍ PROTOKOL ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Jak se stanete partnerským autíčkářem
          </h2>
          <div className="space-y-8">
            {verificationSteps.map((step) => (
              <div key={step.n} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WAITLIST ── */}
      <section id="waitlist" className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
            Marketplace je v invite-only beta. Zaregistrujte se k ranému přístupu.
          </h2>
          <p className="text-gray-500 mb-8 text-center leading-relaxed">
            Otevíráme po vlnách — každé 2 týdny přijímáme 20 nových autíčkářů a 10 investorů.
            Pořadí podle data registrace a kompletnosti profilu. První vlna proběhla v březnu 2026.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-fraunces text-3xl font-bold text-gray-900 mb-8">
            Časté otázky
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex justify-between items-center cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 list-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 shrink-0 text-orange-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BAND ── */}
      <section className="py-16 md:py-24 bg-gray-950 text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-4xl mx-auto mb-5 text-center">🏆</div>
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold mb-4">
            Začneme pilotním dealem do 500 000 Kč
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Zaregistrujete se, ověříme vás, zafinancujeme první deal pod dohledem. Žádný závazek,
            žádná počáteční investice z vaší strany kromě vlastního času.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors no-underline"
            >
              Registrovat se na waitlist
            </a>
            <Link
              href="/marketplace-whitepaper.pdf"
              className="inline-block border border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors no-underline"
            >
              Stáhnout Marketplace whitepaper (PDF, 12 stran)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
