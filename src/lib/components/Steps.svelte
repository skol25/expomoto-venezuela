<script>
  const pasos = [
    { titulo: 'Regístrese', texto: 'Complete sus datos, indique el monto que desea mover y elija la empresa con la que quiere reunirse.' },
    { titulo: 'Reciba su ticket', texto: 'Al enviar el formulario se genera un código único y un ticket con código QR que puede descargar.' },
    { titulo: 'Preséntese', texto: 'El día del evento muestre su ticket y su cédula en la acreditación de la Rueda de Negocios.' }
  ];
</script>

<section class="block">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow">Proceso</span>
        <h2>Cómo funciona</h2>
      </div>
    </div>
    <ol>
      {#each pasos as p, i}
        <li>
          <span>Paso {i + 1}</span>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  li { border-top: 2px solid var(--blue); padding-top: 18px; }
  li:nth-child(1) { border-color: var(--yellow); }
  li:nth-child(3) { border-color: var(--red); }
  span { display: block; font: 600 13px/1 var(--f-display); letter-spacing: .18em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  h3 { font: 700 24px/1.05 var(--f-display); text-transform: uppercase; margin: 0 0 8px; }
  p { color: #bcc3da; margin: 0; }
  @media (max-width: 640px) { ol { grid-template-columns: 1fr; } }
</style>
