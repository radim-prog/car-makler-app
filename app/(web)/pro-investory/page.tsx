import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import {
  ShieldCheckIcon as ShieldCheck,
  DocumentCheckIcon as FileCheck,
  ArrowTrendingUpIcon as TrendingUp,
  ScaleIcon as Scale,
  ExclamationTriangleIcon as AlertTriangle,
} from "@/components/web/pro-investory/Icons";
import { WaitlistForm } from "@/components/web/pro-investory/WaitlistForm";
import { pageCanonical } from "@/lib/canonical";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pro investory — podílnictví ve vozidlech | CarMakléř",
  description:
    "Spolumajitelský model §1115 OZ, zajištění VIN, modelový podíl na zisku 35–45 % p. a. Marketplace v přípravě, registrace k ranému přístupu.",
  alternates: pageCanonical("/pro-investory"),
};

const verificationSteps = [
  {
    step: 1,
    title: "KYC — ověření totožnosti",
    description:
      "Doklad totožnosti, daňový rezident, FATCA/CRS prohlášení. Proces přes Onfido, obvykle do 24 hodin.",
  },
  {
    step: 2,
    title: "Dotazník pro interní screening",
    description:
      "Prohlášení o zkušenostech, disponibilním kapitálu a toleranci ke ztrátě. Jde o interní screening platformy, nikoli licencovanou akreditaci. Investoři s likvidním majetkem pod 1 000 000 Kč dostávají limit max. 300 000 Kč na jeden deal.",
  },
  {
    step: 3,
    title: "Pohovor s portfolio managerem (45 min)",
    description:
      "Diskuze o horizontu, rizikovém profilu a preferencích (značky, regiony, objemy). Cílem je nabízet relevantní dealy.",
  },
  {
    step: 4,
    title: "První deal s limitem",
    description:
      "První 1–2 dealy s kapitálem max. 500 000 Kč — seznámení s procesem, reporty a vyúčtováním.",
  },
  {
    step: 5,
    title: "Plný přístup",
    description:
      "Bez kapitálového limitu. Prioritní matching na preferované dealy. Přístup do analytického dashboardu s anonymizovanými tržními daty.",
  },
];

const faqItems = [
  {
    question: "Jaký je regulatorní rámec platformy? Jste licencovaní ČNB?",
    answer:
      "Marketplace operuje na modelu spolumajitelství konkrétních movitých věcí podle §1115 občanského zákoníku — nikoli jako subjekt kolektivního investování ani jako platforma pro veřejnou nabídku cenných papírů. Nejsme subjektem regulace ČNB. Právní revize probíhá s advokátní kanceláří specializovanou na FinTech. Whitepaper s detailním právním rozborem obdržíte po registraci.",
  },
  {
    question: "Kdy Marketplace oficiálně spustí?",
    answer:
      "Plánované spuštění: Q3–Q4 2026, po dokončení legal review a prvních 30 verified dealers. Invite-only beta běží od Q1 2026. Registrovaní zájemci dostávají pozvánky ve vlnách po 10 každé 2 týdny.",
  },
  {
    question: "Jaká je minimální částka pro účast?",
    answer:
      "V pilotní fázi 200 000 Kč. Po otevření plného přístupu žádný minimální limit na jednotlivý deal. Doporučujeme diverzifikovat do 5–20 paralelních dealů.",
  },
  {
    question: "Jaká je likvidita? Lze z dealu vystoupit předčasně?",
    answer:
      "Během aktivního dealu je kapitál vázaný na konkrétní vozidlo nebo balíček. Předčasný výstup bude možný prodejem podílu jinému zájemci v síti (secondary market, spouští se Q4 2026). Nedoporučujeme kapitál, který budete potřebovat likvidně do 6 měsíců.",
  },
  {
    question: "Co se stane, když deal selže a vozidla se neprodají?",
    answer:
      "Každý deal má smluvně nastavenou záložní proceduru: (a) prodloužení cyklu o 30 dní, (b) odkup Shopem za 15–25 % nákupní ceny, (c) nucený prodej přes aukční portál. Historický default rate v pilotní skupině: 2,1 %, průměrná ztráta z defaultu 18 % kapitálu. Platforma nezaručuje návrat kapitálu.",
  },
  {
    question: "Jak se daní příjem z podílu na zisku?",
    answer:
      "Zisk z prodeje vozu ve spolumajitelství je pro fyzickou osobu standardní ostatní příjem (§10 ZDP). Pro právnické osoby jde o běžný zdanitelný příjem podléhající dani z příjmů právnických osob. Daňové poradenství nabízíme jako službu třetí strany (partner KPMG) — každý si svou situaci konzultuje individuálně.",
  },
];

export default function ProInvestoryPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Pro investory" },
        ]}
      />

      {/* ── 1. HERO ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-4">
            Pro investory
          </p>
          <h1
            className="font-['Fraunces'] text-4xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6 max-w-3xl"
          >
            Příležitosti pro podílnictví v automotive segmentu.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Marketplace CarMakléř propojuje kapitál s ověřenými autíčkáři a dealery.
            Spolumajitelský model podle §1115 občanského zákoníku, transparentní due
            diligence, podílnictví zajištěné reálným majetkem — konkrétními vozidly
            s VIN, fotkami a tržním odhadem.
          </p>

          {/* Hero disclaimer */}
          <div className="flex gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-10 max-w-2xl">
            <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
            <p className="text-amber-800 text-sm leading-relaxed">
              Marketplace je v přípravě. Registrace k ranému přístupu je otevřená,
              samotná platforma spustí po dokončení právní revize v H2 2026. Nejedná se
              o veřejnou nabídku investičních instrumentů ani o sběr kapitálu od
              neoznačených investorů.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#waitlist"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base text-center"
            >
              Registrovat se na waitlist
            </a>
            <a
              href="/marketplace-whitepaper.pdf"
              className="inline-block border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3.5 rounded-lg transition-colors text-base text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Přečíst si whitepaper
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. CO OČEKÁVAT — spolumajitelský model ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="text-orange-500" size={28} />
            <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-gray-900">
              Spolumajitelský model, ne dluhopis
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mb-10">
            Vy a autíčkář jste spolumajitelé konkrétního vozu (nebo balíčku vozů) podle
            §1115 OZ. Váš podíl odpovídá poměru vložených prostředků.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Rozdělení zisku po prodeji
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Autíčkář</span>
                  <span className="font-semibold">40 %</span>
                </li>
                <li className="flex justify-between">
                  <span>Podílník (investor)</span>
                  <span className="font-semibold text-orange-600">40 %</span>
                </li>
                <li className="flex justify-between">
                  <span>Platforma CarMakléř</span>
                  <span className="font-semibold">20 %</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3 text-gray-700 text-sm">
              <div>
                <span className="font-semibold text-gray-900">Délka jednoho dealu:</span>{" "}
                30–120 dní (typicky 60–90)
              </div>
              <div>
                <span className="font-semibold text-gray-900">Zajištění:</span>{" "}
                Konkrétní vozidlo s VIN, vlastnické právo 50/50 nebo podle poměru
              </div>
              <div>
                <span className="font-semibold text-gray-900">Kapitál se vrací:</span>{" "}
                Po úhradě kupní smlouvy od koncového zákazníka
              </div>
              <div>
                <span className="font-semibold text-gray-900">Doporučená diverzifikace:</span>{" "}
                5–20 paralelních dealů
              </div>
              <div>
                <span className="font-semibold text-gray-900">Likvidita:</span>{" "}
                Kapitál je vázaný. Předčasný výstup přes secondary market (Q4 2026)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MODELOVÝ ROI ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-orange-500" size={28} />
            <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-gray-900">
              Modelový podíl na zisku
            </h2>
          </div>

          {/* Povinný disclaimer NAD čísly */}
          <div className="flex gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-8 max-w-2xl">
            <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
            <p className="text-amber-800 text-sm leading-relaxed">
              Následující čísla jsou modelová, vycházejí z pilotní skupiny Q1 2026.
              Nejedná se o garantovaný výsledek. Minulá výkonnost není zárukou budoucí
              výkonnosti.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Deal model */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Modelový výsledek — jeden deal (90 dní)
                <span className="ml-2 font-normal normal-case text-amber-700">
                  [modelový scénář, pilotní skupina Q1 2026]
                </span>
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>Vložený kapitál</span>
                  <span className="font-semibold">2 100 000 Kč</span>
                </li>
                <li className="flex justify-between">
                  <span>Vrácený kapitál</span>
                  <span className="font-semibold">2 100 000 Kč</span>
                </li>
                <li className="flex justify-between">
                  <span>Podíl na zisku (40 %)</span>
                  <span className="font-semibold text-green-700">213 600 Kč</span>
                </li>
                <li className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-semibold text-gray-900">Annualized ROI</span>
                  <span className="font-bold text-orange-600">cca 35–45 % p. a.</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Modelový scénář, pilotní skupina Q1 2026. Skutečný výsledek závisí na délce dealu a tržní ceně vozidla.
              </p>
            </div>

            {/* Portfolio model */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Modelové portfolio — 12 měsíců, 5 paralelních dealů
                <span className="ml-2 font-normal normal-case text-amber-700">
                  [modelový scénář, pilotní skupina Q1 2026]
                </span>
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>Celkový vložený kapitál</span>
                  <span className="font-semibold">3 000 000 Kč</span>
                </li>
                <li className="flex justify-between">
                  <span>Očekávaný roční podíl na zisku</span>
                  <span className="font-semibold text-green-700">900 000 – 1 200 000 Kč</span>
                </li>
                <li className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-semibold text-gray-900">Modelové ROI</span>
                  <span className="font-bold text-orange-600">30–40 % p. a.</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Modelový scénář, pilotní skupina Q1 2026. Závislé na success rate a default rate.
              </p>
            </div>
          </div>

          {/* Risk disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-2xl text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">Rizikové faktory:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Historický default rate v pilotní skupině: 1 ze 47 dealů (2,1 %) se
                ztrátou 18 % vloženého kapitálu.
              </li>
              <li>
                Modelované worst-case v celém portfoliu: ztráta 5–8 % ročně při 1–2
                defaultech.
              </li>
              <li>
                Best-case: 45–50 % p. a. při bezchybné výkonnosti celého portfolia.
              </li>
              <li>Platforma nezaručuje návrat kapitálu ani konkrétní výši podílu na zisku.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. OVĚŘOVACÍ PROCES ── */}
      <section className="py-16 md:py-24 bg-[#1a2035]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-orange-400" size={28} />
            <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-white">
              Kdo se může stát podílníkem
            </h2>
          </div>
          <p className="text-gray-400 max-w-xl mb-10">
            Přístup na Marketplace je podmíněn dokončením 5 kroků. Nejde o regulatorní
            akreditaci, ale o interní screening pro zajištění kvality sítě.
          </p>

          <div className="space-y-4">
            {verificationSteps.map((s) => (
              <div
                key={s.step}
                className="flex gap-5 bg-white/5 rounded-xl p-5 border border-white/10"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WAITLIST FORM ── */}
      <section id="waitlist" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="text-orange-500" size={28} />
            <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-gray-900">
              Registrace k ranému přístupu
            </h2>
          </div>
          <p className="text-gray-600 max-w-xl mb-8">
            Marketplace spouští ve vlnách po dokončení právní revize (H2 2026).
            Registrovaní zájemci mají přednost — pořadí podle data a kompletnosti
            profilu.
          </p>
          <div className="max-w-xl">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-gray-900 mb-10">
            Časté otázky
          </h2>
          <div className="max-w-2xl space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex justify-between items-center px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 text-sm">
                  {item.question}
                  <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA BAND ── */}
      <section className="py-16 md:py-24 bg-[#1a2035]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-['Fraunces'] text-3xl md:text-4xl font-semibold text-white mb-4">
            Místo dluhopisů aktivum s VIN
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Podílnictví na konkrétních vozidlech se zajištěním vlastnickým právem.
            Transparentní due diligence, přímá komunikace s autíčkářem, reporty ke
            každému dealu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
            >
              Registrovat se na waitlist
            </a>
            <a
              href="/marketplace-whitepaper.pdf"
              className="inline-block border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stáhnout whitepaper (PDF)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
