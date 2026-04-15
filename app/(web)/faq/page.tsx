import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { pageCanonical } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "Časté dotazy (FAQ)",
  description:
    "Odpovědi na nejčastější dotazy k službám CarMakléř — prodej auta, nákup, prověrka, financování, pojištění, marketplace.",
  openGraph: {
    title: "Časté dotazy (FAQ)",
    description:
      "Odpovědi na nejčastější dotazy k službám CarMakléř — prodej, nákup, makléřská síť, marketplace.",
  },
  alternates: pageCanonical("/faq"),
};

const faqs = [
  {
    q: "Jak prodám auto přes CarMakléře?",
    a: "Vyplníte krátkou poptávku, certifikovaný makléř vás kontaktuje, převezme prodej (foto, inzerce, prohlídky, smlouva, přepis). Provize 5 % z prodejní ceny, min. 25 000 Kč.",
  },
  {
    q: "Kolik stojí inzerát na inzertní platformě?",
    a: "Základní inzerát je zdarma. Nabízíme platformové premium balíčky pro vyšší dosah (top pozice, větší fotky). Detaily uvidíte při vkládání inzerátu.",
  },
  {
    q: "Jak funguje prověrka vozidla?",
    a: "Online objednávka, naši technici proverí historii (Cebia + VIN dekodér), stav (foto i fyzická prohlídka), poradí s rozhodováním. Detaily na /sluzby/proverka.",
  },
  {
    q: "Co je Marketplace a kdo se může účastnit?",
    a: "Uzavřená investiční platforma pro flipping aut. Přístup mají pouze ověření realizátoři (autobazary, dealeři) a investoři po prověření. Není to veřejná služba — invite only.",
  },
  {
    q: "Můžu vrátit díly z e-shopu?",
    a: "Na použité díly (z vrakovišť) i nové aftermarket díly platí standardní reklamace dle občanského zákoníku. Detaily v obchodních podmínkách.",
  },
  {
    q: "Jak se stanu makléřem CarMakléře?",
    a: "Vyplníte žádost na /kariera, projdete pohovorem a školením, získáte certifikaci a přístup do PWA pro makléře. Pracujete jako OSVČ s podporou backoffice.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: "Časté dotazy" }]} />
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Stránka ve vývoji — průběžně rozšiřujeme
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-5">
          Časté dotazy
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Vybrané odpovědi k nejčastějším otázkám napříč ekosystémem CarMakléř — prodej
          a nákup aut, makléřská síť, autodíly, investiční marketplace.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-orange-300 transition-colors"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900 group-open:text-orange-600 transition-colors">
                  {item.q}
                </h2>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vaše otázka tady není?
          </h2>
          <p className="text-gray-600 mb-6">
            Ozvěte se nám — odpovídáme do 24 hodin v pracovní dny.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange hover:-translate-y-0.5 hover:shadow-orange-hover transition-all no-underline"
          >
            Kontaktovat nás
          </Link>
        </div>
      </section>
    </div>
  );
}
