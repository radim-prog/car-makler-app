import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LockIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Uzavřený přístup | CarMakléř",
  robots: {
    index: false,
    follow: false,
  },
};

type GatePageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

function normalizeNext(next?: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export default async function GatePage({ searchParams }: GatePageProps) {
  const params = await searchParams;
  const nextPath = normalizeNext(params.next);
  const hasError = params.error === "1";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
          <LockIcon className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">
          Web je dočasně uzamčený
        </h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          Zadejte přístupové heslo pro interní kontrolu a úpravy před veřejným spuštěním.
        </p>

        {hasError && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Heslo nesedí. Zkontrolujte ho a zkuste to znovu.
          </p>
        )}

        <form action="/api/site-access" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              Přístupové heslo
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Odemknout web
          </Button>
        </form>

        <div className="mt-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-orange-600 no-underline">
            Zpět na úvod
          </Link>
        </div>
      </Card>
    </main>
  );
}
