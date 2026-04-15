import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prezentace | CarMakléř — Partnersky program",
  description:
    "Stante se partnerem CarMakléř. Nabizime spolupraci pro autobazary a vrakoviste.",
};

export default function PrezentaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
