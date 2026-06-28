const fs = require('fs');
const Nunjucks = require('nunjucks');
const COLORS = require('./src/constants/colors.js');

const nunjucks = Nunjucks.configure('src', { noCache: true });

const APP_VERSION = fs.readFileSync('VERSION.md', 'utf8').trim();

nunjucks.addGlobal('DEBUG_AFRAME', !!process.env.DEBUG_AFRAME);
nunjucks.addGlobal('DEBUG_KEYBOARD', !!process.env.DEBUG_KEYBOARD);
nunjucks.addGlobal('DEBUG_INSPECTOR', !!process.env.DEBUG_INSPECTOR);
nunjucks.addGlobal('HOST', 'localhost');
nunjucks.addGlobal('IS_PRODUCTION', process.env.NODE_ENV === 'production');
nunjucks.addGlobal('COLORS', COLORS);
nunjucks.addGlobal('VERSION', APP_VERSION);

fs.writeFileSync('play.html', nunjucks.render('index.html'));
fs.writeFileSync('docs.html', nunjucks.render('templates/docs.html'));
