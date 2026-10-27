<script>
  import { EMPRESAS } from '../data.js';
</script>

<section class="block" id="empresas">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Participan</span>
        <h2>Empresas de la rueda</h2>
      </div>
      <p>Cada participante elige una empresa para su reunión. La organización confirmará el horario asignado.</p>
    </div>
    <div class="grid">
      {#each EMPRESAS as e, i (e.id)}
        <div class="brand">
          <div>
            <b>{e.nombre}</b>
            {#if e.nota}<small>{e.nota}</small>{/if}
          </div>
          <i>{String(i + 1).padStart(2, '0')}</i>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); }
  .brand { background: var(--ink); padding: 26px 22px; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 96px; transition: background .2s; }
  .brand:hover { background: var(--panel); }
  b { font: 700 28px/1 var(--f-display); text-transform: uppercase; letter-spacing: .02em; }
  small { display: block; color: var(--muted); font-size: 13px; margin-top: 4px; }
  i { font: 600 12px/1 var(--f-mono); color: #59617e; font-style: normal; }
  @media (max-width: 640px) {
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    b { font-size: 22px; }
  }
</style>
