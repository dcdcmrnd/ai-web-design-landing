/* main.js — contact form handler only (nav/scroll handled by animations.js) */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const ACTION = form.dataset.action || '#';
    if (ACTION === '#') {
      await new Promise(r => setTimeout(r, 700));
      btn.textContent = '✓ Sent — we\'ll reply within 24 hours.';
      btn.style.background = 'var(--teal)';
      btn.style.color = 'var(--dark)';
      form.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 5000);
      return;
    }

    try {
      const res = await fetch(ACTION, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        btn.textContent = '✓ Sent!';
        form.reset();
      } else throw new Error();
    } catch {
      btn.textContent = 'Error — please email us directly.';
      btn.style.background = '#aa3333';
      btn.disabled = false;
    }

    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 5000);
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
