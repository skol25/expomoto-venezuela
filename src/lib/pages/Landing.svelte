<script>
  import logo from '../../assets/logo.png';
  import { EMPRESAS } from '../data.js';
</script>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">4ta edición · Valencia 2026</span>
    <img class="logo" src={logo} alt="Expomoto Venezuela Valencia 2026" />
    <p class="lead">
      La feria que reúne a marcas, distribuidores, compradores y amantes de las motos en Venezuela.
    </p>
    <a class="btn cta" href="#/registro">Registrarse</a>
  </div>
</section>

<section class="block">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Marcas</span>
        <h2>Presentes en la expo</h2>
      </div>
    </div>
    <ul class="marcas">
      {#each EMPRESAS as e (e.id)}
        <li>{e.nombre}{#if e.nota}<small>{e.nota}</small>{/if}</li>
      {/each}
    </ul>
  </div>
</section>

<section class="block final">
  <div class="wrap">
    <h2>Expomoto Venezuela 2026</h2>
    <a class="btn" href="#/registro">Registrarse</a>
  </div>
</section>

<style>
  .hero { position: relative; overflow: hidden; text-align: center; }
  .hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      repeating-linear-gradient(115deg, transparent 0 46px, rgba(42, 71, 255, .05) 46px 48px),
      radial-gradient(900px 500px at 50% 0%, rgba(42, 71, 255, .22), transparent 70%);
  }
  .hero .wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: 28px; padding-block: 96px 104px; }
  .logo { width: min(820px, 100%); height: auto; }
  .lead { color: #c4cae0; font-size: 19px; max-width: 34em; margin: 0; text-wrap: balance; }
  .btn { text-decoration: none; }
  .cta, .final .btn { font-size: 22px; padding: 20px 48px 20px 38px; }

  .marcas { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); }
  .marcas li { background: var(--ink); padding: 26px 22px; font: 700 28px/1 var(--f-display); text-transform: uppercase; letter-spacing: .02em; }
  .marcas small { display: block; margin-top: 6px; font: 400 13px/1.2 var(--f-body); text-transform: none; letter-spacing: 0; color: var(--muted); }

  .final .wrap { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .final h2 { font: italic 700 clamp(34px, 4.4vw, 52px)/.95 var(--f-display); text-transform: uppercase; margin: 0; }

  @media (max-width: 640px) {
    .hero .wrap { padding-block: 64px 72px; gap: 22px; }
    .lead { font-size: 17px; }
    .marcas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .marcas li { font-size: 22px; }
  }
</style>
