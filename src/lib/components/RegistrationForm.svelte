<script>
  import { EMPRESAS, MONTOS } from '../data.js';
  import { registrar, modoDemo } from '../api.js';

  let { onRegistrado } = $props();

  const vacio = () => ({ nombre: '', apellido: '', nac: 'V', cedula: '', nacimiento: '', monto: '', empresa: '', acepto: false });
  let f = $state(vacio());
  let errores = $state({});
  let errorGeneral = $state('');
  let enviando = $state(false);

  const hoy = new Date();
  const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()).toISOString().slice(0, 10);
  const nombreRe = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{2,40}$/;

  function edad(iso) {
    const d = new Date(iso + 'T00:00:00');
    let a = hoy.getFullYear() - d.getFullYear();
    const m = hoy.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < d.getDate())) a--;
    return a;
  }

  function validar() {
    const e = {};
    if (!nombreRe.test(f.nombre.trim())) e.nombre = 'Escriba su nombre (solo letras).';
    if (!nombreRe.test(f.apellido.trim())) e.apellido = 'Escriba su apellido (solo letras).';
    if (!/^\d{6,9}$/.test(f.cedula)) e.cedula = 'La cédula debe tener entre 6 y 9 dígitos.';
    if (!f.nacimiento) e.nacimiento = 'Indique su fecha de nacimiento.';
    else if (edad(f.nacimiento) < 18) e.nacimiento = 'Debe ser mayor de 18 años.';
    if (!f.monto) e.monto = 'Seleccione un rango de monto.';
    if (!f.empresa) e.empresa = 'Seleccione una empresa.';
    errores = e;
    return Object.keys(e).length === 0;
  }

  function soloDigitos(ev) {
    f.cedula = ev.currentTarget.value.replace(/\D/g, '').slice(0, 10);
  }

  async function enviar(ev) {
    ev.preventDefault();
    errorGeneral = '';
    if (!validar()) {
      document.querySelector('.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!f.acepto) { errorGeneral = 'Confirme la autorización de uso de datos para continuar.'; return; }
    enviando = true;
    try {
      const r = await registrar({
        nombre: f.nombre.trim().replace(/\s+/g, ' '),
        apellido: f.apellido.trim().replace(/\s+/g, ' '),
        cedula: `${f.nac}-${f.cedula}`,
        nacimiento: f.nacimiento,
        monto: f.monto,
        empresa: f.empresa
      });
      f = vacio();
      onRegistrado(r.registro, !!r.duplicate);
    } catch (err) {
      errorGeneral = err?.message || 'No se pudo completar el registro. Revise su conexión e intente de nuevo.';
    } finally {
      enviando = false;
    }
  }
</script>

<div class="head">
  <h2>Inscripción</h2>
  <p>Todos los campos son obligatorios. Un registro por cédula.</p>
</div>

<form onsubmit={enviar} novalidate>
  <div class="row">
    <div class="field" class:invalid={errores.nombre}>
      <label for="nombre">Nombre</label>
      <input id="nombre" type="text" autocomplete="given-name" placeholder="Ej. María" bind:value={f.nombre} />
      {#if errores.nombre}<div class="msg">{errores.nombre}</div>{/if}
    </div>
    <div class="field" class:invalid={errores.apellido}>
      <label for="apellido">Apellido</label>
      <input id="apellido" type="text" autocomplete="family-name" placeholder="Ej. González" bind:value={f.apellido} />
      {#if errores.apellido}<div class="msg">{errores.apellido}</div>{/if}
    </div>
  </div>

  <div class="row">
    <div class="field" class:invalid={errores.cedula}>
      <label for="cedula">Cédula</label>
      <div class="ced">
        <select id="nac" aria-label="Nacionalidad" bind:value={f.nac}>
          <option value="V">V</option>
          <option value="E">E</option>
        </select>
        <input id="cedula" type="text" inputmode="numeric" maxlength="10" placeholder="12345678" value={f.cedula} oninput={soloDigitos} />
      </div>
      {#if errores.cedula}<div class="msg">{errores.cedula}</div>{/if}
    </div>
    <div class="field" class:invalid={errores.nacimiento}>
      <label for="nacimiento">Fecha de nacimiento</label>
      <input id="nacimiento" type="date" min="1920-01-01" max={fechaMax} bind:value={f.nacimiento} />
      {#if errores.nacimiento}<div class="msg">{errores.nacimiento}</div>{/if}
    </div>
  </div>

  <fieldset class:invalid={errores.monto}>
    <legend>¿Cuánto dinero desea mover? (USD)</legend>
    <div class="amounts opts">
      {#each MONTOS as m, i (m.id)}
        <label class="opt">
          <input type="radio" name="monto" id="monto-{i}" value={m.id} bind:group={f.monto} />
          <span><b>{m.corto}</b><small>{m.label}</small></span>
        </label>
      {/each}
    </div>
    {#if errores.monto}<div class="msg">{errores.monto}</div>{/if}
  </fieldset>

  <fieldset class:invalid={errores.empresa}>
    <legend>Empresa con la que desea reunirse</legend>
    <div class="brands opts">
      {#each EMPRESAS as e, i (e.id)}
        <label class="opt">
          <input type="radio" name="empresa" id="emp-{i}" value={e.id} bind:group={f.empresa} />
          <span><b>{e.nombre}</b>{#if e.nota}<small>{e.nota}</small>{/if}</span>
        </label>
      {/each}
    </div>
    {#if errores.empresa}<div class="msg">{errores.empresa}</div>{/if}
  </fieldset>

  <label class="consent">
    <input type="checkbox" id="acepto" bind:checked={f.acepto} />
    <span>Confirmo que los datos son correctos y autorizo su uso por la organización de Expomoto Venezuela para coordinar la Rueda de Negocios.</span>
  </label>

  {#if errorGeneral}<div class="form-error" role="alert">{errorGeneral}</div>{/if}

  <button class="btn" type="submit" disabled={enviando}>{enviando ? 'Registrando…' : 'Registrarme'}</button>
</form>

{#if modoDemo}
  <p class="demo">Modo demostración: los registros se guardan solo en este navegador. Configure VITE_ENDPOINT para recibirlos en Google Sheets.</p>
{/if}

<style>
  .head { padding: 26px 28px 6px; }
  h2 { font: 700 30px/1 var(--f-display); text-transform: uppercase; margin: 0 0 6px; letter-spacing: .02em; }
  .head p { margin: 0; color: var(--muted); font-size: 14px; }
  form { padding: 18px 28px 28px; display: grid; gap: 18px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field { display: grid; gap: 6px; min-width: 0; align-content: start; }
  label, legend { font: 600 13px/1.2 var(--f-display); letter-spacing: .14em; text-transform: uppercase; color: #b7bed6; }
  legend { padding: 0; margin-bottom: 8px; }
  input[type='text'], input[type='date'], select {
    width: 100%; min-width: 0; background: var(--ink); border: 1px solid var(--line); color: var(--text);
    font: 500 16px/1.2 var(--f-body); padding: 12px; border-radius: 2px; outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  input::placeholder { color: #5d6683; }
  input:focus, select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(42, 71, 255, .25); }
  .ced { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 8px; }
  .invalid input[type='text'], .invalid input[type='date'], .invalid select { border-color: var(--err); }
  .msg { font-size: 13px; color: var(--err); }
  fieldset { border: 0; margin: 0; padding: 0; display: grid; gap: 8px; min-width: 0; }
  fieldset.invalid .opts { outline: 1px solid var(--err); outline-offset: 3px; }
  .amounts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .brands { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .opt { position: relative; letter-spacing: 0; }
  .opt input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
  .opt span {
    display: flex; flex-direction: column; gap: 2px; height: 100%;
    border: 1px solid var(--line); background: var(--ink); padding: 11px 12px; cursor: pointer;
    transition: border-color .15s, background .15s;
  }
  .opt b { font: 700 21px/1 var(--f-display); color: var(--text); font-variant-numeric: tabular-nums; }
  .opt small { color: var(--muted); font: 500 12px/1.3 var(--f-body); text-transform: none; }
  .brands .opt span { align-items: center; justify-content: center; text-align: center; min-height: 52px; padding: 8px; }
  .brands .opt b { font-size: 17px; text-transform: uppercase; }
  .opt input:checked + span { border-color: var(--blue); background: rgba(42, 71, 255, .14); }
  .opt input:focus-visible + span { box-shadow: 0 0 0 3px rgba(42, 71, 255, .35); }
  .consent { display: flex; gap: 10px; align-items: flex-start; font: 400 13px/1.45 var(--f-body); letter-spacing: 0; text-transform: none; color: var(--muted); }
  .consent input { margin-top: 2px; width: 16px; height: 16px; accent-color: var(--blue); flex: none; }
  .form-error { background: rgba(255, 107, 122, .1); border: 1px solid rgba(255, 107, 122, .4); color: #ffc3ca; padding: 10px 12px; font-size: 14px; }
  .demo { font-size: 12px; color: var(--muted); border-top: 1px dashed var(--line); padding: 12px 28px 18px; margin: 0; }
  @media (max-width: 640px) {
    .row { grid-template-columns: 1fr; }
    .brands { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .head, form, .demo { padding-left: 18px; padding-right: 18px; }
  }
</style>
