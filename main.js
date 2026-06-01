/* main.js — loads content from content.json, wires up mobile nav and contact form */

async function loadContent() {
  try {
    const res = await fetch('content.json');
    if (!res.ok) throw new Error('content.json not found');
    const data = await res.json();
    renderServicesTable(data.services);
    renderProcessTimeline(data.process);
  } catch (err) {
    console.warn('Static fallback active:', err.message);
  }
}

function renderServicesTable(services) {
  const tbody = document.getElementById('services-tbody');
  if (!tbody || !Array.isArray(services)) return;

  tbody.innerHTML = services.map(s => `
    <tr>
      <td class="service-name">
        <span class="service-icon-sm" aria-hidden="true">${s.icon}</span>
        <span>${s.name}</span>
      </td>
      <td>${s.bestFor}</td>
      <td class="service-timeline">${s.timeline}</td>
      <td class="service-price">${s.startingAt}</td>
      <td><a href="#contact" class="btn-sm">Get Started</a></td>
    </tr>
  `).join('');

  const wrap = document.querySelector('.services-table-wrap');
  if (wrap) wrap.hidden = false;

  const fallback = document.getElementById('services-fallback');
  if (fallback) fallback.hidden = true;
}

function renderProcessTimeline(steps) {
  const container = document.getElementById('process-timeline');
  if (!container || !Array.isArray(steps)) return;

  container.innerHTML = steps.map((step, i) => `
    <article class="process-step">
      <div class="step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
      <div class="step-body">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
        <span class="step-time">${step.timeframe}</span>
      </div>
    </article>
  `).join('');
}

/* Mobile nav toggle */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const cta = document.querySelector('.header-cta');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav-open', !open);
    if (cta) cta.classList.toggle('cta-open', !open);
  });

  /* Close nav when a link is clicked */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
      if (cta) cta.classList.remove('cta-open');
    });
  });
}

/* Contact form — connects to Formspree; swap ACTION_URL before deploying */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* Replace ACTION_URL with your Formspree endpoint, e.g. https://formspree.io/f/yourcode */
    const ACTION_URL = form.dataset.action || '#';

    if (ACTION_URL === '#') {
      /* Demo mode — no real submission */
      await new Promise(r => setTimeout(r, 600));
      btn.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';
      btn.style.background = 'var(--seafoam)';
      btn.style.color = 'var(--ocean-deep)';
      form.reset();
      return;
    }

    try {
      const res = await fetch(ACTION_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        btn.textContent = '✓ Sent! We\'ll reply within 24 hours.';
        btn.style.background = 'var(--seafoam)';
        btn.style.color = 'var(--ocean-deep)';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Error — please email us directly.';
      btn.style.background = '#cc4444';
      btn.disabled = false;
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 5000);
  });
}

/* Active nav link on scroll */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  initMobileNav();
  initContactForm();
  initScrollSpy();
});
