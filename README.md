# Abso website — vG (2026-05-22)

A from-scratch rebuild: homepage + 3 product pages + science page. **Every photograph and video is freshly generated in Higgsfield** (May 2026). Only the transparent pack renders, logos, glyphs and lockup bars are reused (real product, for label accuracy — generating fake packs risks wrong doses/colours).

## Pages
- `index.html` — conversion-first with strong light/dark contrast rhythm: product hero (real 3-pack lineup + Strip brand device gliding behind, price, rating, Shop CTA) · trust bar · **Shop the range** product cards (price + add-to-cart, bestseller badge) · **PEEL** — a scroll-driven centerpiece where the Strip emerges from the Sleep pack across "Tear → Place → Feel" (dark) · "It's a strip, not a pill" how-it-works (clean strip macro + steps + 90%/<1min/5min stats) · **In your day** dark video showcase (3 shoppable SKU loops) · stack-builder quiz · interactive 3-layer lab (dark) · pill-vs-strip comparison · UGC reviews wall · formulator Q&A · press · mega CTA
  - *Iteration history: v1 was too abstract / unclear what's sold → led with product + merchandising. Then on feedback: restored video presence (homepage showcase + PDP bands), added contrast (dark sections), featured the Strip brand device, built the scroll "strip-out-of-pack" animation, and fixed the PDP gallery (an overlay pack was being stretched full-height by a global rule — now a clean product chip). AI-composited pack shots were discarded — they garble labels/doses — so all pack imagery is the real renders.*
- PDPs each gained a cinematic SKU video band between the benefits and ingredient panel.
- `grid.html` + `grid-sleep.html` / `grid-energy.html` / `grid-glow.html` — **Grid Edition** (Daylight-inspired, linked from nav as "Grid"). A hairline modular grid, editorial Instrument-Serif headlines, mono data annotations, and the **Strip brand device as a fluid grained gradient swatch** (diagonal light-bands + film grain, continuously flowing). A single **traveling strip** glides between grid cells as you scroll — hero → photo right-third → "Absorb more." square → "Place. Dissolve. Feel." band — morphing its SKU gradient and fading between acts (`assets/gridfx.js`, `assets/grid.css`). The range row shows the three SKU swatches; each PDP carries the strip behind the pack with corner annotations, plus the working subscription buy-box and shared cart. Pure-CSS strips (no extra image/video cost).
- `lookbook.html` — **"A Day With Abso"**, a separate cinematic lifestyle-led page (linked from nav). Full-bleed Higgsfield video chapters Rise → Renew → Rest, editorial asymmetric image clusters, shoppable chapter strips, shared cart. Assets in `assets/gen-lb/` (16 lifestyle stills + 8 video loops, all reviewed ≥95). Built on the same brand system + effects layer.

## Asset QA pass (≥95 review)
Every image and video was reviewed at full size (videos via extracted ffmpeg frames). Fixes applied:
- Re-rolled vG `ugc_energy_w` (gibberish bottle label), `ugc_sleep_m` (gibberish book title), `sci_hero` (film-frame border → clean full-bleed).
- Swapped the clinical `macro_tongue` for the clean `strip_fingertips` across PDPs/science.
- Cropped the `hero_science` video to remove its film-frame border (motion preserved).
- Re-rolled lookbook `group_life` (was Mediterranean → now clearly Singapore) and dropped `sg_marina` (re-roll read as Shanghai Bund, not Marina Bay — omitted rather than ship off-brief).
- Fixed two UGC name/gender labels after re-rolls.
- AI pack-label accuracy held up well at lifestyle scale (flat-lays show correct ingredient lists); composited multi-pack shots still garble labels, so those remain real renders.
- `sleep.html` / `energy.html` / `glow-up.html` — full PDPs: sticky gallery, subscription-default buy box, size/plan toggles, per-strip pricing, benefits, ingredient panel, how-to, reviews, FAQ, cross-sell, sticky mobile add-to-cart
- `science.html` — editorial scroll story on first-pass metabolism, sublingual bioavailability, the strip's three layers, and the five-minute standard, with cited sources

## Showcase effects layer (`effects.css` + `effects.js`)
Progressive enhancement, all gated behind `hover:hover`/fine-pointer and `prefers-reduced-motion`:
- **Scroll-driven "strip out of the pack"** (the PEEL section) — JS scroll-progress drives the Strip device up and out of the Sleep pack across three captions, with a **canvas particle dissolve** emitting from the strip as it emerges.
- **Interactive five-minute demo** — tap the strip, it bursts into canvas particles and a clock runs 0:00 → 5:00, landing on "Felt it. On cue." with an add-to-cart.
- **Custom cursor** — a dot + trailing ring (blend-mode so it reads on light and dark) that grows and shows contextual labels ("Shop", "View", "+ Add", "Tap") over interactive elements; native cursor only hidden once JS confirms.
- **3D tilt** on hero packs, shop cards, video tiles, formulator photo (mouse-reactive perspective).
- **Scroll-velocity skew** on editorial images; **text-scramble** decode on the hero eyebrow; **scroll progress rail**.
- **Cross-document View Transitions** — smooth morph between pages in supporting browsers (named transition on the wordmark).

## Tech / interaction
- **Lenis** smooth scroll (lerp 0.08, no smooth-touch), CDN with graceful native fallback
- Scroll reveals + staggers via IntersectionObserver; `clip-rise` headline masks; count-up metrics
- Magnetic CTAs; SKU theme-shift on scroll; lab hover; live SG clock + orders ticker
- Cart in `localStorage` (drawer, qty, subscribe −15%, count badges, bump); stack-builder bundle logic
- Lazy-loaded hero videos (poster-first, `preload=none`, IO swap); optimized JPEGs
- Full `prefers-reduced-motion` handling; mobile burger nav + sticky ATC bar

## Brand & compliance held
Cream `#FFF7E9` / warm-ink `#1F1A12` / solar `#DF6D09`; Instrument Serif + Inter Tight; per-SKU gradients; the Strip device (CSS breath). Sleep keeps its 2 mg melatonin; Glow-Up framed as a **collagen multiplier** (not collagen); Energy at 80 mg green-coffee caffeine (B12 form unspecified); Singapore-engineered (no US/FDA). "Dissolves in under a minute" kept distinct from "feel it in five" (felt onset). No "money-back" wording and no competitor-drug comparison on Sleep/Glow (HSA Quasi-Medicinal); Energy (exempt) uses the half-a-coffee comparison. Disease disclaimer in every footer.

## Assets
- `assets/gen/img/` — 19 generated stills (heroes, lifestyle, ingredient macros, how-to, formulator, 6 UGC, science)
- `assets/gen/video/` — 5 cinematic 1080p hero loops (home, sleep, energy, glow, science)
- `assets/brand/` — reused real packs, logos, glyphs
- `ASSET-MANIFEST.md` — full prompt/model log and Higgsfield reference IDs

## Notes before production
- Review counts, named reviewers, press quotes and headline stats are **illustrative placeholders** (same convention as prior builds) — swap for verified data before launch.
- Static, Netlify-ready. Checkout button is a stub.
- Glow-Up D3 is shown at 1000 IU (actual panel); per the HSA memo this sits on the Quasi-Medicinal ceiling — relevant if this is ever submitted as ad creative.
