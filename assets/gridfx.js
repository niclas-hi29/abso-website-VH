/* ============================================================
   ABSO · vG — Grid edition FX
   Traveling fluid gradient strip + grid reveal + nav.
   ============================================================ */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ged = document.querySelector('.ged');
  if (!ged) return;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => ged.classList.add('lines-in'));
    nav(); travelStrip();
  });

  function nav() {
    const n = $('.gnav'); if (!n) return;
    const on = () => n.classList.toggle('solid', scrollY > 40);
    addEventListener('scroll', on, { passive: true }); on();
  }

  function travelStrip() {
    const travel = $('.travel');
    const slots = $$('.strip-slot');
    if (!travel || !slots.length) return;
    ged.classList.add('travel-on');
    const ease = RM ? 1 : 0.12;
    let cur = null;

    function activeSlot() {
      const vc = innerHeight / 2; let best = null, bd = Infinity;
      for (const s of slots) {
        const r = s.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - vc);
        if (d < bd) { bd = d; best = { s, r, d }; }
      }
      return best;
    }

    function frame() {
      requestAnimationFrame(frame);
      const a = activeSlot(); if (!a) return;
      const { s, r, d } = a;
      if (!cur) cur = { x: r.left, y: r.top, w: r.width, h: r.height };
      cur.x = lerp(cur.x, r.left, ease);
      cur.y = lerp(cur.y, r.top, ease);
      cur.w = lerp(cur.w, r.width, ease);
      cur.h = lerp(cur.h, r.height, ease);
      travel.style.transform = `translate(${cur.x}px,${cur.y}px)`;
      travel.style.width = cur.w + 'px';
      travel.style.height = cur.h + 'px';
      // fade between acts: full when target near center, fade when far
      const dn = d / innerHeight;
      travel.style.opacity = clamp(1 - (dn - 0.32) / 0.42, 0, 1).toFixed(3);
      const sku = s.dataset.sku || 'solar';
      if (travel.dataset.sku !== sku) {
        travel.className = 'travel fstrip sku-' + sku;
        travel.dataset.sku = sku;
      }
    }
    frame();
  }
})();
