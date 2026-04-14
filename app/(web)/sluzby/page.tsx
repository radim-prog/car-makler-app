import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/web/Breadcrumbs";
import { pageCanonical } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "Služby",
  description:
    "Kompletní služby pro prodej a nákup auta: prověrka vozidla, financování na splátky, pojištění online. Vše na jednom místě.",
  openGraph: {
    title: "Služby | CarMakléř",
    description:
      "Prověrka vozidla, financování na splátky, pojištění online. Kompletní služby pro nákup a prodej auta.",
  },
  alternates: pageCanonical("/sluzby"),
};

const services = [
  {
    href: "/sluzby/proverka",
    title: "Prověrka vozidla",
    description:
      "Kompletní kontrola historie a technického stavu vozu. Zjistěte, do čeho investujete — ještě před podpisem.",
    cta: "Objednat prověrku",
    icon: (
      <svg
        className="w-8 h-8 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
  {
    href: "/sluzby/financovani",
    title: "Financování",
    description:
      "Výhodné financování auta na splátky do 30 minut. Bez zálohy, nízký úrok od 3,9 %, schválení online.",
    cta: "Spočítat splátky",
    icon: (
      <svg
        className="w-8 h-8 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        />
      </svg>
    ),
  },
  {
    href: "/sluzby/pojisteni",
    title: "Pojištění",
    description:
      "Povinné ručení i havarijní pojištění online. Porovnejte nabídky a sjednejte pojistku rovnou k nové koupi.",
    cta: "Sjednat pojištění",
    icon: (
      <svg
        className="w-8 h-8 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
        />
      </svg>
    ),
  },
];

export default function SluzbyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: "Služby" }]} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Služby pro <span className="text-orange-500">každou fázi</span> koupě auta
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Od prověrky vozu přes financování až po pojištění — vše online, rychle a bez starostí.
            Využijte naše služby samostatně nebo v rámci kompletního procesu nákupu přes CarMakléře.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-8 hover:border-orange-300 hover:shadow-lg transition-all no-underline"
            >
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {service.title}
              </h2>
              <p className="text-gray-600 leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-orange-600 font-semibold">
                {service.cta}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nevíte si rady? Ozvěte se nám
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Certifikovaní makléři CarMakléře vám pomůžou s výběrem auta, prověrkou, financováním
              i pojištěním — vše v jednom balíčku.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange hover:-translate-y-0.5 hover:shadow-orange-hover transition-all no-underline"
              >
                Kontaktovat makléře
              </Link>
              <Link
                href="/makleri"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-sm bg-white text-gray-800 shadow-[inset_0_0_0_2px_var(--gray-200)] hover:bg-gray-50 hover:shadow-[inset_0_0_0_2px_var(--gray-300)] transition-all no-underline"
              >
                Najít makléře v okolí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
