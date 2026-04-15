"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/Button";
import { LockIcon, DocumentIcon, ScaleIcon, CheckIcon } from "@/components/ui/Icons";

export function WaitlistComingSoon() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"INVESTOR" | "DEALER" | "BOTH">("INVESTOR");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorText(null);
    try {
      const res = await fetch("/api/marketplace/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, message, source: "marketplace_gate" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Chyba při odesílání");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Chyba při odesílání");
    }
  }

  return (
    <main className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Uzavřená investiční platforma
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Marketplace <span className="text-orange-500">už brzy</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mt-6 leading-relaxed max-w-2xl mx-auto">
            CarMakléř Marketplace propojuje ověřené realizátory aut s investory.
            Platforma je v uzavřené přípravě a spouští se postupně ve vlnách.
            Zaregistrujte se do waitlistu a budete mezi prvními pozvanými.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {([
            { icon: LockIcon, title: "Uzavřená komunita", desc: "Pouze ověření investoři a realizátoři" },
            { icon: DocumentIcon, title: "Smlouva ke každé transakci", desc: "Žádné překvapení, vše transparentně" },
            { icon: ScaleIcon, title: "Regulatorní příprava", desc: "Spolupráce s právníky před veřejným spuštěním" },
          ] as Array<{ icon: ComponentType<{ className?: string }>; title: string; desc: string }>).map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <div className="font-semibold mb-1">{item.title}</div>
              <div className="text-sm text-white/60">{item.desc}</div>
            </div>
          ))}
        </div>

        {status === "ok" ? (
          <div className="bg-green-500/10 border border-green-500/40 rounded-2xl p-8 text-center">
            <CheckIcon className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h2 className="text-2xl font-bold mb-2">Jste na seznamu</h2>
            <p className="text-white/70">
              Děkujeme. Ozveme se, jakmile pro vás budeme mít místo v další vlně.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Přihlásit se do waitlistu</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="block text-sm text-white/70 mb-1.5">Jméno</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none"
                  placeholder="Jan Novák"
                />
              </label>

              <label className="block">
                <span className="block text-sm text-white/70 mb-1.5">
                  Email <span className="text-orange-400">*</span>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none"
                  placeholder="vas@email.cz"
                />
              </label>
            </div>

            <label className="block mb-4">
              <span className="block text-sm text-white/70 mb-1.5">Zajímá mě role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="INVESTOR">Investor</option>
                <option value="DEALER">Realizátor (dealer / autobazar)</option>
                <option value="BOTH">Obojí</option>
              </select>
            </label>

            <label className="block mb-6">
              <span className="block text-sm text-white/70 mb-1.5">Krátká zpráva (nepovinné)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none resize-none"
                placeholder="Zkušenosti, objem kapitálu, specializace…"
              />
            </label>

            {errorText && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
                {errorText}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Odesílám…" : "Přihlásit do waitlistu"}
            </Button>

            <p className="text-xs text-white/50 mt-4 text-center">
              Odesláním souhlasíte se zpracováním kontaktních údajů pro účely pozvánky do platformy.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
