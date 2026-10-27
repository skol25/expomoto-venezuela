<script>
  import Header from './lib/components/Header.svelte';
  import Footer from './lib/components/Footer.svelte';
  import Landing from './lib/pages/Landing.svelte';
  import Registro from './lib/pages/Registro.svelte';
  import { ruta } from './lib/router.svelte.js';
</script>

<Header />

<main>
  {#if ruta.actual === '/registro'}
    <Registro />
  {:else}
    <Landing />
  {/if}
</main>

<Footer />
