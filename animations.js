/* animations.js — premium scroll reveals, cursor, counters, parallax */

/* ── PAGE INTRO ── */
function initIntro() {
  const intro = document.getElementById('page-intro');
  const hero  = document.querySelector('.hero-section');
  if (!intro) return;

  /* Fade out the dark overlay */
  requestAnimationFrame(() => {
    intro.classList.add('out');
    setTimeout(() => intro.remove(), 900);
  });

  /* Trigger hero text reveal after overlay starts fading */
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 250);
  }
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -72px 0px', threshold: 0.08 });

  els.forEach(el => io.observe(el));
}

/* ── CUSTOM CURSOR ── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cur-dot';
  ring.className = 'cur-ring';
  document.body.append(dot, ring);

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Ring follows with lerp for fluid lag */
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  /* Expand ring on hoverable elements */
  const targets = 'a, button, .service-card, .pricing-card, .project-card, .btn-hero, .btn-pricing';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  /* Flip color on dark sections */
  const darkSections = document.querySelectorAll('.work-section, .contact-section');
  function checkDark() {
    const mid = window.innerHeight / 2;
    let onDark = false;
    darkSections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) onDark = true;
    });
    dot.classList.toggle('on-dark', onDark);
    ring.classList.toggle('on-dark', onDark);
  }
  window.addEventListener('scroll', checkDark, { passive: true });
  checkDark();
}

/* ── STAT COUNTERS ── */
function initCounters() {
  const items = document.querySelectorAll('.stat-num[data-count]');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1400;
      const start  = performance.now();

      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        /* Ease out cubic */
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(start);

      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  items.forEach(el => io.observe(el));
}

/* ── PARALLAX HERO ── */
function initParallax() {
  const hero = document.querySelector('.hero-inner');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        /* Subtle — only moves at 18% of scroll speed */
        hero.style.transform = `translateY(${y * 0.18}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── HEADER BLUR ON SCROLL ── */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── SCROLL DOT (combined here to share dark-section check) ── */
function initScrollDot() {
  const dot = document.getElementById('scroll-dot');
  if (!dot) return;

  const darkSections = document.querySelectorAll('.work-section, .contact-section');

  function update() {
    const pct    = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const minTop = 72;
    const maxTop = window.innerHeight - 72;
    dot.style.top = (minTop + (maxTop - minTop) * pct) + 'px';

    const mid = window.innerHeight / 2;
    let onDark = false;
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

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initReveal();
  initCursor();
  initCounters();
  initParallax();
  initHeader();
  initScrollDot();
  initNav();
  initScrollSpy();
});
