// Scroll reveal
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Logo vivo: pupilas que siguen el cursor. data-ox/oy = posición de reposo (la del logo original), en fracción del ojo
const pupils = document.querySelectorAll('.pupil');
function placePupils(ev) {
  for (const p of pupils) {
    const r = p.parentElement.getBoundingClientRect();
    let x = r.width * +p.dataset.ox, y = r.width * +p.dataset.oy;
    if (ev) {
      const dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2);
      const a = Math.atan2(dy, dx), d = Math.min(r.width * 0.2, Math.hypot(dx, dy) / 15);
      x = Math.cos(a) * d; y = Math.sin(a) * d;
    }
    p.style.transform = `translate(${x}px, ${y}px)`;
  }
}
placePupils();
addEventListener('resize', () => placePupils());
addEventListener('pointermove', placePupils, { passive: true });

// Tarjetas de cursos que se voltean
document.querySelectorAll('.flip').forEach((card) => {
  const toggle = () => card.classList.toggle('flipped');
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

// Sonido y voz (sin archivos): tono corto + el navegador pronuncia la palabra
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

// Mini juego de vocabulario
const GAME = [
  { emoji: '🐱', answer: 'cat', options: ['cat', 'dog', 'fish'] },
  { emoji: '🍎', answer: 'apple', options: ['bread', 'apple', 'banana'] },
  { emoji: '🔵', answer: 'blue', options: ['red', 'green', 'blue'] },
  { emoji: '🐘', answer: 'elephant', options: ['elephant', 'lion', 'monkey'] },
  { emoji: '☀️', answer: 'sun', options: ['moon', 'sun', 'star'] },
];
const gEmoji = document.getElementById('game-emoji');
const gOptions = document.getElementById('game-options');
const gStatus = document.getElementById('game-status');
let gIndex = 0, gScore = 0;

function renderGame() {
  if (gIndex >= GAME.length) {
    gEmoji.textContent = gScore === GAME.length ? '🏆' : '🎉';
    gOptions.innerHTML = `<button class="btn" type="button" id="game-again">Jugar otra vez</button>
      <a class="btn btn-ghost" href="#clase-muestra">Agenda tu clase muestra</a>`;
    gStatus.textContent = `¡Acertaste ${gScore} de ${GAME.length}! Así de divertido es aprender con nosotros.`;
    document.getElementById('game-again').onclick = () => { gIndex = 0; gScore = 0; renderGame(); };
    return;
  }
  const q = GAME[gIndex];
  gEmoji.textContent = q.emoji;
  gStatus.textContent = `Pregunta ${gIndex + 1} de ${GAME.length}`;
  gOptions.innerHTML = '';
  for (const opt of q.options) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'game-opt'; b.textContent = opt;
    b.onclick = () => {
      const ok = opt === q.answer;
      b.classList.add(ok ? 'ok' : 'bad');
      gOptions.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.textContent === q.answer) x.classList.add('ok'); });
      if (ok) { gScore++; tone(880, 150); setTimeout(() => tone(1320, 200), 120); gStatus.textContent = '¡Muy bien! 🎉'; }
      else { tone(220, 250); gStatus.textContent = `Casi. Se dice "${q.answer}".`; }
      say(q.answer);
      setTimeout(() => { gIndex++; renderGame(); }, 1300);
    };
    gOptions.appendChild(b);
  }
}
renderGame();

// Test de nivel (adultos): 6 preguntas de dificultad creciente
const LEVEL = [
  { q: '___ name is Ana.', options: ['My', 'Me', 'I'], answer: 'My' },
  { q: 'She ___ to work every day.', options: ['go', 'goes', 'going'], answer: 'goes' },
  { q: 'I have lived here ___ 2019.', options: ['for', 'from', 'since'], answer: 'since' },
  { q: 'If I ___ more time, I would travel.', options: ['had', 'have', 'would have'], answer: 'had' },
  { q: 'The report ___ by Friday.', options: ['must finish', 'must be finished', 'must finishing'], answer: 'must be finished' },
  { q: '___ the rain, the event went ahead.', options: ['Although', 'Even', 'Despite'], answer: 'Despite' },
];
const LEVEL_NAMES = ['A1 · A2 básico', 'B1 · B2 intermedio', 'C1 · C2 avanzado'];
function levelFor(correct) { return LEVEL_NAMES[correct <= 2 ? 0 : correct <= 4 ? 1 : 2]; }

const lProgress = document.getElementById('level-progress');
const lQ = document.getElementById('level-q');
const lOptions = document.getElementById('level-options');
let lIndex = 0, lScore = 0;

function renderLevel() {
  if (lIndex >= LEVEL.length) {
    const level = levelFor(lScore);
    lProgress.textContent = `Acertaste ${lScore} de ${LEVEL.length}`;
    lQ.textContent = `Te sugerimos empezar en: ${level}`;
    lOptions.innerHTML = `<button class="btn" type="button" id="level-use">Agendar con este nivel</button>
      <button class="btn btn-ghost" type="button" id="level-again">Repetir</button>`;
    document.getElementById('level-use').onclick = () => {
      document.getElementById('nivel-select').value = level;
      document.getElementById('clase-muestra').scrollIntoView({ behavior: 'smooth' });
    };
    document.getElementById('level-again').onclick = () => { lIndex = 0; lScore = 0; renderLevel(); };
    return;
  }
  const q = LEVEL[lIndex];
  lProgress.textContent = `Pregunta ${lIndex + 1} de ${LEVEL.length}`;
  lQ.textContent = q.q;
  lOptions.innerHTML = '';
  for (const opt of q.options) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'game-opt'; b.textContent = opt;
    b.onclick = () => {
      const ok = opt === q.answer;
      b.classList.add(ok ? 'ok' : 'bad');
      lOptions.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.textContent === q.answer) x.classList.add('ok'); });
      if (ok) lScore++;
      setTimeout(() => { lIndex++; renderLevel(); }, 700);
    };
    lOptions.appendChild(b);
  }
}
renderLevel();

// Formulario: envía con fetch para que el visitante no salga de la página
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

// Autocomprobación de la lógica de nivel y de los datos del juego
console.assert(levelFor(0) === LEVEL_NAMES[0] && levelFor(2) === LEVEL_NAMES[0], 'nivel básico');
console.assert(levelFor(3) === LEVEL_NAMES[1] && levelFor(4) === LEVEL_NAMES[1], 'nivel intermedio');
console.assert(levelFor(5) === LEVEL_NAMES[2] && levelFor(6) === LEVEL_NAMES[2], 'nivel avanzado');
console.assert([...GAME, ...LEVEL].every((q) => q.options.includes(q.answer)), 'cada pregunta contiene su respuesta');
console.assert(LEVEL_NAMES.every((n) => [...document.getElementById('nivel-select').options].some((o) => o.text === n)), 'niveles coinciden con el formulario');
