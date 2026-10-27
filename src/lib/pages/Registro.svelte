<script>
  import { tick } from 'svelte';
  import RegistrationForm from '../components/RegistrationForm.svelte';
  import Ticket from '../components/Ticket.svelte';

  let registro = $state(null);
  let duplicado = $state(false);
  let card;

  async function alRegistrar(r, dup) {
    registro = r;
    duplicado = dup;
    await tick();
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<section class="page">
  <div class="wrap">
    <div class="intro">
      <a class="back" href="#/">← Volver al inicio</a>
      <span class="eyebrow">Rueda de Negocios</span>
      <h1>Registro de <span>participantes</span></h1>
      <p>Complete sus datos, indique el monto que desea mover y elija la empresa con la que quiere reunirse. Al terminar recibe su código y su ticket.</p>
      <ul>
        <li>Un registro por cédula.</li>
        <li>Debe ser mayor de 18 años.</li>
        <li>Presente el ticket y su cédula en la acreditación.</li>
      </ul>
    </div>

    <div class="card" id="registro" bind:this={card}>
      {#if registro}
        <Ticket {registro} {duplicado} onNuevo={() => (registro = null)} />
      {:else}
        <RegistrationForm onRegistrado={alRegistrar} />
      {/if}
    </div>
  </div>
</section>

<style>
  .page { position: relative; }
  .page::before {
    content: ''; position: absolute; inset: 0 0 auto; height: 520px; pointer-events: none;
    background: radial-gradient(800px 420px at 10% 0%, rgba(42, 71, 255, .16), transparent 70%);
  }
  .wrap { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 560px); gap: 56px; padding-block: 48px 80px; align-items: start; }
  .intro { position: sticky; top: 32px; }
  .back { display: block; width: fit-content; color: var(--muted); text-decoration: none; font-size: 14px; margin-bottom: 28px; }
  .back:hover { color: var(--text); }
  h1 { font: italic 700 clamp(40px, 4.8vw, 66px)/.9 var(--f-display); overflow-wrap: anywhere; text-transform: uppercase; margin: 16px 0 20px; text-wrap: balance; }
  h1 span { color: var(--blue); }
  p { color: #c4cae0; max-width: 32em; margin: 0 0 22px; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; color: var(--muted); font-size: 15px; }
  li { display: flex; gap: 10px; align-items: center; }
  li::before { content: ''; width: 10px; height: 2px; background: var(--blue); flex: none; }
  .card { background: var(--panel); border: 1px solid var(--line); position: relative; scroll-margin-top: 16px; }
  .card::before { content: ''; position: absolute; left: -1px; right: -1px; top: -1px; height: 4px; background: var(--tricolor); }
  @media (max-width: 980px) {
    .wrap { grid-template-columns: minmax(0, 1fr); gap: 32px; padding-block: 32px 56px; }
    .intro { position: static; }
    .back { margin-bottom: 18px; }
  }
</style>
