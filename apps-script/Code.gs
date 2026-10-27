/**
 * Rueda de Negocios — Expomoto Venezuela, Valencia 2026
 * Recibe los registros de la landing y los guarda en esta hoja de cálculo.
 *
 * Instalación:
 * 1. Cree una Hoja de cálculo de Google. Menú Extensiones > Apps Script.
 * 2. Pegue este archivo completo y guarde.
 * 3. Implementar > Nueva implementación > Tipo: Aplicación web.
 *    Ejecutar como: Yo.  Quién tiene acceso: Cualquier usuario.
 * 4. Copie la URL que termina en /exec y péguela en CONFIG.ENDPOINT del index.html.
 */

const HOJA = 'Registros';
const ENCABEZADOS = ['Fecha registro', 'Código', 'Nombre', 'Apellido', 'Cédula', 'Fecha nacimiento', 'Monto (USD)', 'Empresa'];
const EMPRESAS = ['HAOJIN', 'BERA', 'MOTOS TORO', 'KAWASAKI', 'YAMAHA', 'BENSERCA', 'MOTOS BEL', 'EUROGRIP', 'WELLSTAR'];
const MONTOS = {
  '50-100': '$50 mil – $100 mil',
  '100-150': '$100 mil – $150 mil',
  '150-250': '$150 mil – $250 mil',
  '250+': '$250 mil en adelante'
};
const ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.appendRow(ENCABEZADOS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function codigo_(empresa, existentes) {
  const pref = (empresa.replace(/[^A-Z]/g, '') + 'XXX').slice(0, 3);
  let c;
  do {
    let r = '';
    for (let i = 0; i < 5; i++) r += ALFA.charAt(Math.floor(Math.random() * ALFA.length));
    c = 'EMV26-' + pref + '-' + r;
  } while (existentes.has(c));
  return c;
}

function doGet() {
  return json_({ ok: true, servicio: 'Rueda de Negocios EMV26' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents || '{}');
    const nombre = String(d.nombre || '').trim();
    const apellido = String(d.apellido || '').trim();
    const cedula = String(d.cedula || '').trim().toUpperCase();
    const nacimiento = String(d.nacimiento || '').trim();
    const monto = String(d.monto || '');
    const empresa = String(d.empresa || '');

    if (nombre.length < 2 || apellido.length < 2) return json_({ ok: false, error: 'Nombre y apellido son obligatorios.' });
    if (!/^[VE]-\d{6,9}$/.test(cedula)) return json_({ ok: false, error: 'La cédula no es válida.' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nacimiento)) return json_({ ok: false, error: 'La fecha de nacimiento no es válida.' });
    if (!MONTOS[monto]) return json_({ ok: false, error: 'Seleccione un rango de monto válido.' });
    if (EMPRESAS.indexOf(empresa) < 0) return json_({ ok: false, error: 'Seleccione una empresa de la lista.' });

    const sh = hoja_();
    const datos = sh.getDataRange().getValues().slice(1);
    const codigos = new Set(datos.map(r => r[1]));
    const previo = datos.find(r => String(r[4]).toUpperCase() === cedula);
    if (previo) {
      const montoId = Object.keys(MONTOS).find(k => MONTOS[k] === previo[6]) || previo[6];
      return json_({ ok: true, duplicate: true, registro: {
        fecha: new Date(previo[0]).toISOString(), codigo: previo[1], nombre: previo[2], apellido: previo[3],
        cedula: previo[4], nacimiento: previo[5], monto: montoId, empresa: previo[7]
      }});
    }

    const fecha = new Date();
    const codigo = codigo_(empresa, codigos);
    sh.appendRow([fecha, codigo, nombre, apellido, cedula, "'" + nacimiento, MONTOS[monto], empresa]);
    return json_({ ok: true, registro: { fecha: fecha.toISOString(), codigo, nombre, apellido, cedula, nacimiento, monto, empresa } });
  } catch (err) {
    return json_({ ok: false, error: 'Error del servidor. Intente de nuevo.' });
  } finally {
    lock.releaseLock();
  }
}
