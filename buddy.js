// Mascota y piezas compartidas por todas las páginas: pupilas, voz, festejo y el acompañante de scroll

// Pupilas que siguen el cursor: las del logo y la mascota (.pupil, divs) y las de los iconos (.ico-pupil, SVG).
// data-ox/oy = posición de reposo, en fracción del ojo. Se consultan en cada evento porque los iconos llegan después (menu.js).
function placePupils(ev) {
  for (const p of document.querySelectorAll('.pupil, .ico-pupil')) {
    const svg = p.ownerSVGElement;
    const r = (svg || p.parentElement).getBoundingClientRect();
    let x = r.width * +(p.dataset.ox || 0), y = r.width * +(p.dataset.oy || 0);
    if (ev) {
      const dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2);
      const a = Math.atan2(dy, dx), d = Math.min(r.width * (svg ? 0.1 : 0.2), Math.hypot(dx, dy) / 15);
      x = Math.cos(a) * d; y = Math.sin(a) * d;
    }
    if (svg) { const k = 40 / r.width; p.setAttribute('transform', `translate(${x * k} ${y * k})`); }
    else p.style.transform = `translate(${x}px, ${y}px)`;
  }
}
placePupils();
addEventListener('resize', () => placePupils());
addEventListener('pointermove', placePupils, { passive: true });

// Sonido y voz sin archivos: tono corto + el navegador pronuncia en inglés
let audio;
function tone(freq, ms) {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(audio.destination);
    g.gain.setValueAtTime(0.15, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + ms / 1000);
    o.start(); o.stop(audio.currentTime + ms / 1000);
  } catch { /* sin audio, sin drama */ }
}
function say(word) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'en-US'; u.rate = 0.85;
  speechSynthesis.speak(u);
}

// Festejo: brinco de los logos y guiño de los ojos que existan en la página
function celebrate() {
  for (const el of document.querySelectorAll('.logo-wrap, .brand img')) { el.classList.remove('happy'); void el.offsetWidth; el.classList.add('happy'); }
  for (const eye of document.querySelectorAll('.logo-wrap .eye, .buddy .eye')) {
    eye.classList.add('wink'); setTimeout(() => eye.classList.remove('wink'), 450);
  }
}

// Mascota. En la portada acompaña el scroll y saluda por sección; en otras páginas se queda abajo a la derecha.
// shortcut: "solo menores de 12" se decide con el grupo elegido en la portada (localStorage); cuando haya cuentas, por fecha de nacimiento
const buddy = document.getElementById('buddy');
if (buddy && buddy.dataset.kidsOnly !== undefined && localStorage.getItem('ekzGroup') === 'Adulto') buddy.remove();
if (buddy && buddy.isConnected) {
  const bubble = document.getElementById('buddy-bubble');
  let bubbleTimer;
  const greet = (text) => {
    bubble.textContent = text; bubble.classList.add('show');
    clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2500);
  };
  const GREETINGS = { inicio: '¡Hola! 👋', quienes: 'Para peques… y grandes', cursos: 'Toca una tarjeta', juego: '¿Jugamos?', cambridge: '¡Rumbo a Cambridge!', nivel: '¡Tú puedes!', como: 'Es muy fácil', 'clase-muestra': '¡Agenda tu clase!' };
  const sections = Object.keys(GREETINGS).map((id) => document.getElementById(id)).filter(Boolean);

  if (sections.length) {
    let walkTimer, lastGreeting = '';
    const moveBuddy = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? scrollY / max : 0;
      const top = 90, bottom = innerHeight - buddy.offsetHeight - 24;
      buddy.style.transform = `translateY(${top + progress * (bottom - top)}px)`;
      buddy.classList.add('walking');
      clearTimeout(walkTimer);
      walkTimer = setTimeout(() => {
        buddy.classList.remove('walking');
        const mid = scrollY + innerHeight / 2;
        const current = sections.filter((s) => s.offsetTop <= mid).pop();
        if (current && current.id !== lastGreeting) { lastGreeting = current.id; greet(GREETINGS[current.id]); }
      }, 180);
    };
    addEventListener('scroll', moveBuddy, { passive: true });
    addEventListener('resize', moveBuddy);
    moveBuddy();
    setTimeout(() => greet(GREETINGS.inicio), 800);
  } else {
    buddy.classList.add('parked');
    setTimeout(() => greet(buddy.dataset.greeting || '¡Hola! 👋'), 800);
  }

  const go = () => {
    say('Hello!'); celebrate();
    const target = buddy.dataset.go || '#clase-muestra';
    if (target.startsWith('#')) document.querySelector(target).scrollIntoView({ behavior: 'smooth' }); else location.href = target;
  };
  buddy.addEventListener('click', go);
  buddy.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
}
