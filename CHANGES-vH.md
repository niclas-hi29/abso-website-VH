# vH — changes from vG (2026-06-02)

vH is a clone of vG (`abso-vG-v1_2026-05-22`) with the salvaged elements from the website review grafted in, rebuilt natively on vG's design tokens (no archive code pasted, no broken assets). Driven by the salvage spec at `../SALVAGE-SPEC-new-build.md`.

## Done this pass

1. **Lab section relocated off the homepage.** vG carried the "A strip is three layers" lab on *both* index.html and science.html. Removed the homepage copy (it lives correctly on science.html as section "03 · The strip"). Homepage sections renumbered (Why-a-strip 05 → 04).

2. **Ingredient Atlas added to homepage** (section 05, `#atlas`) — salvaged from vC's periodic-table grid, rebuilt natively. 18 element-style tiles with SKU colour accents, glyphs, names, doses, NRV annotations, and an All/Sleep/Energy/Glow filter. **All doses pulled from the POSG-10001 supplement facts** — Sleep (Valerian 25 / L-theanine 25 / Lavender 20 / Passion flower 20 / GABA 5 / Melatonin 2mg / B6 1.3), Energy (Caffeine 80 / L-theanine 30 / Korean ginseng 20 / B6 / B12), Glow-Up (Silicium 30 / Vit E tocotrienols 10 / HA 5 / Biotin 600mcg / Folate 400mcg / D3 1000IU). No collagen on Glow-Up; footnote states the collagen-multiplier framing.

3. **Dashboard "Everything at a glance" bento added to homepage** (section 09) — salvaged from vC. 4-col bento: Sleep 2×2 hero (real pack render + Add), 90% bioavailability stat, <1 min dissolve, live Singapore order ticker, 60-day guarantee, Energy/Glow gradient cells, and a full-day bundle cell ("Add all three · save 15%" → adds all three via existing cart). Uses vG's working assets — no broken symlink.

4. **PDP "What you feel" emotion ladder added** (section 02) on sleep/energy/glow-up — salvaged from vA. Sits after the video band, on each SKU's deep ground colour (auto-themed via `body[data-pdp]`). Time-stamped felt-outcome ladders; Glow-Up uses a weeks-not-minutes timeline. Focus-on-hover dims sibling rows.

All new CSS appended to `assets/style.css` under a "vH ADDITIONS" banner. New JS (atlas filter, ticker, bundle) is a small inline block at the end of index.html.

**Verified:** 0 console errors, 0 server 404s, all new sections render. Compliance scan clean (no banned ingredient copy; fixed an early "no melatonin fog" → "no morning fog" on the Sleep ladder).

## Alternative homepage — `home-alt.html` (element library, linked in nav as "Alt Home", noindex)

A second homepage that preserves every element we liked, so the old builds can be archived without loss. Built on vH tokens; reachable from the header on the main page.

- **vC cursor-tracked first fold** — mesh gradient that follows the cursor (auto-drifts when idle), the tilted drifting strip floater, and a time-of-day headline ("Tonight is Sleep" / "This afternoon is Energy" / "This evening is Glow-Up") with live clock + recommended-SKU card.
- **vC "range" compare row + strip hover** — Tonight / Tomorrow / In three weeks, three SKU columns with the canonical strip animating on hover.
- **vA "Place. Dissolve. Feel." ritual** — auto-advancing 3-stage stepper (0:00 Place → 0:45 Dissolve → 5:00 Feel) with the strip dissolving away to "Felt it. On cue." Driven directly (no MutationObserver).
- **vD Strip Migration** — pinned scroll section; the strip walks a grid as "Place → Dissolve → Feel" fade in and a Tongue→Mucosa→Blood indicator advances. On a compact `--p` scroll engine (rAF, works alongside Lenis).
- **vD Three Lives** — per-SKU strip-shaped photo portals that grow to full-bleed on scroll, then name + shop card slide in. **Ingredients corrected to canon** (vD's source had Sleep "Magnesium" and Glow "Marine collagen · Vit C · Zinc" — all wrong; replaced with the real POSG-10001 actives). Photos swapped to vH's working hero images.
- **vD Absorption bars** — pill/gummy/powder/strip bioavailability bars that fill on scroll into view.
- Also reuses the Ingredient Atlas + dashboard bento from the main homepage.

Verified: 0 console errors; scroll engine confirmed driving `--p` (migration + portals scrub correctly). The dissolution clock from vD was deliberately left out (its 0:00→5:00 framing implies a 5-minute dissolve, which breaks canon — dissolve is under a minute, five is time-to-felt).
