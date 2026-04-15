import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { pageCanonical } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů (GDPR)",
  description:
    "Zásady zpracování osobních údajů na platformě CarMakléř. Informace dle nařízení GDPR (EU 2016/679) a zákona č. 110/2019 Sb.",
  openGraph: {
    title: "Ochrana osobních údajů (GDPR)",
    description:
      "Zásady zpracování osobních údajů na platformě CarMakléř — vaše práva, kontakt na pověřence, doba uchování.",
  },
  alternates: pageCanonical("/gdpr"),
};

export default function GdprPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: "Ochrana osobních údajů" }]} />
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Stránka ve vývoji
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-5">
          Ochrana osobních údajů
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Tato stránka popisuje zpracování osobních údajů na platformě CarMakléř v souladu
          s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb.
          Kompletní znění aktuálně připravujeme s právním partnerem.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Co momentálně zveřejňujeme</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-orange-500 shrink-0">•</span>
              <span>
                <strong>Správce údajů:</strong> CAR makler, s.r.o. — kontakt přes{" "}
                <Link href="/kontakt" className="text-orange-600 hover:underline">
                  /kontakt
                </Link>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 shrink-0">•</span>
              <span>
                <strong>Účel zpracování:</strong> poskytnutí služby (inzerce, e-shop, makléřská
                činnost, marketplace), plnění smlouvy, oprávněné zájmy správce.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 shrink-0">•</span>
              <span>
                <strong>Doba uchování:</strong> po dobu trvání smluvního vztahu a následně
                v zákonné archivační lhůtě (účetní 10 let, daňové 10 let).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 shrink-0">•</span>
              <span>
                <strong>Vaše práva:</strong> právo na přístup, opravu, výmaz, omezení
                zpracování, přenositelnost a vznesení námitky. Stížnost můžete podat u
                Úřadu pro ochranu osobních údajů (uoou.cz).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 shrink-0">•</span>
              <span>
                <strong>Cookies:</strong> používáme technické (nezbytné), analytické
                a marketingové cookies. Nastavení můžete kdykoli změnit v cookie liště.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Potřebujete plné znění nebo uplatnit svá práva?
          </h2>
          <p className="text-gray-700 mb-5">
            Napište nám na{" "}
            <a
              href="mailto:gdpr@carmakler.cz"
              className="text-orange-600 font-semibold hover:underline"
            >
              gdpr@carmakler.cz
            </a>{" "}
            nebo využijte kontaktní formulář. Odpovídáme do 30 dnů (dle čl. 12 odst. 3 GDPR).
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
