# Brand Assets - CAR makléř

**Status:** 🚧 Připraveno (zatím prázdná složka)

## O této složce

Centrální místo pro všechny brand assety CAR makléř - loga, ikony, fotky, illustrations, atd.

## Struktura (plánovaná)

```
/assets
  /logo
    /primary
      car-makler-logo.svg         ← Main logo (color)
      car-makler-logo.png         ← Raster version (high-res)
      car-makler-logo-white.svg   ← Logo for dark backgrounds
    /favicon
      favicon.ico
      favicon-16x16.png
      favicon-32x32.png
      apple-touch-icon.png
    /wordmark
      car-makler-wordmark.svg     ← Text only (no icon)

  /icons
    /ui-icons
      checkmark.svg
      arrow-right.svg
      phone.svg
      email.svg
    /feature-icons
      fast-sale.svg               ← 17 dní guarantee icon
      money-back.svg              ← 100% zpět icon
      premium-service.svg

  /photos
    /hero
      hero-car-1.jpg              ← Main hero image (BMW/Audi/Mercedes)
      hero-car-2.jpg
    /testimonials
      client-1.jpg                ← Client photo (with consent)
      client-2.jpg
      makler-1.jpg                ← Makléř photo
    /process
      step-1-evaluation.jpg       ← Process visualization
      step-2-photography.jpg
      step-3-listing.jpg
      step-4-negotiation.jpg
      step-5-sale.jpg

  /illustrations
    /how-it-works
      illustration-1.svg          ← Custom illustrations (optional)
    /empty-states
      no-leads.svg
      no-sales.svg

  /social
    og-image.png                  ← Open Graph (1200x630)
    twitter-card.png              ← Twitter Card (1200x675)
    linkedin-banner.png           ← LinkedIn (1584x396)

  /exports
    brand-kit.zip                 ← Complete brand kit download
    style-guide.pdf               ← Visual style guide PDF
```

## Brand Guidelines

**Pro detailní brand guidelines viz:**
- `../docs/BRANDING-GUIDELINES.md` - Kompletní branding manual

### Quick Reference:

**Primární barvy:**
- Zelenomodrá (Primary): `#16A085` / `rgb(22, 160, 133)`
- Tmavě šedá (Dark): `#2C3E50` / `rgb(44, 62, 80)`

**Sekundární barvy:**
- Světle šedá: `#ECF0F1` / `rgb(236, 240, 241)`
- Bílá: `#FFFFFF`
- Accent (zlatá): `#F39C12` / `rgb(243, 156, 18)`

**Typografie:**
- Headings: **Poppins** (Bold, 600)
- Body: **Inter** (Regular, 400)
- Buttons: **Inter** (Medium, 500)

## Image Guidelines

### Fotky aut:
- **Rozlišení:** Min 1920x1080px (FullHD)
- **Formát:** JPG (80% quality) pro web
- **Aspect ratio:** 16:9 (hero), 4:3 (gallery)
- **Style:** Profesionální fotodokumentace (light, clean background)
- **Focus:** Prémiové vozy (BMW, Audi, Mercedes, Porsche)

### Loga:
- **Formát:** SVG (vector) primary, PNG (fallback)
- **Minimum size:** 120px width (logo musí být čitelné)
- **Clear space:** Min 20px padding okolo loga
- **Backgrounds:** Logo funguje na bílé i tmavé (#2C3E50)

### Ikony:
- **Style:** Line icons (ne filled)
- **Stroke width:** 2px
- **Size:** 24x24px (base size)
- **Color:** Inherit from parent (použij `currentColor` v SVG)

## Usage Rights

**DŮLEŽITÉ - Copyright & Licensing:**

### Fotky aut:
- ✅ **Vlastní fotky** (pořízené námi nebo makléři) - plná práva
- ✅ **Stock photos** (Unsplash, Pexels) - free commercial use
- ❌ **Google Images** - NEPOUŽÍVAT bez ověření licence
- ❌ **Manufacturer photos** (BMW.com atd.) - vyžaduje svolení

### Logo & brand assets:
- Všechny brand assety jsou vlastnictvím CAR makléř
- Zakázáno používat bez svolení

### Recommended Stock Photo Sites:
- [Unsplash](https://unsplash.com) - Free commercial use
- [Pexels](https://pexels.com) - Free commercial use
- [Pixabay](https://pixabay.com) - Free commercial use

**Search terms:**
- "luxury car"
- "BMW car"
- "car salesman"
- "car keys"
- "car dealership"

## Next.js Image Optimization

**Jak používat obrázky v Next.js:**

```typescript
import Image from 'next/image'

// Statické obrázky (z /public nebo /assets)
<Image
  src="/assets/photos/hero/hero-car-1.jpg"
  alt="BMW X5 - prémiové auto na prodej"
  width={1920}
  height={1080}
  priority  // Pro hero images (above the fold)
/>

// External images (z URL)
<Image
  src="https://example.com/car.jpg"
  alt="Mercedes GLE"
  width={1920}
  height={1080}
  unoptimized  // Pokud external domain není v next.config.js
/>
```

**next.config.js setup:**
```javascript
module.exports = {
  images: {
    domains: ['unsplash.com', 'pexels.com'],  // Allowed external domains
    formats: ['image/avif', 'image/webp'],    // Modern formats
  },
}
```

## File Naming Convention

**Doporučené pojmenování souborů:**
- Lowercase only: `hero-car-1.jpg` (ne `HeroCar1.jpg`)
- Dashes for spaces: `car-makler-logo.svg` (ne `car_makler_logo.svg`)
- Descriptive names: `testimonial-jan-novak.jpg` (ne `img001.jpg`)

**Bad examples:**
- ❌ `IMG_1234.jpg` (nondescriptive)
- ❌ `HeroCarImage.PNG` (mixed case)
- ❌ `car makler logo.svg` (spaces)

**Good examples:**
- ✅ `hero-bmw-x5.jpg`
- ✅ `icon-money-back-guarantee.svg`
- ✅ `makler-portrait-petr-dvorak.jpg`

---

## 🤖 PRO AI ASISTENTY

### Před prací s assety MUSÍŠ vědět:

1. **Přečti:** `../docs/BRANDING-GUIDELINES.md` - Brand identity (colors, fonts, tone)
2. **Přečti:** `../AI-CONTEXT.md` - Business kontext (co je CAR makléř)

### Co musíš vědět:

- **Toto je brand asset library**, ne random složka s obrázky
- **Konzistence je klíč** - všechny assety musí mít stejný visual style
- **Performance matters** - optimalizuj obrázky (WebP, AVIF) pro web
- **Copyright is serious** - nikdy nepoužívej obrázky bez ověření licence

### Když uživatel řekne "přidej fotku auta":

**✅ SPRÁVNĚ - Zeptej se:**
- "Máme použít stock photo (Unsplash/Pexels) nebo vlastní fotku?"
- "Jaký typ auta? (BMW, Audi, Mercedes?)"
- "Kam půjde fotka? (Hero, gallery, testimonial?)"
- "Chceš preview options než to přidám?"

**❌ ŠPATNĚ - Nedělej:**
- Google Images search a nahrát první fotku (copyright issue!)
- Přidat low-res obrázek (min 1920x1080 pro hero)
- Ignorovat brand style (fotky musí být light, clean, premium look)
- Upload without optimization (min 80% JPG compression)

### Když uživatel řekne "vytvořit logo":

**⚠️ POZOR - Logo design je komplexní:**

Jako AI asistent můžeš:
- ✅ Navrhnout text-based logo (CSS/SVG)
- ✅ Použít existující fonts (Poppins, Inter)
- ✅ Vytvořit simple wordmark

Nemůžeš (vyžaduje graphic designer):
- ❌ Kompletní brand identity s custom iconem
- ❌ Komplexní ilustrace a ikony
- ❌ Print-ready files (CMYK, Pantone)

**Doporučení:** Pro profesionální logo najměte designéra (Fiverr, 99designs)

### File Organization Tips:

**Když přidáváš nový asset:**
1. Zkontroluj licensing (commercial use OK?)
2. Optimalizuj (compress, resize, convert to WebP)
3. Přidej do správné subfolder (`/photos/hero`, ne jen `/photos`)
4. Použij správné naming convention
5. Update tento README (přidej do struktury výše)

### Image Optimization Commands:

```bash
# Install ImageMagick (pokud ještě nemáš)
brew install imagemagick

# Convert to WebP (80% quality)
convert hero-car-1.jpg -quality 80 hero-car-1.webp

# Resize to specific width (zachová aspect ratio)
convert original.jpg -resize 1920x original-1920.jpg

# Batch convert všechny JPG to WebP
for file in *.jpg; do
  convert "$file" -quality 80 "${file%.jpg}.webp"
done
```

### Common Issues & Solutions:

**Issue:** "Obrázek je příliš velký (slow loading)"
- **Fix:** Compress JPG na 80% quality, nebo convert to WebP

**Issue:** "Next.js nepodporuje external image domain"
- **Fix:** Přidej domain do `next.config.js` → `images.domains`

**Issue:** "Logo vypadá rozmazaně na Retina displays"
- **Fix:** Použij SVG (vector) místo PNG, nebo 2x PNG size

**Issue:** "Ikony nejsou konzistentní (různé styles)"
- **Fix:** Použij icon library (Heroicons, Lucide) nebo vytvoř vlastní s jednotným stylem

### Placeholder Images (development):

**Než máme finální fotky, použij:**
- [Unsplash Source API](https://source.unsplash.com/1920x1080/?luxury-car)
- [Placehold.co](https://placehold.co/1920x1080/16A085/FFFFFF/png?text=Hero+Image)

```typescript
// Temporary placeholder v developmentu
<Image
  src="https://source.unsplash.com/1920x1080/?bmw,car"
  alt="Placeholder - BMW car"
  width={1920}
  height={1080}
/>
```

### Brand Asset Checklist:

Před launchem zkontroluj že máme:
- [ ] Logo SVG (color + white version)
- [ ] Favicon (všechny sizes)
- [ ] Hero image (min 1x, ideálně 3x varianty)
- [ ] OG image (1200x630 for social sharing)
- [ ] Feature icons (min 3-5 main features)
- [ ] Testimonial photos (min 3 clients)
- [ ] Process step images (5 steps)

---

## Learn More

- **Next.js Image Component:** https://nextjs.org/docs/app/api-reference/components/image
- **Image Optimization:** https://web.dev/fast/#optimize-your-images
- **Unsplash Guidelines:** https://unsplash.com/license
- **WebP Format:** https://developers.google.com/speed/webp
