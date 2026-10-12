import { cp, mkdir, readdir, rm } from 'node:fs/promises';

const pages = ['index.html', 'rankings.html', 'styles.css', 'rankings.css', 'app.js', 'ranking-data.js', 'rankings.js', 'sticky-header.js', 'static-interactions.js'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await Promise.all(pages.map(file => cp(file, `dist/${file}`)));
const assets = (await readdir('assets')).filter(file => /\.(webp|svg|ttf|woff2?)$/i.test(file));
await Promise.all(assets.map(file => cp(`assets/${file}`, `dist/assets/${file}`)));
console.log(`Built ${pages.length} application files and ${assets.length} assets.`);
