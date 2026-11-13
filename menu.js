// Menú hamburguesa, compartido por todas las páginas
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('drawer-backdrop');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
backdrop.addEventListener('click', () => setMenu(false));
drawer.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
