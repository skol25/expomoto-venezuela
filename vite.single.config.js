// Genera un único archivo HTML autocontenido en dist-single/ (útil para compartir una vista previa).
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [svelte(), viteSingleFile()],
  build: { outDir: 'dist-single', assetsInlineLimit: 200000 }
});
