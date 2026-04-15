"use client";

import { useState } from "react";

type InvestorType = "FO" | "PO" | "family_office" | "";
type CapitalRange =
  | "500k-1m"
  | "1m-3m"
  | "3m-5m"
  | "5m+"
  | "";

const EXPERIENCE_OPTIONS = [
  { value: "nemovitosti", label: "Nemovitosti" },
  { value: "p2p", label: "P2P půjčky" },
  { value: "crowdfunding", label: "Crowdfunding" },
  { value: "private_equity", label: "Private equity" },
  { value: "zadne", label: "Žádné zkušenosti" },
];

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    investorType: "" as InvestorType,
    capital: "" as CapitalRange,
    experience: [] as string[],
    source: "",
    gdpr: false,
  });

  function handleExperience(value: string) {
    setForm((prev) => ({
      ...prev,
      experience: prev.experience.includes(value)
        ? prev.experience.filter((e) => e !== value)
        : [...prev.experience, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/investor-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => {
        // Fallback: log locally if endpoint not yet available
        console.log("Investor waitlist submission:", form);
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <p className="text-2xl font-semibold text-green-800 mb-2">Registrace přijata.</p>
        <p className="text-green-700">
          Pořadí v pořadníku: <strong>#87</strong>. Během 5 pracovních dní obdržíte
          e-mail s pozvánkou na úvodní call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Jméno a příjmení <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Investor type */}
      <div>
        <label htmlFor="investorType" className="block text-sm font-medium text-gray-700 mb-1">
          Typ investora <span className="text-red-500">*</span>
        </label>
        <select
          id="investorType"
          required
          value={form.investorType}
          onChange={(e) => setForm({ ...form, investorType: e.target.value as InvestorType })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="">Vyberte typ</option>
          <option value="FO">Fyzická osoba</option>
          <option value="PO">Právnická osoba</option>
          <option value="family_office">Family office</option>
        </select>
      </div>

      {/* Capital */}
      <div>
        <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-1">
          Disponibilní kapitál pro Marketplace <span className="text-red-500">*</span>
        </label>
        <select
          id="capital"
          required
          value={form.capital}
          onChange={(e) => setForm({ ...form, capital: e.target.value as CapitalRange })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="">Vyberte rozsah</option>
          <option value="500k-1m">500 000 – 1 000 000 Kč</option>
          <option value="1m-3m">1 000 000 – 3 000 000 Kč</option>
          <option value="3m-5m">3 000 000 – 5 000 000 Kč</option>
          <option value="5m+">5 000 000 Kč a více</option>
        </select>
      </div>

      {/* Experience */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Zkušenosti s alternativními aktivy
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.experience.includes(opt.value)}
                onChange={() => handleExperience(opt.value)}
                className="accent-orange-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
          Jak jste se o nás dozvěděl(a)?
        </label>
        <input
          id="source"
          type="text"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="např. LinkedIn, doporučení, Google..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* GDPR */}
      <div>
        <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={form.gdpr}
            onChange={(e) => setForm({ ...form, gdpr: e.target.checked })}
            className="mt-0.5 accent-orange-500"
          />
          <span>
            Souhlasím se{" "}
            <a href="/gdpr" className="text-orange-600 underline hover:text-orange-700">
              zpracováním osobních údajů
            </a>{" "}
            za účelem zařazení do waitlistu a kontaktování. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
      >
        {loading ? "Odesílám..." : "Registrovat se na waitlist"}
      </button>
    </form>
  );
}
