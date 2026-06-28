import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'assets', dest: '' },
        { src: 'vendor', dest: '' },
        { src: 'site', dest: '' }
      ]
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/vendor/, /node_modules/]
    },
    rollupOptions: {
      input: {
        main: 'play.html',
        index: 'index.html',
        docs: 'docs.html'
      }
    }
  }
});
