"use client";

import { useState } from "react";

interface RoiInputs {
  pocetVozu: number;
  prumerCena: number;
  dnySklad: number;
  prodejnost: number;
  rezie: number;
}

interface RoiResult {
  novaObratka: number;
  poklesDni: number;
  dodatecneProdano: number;
  hrubyObrat: number;
  provize: number;
  usporaDrzeni: number;
  cistyPrinos: number;
  rocniPrognoza: number;
}

function calculateRoi(inputs: RoiInputs): RoiResult {
  const { pocetVozu, prumerCena, dnySklad, prodejnost, rezie } = inputs;

  // Nová obrátka — pilotní data: pokles o ~65 %
  const novaObratka = Math.round(dnySklad * 0.35);
  const poklesDni = dnySklad - novaObratka;

  // Zrychlení obrátky = více prodaných vozů za měsíc
  const stavajiciObratky = 30 / dnySklad; // kolikrát se sklad otočí za měsíc
  const novaObratkyMesic = 30 / novaObratka;
  const faktoreZrychleni = novaObratkyMesic / stavajiciObratky;
  const novaProdejnost = Math.round(prodejnost * faktoreZrychleni);
  const dodatecneProdano = Math.max(0, novaProdejnost - prodejnost);

  // Finance
  const hrubyObrat = dodatecneProdano * prumerCena;
  const provize = hrubyObrat * 0.05;

  // Úspora na držení skladu: méně dní = nižší náklady
  // Průměrná hodnota skladu * (dnySklad - novaObratka) / 30 * (rezie/100) * pocetVozu
  const usporaPerVuz =
    prumerCena * ((poklesDni / 30) * (rezie / 100));
  const usporaDrzeni = Math.round(usporaPerVuz * pocetVozu);

  const cistyPrinos = Math.round(hrubyObrat - provize + usporaDrzeni);
  const rocniPrognoza = cistyPrinos * 12;

  return {
    novaObratka,
    poklesDni,
    dodatecneProdano,
    hrubyObrat,
    provize,
    usporaDrzeni,
    cistyPrinos,
    rocniPrognoza,
  };
}

function formatKc(value: number): string {
  return (
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0Kč"
  );
}

function formatMil(value: number): string {
  const mil = value / 1_000_000;
  return mil.toFixed(1).replace(".", ",") + "\u00a0mil. Kč";
}

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>({
    pocetVozu: 120,
    prumerCena: 380000,
    dnySklad: 68,
    prodejnost: 22,
    rezie: 1.2,
  });
  const [result, setResult] = useState<RoiResult | null>(null);

  function handleChange(field: keyof RoiInputs, value: string) {
    const num = field === "rezie" ? parseFloat(value) : parseInt(value, 10);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [field]: num }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(calculateRoi(inputs));
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Počet vozů ve skladu k dnešnímu dni
            </label>
            <input
              type="number"
              min={20}
              max={500}
              value={inputs.pocetVozu}
              onChange={(e) => handleChange("pocetVozu", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrná prodejní cena vozu (Kč)
            </label>
            <input
              type="number"
              min={50000}
              max={5000000}
              step={10000}
              value={inputs.prumerCena}
              onChange={(e) => handleChange("prumerCena", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrný počet dní na sklad před prodejem
            </label>
            <input
              type="number"
              min={5}
              max={365}
              value={inputs.dnySklad}
              onChange={(e) => handleChange("dnySklad", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrná měsíční prodejnost (vozů)
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={inputs.prodejnost}
              onChange={(e) => handleChange("prodejnost", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Režijní náklady držení skladu (% z ceny vozu měsíčně)
            </label>
            <input
              type="number"
              min={0.1}
              max={5}
              step={0.1}
              value={inputs.rezie}
              onChange={(e) => handleChange("rezie", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-8 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all"
          >
            Spočítat
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Projekce při zapojení do sítě CarMakléř:
          </h3>
          <ul className="space-y-3 text-sm text-gray-700 mb-6">
            <li className="flex justify-between">
              <span>Odhadovaná nová obrátka</span>
              <span className="font-bold text-gray-900">
                {result.novaObratka} dní (pokles o {result.poklesDni} dní)
              </span>
            </li>
            <li className="flex justify-between">
              <span>Dodatečně prodaných vozů / měsíc</span>
              <span className="font-bold text-green-700">+ {result.dodatecneProdano} ks</span>
            </li>
            <li className="flex justify-between">
              <span>Hrubý dodatečný obrat</span>
              <span className="font-bold text-green-700">+ {formatKc(result.hrubyObrat)}</span>
            </li>
            <li className="flex justify-between border-t border-gray-200 pt-3">
              <span>Provize CarMakléři (5 %)</span>
              <span className="font-bold text-red-600">− {formatKc(result.provize)}</span>
            </li>
            <li className="flex justify-between">
              <span>Úspora na držení skladu</span>
              <span className="font-bold text-green-700">+ {formatKc(result.usporaDrzeni)}</span>
            </li>
            <li className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <span className="font-bold text-gray-900">Čistý měsíční přínos</span>
              <span className="font-bold text-orange-600">+ {formatKc(result.cistyPrinos)}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-bold text-gray-900">Roční projekce</span>
              <span className="font-bold text-orange-600">+ {formatMil(result.rocniPrognoza)}</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-4">
            Modelový propočet vychází z pilotních dat 18 autobazarů zapojených do sítě v Q1 2026.
            Skutečný výkon závisí na kvalitě skladu, regionu, sezóně a mixu značek.
            Čísla aktualizujeme po každém ukončeném kvartálu.
          </p>
          <div className="mt-6">
            <a
              href="/kontakt?typ=roi-analyza"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full py-3 px-6 text-[15px] bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:-translate-y-0.5 transition-all no-underline"
            >
              Chci detailní analýzu pro náš bazar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
