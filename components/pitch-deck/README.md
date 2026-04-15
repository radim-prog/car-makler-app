# B2B Pitch Deck — Designer handoff

**Autor:** Designer lane (AUDIT-028d implementace, 2026-04-15)
**Pro:** Implementátor (AUDIT-029 Fáze 1 — Puppeteer render pipeline)
**Status:** Ready for integration

---

## Co je hotové (Designer)

- `PitchDeckTemplate.tsx` — React server component renderující 10 slide-ů A4 landscape
- `pitchDeckStyles.ts` — scoped CSS (`.deck-scope`) s FIX-022 editorial tokens
- Inline Lucide SVG ikony (žádná runtime závislost)
- SVG ekosystém diagram na slide 6
- Disclaimery na slide 7 (Pavel modelový) a 8 (ROI)
- Props interface pro personalizaci (firma, kontakt, datum, obchodní zástupce, QR)

## Co zbývá (Implementátor — AUDIT-029 Fáze 1)

### 1. API route `/api/pitch-deck/generate`

```ts
// app/api/pitch-deck/generate/route.ts
import { NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer";
import { PitchDeckTemplate } from "@/components/pitch-deck/PitchDeckTemplate";
import { z } from "zod";

const schema = z.object({
  companyName: z.string().min(1).max(120),
  contactPerson: z.string().min(1).max(120),
  presentedDate: z.string().regex(/^\d{1,2}\.\d{1,2}\.\d{4}$/),
  salesRepName: z.string().max(80).optional(),
  salesRepEmail: z.string().email().optional(),
  salesRepPhone: z.string().max(40).optional(),
  bookingUrl: z.string().url().optional(),
  qrCodeUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<PitchDeckTemplate {...body} />);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="carmakler-${slugify(body.companyName)}.pdf"`,
    },
  });
}
```

### 2. Preview route (admin only) `/admin/pitch-deck/preview`

Server component renderuje `<PitchDeckTemplate />` přímo v prohlížeči pro QA/design review. Query parametry nastaví props.

### 3. Download generické verze `/pro-bazary/deck.pdf`

Cron (nebo on-demand) předgeneruje `public/pitch-deck/carmakler-b2b-pitch-v1.pdf` bez personalizace (default props). Odkaz na `/pro-bazary` CTA `"Stáhnout PDF přehled"`.

### 4. Resend integrace (distribution workflow slide AUDIT-028d sekce 5)

Template `b2b-deck-delivery` v Resend. Admin trigger → API route vygeneruje PDF → Resend `send` s PDF přílohou + tracking webhookem.

---

## Závislosti k instalaci

```bash
npm install puppeteer
# nebo (lehčí varianta pro Vercel):
npm install puppeteer-core @sparticuz/chromium
```

Pro Vercel deployment použít `@sparticuz/chromium` — standardní Puppeteer binárka je moc velká pro serverless function limits.

## Font embedding

`<link>` na Google Fonts je v `<head>` komponenty — Puppeteer s `waitUntil: "networkidle0"` počká na načtení. Pro air-gapped produkci (pokud by tam byla) by bylo nutné fonty bundlovat lokálně přes `@fontsource/fraunces` + `@fontsource/outfit` + `@fontsource/jetbrains-mono` a inline-ovat je do `<style>`.

## QR kód

Implementátor vygeneruje QR kód (např. `qrcode` npm balíček) z `bookingUrl` a předá jako `qrCodeUrl` (base64 data URI nebo stažený public URL).

## Verifikace

1. POST na `/api/pitch-deck/generate` s test JSON → stažený PDF otevřít v Preview.app / Adobe Reader
2. Všech 10 slide-ů renderováno, žádný ořez textu
3. Fonts načtené (Fraunces serif na headlines, Outfit sans na body, JetBrains Mono na číslech)
4. Disclaimery čitelné (slide 7, slide 8)
5. Velikost souboru pod 2 MB
6. QR kód čitelný kamerou (pokud je generován)

## FIX-LOG reference

F-047 FIX-023: B2B pitch deck HTML/CSS template (Designer, 2026-04-15)
