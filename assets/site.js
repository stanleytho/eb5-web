// Exhibit tabs: mark the tab for the part in view.
const strip = document.querySelector('.tabs');
const tabs = [...strip.querySelectorAll('a')];
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    for (const a of tabs) {
      const on = a.getAttribute('href') === '#' + e.target.id;
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      if (on) strip.scrollTo({ left: a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2 }); // sideways only: scrollIntoView would fight the page scroll
    }
  }
}, { rootMargin: '-30% 0px -60% 0px' });
for (const a of tabs) { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); }

// Contact form: post to /api/contact with the Turnstile token.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = form.querySelector('button');
  const data = Object.fromEntries(new FormData(form));
  data.token = data['cf-turnstile-response'];
  button.disabled = true;
  status.textContent = form.dataset.sending;
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error();
    status.textContent = form.dataset.ok;
    form.reset();
  } catch {
    status.textContent = form.dataset.err;
  } finally {
    button.disabled = false;
    window.turnstile?.reset();
  }
});
