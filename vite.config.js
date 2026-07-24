import { defineConfig } from 'vite';
import nunjucks from 'vite-plugin-nunjucks';
import viteCommonjs from 'vite-plugin-commonjs';
import path from 'path';

// Minimal Vite config to replace Webpack
export default defineConfig({
  plugins: [
    viteCommonjs(),
    nunjucks({
      templatesDir: 'src',
      variables: {
        'DEBUG_AFRAME': process.env.DEBUG_AFRAME,
        'DEBUG_KEYBOARD': process.env.DEBUG_KEYBOARD,
        'DEBUG_INSPECTOR': process.env.DEBUG_INSPECTOR,
        'HOST': 'localhost',
        'IS_PRODUCTION': process.env.NODE_ENV === 'production',
        'VERSION': '1.4.3',
        'COLORS': require('./src/constants/colors.js')
      }
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        play: path.resolve(__dirname, 'play.html')
      },
      output: {
        entryFileNames: `[name].js`
      }
    }
  }
});
