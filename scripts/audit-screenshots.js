#!/usr/bin/env node
/**
 * Design audit screenshot capture script
 * Captures full-page screenshots (desktop + mobile) and body text for each URL
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../.claude-context/design/screenshots');
const TIMEOUT = 20000;

const URLS = [
  { url: 'https://car.zajcon.cz/', slug: 'homepage' },
  { url: 'https://car.zajcon.cz/nabidka', slug: 'nabidka' },
  { url: 'https://car.zajcon.cz/dily', slug: 'dily' },
  { url: 'https://car.zajcon.cz/jak-to-funguje', slug: 'jak-to-funguje' },
  { url: 'https://car.zajcon.cz/makleri', slug: 'makleri' },
  { url: 'https://car.zajcon.cz/o-nas', slug: 'o-nas' },
  { url: 'https://car.zajcon.cz/kontakt', slug: 'kontakt' },
  { url: 'https://car.zajcon.cz/chci-prodat', slug: 'chci-prodat' },
  { url: 'https://car.zajcon.cz/kolik-stoji-moje-auto', slug: 'kolik-stoji-moje-auto' },
  { url: 'https://car.zajcon.cz/sluzby', slug: 'sluzby' },
  { url: 'https://inzerce.car.zajcon.cz/', slug: 'inzerce' },
  { url: 'https://shop.car.zajcon.cz/', slug: 'shop' },
  { url: 'https://marketplace.car.zajcon.cz/', slug: 'marketplace' },
];

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 375, height: 812 };

async function capturePage(browser, url, slug, viewport, label) {
  const context = await browser.newContext({
    viewport,
    userAgent: label === 'mobile'
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT);

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
    const status = response ? response.status() : 'no response';
    const finalUrl = page.url();

    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${slug}-${label}.png`),
      fullPage: true,
    });

    return { ok: true, status, finalUrl };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await context.close();
  }
}

async function extractText(browser, url, slug) {
  const context = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
    const text = await page.evaluate(() => document.body.innerText);
    const cleaned = text.replace(/\n{3,}/g, '\n\n').trim();
    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.txt`), cleaned, 'utf8');
    return { ok: true, chars: cleaned.length };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await context.close();
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Capturing ${URLS.length} URLs...\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const { url, slug } of URLS) {
    process.stdout.write(`[${slug}] desktop... `);
    const desktop = await capturePage(browser, url, slug, DESKTOP_VIEWPORT, 'desktop');
    console.log(desktop.ok ? `OK (${desktop.status}, ${desktop.finalUrl})` : `FAIL: ${desktop.error}`);

    process.stdout.write(`[${slug}] mobile...  `);
    const mobile = await capturePage(browser, url, slug, MOBILE_VIEWPORT, 'mobile');
    console.log(mobile.ok ? `OK` : `FAIL: ${mobile.error}`);

    process.stdout.write(`[${slug}] text...    `);
    const text = await extractText(browser, url, slug);
    console.log(text.ok ? `OK (${text.chars} chars)` : `FAIL: ${text.error}`);

    results.push({ slug, url, desktop, mobile, text });
    console.log();
  }

  await browser.close();

  // Summary
  const ok = results.filter(r => r.desktop.ok && r.mobile.ok).length;
  const fail = results.length - ok;
  console.log('=== SUMMARY ===');
  console.log(`Total: ${results.length} URLs`);
  console.log(`Success (both viewports): ${ok}`);
  console.log(`Failed: ${fail}`);
  results.filter(r => !r.desktop.ok || !r.mobile.ok).forEach(r => {
    console.log(`  FAIL [${r.slug}]: desktop=${r.desktop.ok ? 'ok' : r.desktop.error} | mobile=${r.mobile.ok ? 'ok' : r.mobile.error}`);
  });
  console.log(`\nFiles written to: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
