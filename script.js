// Scroll reveal
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Form: submit via fetch so the visitor stays on the page
const form = document.querySelector('.form');
const msg = form.querySelector('.form-msg');
form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  msg.className = 'form-msg';
  msg.textContent = 'Enviando…';
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    msg.className = 'form-msg ok';
    msg.textContent = '¡Listo! Te contactamos muy pronto.';
  } catch {
    msg.className = 'form-msg err';
    msg.textContent = 'No se pudo enviar. Intenta de nuevo o escríbenos por redes sociales.';
  }
});
