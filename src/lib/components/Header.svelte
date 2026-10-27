<script>
  import logo from '../../assets/logo.png';
  import { ruta } from '../router.svelte.js';
</script>

<div class="tricolor"></div>
<header>
  <div class="wrap">
    <a href="#/" class="brand" aria-label="Ir al inicio"><img src={logo} alt="Expomoto Venezuela Valencia 2026" /></a>
    <div class="right">
      {#if ruta.actual === '/registro'}
        <div class="edition"><b>Rueda de Negocios</b>4ta edición</div>
      {:else}
        <div class="edition"><b>Valencia 2026</b>4ta edición</div>
      {/if}
      {#if ruta.actual !== '/registro'}
        <a class="btn small" href="#/registro">Registrarse</a>
      {/if}
    </div>
  </div>
</header>

<style>
  header { border-bottom: 1px solid var(--line); }
  .wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-block: 18px; }
  img { height: 46px; width: auto; }
  .right { display: flex; align-items: center; gap: 24px; }
  .edition { font: 600 13px/1.2 var(--f-display); letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-align: right; }
  .edition b { display: block; color: var(--text); font-size: 15px; }
  .small { font-size: 16px; padding: 12px 22px 12px 18px; text-decoration: none; }
  @media (max-width: 640px) {
    img { height: 34px; }
    .edition { display: none; }
    .small { font-size: 14px; padding: 10px 18px 10px 14px; }
  }
</style>
