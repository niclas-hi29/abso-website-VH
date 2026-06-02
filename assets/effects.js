/* ============================================================
   ABSO · vG — effects engine (progressive enhancement only)
   ============================================================ */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('DOMContentLoaded', () => {
    if (RM) return;
    scrollRail(); assignHints(); tilt(); skew(); scramble(); peelParticles(); demo();
    if (FINE) cursor();
  });

  /* scroll progress rail */
  function scrollRail() {
    const bar = document.createElement('div'); bar.className = 'scrollbar'; document.body.appendChild(bar);
    const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? clamp(scrollY / h, 0, 1) : 0})`; };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* assign cursor labels + tilt/skew/scramble targets without touching HTML */
  function assignHints() {
    $$('.shop-card').forEach(e => e.dataset.cursor = 'View');
    $$('.wall-cell, .inday-card').forEach(e => e.dataset.cursor = '+ Add');
    $$('.heroL-packs').forEach(e => e.dataset.cursor = 'Shop');
    $$('.shop-card, .inday-card, .heroL-packs, .doctor-photo').forEach(e => e.setAttribute('data-tilt', ''));
    $$('.how-media img, .panel-media img, .sci-visual img, .format-media').forEach(e => e.setAttribute('data-skew', ''));
    const eye = $('.heroL .eye') || $('.sci-hero .eye'); if (eye) eye.setAttribute('data-scramble', '');
  }

  /* custom cursor */
  function cursor() {
    document.body.classList.add('cursor-on');
    const mk = c => { const d = document.createElement('div'); d.className = c; document.body.appendChild(d); return d; };
    const dot = mk('cursor'), ring = mk('cursor-ring'), label = mk('cursor-label');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      rx = lerp(rx, mx, .2); ry = lerp(ry, my, .2);
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      label.style.left = mx + 'px'; label.style.top = (my + 28) + 'px';
      requestAnimationFrame(loop);
    }; loop();
    const HOT = 'a,button,.btn,label.q-opt,.lab-layer,.faq-q,.gal-thumb,[data-tilt],[data-cursor],.demo-strip';
    document.addEventListener('pointerover', e => {
      const t = e.target.closest && e.target.closest(HOT); if (!t) return;
      dot.classList.add('is-hot'); ring.classList.add('is-hot');
      if (t.dataset.cursor) { label.textContent = t.dataset.cursor; label.classList.add('show'); }
    });
    document.addEventListener('pointerout', e => {
      const t = e.target.closest && e.target.closest(HOT); if (!t) return;
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOT)) return;
      dot.classList.remove('is-hot'); ring.classList.remove('is-hot'); label.classList.remove('show');
    });
    document.addEventListener('mouseleave', () => { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); });
  }

  /* 3D tilt */
  function tilt() {
    if (!FINE) return;
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.classList.add('tilting');
        el.style.transform = `perspective(900px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('tilting'); el.style.transform = ''; });
    });
  }

  /* scroll-velocity skew */
  function skew() {
    const els = $$('[data-skew]'); if (!els.length) return;
    let last = scrollY, vel = 0;
    const tick = () => {
      const cur = scrollY, d = cur - last; last = cur;
      vel = lerp(vel, clamp(d * 0.35, -7, 7), .15);
      const s = (Math.abs(vel) > 0.04 ? vel : 0) * 0.4;
      els.forEach(el => el.style.transform = `skewY(${s}deg)`);
      requestAnimationFrame(tick);
    }; tick();
  }

  /* text scramble decode */
  function scramble() {
    const els = $$('[data-scramble]'); if (!els.length) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·/—0123456789';
    const io = new IntersectionObserver(ents => ents.forEach(en => { if (!en.isIntersecting) return; io.unobserve(en.target); run(en.target); }), { threshold: .6 });
    els.forEach(e => io.observe(e));
    function run(el) {
      const final = el.textContent; let frame = 0; const dur = 26;
      const id = setInterval(() => {
        frame++; let out = '';
        for (let i = 0; i < final.length; i++) {
          if (i < frame * final.length / dur) out += final[i];
          else if (final[i] === ' ') out += ' ';
          else out += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = out;
        if (frame >= dur) { clearInterval(id); el.textContent = final; }
      }, 30);
    }
  }

  /* peel particle dissolve */
  function peelParticles() {
    const sec = $('.peel'); if (!sec) return;
    const stage = $('.peel-stage', sec), strip = $('.peel-strip', sec);
    const canvas = document.createElement('canvas'); canvas.className = 'peel-canvas';
    stage.insertBefore(canvas, stage.firstChild);
    const ctx = canvas.getContext('2d'); let W, H, parts = [];
    const size = () => { W = canvas.width = stage.offsetWidth; H = canvas.height = stage.offsetHeight; };
    size(); addEventListener('resize', size);
    const progress = () => { const r = sec.getBoundingClientRect(), t = r.height - innerHeight; return t > 0 ? clamp(-r.top / t, 0, 1) : 0; };
    const inView = () => { const r = sec.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    function emit() {
      const sr = strip.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      const x = sr.left - cr.left + sr.width * Math.random();
      const y = sr.top - cr.top + sr.height * 0.08;
      parts.push({ x, y, vx: (Math.random() - .5) * .7, vy: -Math.random() * 1.3 - .25, r: Math.random() * 2.4 + .5, a: 1 });
    }
    function loop() {
      requestAnimationFrame(loop);
      if (!inView()) { if (parts.length) { ctx.clearRect(0, 0, W, H); parts = []; } return; }
      ctx.clearRect(0, 0, W, H);
      const p = progress();
      if (p > 0.48 && p < 0.99) for (let i = 0; i < 4; i++) emit();
      for (const pt of parts) { pt.x += pt.vx; pt.y += pt.vy; pt.vy -= .004; pt.a -= .012; }
      parts = parts.filter(pt => pt.a > 0);
      for (const pt of parts) {
        ctx.globalAlpha = Math.max(0, pt.a);
        ctx.fillStyle = `rgb(${223 + (Math.random() * 20 | 0)},${150 + (Math.random() * 40 | 0)},${40 + (Math.random() * 40 | 0)})`;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } loop();
  }

  /* five-minute interactive demo */
  function demo() {
    const sec = $('.demo'); if (!sec) return;
    const strip = $('.demo-strip', sec), timerEl = $('.demo-timer', sec), canvas = $('.demo-canvas', sec), stage = $('.demo-stage', sec);
    const ctx = canvas.getContext('2d'); let parts = [], anim;
    const size = () => { canvas.width = stage.offsetWidth; canvas.height = stage.offsetHeight; };
    size(); addEventListener('resize', size);
    function burst() {
      const sr = strip.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      const cx = sr.left - cr.left + sr.width / 2, cy = sr.top - cr.top + sr.height / 2;
      for (let i = 0; i < 150; i++) { const a = Math.random() * 7, s = Math.random() * 3 + .5; parts.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - .5, r: Math.random() * 2.6 + .6, al: 1 }); }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) { p.x += p.vx; p.y += p.vy; p.vy += .02; p.al -= .012; }
      parts = parts.filter(p => p.al > 0);
      for (const p of parts) { ctx.globalAlpha = Math.max(0, p.al); ctx.fillStyle = '#DF6D09'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1; if (parts.length) anim = requestAnimationFrame(draw);
    }
    function run() {
      if (sec.classList.contains('run')) return;
      sec.classList.remove('done'); sec.classList.add('run');
      burst(); cancelAnimationFrame(anim); draw();
      const dur = 2600, t0 = performance.now();
      const tick = now => {
        const k = clamp((now - t0) / dur, 0, 1);
        const total = Math.round(k * 300), mm = Math.floor(total / 60), ss = total % 60;
        timerEl.textContent = mm + ':' + String(ss).padStart(2, '0');
        if (k < 1) requestAnimationFrame(tick);
        else { timerEl.textContent = '5:00'; sec.classList.add('done'); sec.classList.remove('run'); }
      };
      requestAnimationFrame(tick);
    }
    strip.addEventListener('click', run);
    sec.addEventListener('click', e => {
      if (sec.classList.contains('done') && !e.target.closest('.btn') && !e.target.closest('.demo-strip')) {
        sec.classList.remove('done'); timerEl.textContent = '0:00';
      }
    });
  }
})();
