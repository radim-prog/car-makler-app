"use client";

import { useState } from "react";

interface IncomeInputs {
  vozyMesic: number;
  prumerCena: number;
  sezonnost: boolean;
}

interface IncomeResult {
  rocniObjem: number;
  rocniProvize: number;
  mesicniPrumer: number;
  sezonniMesice: number;
}

const MIN_PROVIZE_PER_VUZ = 25000;

function calculateIncome(inputs: IncomeInputs): IncomeResult {
  const { vozyMesic, prumerCena, sezonnost } = inputs;

  // Měsíční provize s minimem 25 000 Kč / vůz
  const provizePerVuz = Math.max(prumerCena * 0.05, MIN_PROVIZE_PER_VUZ);
  const mesicniProvize = vozyMesic * provizePerVuz;

  let rocniProvize: number;
  if (sezonnost) {
    // Červenec + srpen = pokles 30 %, zbylých 10 měsíců plný výkon
    const plneMesice = 10;
    const sezonniMesice = 2;
    rocniProvize =
      plneMesice * mesicniProvize + sezonniMesice * mesicniProvize * 0.7;
  } else {
    rocniProvize = 12 * mesicniProvize;
  }

  const rocniObjem = sezonnost
    ? 10 * vozyMesic * prumerCena + 2 * vozyMesic * prumerCena * 0.7
    : 12 * vozyMesic * prumerCena;

  const mesicniPrumer = rocniProvize / 12;
  const sezonniMesice = sezonnost ? 2 : 0;

  return { rocniObjem, rocniProvize, mesicniPrumer, sezonniMesice };
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
  if (mil >= 1) {
    return mil.toFixed(2).replace(".", ",") + "\u00a0mil.\u00a0Kč";
  }
  return (
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0") + "\u00a0Kč"
  );
}

export function IncomeCalculator() {
  const [inputs, setInputs] = useState<IncomeInputs>({
    vozyMesic: 3,
    prumerCena: 380000,
    sezonnost: false,
  });

  const result = calculateIncome(inputs);

  const provizePerVuz = Math.max(inputs.prumerCena * 0.05, MIN_PROVIZE_PER_VUZ);
  const showMinimumNote = inputs.prumerCena * 0.05 < MIN_PROVIZE_PER_VUZ;

  return (
    <div id="kalkulacka" className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        {/* Slider: vozy/měsíc */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Vozů prodaných měsíčně
            </label>
            <span className="text-xl font-bold text-orange-500">
              {inputs.vozyMesic}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={inputs.vozyMesic}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                vozyMesic: parseInt(e.target.value, 10),
              }))
            }
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Slider: průměrná cena */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Průměrná prodejní cena vozu
            </label>
            <span className="text-xl font-bold text-orange-500">
              {formatKc(inputs.prumerCena)}
            </span>
          </div>
          <input
            type="range"
            min={150000}
            max={800000}
            step={10000}
            value={inputs.prumerCena}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                prumerCena: parseInt(e.target.value, 10),
              }))
            }
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>150\u00a0tis.\u00a0Kč</span>
            <span>475\u00a0tis.\u00a0Kč</span>
            <span>800\u00a0tis.\u00a0Kč</span>
          </div>
        </div>

        {/* Checkbox: sezónnost */}
        <div className="flex items-start gap-3 mb-4">
          <input
            id="sezonnost"
            type="checkbox"
            checked={inputs.sezonnost}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, sezonnost: e.target.checked }))
            }
            className="mt-0.5 w-4 h-4 accent-orange-500 shrink-0"
          />
          <label htmlFor="sezonnost" className="text-sm text-gray-700 cursor-pointer">
            Zohlednit sezónnost{" "}
            <span className="text-gray-400">
              (červenec–srpen pokles 30 %)
            </span>
          </label>
        </div>
      </div>

      {/* Výsledky */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">
          Roční projekce při {inputs.vozyMesic}{" "}
          {inputs.vozyMesic === 1 ? "voze" : inputs.vozyMesic < 5 ? "vozech" : "vozech"} / měsíc
        </h3>
        <ul className="space-y-3 text-sm text-gray-700 mb-6">
          <li className="flex justify-between">
            <span>Roční prodejní objem</span>
            <span className="font-bold text-gray-900">
              {formatMil(result.rocniObjem)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>
              Provize 5 %{showMinimumNote && " (min. 25\u00a0000\u00a0Kč / vůz)"}
            </span>
            <span className="font-bold text-gray-900">
              {formatMil(result.rocniProvize)} / rok
            </span>
          </li>
          <li className="flex justify-between border-t border-gray-200 pt-3 text-base">
            <span className="font-bold text-gray-900">
              Průměrný měsíční příjem
            </span>
            <span className="font-bold text-orange-600">
              {formatKc(result.mesicniPrumer)}
            </span>
          </li>
        </ul>

        {showMinimumNote && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mb-4">
            <p className="text-xs text-orange-800 leading-relaxed">
              <strong>Minimum provize 25\u00a0000\u00a0Kč / vůz:</strong> při prodeji vozu za{" "}
              {formatKc(inputs.prumerCena)} dostanete{" "}
              {formatKc(provizePerVuz)} místo matematických{" "}
              {formatKc(inputs.prumerCena * 0.05)} (5\u00a0%).
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-4">
          Modelový propočet. Skutečný příjem závisí na vaší síti, regionu, aktivitě a tržních
          podmínkách. Není to garantovaný výnos.
        </p>
      </div>
    </div>
  );
}
