<script>
  import QRCode from 'qrcode';
  import html2canvas from 'html2canvas-pro';
  import logo from '../../assets/logo.png';
  import { EMPRESAS, MONTOS } from '../data.js';

  let { registro, duplicado = false, onNuevo } = $props();

  let ticketEl = $state();
  let qrUrl = $state('');
  let estado = $state('');

  const empresa = $derived(EMPRESAS.find((e) => e.id === registro.empresa) ?? { nombre: registro.empresa });
  const monto = $derived(MONTOS.find((m) => m.id === registro.monto) ?? { label: registro.monto });
  const fecha = $derived(new Date(registro.fecha).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }));

  $effect(() => {
    QRCode.toDataURL(`${registro.codigo}|${registro.cedula}`, { width: 360, margin: 1, color: { dark: '#0B1022', light: '#FFFFFF' } })
      .then((url) => (qrUrl = url))
      .catch(() => (qrUrl = ''));
  });

  async function copiar(ev) {
    try {
      await navigator.clipboard.writeText(registro.codigo);
      estado = 'Código copiado.';
    } catch {
      const code = ev.currentTarget.previousElementSibling;
      const r = document.createRange();
      r.selectNodeContents(code);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      estado = 'Código seleccionado: cópielo con Ctrl+C.';
    }
  }

  async function descargar() {
    estado = 'Generando imagen…';
    try {
      const canvas = await html2canvas(ticketEl, { scale: 3, backgroundColor: null });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `ticket-${registro.codigo}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      estado = 'Ticket descargado.';
    } catch {
      estado = 'No se pudo descargar. Haga una captura de pantalla del ticket.';
    }
  }
</script>

<div class="result">
  <div>
    <h2>{duplicado ? 'Esta cédula ya está registrada' : 'Registro confirmado'}</h2>
    <p>
      {duplicado
        ? 'Le mostramos el ticket asociado a su cédula. Preséntelo junto a su cédula en la acreditación.'
        : 'Guarde su código. Preséntelo junto a su cédula en la acreditación de la Rueda de Negocios.'}
    </p>
  </div>

  <div class="codebox">
    <code>{registro.codigo}</code>
    <button class="btn ghost" type="button" onclick={copiar}>Copiar código</button>
  </div>

  <div class="ticket" bind:this={ticketEl}>
    <div class="band"><img src={logo} alt="" /><span>Rueda de<br />Negocios</span></div>
    <div class="stripe"></div>
    <div class="main">
      <div class="name">{registro.nombre} {registro.apellido}</div>
      <dl>
        <div><dt>Cédula</dt><dd>{registro.cedula}</dd></div>
        <div><dt>Empresa</dt><dd>{empresa.nombre}{empresa.nota ? ` (${empresa.nota})` : ''}</dd></div>
        <div><dt>Monto a mover</dt><dd>{monto.label}</dd></div>
        <div><dt>Registrado</dt><dd>{fecha}</dd></div>
      </dl>
    </div>
    <div class="side">
      <div class="qr">{#if qrUrl}<img src={qrUrl} alt="Código QR del ticket" />{/if}</div>
      <div class="code">{registro.codigo}</div>
    </div>
  </div>

  <div class="actions">
    <button class="btn" type="button" onclick={descargar}>Descargar ticket</button>
    <button class="btn ghost" type="button" onclick={onNuevo}>Nuevo registro</button>
  </div>
  <div class="status" aria-live="polite">{estado}</div>
</div>

<style>
  .result { padding: 24px 28px 28px; display: grid; gap: 18px; }
  h2 { font: 700 28px/1 var(--f-display); text-transform: uppercase; margin: 0 0 6px; }
  .result > div > p { margin: 0; color: var(--muted); font-size: 14px; }
  .codebox { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: var(--ink); border: 1px solid var(--line); padding: 12px 14px; }
  .codebox code { font: 600 20px/1.2 var(--f-mono); letter-spacing: .06em; color: #fff; flex: 1 1 auto; white-space: nowrap; }
  .ticket { background: #f4f6fb; color: #0b1022; display: grid; grid-template-columns: minmax(0, 1fr) 150px; overflow: hidden; }
  .band { grid-column: 1 / -1; background: #0a0e1a; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .band img { height: 34px; width: auto; }
  .band span { font: 700 14px/1.1 var(--f-display); letter-spacing: .18em; text-transform: uppercase; color: #fff; text-align: right; }
  .stripe { grid-column: 1 / -1; height: 5px; background: var(--tricolor); }
  .main { padding: 18px 18px 16px; display: grid; gap: 12px; min-width: 0; }
  .name { font: 700 28px/1 var(--f-display); text-transform: uppercase; overflow-wrap: anywhere; }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin: 0; }
  dt { font: 600 11px/1.2 var(--f-display); letter-spacing: .16em; text-transform: uppercase; color: #5a6385; }
  dd { margin: 3px 0 0; font: 600 15px/1.25 var(--f-body); overflow-wrap: anywhere; }
  .side { border-left: 2px dashed #c7cde0; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .qr { width: 116px; height: 116px; background: #fff; padding: 4px; }
  .qr img { width: 100%; height: 100%; }
  .code { font: 600 12px/1.3 var(--f-mono); text-align: center; letter-spacing: .04em; word-break: break-all; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .status { font-size: 13px; color: var(--ok); min-height: 1em; }
  @media (max-width: 640px) {
    .result { padding-left: 18px; padding-right: 18px; }
    .ticket { grid-template-columns: minmax(0, 1fr); }
    .side { border-left: 0; border-top: 2px dashed #c7cde0; flex-direction: row; justify-content: flex-start; }
    .code { text-align: left; }
  }
</style>
