/* page2.js */

/* ── PAGE INTRO ── */
function initIntro() {
  const intro = document.getElementById('page-intro');
  const hero  = document.querySelector('.hero-section');
  if (!intro) return;
  requestAnimationFrame(() => {
    intro.classList.add('out');
    setTimeout(() => intro.remove(), 900);
  });
  if (hero) setTimeout(() => hero.classList.add('loaded'), 260);
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

/* ── STAT COUNTERS ── */
function initCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400, start = performance.now();
        const grad = el.classList.contains('text-gradient');
        if (grad) {
          el.style.background = 'linear-gradient(135deg,#38BDF8,#2DD4BF)';
          el.style.webkitBackgroundClip = 'text';
          el.style.webkitTextFillColor = 'transparent';
          el.style.backgroundClip = 'text';
        }
        (function tick(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (grad) {
            el.style.background = 'linear-gradient(135deg,#38BDF8,#2DD4BF)';
            el.style.webkitBackgroundClip = 'text';
            el.style.webkitTextFillColor = 'transparent';
            el.style.backgroundClip = 'text';
          }
          if (t < 1) requestAnimationFrame(tick);
        })(start);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    io.observe(el);
  });
}

/* ── HERO PARALLAX ── */
function initParallax() {
  const hero = document.querySelector('.hero-inner');
  if (!hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        hero.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── HEADER SCROLL ── */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── SCROLL DOT ── */
function initScrollDot() {
  const dot = document.getElementById('scroll-dot');
  if (!dot) return;
  function update() {
    const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    dot.style.top = (72 + (window.innerHeight - 144) * pct) + 'px';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ── MOBILE NAV ── */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav-open', !open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav-open');
  }));
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

/* ── SERVICE CARD MOUSE GLOW ── */
function initCardGlow() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initReveal();
  initCounters();
  initParallax();
  initHeader();
  initScrollDot();
  initNav();
  initScrollSpy();
  initCardGlow();
});
