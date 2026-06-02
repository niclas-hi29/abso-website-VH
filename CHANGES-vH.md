# vH — changes from vG (2026-06-02)

vH is a clone of vG (`abso-vG-v1_2026-05-22`) with the salvaged elements from the website review grafted in, rebuilt natively on vG's design tokens (no archive code pasted, no broken assets). Driven by the salvage spec at `../SALVAGE-SPEC-new-build.md`.

## Done this pass

1. **Lab section relocated off the homepage.** vG carried the "A strip is three layers" lab on *both* index.html and science.html. Removed the homepage copy (it lives correctly on science.html as section "03 · The strip"). Homepage sections renumbered (Why-a-strip 05 → 04).

2. **Ingredient Atlas added to homepage** (section 05, `#atlas`) — salvaged from vC's periodic-table grid, rebuilt natively. 18 element-style tiles with SKU colour accents, glyphs, names, doses, NRV annotations, and an All/Sleep/Energy/Glow filter. **All doses pulled from the POSG-10001 supplement facts** — Sleep (Valerian 25 / L-theanine 25 / Lavender 20 / Passion flower 20 / GABA 5 / Melatonin 2mg / B6 1.3), Energy (Caffeine 80 / L-theanine 30 / Korean ginseng 20 / B6 / B12), Glow-Up (Silicium 30 / Vit E tocotrienols 10 / HA 5 / Biotin 600mcg / Folate 400mcg / D3 1000IU). No collagen on Glow-Up; footnote states the collagen-multiplier framing.

3. **Dashboard "Everything at a glance" bento added to homepage** (section 09) — salvaged from vC. 4-col bento: Sleep 2×2 hero (real pack render + Add), 90% bioavailability stat, <1 min dissolve, live Singapore order ticker, 60-day guarantee, Energy/Glow gradient cells, and a full-day bundle cell ("Add all three · save 15%" → adds all three via existing cart). Uses vG's working assets — no broken symlink.

4. **PDP "What you feel" emotion ladder added** (section 02) on sleep/energy/glow-up — salvaged from vA. Sits after the video band, on each SKU's deep ground colour (auto-themed via `body[data-pdp]`). Time-stamped felt-outcome ladders; Glow-Up uses a weeks-not-minutes timeline. Focus-on-hover dims sibling rows.

All new CSS appended to `assets/style.css` under a "vH ADDITIONS" banner. New JS (atlas filter, ticker, bundle) is a small inline block at the end of index.html.

**Verified:** 0 console errors, 0 server 404s, all new sections render. Compliance scan clean (no banned ingredient copy; fixed an early "no melatonin fog" → "no morning fog" on the Sleep ladder).

## Not done — needs a decision (likely redundant with vG)

- **vC "range" compare row + strip hover** (Tonight/Tomorrow/In three weeks). vG already ships a strong "Shop the range" card grid in the same slot. Building vC's compare-row on top would duplicate it. Decide: keep vG's cards, or replace them with the vC treatment.
- **vA "Place. Dissolve. Feel." timeline.** vG's PEEL scroll centrepiece already runs "Tear → Place → Feel", and science.html's mega is "Place. Dissolve. Feel." Adding vA's 5-stage timeline risks a third version of the same beat. Decide before building.
- **vD scroll animations** (Strip Migration, Three Lives photo portals). Largest, riskiest port; vG already has Lenis + the PEEL scroll moment. Per the spec's open question, confirm these don't compete with PEEL before adding.
