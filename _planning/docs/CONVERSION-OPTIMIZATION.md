# CONVERSION OPTIMIZATION - carmakler.cz

**Datum:** 12. října 2025
**Zpracoval:** CRO (Conversion Rate Optimization) Specialista
**Cíl:** Zvýšit conversion rate z 2-3% na 8-12% během 90 dní

---

## 🎯 CRO PHILOSOPHY

> "Dobrý web přináší traffic. Skvělý web traffic KONVERTUJE."

**Conversion Optimization není o:**
- ❌ Levných tricích ("Koupit TEĎ nebo NIKDY!")
- ❌ Dark patterns (záměrně matoucí UX)
- ❌ Manipulaci

**Conversion Optimization JE o:**
- ✅ Odstranění friction pointů
- ✅ Budování důvěry rychleji
- ✅ Jasnosti (user ví co dělat)
- ✅ Relevanci (správná nabídka správnému člověku)

---

## 📊 CURRENT STATE BASELINE

### Assumed Current Metrics

| Metric | Current | Target (90 days) | Method |
|--------|---------|------------------|---------|
| Bounce Rate | 55% | <40% | Better above-fold |
| Avg. Time on Page | 1:45 | >3:00 | Engaging content |
| Form Start Rate | 12% | >25% | Better CTA |
| Form Completion Rate | 35% | >60% | Reduce fields |
| Overall Conversion Rate | 2.5% | 8-10% | All tactics |
| Phone Clicks (mobile) | 4% | >10% | Sticky CTA |

**Note:** Implement Google Analytics + Hotjar ASAP for actual data.

---

## 🔍 CONVERSION FUNNEL ANALYSIS

### The Journey

```
100 Visitors
    ↓ (-55% bounce)
 45 Scroll past hero
    ↓ (-50% drop-off)
 22 Scroll to form
    ↓ (-75% don't start)
  5 Start form
    ↓ (-40% abandon)
  3 Complete form

= 3% conversion rate
```

**Our job:** Plug the leaks at each stage.

---

## 🚀 PRIORITY OPTIMIZATIONS (ROI-ranked)

### 🥇 PRIORITY 1: Above-the-Fold Optimization

**Impact:** HIGH | **Effort:** LOW | **ROI:** 🔥🔥🔥

#### Current Issues:
- Headline může být silnější
- Žádný trust signal above fold
- CTA button může být výraznější

#### Fixes:

**1.1: Headline A/B Test**

**Variant A (Current):**
```
Prodáme vaše auto rychle a za férovou cenu
```

**Variant B (Outcome-focused):**
```
Prodáme Vaše Auto Za 17 Dní. Vy Jen Podepíšete a Vyberete Peníze.
```

**Variant C (Problem-aware):**
```
Nechcete Se Hádat S Kupci o Cenu? My To Vyřešíme Za Vás.
```

**Expected lift:** 15-25% improvement in scroll depth

**1.2: Add Trust Signals Above Fold**

**Before (missing):**
No trust signals visible without scroll

**After (add these):**
```html
<div class="trust-bar">
  ⭐⭐⭐⭐⭐ 4.8/5 (150+ recenzí)  |
  🚗 Prodáno 150+ aut  |
  ⏱️ Průměr 17 dní
</div>
```

Place immediately under hero image/CTA.

**Expected lift:** 10-15% reduction in bounce rate

**1.3: Enhance Primary CTA Button**

**Current:**
```html
<button>Chci prodat auto</button>
```

**Problems:**
- Generic text
- No benefit stated
- No indication of commitment level

**Optimized:**
```html
<button class="cta-primary pulse-animation">
  Zjistit Cenu Za 30 Sekund
  <span class="cta-sub">Nezávazně • Zdarma</span>
</button>
```

**CSS enhancement:**
```css
.cta-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  transition: all 0.3s ease;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 107, 53, 0.6);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4); }
  50% { box-shadow: 0 8px 32px rgba(255, 107, 53, 0.7); }
}
```

**Expected lift:** 20-30% improvement in CTR

---

### 🥈 PRIORITY 2: Form Optimization

**Impact:** HIGH | **Effort:** MEDIUM | **ROI:** 🔥🔥

#### Current Issues:
- Pravděpodobně moc polí
- Žádný progress indicator
- Chybí assurance copy

#### Fixes:

**2.1: Reduce Form Fields**

**Current (assumed):**
- Značka
- Model
- Rok
- Nájezd
- Jméno
- Telefon
- Email
- Poznámka

**Optimized (Multi-step form):**

**Step 1: Auto Info (3 fields)**
```
Značka: [BMW ▼]
Model: [X5 ▼]
Rok: [2019 ▼]

[Pokračovat →]
```

**Step 2: Kontakt (2 fields)**
```
Telefon: [+420 ___ ___ ___]
(Na tento telefon vám zavoláme do 1 hodiny)

Email: [___@___.cz]
(Jen pro potvrzení, ne spam)

[Získat Odhad →]
```

**Why it works:**
- Lower initial commitment
- Progressive disclosure
- Each step feels easy

**Expected lift:** 40-60% improvement in form completion

**2.2: Add Progress Indicator**

```html
<div class="progress-bar">
  <div class="step active">
    <span class="step-number">1</span>
    Auto
  </div>
  <div class="step">
    <span class="step-number">2</span>
    Kontakt
  </div>
</div>
```

**Psychological benefit:** User sees finish line, more likely to complete.

**2.3: Add Assurance Microcopy**

Under each field:
```
Telefon: [___]
↳ Zavoláme do 1 hodiny, ne za 3 dny

Email: [___]
↳ Používáme jen pro potvrzení. Žádný spam, slibujeme.
```

Under submit button:
```
✓ Nezávazné  ✓ Zdarma  ✓ Bez otravování
```

**Expected lift:** 15-20% reduction in form abandonment

---

### 🥉 PRIORITY 3: Mobile Experience

**Impact:** HIGH | **Effort:** MEDIUM | **ROI:** 🔥🔥

**Context:** 60-70% traffic je mobile. Musí být perfektní.

#### Current Issues:
- CTA může být obtížně dostupný (scroll up)
- Telefon číslo není click-to-call
- Formulář může být těžkopádný na mobilu

#### Fixes:

**3.1: Sticky Mobile CTA**

```html
<!-- Sticky bar at bottom on mobile -->
<div class="mobile-cta-sticky">
  <button onclick="openQuickForm()">
    📞 Zavolat Teď: 773 838 773
  </button>
</div>

<style>
@media (max-width: 768px) {
  .mobile-cta-sticky {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #FF6B35, #FF8F6B);
    padding: 12px;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
  }

  .mobile-cta-sticky button {
    width: 100%;
    height: 56px;
    font-size: 18px;
    font-weight: 600;
    background: white;
    color: #FF6B35;
    border: none;
    border-radius: 12px;
  }
}
</style>
```

**Expected lift:** 50-80% increase in mobile phone clicks

**3.2: Click-to-Call Everywhere**

```html
<a href="tel:+420773838773" class="phone-link">
  +420 773 838 773
</a>
```

**All instances** of phone number should be clickable.

**3.3: Mobile-Optimized Form**

```html
<!-- Better input types -->
<input type="tel" inputmode="numeric" />  <!-- Opens number keyboard -->
<input type="email" inputmode="email" />  <!-- @ key visible -->

<!-- Larger touch targets -->
<button style="min-height: 48px">  <!-- Apple HIG guideline -->

<!-- One field per screen on mobile -->
<div class="mobile-step">
  <label>Značka auta</label>
  <select>...</select>
  <button>Pokračovat →</button>
</div>
```

**Expected lift:** 30-40% improvement in mobile form completion

---

### 🏅 PRIORITY 4: Social Proof Enhancement

**Impact:** MEDIUM | **Effort:** LOW | **ROI:** 🔥

#### Current State:
- References na konci stránky
- Statické čísla (150+, 17 dní, 94%)

#### Optimizations:

**4.1: Move Social Proof Higher**

Place testimonial carousel **immediately after hero**, not at bottom.

**Psychology:** Trust needs to be established EARLY.

**4.2: Animated Counter Numbers**

```javascript
// Count up animation for stats
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// When user scrolls to stats section
animateValue(document.getElementById('cars-sold'), 0, 150, 2000);
animateValue(document.getElementById('avg-days'), 0, 17, 1500);
```

**Why it works:** Movement = attention. Animated numbers are more engaging.

**4.3: Real-Time Activity Feed**

```html
<div class="activity-feed">
  <div class="activity-item fade-in">
    🚗 <strong>BMW X5</strong> právě bylo ohodnoceno v <strong>Praze</strong>
    <span class="time">před 4 minutami</span>
  </div>
  <div class="activity-item fade-in">
    ✅ <strong>Audi Q7</strong> prodáno za <strong>14 dní</strong>
    <span class="time">před 2 hodinami</span>
  </div>
</div>
```

**Update dynamically** (real or simulated with real data rotated).

**Expected lift:** 10-15% improvement in trust perception

---

### 🎖️ PRIORITY 5: Exit Intent Popup

**Impact:** MEDIUM | **Effort:** LOW | **ROI:** 🔥

**Trigger:** User moves mouse toward browser close button.

**Popup Content:**

```html
<div class="exit-popup">
  <div class="popup-content">
    <h2>⏱️ Počkat! Před Odchodem...</h2>

    <p class="highlight">
      Získejte <strong>ZDARMA profesionální odhad</strong>
      tržní hodnoty vašeho auta
    </p>

    <p>I když se rozhodnete prodat sami, budete vědět:</p>
    <ul>
      ✓ Přesnou tržní cenu (ne odhad z internetu)
      ✓ Co ovlivňuje hodnotu právě vašeho vozu
      ✓ Jak maximalizovat prodejní cenu
    </ul>

    <div class="mini-form">
      <select name="brand" required>
        <option>Značka</option>
        <option>BMW</option>
        <option>Audi</option>
        <option>Mercedes</option>
      </select>

      <input type="tel" placeholder="Telefon" required />

      <button>Získat Odhad Zdarma →</button>
    </div>

    <p class="assurance">
      Zavoláme do 1 hodiny • Žádné závazky • 100% zdarma
    </p>
  </div>
</div>
```

**Timing:**
- Show only once per session
- Don't show on mobile (annoying)
- Don't show if user already filled form

**Expected lift:** Capture 5-10% of otherwise lost visitors

---

## 📱 CONVERSION FUNNEL MICRO-OPTIMIZATIONS

### Optimization 6: Autofill & Smart Defaults

```html
<!-- Enable browser autofill -->
<input
  type="tel"
  name="phone"
  autocomplete="tel"
  placeholder="+420"
/>

<!-- Smart defaults based on previous selections -->
<script>
// If user selected "BMW", show popular BMW models first in dropdown
if (brand === 'BMW') {
  modelDropdown.innerHTML = `
    <option>X5</option>
    <option>X3</option>
    <option>5 Series</option>
    <option>3 Series</option>
    ...
  `;
}
</script>
```

**Expected lift:** 5-10% faster form completion = less abandonment

### Optimization 7: Real-Time Validation

```javascript
// Validate as user types, not on submit
phoneInput.addEventListener('input', (e) => {
  const phone = e.target.value;

  if (phone.length >= 9) {
    if (isValidCzechPhone(phone)) {
      showCheckmark(e.target);  // ✓ green checkmark
    } else {
      showError(e.target, "Zkontrolujte prosím číslo");
    }
  }
});
```

**Why it works:** User fixes errors immediately, not at end.

**Expected lift:** 15-20% reduction in form errors

### Optimization 8: Conditional Fields

```javascript
// Only show email field AFTER phone is valid
if (phoneIsValid) {
  emailField.style.display = 'block';
  emailField.focus();  // Auto-focus for better UX
}
```

**Progressive disclosure** = less overwhelming.

### Optimization 9: Loading State Feedback

```html
<!-- During form submit -->
<button class="submitting">
  <span class="spinner"></span>
  Připravujeme váš odhad...
</button>

<!-- After submit -->
<div class="success-message">
  🎉 Skvělé! Zavoláme vám do 60 minut.

  <p>Zatímco čekáte, přečtěte si:</p>
  <a href="/blog/5-chyb-pri-prodeji">
    5 chyb, které vás stojí 100 000 Kč →
  </a>
</div>
```

**Why it works:**
- User knows something is happening
- Reduces anxiety
- Success message = dopamine hit
- Blog link = engagement continues

---

## 🧪 A/B TESTING ROADMAP

### Test Priority Matrix

| Test | Impact | Effort | Priority | Run Time |
|------|--------|--------|----------|----------|
| Headline variants | High | Low | P0 | Week 1-2 |
| Multi-step form | High | Medium | P0 | Week 1-3 |
| CTA button text | High | Low | P0 | Week 2-3 |
| Mobile sticky CTA | High | Low | P1 | Week 3-4 |
| Social proof placement | Medium | Low | P1 | Week 4-5 |
| Exit intent popup | Medium | Low | P2 | Week 5-6 |
| Testimonial format | Medium | Medium | P2 | Week 6-8 |
| Video in hero | Medium | High | P3 | Week 8-10 |

### Test #1: Headline

**Setup:**
- Traffic split: 50/50
- Sample size needed: 1,000 visitors per variant
- Success metric: Scroll depth >50%
- Duration: 2 weeks

**Variant A (Control):**
```
Prodáme vaše auto rychle a za férovou cenu
```

**Variant B:**
```
Prodáme Vaše Auto Za 17 Dní. Vy Jen Podepíšete a Vyberete Peníze.
```

**Hypothesis:** Variant B will increase scroll depth by 20%+ due to specificity.

**Decision criteria:** If B wins with >95% confidence, implement permanently.

### Test #2: Form Structure

**Variant A (Control):** Single-step form (all fields at once)

**Variant B:** Multi-step form (2 steps)

**Success metric:** Form completion rate

**Expected result:** Multi-step will improve completion by 40-60%

### Test #3: CTA Button Copy

**Variant A:** "Chci prodat auto"
**Variant B:** "Zjistit Cenu Za 30 Sekund"
**Variant C:** "Získat Nezávazný Odhad"

**Success metric:** Click-through rate

**Run:** Sequential (A vs B, winner vs C)

---

## 🔥 HEATMAP & SESSION RECORDING ANALYSIS

### Tools to Implement

**1. Hotjar**
- Heatmaps (where users click)
- Scroll maps (how far they scroll)
- Session recordings (watch actual users)
- Conversion funnels

**2. Microsoft Clarity** (Free alternative)
- Same features as Hotjar
- No visitor limit
- AI-powered insights

### What to Look For

**Rage clicks:**
- User clicks same spot repeatedly = something's broken
- Common on non-clickable elements that LOOK clickable

**Dead clicks:**
- Clicks that lead nowhere
- Indicates user expectation mismatch

**Scroll depth drop-offs:**
- Where do 50% of users stop scrolling?
- Content after that point is invisible → move up or cut

**Form field drop-offs:**
- Which form field causes most abandonment?
- That field is either too personal, too hard, or not clear

---

## 💰 VALUE PROPOSITION OPTIMIZATION

### Current Value Prop Analysis

**Stated benefits:**
- Rychlý prodej (17 dní)
- Férová cena
- Žádné starosti

**Missing:**
- Quantified savings (kolik ušetříte vs. alternativy)
- Risk reversal (what if it doesn't work?)
- Emotional benefits (klid, čas s rodinou)

### Enhanced Value Prop

**Add "Value Calculator" Section:**

```html
<div class="value-calc-teaser">
  <h3>Kolik Vám Ušetří Automobilový Makléř?</h3>

  <div class="calc-result">
    <div class="savings-item">
      <span class="amount">+50 000 Kč</span>
      <span class="label">Lepší cena než autobazar</span>
    </div>

    <div class="savings-item">
      <span class="amount">+23 500 Kč</span>
      <span class="label">Váš čas (47 hodin × 500 Kč)</span>
    </div>

    <div class="savings-item">
      <span class="amount">-7 500 Kč</span>
      <span class="label">Provize makléře</span>
    </div>

    <div class="total">
      <span class="amount-big">= +66 000 Kč</span>
      <span class="label">Celková úspora</span>
    </div>
  </div>

  <button>Spočítat Pro Moje Auto →</button>
</div>
```

**Why it works:**
- Konkretizuje abstraktní benefit
- Shows ROI clearly
- CTA je logický next step

---

## 🎯 PERSONALIZATION STRATEGIES

### Segmentation by Traffic Source

**Google Search (high intent):**
- Show aggressive CTA immediately
- Shorter copy (they already know what they want)
- Price transparency upfront

**Facebook/Instagram (discovery):**
- More education needed
- Testimonials higher up
- Video content

**Email (warm traffic):**
- Personalized greeting (Ahoj [Jméno])
- Reference previous interaction
- Lower friction CTA (just phone call)

### Dynamic Content by Device

**Desktop:**
- Full comparison tables
- Longer form content
- Multiple CTAs (phone + form)

**Mobile:**
- Prioritize phone CTA
- Shorter paragraphs
- Fewer images (page speed)

### Geo-Targeting

**Praha visitors:**
```
📍 Působíme v celé Praze a okolí
Osobní schůzka kdekoliv vám vyhovuje
```

**Brno visitors:**
```
📍 Nově i v Brně!
Už máme 5 úspěšných prodejů za 2 měsíce
```

**Other regions:**
```
📍 Zatím nepůsobíme ve vašem kraji
Ale můžeme pomoct na dálku (online odhad, konzultace)
→ Kontakt
```

---

## 📊 CONVERSION TRACKING SETUP

### Google Analytics 4 Events

**Must-track events:**

```javascript
// CTA button clicks
gtag('event', 'cta_click', {
  'button_location': 'hero',
  'button_text': 'Zjistit cenu'
});

// Form starts
gtag('event', 'form_start', {
  'form_name': 'lead_form'
});

// Form completions
gtag('event', 'form_submit', {
  'form_name': 'lead_form',
  'car_brand': formData.brand
});

// Phone clicks
gtag('event', 'phone_click', {
  'device_type': isMobile ? 'mobile' : 'desktop'
});

// Scroll depth
gtag('event', 'scroll', {
  'percent_scrolled': 75
});

// Video plays
gtag('event', 'video_play', {
  'video_title': 'Jak funguje prodej'
});
```

### Conversion Goals

**Primary Goal:** Lead submission (form or phone)

**Secondary Goals:**
- Email signup (newsletter)
- Video watch >50%
- Blog article read (>2 min)
- Calculator used

### Attribution Model

Track **multi-touch attribution:**

```
User Journey Example:
1. Google Search → Blog article
2. Exit
3. Facebook ad → Homepage
4. Exit (cookie dropped)
5. Email click → Homepage
6. Fills form ✅

Attribution:
- First touch: Google (awareness)
- Last touch: Email (conversion)
- Assisted: Facebook (consideration)
```

**Use this data** to optimize marketing spend.

---

## 🚨 COMMON CONVERSION KILLERS (Avoid These!)

### ❌ Killer #1: Too Many Choices

**Bad:**
```
Máme 3 balíčky:
- Basic (7.5k)
- Premium (12k)
- Enterprise (custom)

Vyberte si →
```

**Why it kills conversion:** Paradox of choice. User paralyzed.

**Good:**
```
Provize: 7 500 Kč za prodej auta
(+ volitelné doplňkové služby)

→ Zjistit více
```

One clear option. Upsell later.

### ❌ Killer #2: Asking for Too Much Info

**Bad:**
```
Vyplňte:
- Značka, Model, Rok, Nájezd, Barva, VIN,
- Servisní historie (ano/ne)
- Počet majitelů
- Jméno, Příjmení, Email, Telefon, Adresa
```

**Why it kills:** User thinks "to je moc práce" and leaves.

**Good:**
```
3 základní info:
- Značka [BMW ▼]
- Model [X5 ▼]
- Rok [2019 ▼]

Telefon: [___]

→ Získat odhad
```

Get rest during phone call.

### ❌ Killer #3: Slow Load Time

**Bad:** Page loads in 5+ seconds

**Impact:**
- 1-3s load time: OK
- 3-5s: -20% conversions
- 5s+: -50% conversions

**Fix:**
- Image optimization (WebP, lazy load)
- Minify JS/CSS
- Use CDN
- Enable caching

**Target:** <2.5s on 4G mobile

### ❌ Killer #4: No Trust Signals

**Bad:** Clean, modern site but no proof.

**Why it kills:** User thinks "is this legit?"

**Fix:**
- Client logos (if B2B)
- Testimonials with photos
- Media mentions ("As seen in...")
- Security badges
- Guarantees
- Social proof numbers

### ❌ Killer #5: Weak CTA

**Bad:**
```
<button>Submit</button>
```

**Why it kills:** No benefit, no clarity.

**Good:**
```
<button>
  Získat Nezávazný Odhad →
  <small>Zavoláme do 60 minut</small>
</button>
```

Benefit-driven + assurance.

---

## ✅ CONVERSION OPTIMIZATION CHECKLIST

Before launching any page:

### Above the Fold ✓
- [ ] Headline clearly states main benefit
- [ ] Sub-headline elaborates or adds urgency
- [ ] Primary CTA visible without scrolling
- [ ] Trust signal visible (reviews, stats, logos)
- [ ] Value proposition clear in <5 seconds
- [ ] Hero image relevant and high-quality
- [ ] Mobile-optimized (looks good on phone)

### Form ✓
- [ ] Minimum fields (3-5 max for first step)
- [ ] Labels clear and descriptive
- [ ] Placeholder text helpful (not just repeating label)
- [ ] Real-time validation
- [ ] Error messages helpful, not accusatory
- [ ] Progress indicator (if multi-step)
- [ ] Assurance copy near submit button
- [ ] Submit button = action verb + benefit

### Page Structure ✓
- [ ] Logical flow (problem → solution → proof → CTA)
- [ ] Social proof strategically placed
- [ ] FAQ addresses main objections
- [ ] Multiple CTAs throughout (not just one at end)
- [ ] Content scannable (headings, bullets, white space)
- [ ] No dead-ends (every section leads somewhere)

### Technical ✓
- [ ] Page load <3 seconds
- [ ] Mobile-responsive
- [ ] No broken links
- [ ] Forms actually submit (test!)
- [ ] Analytics tracking installed
- [ ] Phone numbers clickable on mobile
- [ ] Images have alt text
- [ ] HTTPS enabled (security)

### Psychological ✓
- [ ] Scarcity/urgency used (authentically)
- [ ] Social proof prominent
- [ ] Risk reversal offered (guarantee, free trial)
- [ ] Objections addressed proactively
- [ ] Emotion + logic balanced
- [ ] "You" focused (not "we")

---

## 📈 EXPECTED RESULTS TIMELINE

### Week 1-2: Quick Wins
- Implement Priority 1-2 fixes
- **Expected lift:** +20-30% conversion rate

### Week 3-4: Testing & Iteration
- Run A/B tests on key elements
- Analyze heatmap data
- **Expected lift:** Additional +15-20%

### Week 5-8: Advanced Optimizations
- Personalization
- Exit intent
- Advanced tracking
- **Expected lift:** Additional +10-15%

### Month 3: Consolidated Gains
- **Overall conversion rate:** 8-12% (from baseline 2-3%)
- **Total lift:** 3-4x improvement

### Ongoing: Continuous Improvement
- Monthly A/B tests
- Quarterly UX audits
- **Target:** +5-10% improvement quarterly

---

## 💡 ADVANCED CRO TACTICS

### Tactic 1: Micro-Commitments

Don't ask for form immediately. Build commitment gradually:

```
Step 1: Click quiz "Jaký typ prodeje je pro vás?" (low commitment)
Step 2: Answer 3 questions (investment of time)
Step 3: See result + CTA "Chcete pomoc?" (now more likely to convert)
```

**Consistency principle:** Small yes → bigger yes.

### Tactic 2: Anchoring Pricing

Show alternative costs BEFORE your price:

```
Průměrný autobazar si vezme: 120 000 - 180 000 Kč (skrytá marže)
Soukromý prodej vás stojí: 50 000 Kč (ztráta + čas)

CAR makléř: 7 500 Kč

→ Ušetříte: 42 500 - 172 500 Kč
```

**Anchoring effect:** 7.5k looks TINY after seeing 120k.

### Tactic 3: Decoy Effect

```
Balíček A: Prodej auta (7 500 Kč)
Balíček B: Prodej + Financování pro kupce (13 000 Kč) ← DECOY
Balíček C: Prodej + Financování + Pojištění (15 000 Kč) ← TARGET

Most people choose C (best value).
```

**Note:** Only use if you actually have packages. Don't create fake options.

### Tactic 4: Post-Conversion Optimization

After form submit, don't just say "Díky!"

**Optimize for:**
1. Reduce cancellations (send confirmation email immediately)
2. Increase show rate (send reminder day before meeting)
3. Upsell (offer premium services during meeting)

```html
<!-- Success page -->
<div class="success">
  ✅ Perfektní! Zavoláme do 60 minut.

  📧 Poslali jsme potvrzení na [email]

  <h3>Zatímco čekáte:</h3>
  <a href="/blog/priprava-auta">
    → Jak připravit auto na prodej (checklist)
  </a>

  <div class="calendar-widget">
    Chcete rovnou rezervovat termín schůzky?
    [Kalendář]
  </div>
</div>
```

---

## 🎯 FINAL CONVERSION FORMULA

```
Conversion Rate = (Relevance × Clarity × Trust - Friction) / Anxiety

Where:
- Relevance: Right offer to right person
- Clarity: User knows what to do
- Trust: User believes you'll deliver
- Friction: How hard is it to convert?
- Anxiety: What's the risk?

Optimize:
✅ Increase: Relevance, Clarity, Trust
✅ Decrease: Friction, Anxiety

= Higher Conversions
```

---

## 🚀 IMPLEMENTATION PRIORITY

**Week 1 (Do First):**
1. Add trust signals above fold
2. Implement sticky mobile CTA
3. Add phone click tracking
4. Set up Hotjar/Clarity

**Week 2-3 (High ROI):**
5. Multi-step form
6. Headline A/B test
7. CTA button optimization
8. Real-time form validation

**Week 4-6 (Polish):**
9. Exit intent popup
10. Social proof repositioning
11. Value calculator
12. Personalization by traffic source

**Month 2-3 (Advanced):**
13. Video content testing
14. Advanced personalization
15. Micro-commitment funnels
16. Post-conversion optimization

---

**Remember:** Optimization is never "done". It's a continuous process.

**Test. Measure. Iterate. Repeat.** 🔄

*Conversion optimization is 20% ideas, 80% execution.* 🚀
