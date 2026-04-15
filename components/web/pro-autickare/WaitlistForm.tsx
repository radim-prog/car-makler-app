"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const OBJEMY = [
  { value: "1-4", label: "1–4 vozů měsíčně" },
  { value: "5-9", label: "5–9 vozů měsíčně" },
  { value: "10-15", label: "10–15 vozů měsíčně" },
  { value: "15+", label: "15+ vozů měsíčně" },
];

const SPECIALIZACE = [
  { value: "ceske", label: "České značky" },
  { value: "premium", label: "Premium" },
  { value: "elektro", label: "Elektromobily" },
  { value: "dodavky", label: "Dodávky" },
  { value: "import", label: "Import DE/AT" },
  { value: "bouracky", label: "Bouračky" },
];

export function WaitlistForm() {
  const [jmeno, setJmeno] = useState("");
  const [ico, setIco] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [objem, setObjem] = useState("");
  const [specializ, setSpecializ] = useState<string[]>([]);
  const [zdroj, setZdroj] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const toggleSpec = (val: string) => {
    setSpecializ((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/marketplace-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jmeno, ico, email, telefon, objem, specializ, zdroj }),
      });
      if (!res.ok) throw new Error("server error");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  if (submitState === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Děkujeme.</h3>
        <p className="text-gray-600 mb-6">
          Vaše registrace má pořadí <strong>#142</strong> v pořadníku autíčkářů. Do 72 hodin
          dostanete e-mail s dalšími instrukcemi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#pavel"
            className="inline-block bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors no-underline text-sm"
          >
            Přečíst si příběh Pavla
          </a>
          <a
            href="/makleri"
            className="inline-block border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors no-underline text-sm"
          >
            Prohlédnout si síť makléřů
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Jméno a příjmení <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={jmeno}
            onChange={(e) => setJmeno(e.target.value)}
            placeholder="Pavel Novák"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            IČO / název firmy <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={ico}
            onChange={(e) => setIco(e.target.value)}
            placeholder="12345678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="pavel@firma.cz"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder="+420 777 123 456"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Průměrný měsíční objem <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={objem}
          onChange={(e) => setObjem(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Vyberte rozsah...</option>
          {OBJEMY.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Specializace <span className="text-gray-400 font-normal">(vyberte vše co se hodí)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZACE.map((s) => {
            const active = specializ.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSpec(s.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-orange-400"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Jak jste se o nás dozvěděl? <span className="text-gray-400 font-normal">(volitelné)</span>
        </label>
        <input
          type="text"
          value={zdroj}
          onChange={(e) => setZdroj(e.target.value)}
          placeholder="doporučení, sociální sítě, Google..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {submitState === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          Nastala chyba při odesílání. Zkuste to prosím znovu nebo nás kontaktujte přímo.
        </p>
      )}

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-base"
      >
        {submitState === "submitting" ? "Odesílám..." : "Registrovat se na waitlist"}
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Odpovíme do 1 pracovního dne. Registrací nevzniká žádný závazek.
      </p>
    </form>
  );
}
