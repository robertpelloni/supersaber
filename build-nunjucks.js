const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

var APP_VERSION = fs.readFileSync('VERSION.md', 'utf8').trim();

nunjucks.configure(path.resolve(__dirname, 'src'), { noCache: true });
const context = {
  DEBUG_AFRAME: false,
  DEBUG_KEYBOARD: false,
  DEBUG_INSPECTOR: false,
  IS_PRODUCTION: true,
  VERSION: APP_VERSION,
  COLORS: {
    UI_ACCENT: '#0ff',
    UI_ACCENT2: '#f0f'
  }
};

const html = nunjucks.render('index.html', context);
fs.writeFileSync('play.html', html);
console.log('Compiled play.html');
