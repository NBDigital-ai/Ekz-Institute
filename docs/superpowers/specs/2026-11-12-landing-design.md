# English Kids Zone Institute — landing page

## Intención
Página única, en español, para una escuela de inglés 100 % online. Público principal: padres de niños de 4 a 12 años; secundario: adultos. Objetivo: que agenden una clase muestra.

## Alcance
- Sí: hero, para quién, cursos (A1-A2 / B1-B2 / C1-C2, lunes-miércoles-viernes), preparación Cambridge (Starters…Proficiency, sin precios), cómo funciona, formulario de clase muestra, pie con Facebook e Instagram.
- No: precios de mensualidades, precios de exámenes, WhatsApp (queda oculto hasta que exista), blog, múltiples páginas, inglés.

## Enfoques
- Estático HTML/CSS/JS en GitHub Pages — **elegido**: rápido, gratis, sin mantenimiento.
- Generador/framework — descartado: nada que justifique el peso.

## Decisiones
- Formulario → Formspree. El endpoint queda como marcador `FORMSPREE_ID` hasta que exista el correo de la escuela.
- Redes: enlaces marcadores en el pie; WhatsApp es un botón con `hidden` listo para activar.
- Paleta del logo: rojo #E8231D, amarillo #F5C400, azul #1BA8E0, marino #1F2B4D, crema #F5F0E1. Tipografía redondeada (Fredoka + Nunito).
- El hero usa el logo original tal cual (no una recreación). Interacción ligera: reveal al hacer scroll, validación nativa del formulario.

## Plan
1. `index.html` + `style.css` + `script.js` + `assets/logo.webp`.
2. Verificar a 375 px y 1280 px en el navegador.
3. Commit, push a `main`, activar GitHub Pages.
