import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let _stripe: Stripe | null = null;

/**
 * FIX-047b — typed error pro chybějící Stripe konfiguraci. Umožňuje
 * volajícím rozlišit "Stripe není nakonfigurován" (503) od skutečných
 * Stripe API chyb (502/500).
 */
export class StripeNotConfiguredError extends Error {
  constructor() {
    super("STRIPE_SECRET_KEY není nastaven");
    this.name = "StripeNotConfiguredError";
  }
}

/**
 * Early guard — true pokud je STRIPE_SECRET_KEY nastaven (nenulový string).
 * Používej před voláním `getStripe()` abys mohl vrátit čitelnou 503 místo
 * generické 500 chyby z nekompletního deploymentu.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Route-level guard — vrací NextResponse s 503 pokud Stripe není configured,
 * jinak null. Callers:
 *   const guard = requireStripeConfigured();
 *   if (guard) return guard;
 *   const stripe = getStripe();
 */
export function requireStripeConfigured(): NextResponse | null {
  if (!isStripeConfigured()) {
    console.warn("[Stripe:NOT_CONFIGURED] STRIPE_SECRET_KEY chybí — vracím 503");
    return NextResponse.json(
      {
        error: "Platební služba momentálně není dostupná. Zkuste to prosím později.",
        code: "STRIPE_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }
  return null;
}

/**
 * Lazy Stripe instance — inicializuje se až při prvním volání,
 * aby nedošlo k chybě při buildu bez env proměnných.
 * Hází `StripeNotConfiguredError` pokud klíč chybí — preferuj
 * `requireStripeConfigured()` na začátku route handleru.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new StripeNotConfiguredError();
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// CarMakléř bankovní údaje pro převody — nastavte v .env
export const CARMAKLER_BANK = {
  accountNumber: process.env.CARMAKLER_BANK_ACCOUNT || "",
  iban: process.env.CARMAKLER_IBAN || "",
  bic: process.env.CARMAKLER_BIC || "KOMBCZPP",
  bankName: process.env.CARMAKLER_BANK_NAME || "Komerční banka",
  accountHolder: "CarMakléř s.r.o.",
};

// Provize CarMakléř
export const COMMISSION_CONFIG = {
  rate: 0.05, // 5%
  minimumCzk: 25000, // Minimální provize 25 000 Kč
  brokerShareRate: 0.5, // 50% provize jde makléři
  managerBonusCzk: 2500, // Manažerský bonus 2 500 Kč
};

/**
 * Vypočítá provizi a její rozdělení
 */
export function calculateCommission(salePrice: number) {
  const rawCommission = Math.round(salePrice * COMMISSION_CONFIG.rate);
  const commission = Math.max(rawCommission, COMMISSION_CONFIG.minimumCzk);
  const brokerShare = Math.round(commission * COMMISSION_CONFIG.brokerShareRate);
  const managerBonus = COMMISSION_CONFIG.managerBonusCzk;
  const companyShare = commission - brokerShare - managerBonus;

  return {
    commission,
    brokerShare,
    companyShare,
    managerBonus,
    sellerPayout: salePrice - commission,
  };
}

/**
 * Generuje variabilní symbol z ID vozidla (8 čísel)
 */
export function generateVariableSymbol(vehicleId: string): string {
  let hash = 0;
  for (let i = 0; i < vehicleId.length; i++) {
    const char = vehicleId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString().slice(0, 8).padStart(8, "0");
}

/**
 * Vytvoří SellerPayout a Commission záznamy po potvrzení platby.
 * Sdílená logika pro webhook i manuální potvrzení převodu.
 */
export async function createPayoutRecords(
  paymentId: string,
  vehicleId: string,
  amount: number
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      broker: { select: { id: true, managerId: true } },
      contracts: {
        where: { type: "BROKERAGE" },
        select: { sellerName: true, sellerBankAccount: true },
        take: 1,
      },
    },
  });

  if (!vehicle) return;

  const { commission, brokerShare, companyShare, managerBonus, sellerPayout } =
    calculateCommission(amount);

  // Aktualizovat / vytvořit Commission záznam
  const existingCommission = await prisma.commission.findFirst({
    where: { vehicleId, brokerId: vehicle.brokerId || "" },
  });

  if (existingCommission) {
    await prisma.commission.update({
      where: { id: existingCommission.id },
      data: {
        salePrice: amount,
        commission,
        brokerShare,
        companyShare,
        managerBonus,
        status: "APPROVED",
      },
    });
  } else if (vehicle.brokerId) {
    await prisma.commission.create({
      data: {
        brokerId: vehicle.brokerId,
        vehicleId,
        salePrice: amount,
        commission,
        rate: commission / amount,
        brokerShare,
        companyShare,
        managerBonus,
        status: "APPROVED",
        soldAt: new Date(),
      },
    });
  }

  // Vytvořit SellerPayout
  const contract = vehicle.contracts[0];
  await prisma.sellerPayout.create({
    data: {
      vehicleId,
      paymentId,
      sellerName: contract?.sellerName || vehicle.sellerName || "Neznámý",
      sellerBankAccount: contract?.sellerBankAccount || "",
      amount: sellerPayout,
      commissionAmount: commission,
      status: "PENDING",
    },
  });
}
