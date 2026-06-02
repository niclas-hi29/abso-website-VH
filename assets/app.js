/* ============================================================
   ABSO · vG — interaction layer
   ============================================================ */
(() => {
  'use strict';
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- SKU CATALOG ---------- */
  const SKU = {
    sleep:  { name: 'Sleep',   tag: 'Switch off, on cue.',   p30: 59.90, p10: 24.90, pack: 'assets/brand/pack_sleep_30s_front.png' },
    energy: { name: 'Energy',  tag: 'Clean lift, no crash.',  p30: 59.90, p10: 24.90, pack: 'assets/brand/pack_energy_30s_front.png' },
    glow:   { name: 'Glow-Up', tag: 'Skin people ask about.', p30: 59.90, p10: 24.90, pack: 'assets/brand/pack_glow_30s_front.png' }
  };
  const money = n => '$' + n.toFixed(2);

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  let lenis = null;
  function initLenis() {
    if (RM || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1.05, smoothWheel: true, smoothTouch: false });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // anchor links
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70, duration: 1.2 }); }
    }));
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveals() {
    const els = $$('[data-reveal],[data-reveal-stagger],.clip-rise');
    if (RM || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------- NAV ---------- */
  function initNav() {
    const nav = $('.nav'); if (!nav) return;
    const dock = $('.dock');
    let last = 0;
    const onScroll = (y) => {
      nav.classList.toggle('scrolled', y > 20);
      if (y > 560 && y > last + 4) nav.classList.add('hide');
      else if (y < last - 4 || y < 560) nav.classList.remove('hide');
      if (dock) dock.classList.toggle('show', y > 740 && y < document.body.scrollHeight - window.innerHeight - 700);
      last = y;
    };
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    // mobile menu
    const burger = $('.nav-burger'), menu = $('.mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', () => { menu.classList.toggle('open'); document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : ''; });
      $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; }));
    }
  }

  /* ---------- COUNT-UP ---------- */
  function initCounters() {
    const els = $$('[data-count]');
    if (RM || !('IntersectionObserver' in window)) { els.forEach(e => e.textContent = (e.dataset.count) + (e.dataset.suffix || '')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dur = 1400, t0 = performance.now();
      const step = (t) => { const k = Math.min((t - t0) / dur, 1); const e = 1 - Math.pow(1 - k, 3);
        el.textContent = (Number.isInteger(end) ? Math.round(end * e) : (end * e).toFixed(1)) + suf;
        if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- LAZY VIDEO ---------- */
  function initVideos() {
    const vids = $$('video[data-src]');
    if (!('IntersectionObserver' in window)) { vids.forEach(load); return; }
    const io = new IntersectionObserver((ents) => ents.forEach(en => {
      if (en.isIntersecting) { load(en.target); io.unobserve(en.target); }
    }), { rootMargin: '200px' });
    vids.forEach(v => io.observe(v));
    function load(v) {
      if (RM) return; // reduced motion → poster only
      v.src = v.dataset.src; v.load();
      v.play().catch(() => {});
    }
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (RM || matchMedia('(hover:none)').matches) return;
    $$('.mag').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  /* ---------- THEME SHIFT (sku showcase) ---------- */
  function initThemeShift() {
    const secs = $$('[data-theme-sku]');
    if (!secs.length || !('IntersectionObserver' in window)) return;
    const map = {
      sleep:  ['#3546A0', '#BDB8DC', '#E5EEF1'],
      energy: ['#CF0513', '#E1D58E', '#F7D9B8'],
      glow:   ['#11A9A8', '#C6DAD0', '#D7E5DD']
    };
    const host = $('.showcase');
    const io = new IntersectionObserver((ents) => ents.forEach(en => {
      if (en.isIntersecting && en.intersectionRatio > 0.4) {
        const k = en.target.dataset.themeSku, c = map[k]; if (!c || !host) return;
        host.style.setProperty('--theme-a', c[0]); host.style.setProperty('--theme-b', c[1]);
        host.style.background = c[2] + '55';
      }
    }), { threshold: [0.4, 0.7] });
    secs.forEach(s => io.observe(s));
  }

  /* ---------- PEEL (strip emerges from pack on scroll) ---------- */
  function initPeel() {
    const sec = $('.peel'); if (!sec) return;
    const strip = $('.peel-strip', sec), pack = $('.peel-pack', sec), caps = $$('.peel-cap', sec),
          bar = $('.peel-track i', sec), glow = $('.peel-glow', sec);
    const lerp = (a, b, t) => a + (b - a) * t;
    if (RM) {
      if (strip) strip.style.transform = 'translate(-50%,-78%) rotate(3deg) scale(1.04)';
      caps.forEach((c, i) => c.classList.toggle('on', i === caps.length - 1));
      if (bar) bar.style.width = '100%';
      return;
    }
    let ticking = false;
    function apply() {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      let p = total > 0 ? (-r.top) / total : 0; p = Math.max(0, Math.min(1, p));
      if (strip) strip.style.transform = `translate(-50%, ${lerp(4, -82, p)}%) rotate(${lerp(-1, 4, p)}deg) scale(${lerp(.92, 1.06, p)})`;
      if (pack) pack.style.transform = `rotate(${lerp(0, -3, p)}deg) translateY(${lerp(0, 3, p)}%)`;
      if (glow) glow.style.transform = `translateY(${lerp(8, -10, p)}%) scale(${lerp(.85, 1.15, p)})`;
      if (bar) bar.style.width = (p * 100) + '%';
      const idx = p < .34 ? 0 : (p < .7 ? 1 : 2);
      caps.forEach((c, i) => c.classList.toggle('on', i === idx));
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
    apply();
  }

  /* ---------- LAB LAYERS ---------- */
  function initLab() {
    const layers = $$('.lab-layer'), details = $$('.lab-detail > div');
    if (!layers.length) return;
    layers.forEach(l => l.addEventListener('mouseenter', () => set(l.dataset.l)));
    layers.forEach(l => l.addEventListener('click', () => set(l.dataset.l)));
    function set(i) {
      layers.forEach(l => l.classList.toggle('on', l.dataset.l === i));
      details.forEach(d => d.classList.toggle('on', d.dataset.d === i));
    }
  }

  /* ---------- CART ---------- */
  const CART_KEY = 'abso_cart_vg1';
  let cart = load();
  function load() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
  function save() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); render(); }
  function add(sku, size = '30', sub = false, qty = 1) {
    const id = sku + size + (sub ? 's' : '');
    const ex = cart.find(i => i.id === id);
    if (ex) ex.qty += qty; else cart.push({ id, sku, size, sub, qty });
    save(); open(); bump();
  }
  function bump() { const c = $('.cart-btn'); if (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } }
  function unit(i) { const base = i.size === '10' ? SKU[i.sku].p10 : SKU[i.sku].p30; return i.sub ? base * 0.85 : base; }
  function count() { return cart.reduce((n, i) => n + i.qty, 0); }
  function subtotal() { return cart.reduce((n, i) => n + unit(i) * i.qty, 0); }
  function render() {
    $$('[data-count-cart] .count-num, [data-dock-count]').forEach(e => e.textContent = count());
    const body = $('#drawer-body'), foot = $('#drawer-foot'); if (!body) return;
    if (!cart.length) { body.innerHTML = '<div class="drawer-empty">Your bag is empty.<br>Place. Dissolve. Feel.</div>'; if (foot) foot.hidden = true; return; }
    body.innerHTML = cart.map((i, idx) => {
      const s = SKU[i.sku];
      return `<div class="cart-item">
        <img class="ci-pack" src="${s.pack}" alt="">
        <div>
          <div class="ci-name">${s.name}</div>
          <div class="ci-sub">${i.size} strips${i.sub ? ' · Subscribe −15%' : ' · One-time'}</div>
          <div class="ci-qty"><button data-dec="${idx}">−</button><span>${i.qty}</span><button data-inc="${idx}">+</button></div>
        </div>
        <div style="text-align:right"><div class="ci-price">${money(unit(i) * i.qty)}</div><button class="ci-rm" data-rm="${idx}">Remove</button></div>
      </div>`;
    }).join('');
    if (foot) { foot.hidden = false; $('#drawer-sub').textContent = money(subtotal()); $('#drawer-total').textContent = money(subtotal()); }
    $$('[data-inc]', body).forEach(b => b.onclick = () => { cart[+b.dataset.inc].qty++; save(); });
    $$('[data-dec]', body).forEach(b => b.onclick = () => { const i = cart[+b.dataset.dec]; i.qty--; if (i.qty < 1) cart.splice(+b.dataset.dec, 1); save(); });
    $$('[data-rm]', body).forEach(b => b.onclick = () => { cart.splice(+b.dataset.rm, 1); save(); });
  }
  function open() { $('.drawer')?.classList.add('open'); $('.drawer-overlay')?.classList.add('open'); }
  function close() { $('.drawer')?.classList.remove('open'); $('.drawer-overlay')?.classList.remove('open'); }
  function initCart() {
    $$('[data-cart-toggle]').forEach(b => b.addEventListener('click', open));
    $('.drawer-close')?.addEventListener('click', close);
    $('.drawer-overlay')?.addEventListener('click', close);
    $$('[data-add]').forEach(b => b.addEventListener('click', () => add(b.dataset.add, b.dataset.size || '30', b.dataset.sub === 'true')));
    $$('[data-dock-add]').forEach(b => b.addEventListener('click', () => add(b.dataset.dockAdd)));
    render();
    window.AbsoCart = { add, open };
  }

  /* ---------- STACK BUILDER ---------- */
  function initStack() {
    const root = $('.stack'); if (!root) return;
    const result = $('[data-stack-result]');
    function tally() {
      const votes = {};
      $$('input[type=radio]:checked', root).forEach(r => { const v = r.dataset.vote; votes[v] = (votes[v] || 0) + 1; });
      const answered = $$('input[type=radio]:checked', root).length;
      if (answered < 3) { result.style.display = 'none'; return; }
      const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
      const top = sorted[0][0];
      const bundle = sorted.length >= 2 && sorted[0][1] - sorted[1][1] <= 1; // close → suggest pair/bundle
      show(top, bundle ? sorted.slice(0, 2).map(s => s[0]) : [top]);
    }
    function show(top, picks) {
      result.style.display = '';
      const isBundle = picks.length > 1;
      const total = picks.reduce((n, k) => n + SKU[k].p30, 0) * 0.85;
      const strike = picks.reduce((n, k) => n + SKU[k].p30, 0);
      $('.picks', result).innerHTML = picks.map(k => `<div class="pick" data-sku="${k}"><span class="sw" style="background:linear-gradient(135deg,var(--${k}-a),var(--${k}-c))"></span>${SKU[k].name}</div>`).join('');
      $('[data-result-name]', result).innerHTML = (isBundle ? 'Your stack' : SKU[top].name) + '<span class="solar">.</span>';
      $('[data-result-tag]', result).textContent = isBundle ? picks.map(k => SKU[k].name).join(' + ') + ' — your daily rhythm.' : SKU[top].tag;
      $('[data-result-save]', result).textContent = `${picks.length} strip${isBundle ? 's' : ''} · Subscribe −15%`;
      $('[data-result-total]', result).textContent = money(total);
      $('[data-result-strike]', result).textContent = money(strike);
      const cta = $('[data-stack-add]', result);
      cta.onclick = () => picks.forEach(k => add(k, '30', true));
    }
    $$('input[type=radio]', root).forEach(r => r.addEventListener('change', tally));
  }

  /* ---------- PDP ---------- */
  function initPDP() {
    const pdp = $('[data-pdp]'); if (!pdp) return;
    const sku = pdp.dataset.pdp;
    let size = '30', sub = true, qty = 1;
    const priceEls = $$('[data-pdp-price]'), strikeEls = $$('[data-pdp-strike]'), perEls = $$('[data-pdp-per]');
    function base() { return size === '10' ? SKU[sku].p10 : SKU[sku].p30; }
    function upd() {
      const u = sub ? base() * 0.85 : base();
      const strips = size === '10' ? 10 : 30;
      priceEls.forEach(e => e.textContent = money(u * qty));
      strikeEls.forEach(e => e.textContent = sub ? money(base() * qty) : '');
      perEls.forEach(e => e.textContent = money(u / strips) + ' / strip');
    }
    $$('[data-pdp-size]').forEach(b => b.addEventListener('click', () => { size = b.dataset.pdpSize; $$('[data-pdp-size]').forEach(x => x.classList.toggle('on', x === b)); upd(); }));
    $$('[data-pdp-plan]').forEach(b => b.addEventListener('click', () => { sub = b.dataset.pdpPlan === 'sub'; $$('[data-pdp-plan]').forEach(x => x.classList.toggle('on', x === b)); upd(); }));
    $('[data-pdp-dec]')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); $('[data-pdp-qty]').textContent = qty; upd(); });
    $('[data-pdp-inc]')?.addEventListener('click', () => { qty++; $('[data-pdp-qty]').textContent = qty; upd(); });
    $('[data-pdp-add]')?.addEventListener('click', () => add(sku, size, sub, qty));
    // sticky mobile ATC reveal
    const bar = $('.atc-bar'), anchor = $('[data-pdp-buybox]');
    if (bar && anchor && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { threshold: 0 });
      io.observe(anchor);
      $('[data-atc-add]')?.addEventListener('click', () => add(sku, size, sub, qty));
    }
    // gallery
    $$('[data-gal-thumb]').forEach(t => t.addEventListener('click', () => {
      $('[data-gal-main]').src = t.dataset.galThumb;
      $$('[data-gal-thumb]').forEach(x => x.classList.toggle('on', x === t));
    }));
    // FAQ
    $$('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));
    upd();
  }

  /* ---------- LIVE CLOCK / ORDERS TICKER ---------- */
  function initLive() {
    const clock = $('[data-now]');
    if (clock) {
      const tick = () => { const d = new Date(); const sg = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
        clock.textContent = String(sg.getHours()).padStart(2, '0') + ':' + String(sg.getMinutes()).padStart(2, '0'); };
      tick(); setInterval(tick, 30000);
    }
    const feed = $('[data-orders-tick]');
    if (feed) {
      const names = ['Mei · Tampines', 'Jeremy · Tiong Bahru', 'Aishah · Bedok', 'Suresh · Clementi', 'Chloe · Holland V', 'Wei · Punggol', 'Yumi · Katong'];
      let i = 0; const tick = () => { feed.textContent = names[i % names.length]; i++; };
      tick(); setInterval(tick, 4200);
    }
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLenis(); initReveals(); initNav(); initCounters(); initVideos();
    initMagnetic(); initThemeShift(); initLab(); initPeel(); initCart(); initStack(); initPDP(); initLive();
  });
})();
