"use client";

import { useMemo, useState } from "react";
import { ROI_CALCULATOR_CSS } from "./roiCalculatorStyles";

/**
 * ROI kalkulačka UI — FIX-041 (Designer, 2026-04-15)
 *
 * Pro B2B landing `/pro-autickare` + `/pro-bazary`.
 *
 * UI-only komponenta s **mock logikou**. Business pravidla dopíše
 * implementátor (reálné provize, měsíční cashflow shape, kanálové
 * korekce per AUDIT-028c §2.4 + BusinessPlan.md).
 *
 * Inputs:
 *   - Počet aut ročně (1–50)
 *   - Průměrná marže na auto (20 000 – 200 000 Kč)
 *   - Preferovaný kanál (broker / self / shop)
 *
 * Outputs:
 *   - Modelový roční zisk (tab-sensitive)
 *   - 12-měsíční breakdown bar chart
 *   - Řádkový breakdown (hrubý / provize / čistý)
 *   - Prominent amber disclaimer
 *
 * Design tokeny: FIX-022 (midnight paleta, Fraunces / JetBrains Mono / Outfit,
 * data-broker #F97316, data-investor #6366F1, data-shop #10B981).
 */

type Channel = "broker" | "self" | "shop";

interface ChannelMeta {
  id: Channel;
  title: string;
  kicker: string;
  commission: number; // podíl, který si channel bere (mock)
  caption: string;
}

const CHANNELS: Record<Channel, ChannelMeta> = {
  broker: {
    id: "broker",
    title: "Makléřská síť",
    kicker: "Broker",
    commission: 0.2,
    caption: "Pavel nabere vůz, prodá ho přes CarMakléř síť — provize 20 % z marže.",
  },
  self: {
    id: "self",
    title: "Vlastní klienti",
    kicker: "Direct",
    commission: 0.05,
    caption: "Pavel prodává vlastní klientele, platforma si bere 5 % za použití smluv a escrow.",
  },
  shop: {
    id: "shop",
    title: "CarMakléř Shop",
    kicker: "Shop",
    commission: 0.15,
    caption: "Pavel listuje vůz na CarMakléř Shop, zákazník platí přímo — poplatek 15 %.",
  },
};

const CZK_FORMATTER = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

const NUM_FORMATTER = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

/**
 * Mock cashflow shape — fáze 1 (nábor) tišší, fáze 2 (prodeje) roste k Q3.
 * Implementátor nahradí skutečnou ramp-up křivkou dle historických dat.
 */
const MONTHLY_SHAPE = [0.4, 0.55, 0.65, 0.78, 0.9, 1.0, 1.1, 1.08, 1.15, 1.05, 0.92, 0.82];
const SHAPE_SUM = MONTHLY_SHAPE.reduce((a, b) => a + b, 0);

export interface RoiCalculatorProps {
  /** Volitelný ID pro aria-labelledby (když je komponenta v sekci s vlastním headingem). */
  headingId?: string;
  className?: string;
  /** Default hodnoty — implementátor může přenastavit dle persony landingu. */
  defaultCount?: number;
  defaultMargin?: number;
  defaultChannel?: Channel;
}

export function RoiCalculator({
  headingId = "roi-calculator-heading",
  className,
  defaultCount = 10,
  defaultMargin = 65000,
  defaultChannel = "broker",
}: RoiCalculatorProps) {
  const [count, setCount] = useState<number>(defaultCount);
  const [margin, setMargin] = useState<number>(defaultMargin);
  const [channel, setChannel] = useState<Channel>(defaultChannel);

  const meta = CHANNELS[channel];

  const { gross, platformCut, net, monthly } = useMemo(() => {
    const g = count * margin;
    const cut = g * meta.commission;
    const n = g - cut;
    const months = MONTHLY_SHAPE.map((w) => Math.round((n * w) / SHAPE_SUM));
    return { gross: g, platformCut: cut, net: n, monthly: months };
  }, [count, margin, meta]);

  const maxMonth = Math.max(...monthly, 1);

  return (
    <>
      <style>{ROI_CALCULATOR_CSS}</style>
      <section
        className={`roi-scope${className ? ` ${className}` : ""}`}
        aria-labelledby={headingId}
      >
        <p className="roi-kicker">ROI kalkulačka · Modelový scénář</p>
        <h3 id={headingId} className="roi-title">
          Kolik si jako autíčkář vyděláš na CarMakléři?
        </h3>
        <p className="roi-subtitle">
          Nastav realistický počet vozů ročně, průměrnou marži a prodejní kanál.
          Ukážeme modelový roční zisk po odečtení platformních poplatků.
          Čísla jsou ilustrativní — skutečné výsledky závisí na konkrétních vozech, cenách a úpisu smluv.
        </p>

        <div className="roi-grid">
          {/* ── INPUTS ────────────────────────────────────── */}
          <div className="roi-inputs">
            <div className="roi-field">
              <div className="roi-field__head">
                <label className="roi-field__label" htmlFor="roi-count">
                  Počet vozů ročně
                </label>
                <span className="roi-field__value">
                  <strong>{count}</strong> <span style={{ opacity: 0.6 }}>vozů</span>
                </span>
              </div>
              <input
                id="roi-count"
                type="range"
                min={1}
                max={50}
                step={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="roi-slider"
                aria-valuemin={1}
                aria-valuemax={50}
                aria-valuenow={count}
                aria-valuetext={`${count} vozů ročně`}
              />
              <div className="roi-field__meta">
                <span>1 / měsíc</span>
                <span>50 / rok</span>
              </div>
            </div>

            <div className="roi-field">
              <div className="roi-field__head">
                <label className="roi-field__label" htmlFor="roi-margin">
                  Průměrná marže na vůz
                </label>
                <span className="roi-field__value">
                  <strong>{NUM_FORMATTER.format(margin)}</strong>{" "}
                  <span style={{ opacity: 0.6 }}>Kč</span>
                </span>
              </div>
              <input
                id="roi-margin"
                type="range"
                min={20000}
                max={200000}
                step={5000}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="roi-slider"
                aria-valuemin={20000}
                aria-valuemax={200000}
                aria-valuenow={margin}
                aria-valuetext={`${NUM_FORMATTER.format(margin)} Kč marže na vůz`}
              />
              <div className="roi-field__meta">
                <span>20 000 Kč</span>
                <span>200 000 Kč</span>
              </div>
            </div>

            <div className="roi-field">
              <span className="roi-field__label" id="roi-channel-label">
                Preferovaný prodejní kanál
              </span>
              <div
                className="roi-tabs"
                role="tablist"
                aria-labelledby="roi-channel-label"
              >
                {(Object.values(CHANNELS) as ChannelMeta[]).map((c) => {
                  const isActive = c.id === channel;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-channel={c.id}
                      className={`roi-tab${isActive ? " is-active" : ""}`}
                      onClick={() => setChannel(c.id)}
                    >
                      <span className="roi-tab__channel">{c.kicker}</span>
                      <span>{c.title}</span>
                    </button>
                  );
                })}
              </div>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.8125rem",
                  lineHeight: 1.5,
                  color: "var(--roi-midnight-400)",
                }}
              >
                {meta.caption}
              </p>
            </div>
          </div>

          {/* ── OUTPUT ────────────────────────────────────── */}
          <div className="roi-output" aria-live="polite">
            <p className="roi-output__kicker">Modelový roční čistý zisk</p>
            <p className="roi-output__value">
              {CZK_FORMATTER.format(Math.round(net))}
              <span>· kanál {meta.kicker}</span>
            </p>
            <p className="roi-output__caption">
              Po odečtení platformních poplatků ({Math.round(meta.commission * 100)} %).
              Rozpis po měsících níže — nábor bývá pomalejší, prodeje kulminují v Q3.
            </p>

            {/* 12-měsíční breakdown -------------------------- */}
            <div
              className="roi-chart"
              role="img"
              aria-label={`Rozložení čistého zisku ${CZK_FORMATTER.format(Math.round(net))} do 12 měsíců, nábor pomalejší na začátku, prodeje kulminují v Q3.`}
            >
              {monthly.map((value, i) => {
                const pct = Math.max(4, Math.round((value / maxMonth) * 100));
                return (
                  <div
                    key={i}
                    className="roi-chart__bar"
                    data-channel={channel}
                    style={{ height: `${pct}%` }}
                    title={`Měsíc ${i + 1}: ${CZK_FORMATTER.format(value)}`}
                  />
                );
              })}
            </div>
            <div className="roi-chart__labels" aria-hidden="true">
              {["L", "Ú", "B", "D", "K", "Č", "Č", "S", "Z", "Ř", "L", "P"].map(
                (m, i) => (
                  <span key={i}>{m}</span>
                ),
              )}
            </div>

            {/* Breakdown řádky ------------------------------- */}
            <dl className="roi-breakdown">
              <dt className="roi-breakdown__label">Hrubá marže (počet × marže)</dt>
              <dd className="roi-breakdown__value">
                {CZK_FORMATTER.format(Math.round(gross))}
              </dd>

              <dt className="roi-breakdown__label">
                Platformní poplatek ({Math.round(meta.commission * 100)} %)
              </dt>
              <dd className="roi-breakdown__value">
                − {CZK_FORMATTER.format(Math.round(platformCut))}
              </dd>

              <dt className="roi-breakdown__label roi-breakdown__row--total">
                Čistý roční zisk autíčkáře
              </dt>
              <dd className="roi-breakdown__value roi-breakdown__row--total">
                {CZK_FORMATTER.format(Math.round(net))}
              </dd>
            </dl>
          </div>
        </div>

        {/* ── DISCLAIMER ──────────────────────────────────── */}
        <aside className="roi-disclaimer" role="note">
          <strong>Modelový scénář — nejedná se o nabídku</strong>
          Kalkulace je ilustrativní a neslouží jako investiční doporučení ani
          smluvní závazek. Skutečný výnos závisí na konkrétních vozech, prodejních
          cenách, stavu trhu a parametrech smlouvy §1115 OZ. Platformní poplatky a
          ramp-up křivka jsou orientační — detailní rozpis dostaneš po vstupu do
          ověřovacího protokolu. CarMakléř negarantuje žádnou minimální
          výnosnost.
        </aside>
      </section>
    </>
  );
}

/** Export metadata pro případný A/B test nebo SEO strukturovaná data. */
export const ROI_CALCULATOR_CHANNELS = CHANNELS;
