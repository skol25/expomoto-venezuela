// Enrutador mínimo por hash (#/ y #/registro). Funciona en Laragon o cualquier hosting sin configurar el servidor.
function leer() {
  const h = location.hash.replace(/^#/, '') || '/';
  return h.startsWith('/') ? h : '/' + h;
}

export const ruta = $state({ actual: leer() });

window.addEventListener('hashchange', () => {
  ruta.actual = leer();
  window.scrollTo({ top: 0 });
});

export function ir(path) {
  location.hash = path;
}
