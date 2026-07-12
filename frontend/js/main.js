/* =========================================================
   main.js — shared behavior across every page:
   theme toggle, custom cursor, doodle background, nav, reveal
   ========================================================= */

/* ---------- Theme toggle ---------- */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  });
})();

/* ---------- Mobile nav toggle ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // Mark current page as active in nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});

/* ---------- Custom cursor ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactive = 'a, button, .btn, input, textarea, .filter-btn, .theme-toggle, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) {
      dot.classList.add('grow');
      ring.classList.add('grow');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) {
      dot.classList.remove('grow');
      ring.classList.remove('grow');
    }
  });
});

/* ---------- Doodle background ---------- */
/* Hand-drawn style SVG doodles: stars, clouds, ice-cream, cupcake, cup, squiggly line */
const DOODLE_SVGS = {
  star: `<svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 3 L24 16 L37 16 L26 24 L30 37 L20 28 L10 37 L14 24 L3 16 L16 16 Z"/></svg>`,
  cloud: `<svg viewBox="0 0 64 40" width="64" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 30 C8 30 4 24 8 18 C6 10 16 6 22 10 C26 3 40 3 43 12 C54 11 58 22 50 27 C52 34 42 36 36 32 C30 36 20 35 18 30 Z"/></svg>`,
  icecream: `<svg viewBox="0 0 40 60" width="40" height="60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="14" r="11"/><path d="M11 20 L20 55 L29 20"/><path d="M13 15 Q20 20 27 15"/></svg>`,
  cupcake: `<svg viewBox="0 0 44 50" width="44" height="50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22 C10 14 18 8 22 12 C26 8 34 14 30 22 Z"/><circle cx="22" cy="10" r="2.4" fill="currentColor" stroke="none"/><path d="M10 22 L34 22 L30 46 L14 46 Z"/><path d="M10 22 L34 22 L32 30 L12 30 Z"/></svg>`,
  cup: `<svg viewBox="0 0 40 44" width="40" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10 H32 L29 38 C29 40 27 42 25 42 H15 C13 42 11 40 11 38 Z"/><path d="M31 14 C38 14 38 26 30 26"/><path d="M14 4 C12 8 18 8 16 12"/><path d="M22 4 C20 8 26 8 24 12"/></svg>`,
  squiggle: `<svg viewBox="0 0 80 20" width="80" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M2 10 Q12 0 22 10 T42 10 T62 10 T80 10"/></svg>`,
  lines: `<svg viewBox="0 0 30 30" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 8 H26 M4 15 H26 M4 22 H18"/></svg>`
};

const DOODLE_COLORS = ['var(--pink)', 'var(--cyan)', 'var(--yellow)', 'var(--violet)', 'var(--mint)'];

function buildDoodleLayer() {
  const layer = document.createElement('div');
  layer.className = 'doodle-layer';
  const keys = Object.keys(DOODLE_SVGS);
  const count = window.innerWidth < 700 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('div');
    const type = keys[Math.floor(Math.random() * keys.length)];
    wrap.className = 'doodle';
    wrap.innerHTML = DOODLE_SVGS[type];
    wrap.style.color = DOODLE_COLORS[Math.floor(Math.random() * DOODLE_COLORS.length)];
    wrap.style.top = Math.random() * 100 + '%';
    wrap.style.left = Math.random() * 100 + '%';
    const scale = 0.6 + Math.random() * 1.3;
    wrap.style.transform = `scale(${scale})`;
    const duration = 10 + Math.random() * 18;
    const delay = Math.random() * -20;
    wrap.style.animationDuration = duration + 's';
    wrap.style.animationDelay = delay + 's';
    layer.appendChild(wrap);
  }
  document.body.prepend(layer);
}
document.addEventListener('DOMContentLoaded', buildDoodleLayer);

/* ---------- Scroll reveal ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
});