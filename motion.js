// Motion layer: scroll progress, split-text titles, staggered reveals, stat counters,
// navbar scrollspy, halftone canvas and water ripples. Pure DOM + CSS classes, so it
// does not fight the GSAP transforms that fullpage-scroll.js puts on section children.
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = Array.from(document.querySelectorAll('section'));
  if (!sections.length) return;

  /* ---------- split titles into letters ---------- */
  document.querySelectorAll('.section-title').forEach((title) => {
    const label = title.textContent.replace(/\s+/g, ' ').trim();
    const cursor = title.querySelector('.blinking-cursor');
    title.setAttribute('aria-label', label);
    title.classList.add('split-title');
    const frag = document.createDocumentFragment();
    const group = document.createElement('span');
    group.setAttribute('aria-hidden', 'true');
    let i = 0;
    Array.from(label).forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i++);
      s.textContent = c;
      group.appendChild(s);
    });
    frag.appendChild(group);
    if (cursor) frag.appendChild(cursor);
    title.textContent = '';
    title.appendChild(frag);
  });

  /* ---------- staggered reveal targets ---------- */
  [
    '.hero-stats li',
    '.terminal-meta > div',
    '.certificate-content'
  ].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal-item');
      el.style.setProperty('--i', i);
    });
  });

  /* ---------- experience accordion: one open role at a time (hover, focus or tap) ---------- */
  const panels = Array.from(document.querySelectorAll('.company-card .panel'));
  const open = (panel) => panels.forEach((q) => q.classList.toggle('active', q === panel));
  panels.forEach((panel) => {
    ['pointerenter', 'focus', 'click'].forEach((type) => panel.addEventListener(type, () => open(panel)));
  });
  if (panels.length && !panels.some((q) => q.classList.contains('active'))) open(panels[0]);

  /* ---------- counters ---------- */
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  function runCounters() {
    counters.forEach((el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = end + suffix; return; }
      const start = performance.now();
      const dur = 1500;
      (function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(end * ease(t)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  /* ---------- progress bar + scrollspy ---------- */
  const bar = document.querySelector('.scroll-progress span');
  const links = Array.from(document.querySelectorAll('.glass-nav-link'));
  function setActive(index) {
    sections.forEach((s, i) => s.classList.toggle('active', i === index));
    if (bar) bar.style.transform = 'scaleX(' + (sections.length > 1 ? index / (sections.length - 1) : 1) + ')';
    const id = sections[index] && sections[index].id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (id === 'home') runCounters();
  }

  document.addEventListener('sectionChange', (e) => setActive(e.detail.newIndex));
  // initial state: fullpage-scroll starts on the hero without firing the event
  window.addEventListener('load', () => {
    const current = sections.findIndex((s) => s.classList.contains('active'));
    setActive(current >= 0 ? current : 0);
  });

  /* ---------- halftone canvas (certificates) ---------- */
  const certs = document.getElementById('certificates');
  if (certs) {
    const canvas = document.createElement('canvas');
    canvas.className = 'halftone';
    canvas.setAttribute('aria-hidden', 'true');
    certs.insertBefore(canvas, certs.firstChild);
    const ctx = canvas.getContext('2d');
    const draw = () => {
      const w = (canvas.width = certs.clientWidth);
      const h = (canvas.height = certs.clientHeight);
      const step = w < 600 ? 14 : 18;
      ctx.clearRect(0, 0, w, h);
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          // tone: a soft diagonal wave, bright at the corners, dark in the middle
          const nx = x / w, ny = y / h;
          const edge = Math.min(1, Math.hypot(nx - 0.5, ny - 0.5) * 1.5);
          const wave = 0.5 + 0.5 * Math.sin(nx * 6 + ny * 4);
          const r = (step / 2) * edge * (0.35 + 0.65 * wave);
          if (r < 0.5) continue;
          ctx.fillStyle = (x + y) % (step * 2) < step ? 'rgba(168,85,247,0.55)' : 'rgba(56,189,248,0.5)';
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    draw();
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
  }

  /* ---------- water ripples (contact) ---------- */
  const contact = document.getElementById('contact');
  if (contact) {
    const box = document.createElement('div');
    box.className = 'ripples';
    box.setAttribute('aria-hidden', 'true');
    [['28%', '38%', '0s'], ['72%', '62%', '3s'], ['50%', '50%', '6s']].forEach(([x, y, d]) => {
      const b = document.createElement('b');
      b.style.setProperty('--x', x);
      b.style.setProperty('--y', y);
      b.style.setProperty('--d', d);
      box.appendChild(b);
    });
    contact.insertBefore(box, contact.firstChild);
  }
})();
