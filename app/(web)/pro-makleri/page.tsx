import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { pageCanonical } from "@/lib/canonical";
import { IncomeCalculator } from "@/components/web/pro-makleri/IncomeCalculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pro makléře — kariéra makléře | CarMakléř",
  description:
    "Provize 5 % z každého prodeje, minimum 25 000 Kč. Svobodné rozvržení času, síť 142 aktivních makléřů, právní a technická podpora. Průměrný makléř prodává 2–4 vozy měsíčně.",
  alternates: pageCanonical("/pro-makleri"),
};

const onboardingPhases = [
  {
    label: "Týden 1 — Screening (dny 1–7)",
    desc: "Vyplníte přihlášku. Obdržíte dotazník o zkušenostech a síti kontaktů. Video-call 30 minut s náborovým týmem. Rozhodnutí o přijetí během 5 pracovních dní.",
  },
  {
    label: "Týden 2 — Certifikace (dny 8–14)",
    desc: "Dvoudenní intenzivní trénink v centrále CarMakléř (Praha) nebo online (Zoom). Obsah: platforma, procesy, smlouvy, cenotvorba, compliance (AML, GDPR), simulace prodeje. Zakončeno testem — úspěšnost 80 %+ pro získání certifikátu.",
  },
  {
    label: "Týden 3–8 — Pilot pod mentorem (dny 15–60)",
    desc: "Přidělený senior makléř jako mentor. První 2–3 obchody s jeho asistencí (video-call při jednání s klientem, review smluv, společné plánování). Provize se ještě nedělí — dostáváte 100 %.",
  },
  {
    label: "Týden 9+ — Full access",
    desc: "Vlastní dashboard, vlastní klienti, plný přístup k inventáři sítě. Měsíční check-in s regionálním ředitelem. Kvartální review v centrále.",
  },
];

const regions = [
  { name: "Praha + Střední Čechy", count: 38 },
  { name: "Brno + Jihomoravský", count: 24 },
  { name: "Ostrava + Moravskoslezský", count: 18 },
  { name: "Plzeň + Plzeňský", count: 12 },
  { name: "České Budějovice + Jihočeský", count: 9 },
  { name: "Hradec Králové + Pardubice", count: 14 },
  { name: "Ústí + Liberec", count: 11 },
  { name: "Olomouc + Zlín + Vysočina", count: 16 },
];

const leadSteps = [
  "Klient zadá poptávku v aplikaci (typ vozu, rozpočet, region).",
  "Algoritmus vybere 3 makléře v regionu podle specializace a vytížení.",
  "Makléři mají 30 minut na reakci. První, kdo přijme, má lead.",
  "Po přijetí má makléř 48 hodin na první kontakt s klientem.",
];

const benefits = [
  {
    emoji: "🖥",
    title: "CRM a dashboard",
    desc: "Vlastní administrace s přehledem klientů, rezervací, rozjednaných obchodů, provizí. Export dat kdykoli. Mobilní aplikace (PWA) funguje offline — v terénu bez signálu.",
  },
  {
    emoji: "📥",
    title: "Flow leadů",
    desc: "Platforma vám denně přiváže 2–5 kvalifikovaných poptávek (podle regionu a kapacity). Mimo to si vedete vlastní síť z osobních kontaktů.",
  },
  {
    emoji: "⚖️",
    title: "Právní podpora",
    desc: "Všechny smlouvy (kupní, rezervační, o zprostředkování) jsou šablony schválené advokátní kanceláří. V případě sporu s klientem řeší právní tým centrály, ne vy osobně.",
  },
  {
    emoji: "🤖",
    title: "AI asistent makléře",
    desc: 'Ve vaší aplikaci je Claude-based asistent. Napište \u201EZkontroluj mi tuhle inzerci Octavie 2019 za 285\u00a0000\u201C \u2014 dostanete tržní odhad, rizika a návrhy argumentů. Napište \u201ENapiš popis na tenhle vůz\u201C \u2014 dostanete marketingový text.',
  },
  {
    emoji: "🎓",
    title: "Školení a růst",
    desc: "Kvartální workshop (obchodní dovednosti, tržní trendy, novinky platformy). Roční konference s celou sítí. Mentoring program pro top 10 % makléřů v síti.",
  },
  {
    emoji: "📣",
    title: "Marketing",
    desc: "Centrální PPC, SEO, sociální sítě. Váš osobní profil na carmakler.cz s fotkou, specializací, recenzemi. Co-marketingové balíčky (sdílený budget na lokální PPC).",
  },
];

const testimonials = [
  {
    quote:
      "Přišla jsem z realit. Makléřský model mi sedí — provize za výsledek, ne za odsezené hodiny. Rozdíl je v tom, že v autech je cyklus rychlejší. Reality trvají 3–6 měsíců, tady mám vůz prodaný za 3 týdny. Víc transakcí, víc provize.",
    name: "Petra Malá, Praha (modelová)",
    meta: "Specializace: premium, dovoz DE · 14 prodejů za Q1 2026 · rating 4,9",
  },
  {
    quote:
      "Prodávám auta 18 let — nejdřív ve vlastním bazaru, teď jako makléř. Rozdíl je v tom, že nemám na krku skladové náklady, neplatím provize za inzerci. Dělám jen to, co umím — mluvím s lidmi.",
    name: "Jan Dvořák, Kolín (modelový)",
    meta: "Specializace: české značky, flotily · 22 prodejů za Q1 2026 · rating 4,8",
  },
  {
    quote:
      "Přišel jsem z prodeje pojištění. Měl jsem síť 800 klientů, ale pojišťovací provize jsou dnes srazené. Auta jsem neprodával, ale CarMakléř mě za 2 měsíce vyškolil. Za první rok jsem udělal 1,2\u00a0mil. hrubého.",
    name: "Lukáš Novák, Pardubice (modelový)",
    meta: "Specializace: ojetiny 150–400\u00a0k, rodiny · 19 prodejů za Q1 2026 · rating 4,7",
  },
];

const faqs = [
  {
    q: "Musím být exkluzivně pro CarMakléř, nebo mohu prodávat i pro jiné?",
    a: "Smlouva je exkluzivní pro oblast automobilů. Nesmíte současně zprostředkovávat prodej vozů pro konkurenční síť ani provozovat vlastní autobazar. Prodej nemovitostí, pojištění nebo jiných produktů vám nezakazujeme.",
  },
  {
    q: "Kdy a jak dostávám provizi?",
    a: "Provize se fakturuje CarMakléři po registraci vozu na nového majitele (obvykle 3–5 dní po podpisu kupní smlouvy). Splatnost 14 dní od vystavení faktury. Platí se bankovním převodem.",
  },
  {
    q: "Co když lead od platformy skončí bez prodeje?",
    a: "Žádná provize není — kompenzace za neuskutečněný obchod neexistuje. Ale: platforma monitoruje matching kvalitu. Pokud vám přiděluje nekvalifikované leady (3+ po sobě bez výsledku), eskaluje se to k regionálnímu řediteli.",
  },
  {
    q: "Jaká je smlouva a jak dlouho trvá?",
    a: "Rámcová smlouva na 12 měsíců s automatickou prolongací. Výpověď 60 dní bez udání důvodu, 30 dní v případě porušení (z obou stran). Exkluzivita trvá po dobu smlouvy + 3 měsíce po jejím ukončení (konkurenční doložka pro klienty).",
  },
  {
    q: "Musím být plátce DPH?",
    a: "Ne. Jako OSVČ můžete být plátce i neplátce. Při provizích nad 2\u00a0mil.\u00a0Kč / rok je povinná registrace. Daňové poradenství dostanete v rámci onboardingu.",
  },
  {
    q: "Exit — co se stane s klienty, když odcházím?",
    a: "Klienti, které jste přivedli, zůstávají v CRM platformy. Neberete je s sebou — na to je konkurenční doložka. Platforma vás ale nespamuje z vaší staré databáze — kontakty jsou zmraženy pro další 24 měsíců, pokud vás klient sám neosloví.",
  },
];

export default function ProMakleriPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Pro makléře" },
        ]}
      />

      {/* ── §4.1 Hero ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-4">
          KARIÉRA MAKLÉŘE
        </p>
        <h1 className="font-[Fraunces] text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl">
          Staňte se makléřem CarMakléř.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
          Provize 5\u00a0% z každého prodeje, minimum 25\u00a0000\u00a0Kč. Svobodné rozvržení
          času, síť 142 aktivních makléřů, právní a technická podpora z centrály. Průměrný
          makléř prodává 2–4 vozy měsíčně.
        </p>

        {/* Trust bullets */}
        <ul className="flex flex-col sm:flex-row gap-4 mb-10">
          <li className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-orange-500 text-lg shrink-0 mt-0.5">🪙</span>
            <span>
              Průměrný roční příjem zkušeného makléře (3+ vozy měsíčně):{" "}
              <strong className="text-gray-800">660\u00a0000 – 1\u00a0200\u00a0000\u00a0Kč</strong>
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-orange-500 text-lg shrink-0 mt-0.5">📅</span>
            <span>
              Bez pevné pracovní doby. Bez manažera nad vámi. Bez fixního platu, ale bez stropu.
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-orange-500 text-lg shrink-0 mt-0.5">🎓</span>
            <span>
              Dvoudenní certifikace + 60denní pilot s mentorem. Nábor průběžný po celé ČR.
            </span>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/registrace?role=broker"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all no-underline"
          >
            Podat přihlášku
          </Link>
          <Link
            href="#kalkulacka"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-[15px] bg-white text-gray-800 shadow-[inset_0_0_0_2px_var(--gray-200)] hover:bg-gray-50 hover:shadow-[inset_0_0_0_2px_var(--gray-300)] transition-all no-underline"
          >
            Kalkulačka ročního příjmu
          </Link>
        </div>
      </section>

      {/* ── §4.2 Profil úspěšného makléře ──────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Profil úspěšného makléře
          </h2>
          <p className="text-gray-700 max-w-2xl mb-10 leading-relaxed">
            <strong>Nejste jen prodejce.</strong> Makléř CarMakléř je kombinace obchodníka,
            důvěryhodného prostředníka a technického konzultanta. Klient vám svěří rozhodnutí
            o nákupu, které dělá jednou za 5–10 let. Odpovědnost je vaše — ale provize také.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Co hledáme */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                Co hledáme
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                  Zkušenost z prodeje (auta, reality, finance, pojišťovnictví, B2B)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                  Vlastní síť kontaktů alespoň 200 lidí (rodina, známí, předchozí klienti)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                  Znalost automobilového trhu (značky, segmenty, cenotvorba) nebo rychlost se
                  ji naučit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                  Svoje auto a řidičský průkaz
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                  Ochota pracovat jako OSVČ (plátce nebo neplátce DPH)
                </li>
              </ul>
            </div>

            {/* Co NEnabízíme */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-red-500 text-lg">✕</span>
                Co NEnabízíme
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold mt-0.5 shrink-0">—</span>
                  Fixní plat. Pokud potřebujete jistotu výplaty 1. každého měsíce, tato role
                  není pro vás.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold mt-0.5 shrink-0">—</span>
                  Kancelář a kolegy. Jste v terénu, ne v open space.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold mt-0.5 shrink-0">—</span>
                  Volání telefonem náhodným lidem (cold calling). Vaši klienti jsou z vaší
                  sítě nebo vám je přivede platforma.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── §4.3 Kalkulačka ročního příjmu ─────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kalkulačka ročního příjmu
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Zadejte svá čísla. Výstup je modelový propočet — skutečný příjem závisí na vaší
            síti, regionu a tržních podmínkách.
          </p>
          <IncomeCalculator />
        </div>
      </section>

      {/* ── §4.4 Onboarding proces ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Od přihlášky k prvnímu prodeji za 45 dní
          </h2>

          <div className="space-y-0">
            {onboardingPhases.map((phase, i) => (
              <div key={i} className="flex gap-6 relative">
                {/* Left number */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  {i < onboardingPhases.length - 1 && (
                    <div className="w-0.5 bg-orange-200 flex-1 my-1 min-h-[2rem]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 pt-1 flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{phase.label}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §4.5 Regionální rozdělení ───────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            142 makléřů po celé ČR
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Pilotní fáze 2026. Hledáme makléře ve všech regionech — zejména v méně pokrytých
            oblastech.
          </p>

          {/* Regiony grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {regions.map((region) => (
              <div
                key={region.name}
                className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center"
              >
                <p className="text-2xl font-bold text-orange-500 mb-1">{region.count}</p>
                <p className="text-xs text-gray-600 leading-tight">{region.name}</p>
              </div>
            ))}
          </div>

          {/* Jak přidělujeme leady */}
          <h3 className="font-[Fraunces] text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Jak přidělujeme leady
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {leadSteps.map((step, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center mb-3 shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §4.6 Co dostanete od platformy ─────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Nejste sami
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="text-2xl mb-3">{benefit.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §4.7 Testimonials ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Disclaimer banner — povinný, nahoře sekce */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-6 py-4 mb-10">
            <p className="text-sm font-bold text-yellow-800">
              Modelové testimonialy. Po launchu nahradíme skutečnými citacemi makléřů z pilotní
              skupiny Q1 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col"
              >
                <p className="text-gray-700 italic text-sm leading-relaxed mb-4 flex-1">
                  \u201E{t.quote}\u201C
                </p>
                <footer>
                  <cite className="not-italic text-xs font-bold text-gray-900 block mb-1">
                    — {t.name}
                  </cite>
                  <span className="text-xs text-gray-500">{t.meta}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── §4.8 FAQ ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Nejčastější otázky makléřů
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

      {/* ── §4.9 CTA band ───────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-white mb-4">
            Přihláška — 10 minut
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Vyplníte základní údaje, uložíte CV, odešlete. Ozveme se do 5 pracovních dní.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registrace?role=broker"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-8 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all no-underline"
            >
              Podat přihlášku
            </Link>
            <Link
              href="/kontakt?typ=broker-call"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-8 text-[15px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all no-underline"
            >
              Domluvit neformální call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
