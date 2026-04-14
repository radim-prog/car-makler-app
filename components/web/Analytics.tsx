"use client";

import Script from "next/script";
import { useCookieConsent } from "@/lib/hooks/useCookieConsent";

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const consent = useCookieConsent();

  if (!domain) return null;
  if (!consent?.analytics) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
