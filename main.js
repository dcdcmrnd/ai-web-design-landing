/* main.js */

/* ── SCROLL DOT ── */
function initScrollDot() {
  const dot = document.getElementById('scroll-dot');
  if (!dot) return;

  const darkSections = document.querySelectorAll('.work-section, .contact-section');

  function update() {
    const scrolled   = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? scrolled / docHeight : 0;
    const minTop     = 80;
    const maxTop     = window.innerHeight - 80;
    dot.style.top    = (minTop + (maxTop - minTop) * pct) + 'px';

    let onDark = false;
    const mid = window.innerHeight / 2;
    darkSections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) onDark = true;
    });
    dot.classList.toggle('on-dark', onDark);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ── MOBILE NAV ── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav-open', !open);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    });
  });
}

/* ── SCROLL SPY ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.site-nav a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollDot();
  initMobileNav();
  initScrollSpy();
});
