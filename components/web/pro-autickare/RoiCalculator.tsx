"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";

export function RoiCalculator() {
  const [vozu, setVozu] = useState(10);
  const [cena, setCena] = useState(270000);
  const [marze, setMarze] = useState(20);
  const [kapital, setKapital] = useState(90);

  const rocniObrat = vozu * 12 * cena;
  const hrubyZisk = rocniObrat * (marze / 100);
  const vasPodiL = hrubyZisk * 0.4;
  const investorPodiL = hrubyZisk * 0.4;
  const platforma = hrubyZisk * 0.2;

  const fmt = (n: number) =>
    new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n);

  return (
    <Card className="p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrný počet vozů měsíčně
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={vozu}
              onChange={(e) => setVozu(Math.max(1, Number(e.target.value)))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrná prodejní cena (Kč)
            </label>
            <input
              type="number"
              min={50000}
              step={10000}
              value={cena}
              onChange={(e) => setCena(Math.max(50000, Number(e.target.value)))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Průměrná marže po nákladech (%)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={marze}
              onChange={(e) => setMarze(Math.min(60, Math.max(1, Number(e.target.value))))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kapitál od investora (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={kapital}
              onChange={(e) => setKapital(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Roční projekce</h3>
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 text-sm">Celkový obrat</span>
            <span className="font-bold text-gray-900">{fmt(rocniObrat)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 text-sm">Hrubý zisk ({marze} %)</span>
            <span className="font-bold text-gray-900">{fmt(hrubyZisk)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 text-sm font-semibold">Váš podíl (40 %)</span>
            <span className="font-extrabold text-lg text-orange-500">{fmt(vasPodiL)}/rok</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 text-sm">Investor (40 %)</span>
            <span className="font-bold text-gray-900">{fmt(investorPodiL)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Platforma (20 %)</span>
            <span className="font-bold text-gray-900">{fmt(platforma)}</span>
          </div>
          <p className="text-xs text-gray-400 pt-2 leading-relaxed">
            Modelový propočet. Skutečné marže závisí na zdroji vozů, sezóně a operativní efektivitě. Podklady pro kalkulačku: pilotní Q1 2026.
          </p>
        </div>
      </div>
    </Card>
  );
}
