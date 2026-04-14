import type { Metadata } from "next";
import Link from "next/link";
import { confirmListingByToken } from "@/lib/listing-confirm";

export const metadata: Metadata = {
  title: "Potvrzení inzerátu",
  robots: { index: false, follow: false },
};

export default async function ConfirmListingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await confirmListingByToken(token);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Potvrzení selhalo</h1>
          <p className="text-gray-600 mb-6">{result.error}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/inzerce/pridat"
              className="inline-flex items-center justify-center font-semibold rounded-full py-3 px-6 text-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange hover:-translate-y-0.5 hover:shadow-orange-hover transition-all no-underline"
            >
              Vytvořit inzerát znovu
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center font-semibold rounded-full py-3 px-6 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors no-underline"
            >
              Kontaktovat podporu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Inzerát zveřejněn</h1>
        <p className="text-gray-600 mb-2">
          E-mail <strong>{result.email}</strong> jsme ověřili.
        </p>
        <p className="text-gray-600 mb-6">
          {result.activatedListings === 1
            ? "Tvůj inzerát je teď živý a viditelný kupujícím."
            : `Aktivovali jsme ${result.activatedListings} inzerátů. Všechny jsou teď živé.`}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/moje-inzeraty"
            className="inline-flex items-center justify-center font-semibold rounded-full py-3 px-6 text-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange hover:-translate-y-0.5 hover:shadow-orange-hover transition-all no-underline"
          >
            Spravovat moje inzeráty
          </Link>
          <Link
            href="/zapomenute-heslo"
            className="inline-flex items-center justify-center font-semibold rounded-full py-3 px-6 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors no-underline"
          >
            Nastavit heslo k účtu
          </Link>
        </div>
      </div>
    </div>
  );
}
