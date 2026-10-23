import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
// Usage (from the fest-boss folder): npm i esbuild && node dev/build.mjs
const root = process.argv[2] || join(import.meta.dirname, '..');
const r = await build({ entryPoints: [join(root, 'src/main.js')], bundle: true, format: 'iife', minify: true, write: false, target: 'es2019', legalComments: 'inline' });
// Keep inlined code from closing its own <script>/<style> tag early.
let js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const css = readFileSync(join(root, 'styles.css'), 'utf8').replace(/<\/style/gi, '<\\/style');
let html = readFileSync(join(root, 'index.src.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="styles\.css[^"]*">/, () => `<style>\n${css}\n</style>`);
html = html.replace(/<script type="module" src="src\/main\.js"><\/script>/, () => `<script>\n${js}</script>`);
if (html.includes('src/main.js') || html.includes('styles.css')) throw new Error('replace failed');
writeFileSync(join(root, 'index.html'), html);
console.log('index.html', html.length, 'bytes');
