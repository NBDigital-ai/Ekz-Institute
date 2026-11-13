// Iconos: se inyecta el sprite en la página para que CSS y JS puedan animar sus partes (con <use> no se puede)
fetch('assets/icons.svg').then((r) => r.text()).then((txt) => {
  const sprite = new DOMParser().parseFromString(txt, 'image/svg+xml');
  document.querySelectorAll('svg.ico use').forEach((use) => {
    const id = use.getAttribute('href').split('#')[1], sym = sprite.getElementById(id), svg = use.parentElement;
    if (!sym) return;
    svg.setAttribute('viewBox', sym.getAttribute('viewBox')); svg.classList.add(id);
    use.replaceWith(...[...sym.children].map((c) => document.importNode(c, true)));
  });
}).catch(() => { /* sin fetch (file://), los <use> siguen mostrando el icono estático */ });

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
