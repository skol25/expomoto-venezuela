const ENDPOINT = (import.meta.env.VITE_ENDPOINT || '').trim();
const STORAGE_KEY = 'rueda_emv26';
const ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const modoDemo = !ENDPOINT;

export function generarCodigo(empresa) {
  const pref = empresa.replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, 'X');
  const buf = new Uint32Array(5);
  crypto.getRandomValues(buf);
  let r = '';
  buf.forEach((n) => (r += ALFA[n % ALFA.length]));
  return `EMV26-${pref}-${r}`;
}

function guardarDemo(datos) {
  let lista = [];
  try { lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch {}
  const previo = lista.find((r) => r.cedula === datos.cedula);
  if (previo) return { ok: true, duplicate: true, registro: previo };
  const registro = { ...datos, codigo: generarCodigo(datos.empresa), fecha: new Date().toISOString() };
  lista.push(registro);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lista)); } catch {}
  return { ok: true, registro };
}

export async function registrar(datos) {
  if (modoDemo) return guardarDemo(datos);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    // text/plain evita la verificación previa (CORS) de Apps Script
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'registrar', ...datos })
  });
  if (!res.ok) throw new Error('No se pudo conectar con el servidor.');
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'No se pudo completar el registro.');
  return json;
}
