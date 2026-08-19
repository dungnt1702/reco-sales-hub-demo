/* Gộp 20 màn của prototype thành MỘT tệp HTML tự chứa, dùng để đăng lên Claude Artifact.
 *
 *   node build-artifact.mjs
 *   → dist/reco-sales-hub.html
 *
 * Artifact chặn mọi yêu cầu ra máy chủ ngoài, nên phông chữ và ảnh phải nhúng thẳng
 * dưới dạng data URI, và cả 20 màn phải nằm trong một tài liệu duy nhất.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('e:/Projects/RECO/reco-main-web/node_modules/sharp');

const root = path.dirname(fileURLToPath(import.meta.url));
const A = (...p) => path.join(root, 'assets', ...p);

const args = process.argv.slice(2);
const phaseIdx = args.indexOf('--phase');
const phase = phaseIdx >= 0 ? (args[phaseIdx + 1] || 'gd01') : 'gd01';
const htmlDir = path.join(root, phase);

/* Thứ tự này là thứ tự trình bày trong buổi demo, không phải thứ tự bảng chữ cái. */
const PAGES_DEFAULT = [
  'index', 'sitemap', 'dang-nhap', 'trang-dau', 'du-an', 'du-an-chi-tiet',
  'thu-vien-tai-lieu', 'cay-thu-muc', 'soan-noi-dung', 'chia-se',
  'trang-gui-khach', 'link-het-han', 'quan-tri', 'nguoi-dung', 'de-nghi-sua',
  'xem-truoc-gd2',
  'tinh-nang-gd1', 'chi-tiet-gd1', 'tinh-nang-gd2', 'chi-tiet-gd2', 'ha-tang'
];
const PAGES_GD01 = [
  'index', 'sitemap', 'dang-nhap', 'trang-dau', 'du-an', 'du-an-chi-tiet', 'san-pham',
  'thu-vien-tai-lieu', 'cay-thu-muc', 'chia-se',
  'trang-gui-khach', 'link-het-han', 'quan-tri', 'nguoi-dung', 'de-nghi-sua',
  'xem-truoc-gd2', 'bao-tri',
  'tinh-nang-gd1', 'chi-tiet-gd1', 'tinh-nang-gd2', 'chi-tiet-gd2', 'ha-tang'
];
const PAGES = phase === 'gd01' ? PAGES_GD01 : PAGES_DEFAULT;

const kb = (n) => (n / 1024).toFixed(0) + ' KB';

/* ---------- Phông chữ ---------- */
async function fontDataUris() {
  const files = (await readdir(A('fonts'))).filter((f) => f.endsWith('.woff2'));
  const map = new Map();
  for (const f of files) {
    const buf = await readFile(A('fonts', f));
    map.set(f, `data:font/woff2;base64,${buf.toString('base64')}`);
  }
  return map;
}

/* ---------- Ảnh ----------
 * Ảnh gốc gần 10 MB. Base64 phình thêm một phần ba, nên phải nén trước:
 * bề ngang tối đa 1400px là đủ cho mọi khung dùng trong prototype.
 */
async function imageDataUris() {
  const files = (await readdir(A('img'))).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const map = new Map();
  let before = 0, after = 0;
  for (const f of files) {
    const src = await readFile(A('img', f));
    before += src.length;
    const isLogo = f.includes('logo');
    const out = await sharp(src)
      .resize({ width: isLogo ? 320 : 1400, withoutEnlargement: true })
      .webp({ quality: isLogo ? 90 : 74 })
      .toBuffer();
    after += out.length;
    map.set(f, `data:image/webp;base64,${out.toString('base64')}`);
    console.log(`   ${f.padEnd(26)} ${kb(src.length).padStart(8)} → ${kb(out.length).padStart(8)}`);
  }
  console.log(`   ${'cộng'.padEnd(26)} ${kb(before).padStart(8)} → ${kb(after).padStart(8)}`);
  return map;
}

/* ---------- Ô ảnh bản đồ ----------
 * Đã là webp sẵn từ tools/fetch-tiles.mjs, chỉ cần đổi sang data URI và tra theo khoá
 * 'z/x/y' lúc chạy — cùng cách làm với ảnh, để mỗi ô chỉ nằm đúng một lần trong tệp.
 */
async function tileDataUris() {
  const dir = A('tiles');
  const map = new Map();
  let bytes = 0;
  let zs;
  try { zs = await readdir(dir); }
  catch { console.log('   chưa có assets/tiles — chạy `node tools/fetch-tiles.mjs` trước'); return map; }
  for (const z of zs) {
    for (const x of await readdir(path.join(dir, z))) {
      for (const f of await readdir(path.join(dir, z, x))) {
        if (!f.endsWith('.webp')) continue;
        const buf = await readFile(path.join(dir, z, x, f));
        bytes += buf.length;
        map.set(`${z}/${x}/${f.replace(/\.webp$/, '')}`, `data:image/webp;base64,${buf.toString('base64')}`);
      }
    }
  }
  console.log(`   ${String(map.size).padStart(4)} ô · ${kb(bytes)} trên đĩa`);
  return map;
}

/* ---------- Tách một trang ---------- */
function slice(html) {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();

  const head = (html.match(/<head>([\s\S]*?)<\/head>/) || [, ''])[1];
  const css = [...head.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');

  let body = (html.match(/<body([^>]*)>([\s\S]*?)<\/body>/) || [, '', ''])[2];
  const attrs = (html.match(/<body([^>]*)>/) || [, ''])[1];
  const nav = (attrs.match(/data-page="([^"]*)"/) || [, ''])[1];
  const shell = (attrs.match(/data-shell="([^"]*)"/) || [, 'app'])[1];

  // Mã riêng của trang: gom lại rồi bỏ khỏi phần đánh dấu
  const js = [...body.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
  body = body.replace(/<script>[\s\S]*?<\/script>/g, '').trim();

  const strip = (s) => s.replaceAll('../assets/', 'assets/');
  return { title, css: strip(css), html: strip(body), js: strip(js), nav, shell };
}

/* ---------- Dựng ---------- */
console.log('· Nén ảnh');
const img = await imageDataUris();
console.log('· Nhúng phông chữ');
const fonts = await fontDataUris();
console.log('· Nhúng ô ảnh bản đồ');
const tiles = await tileDataUris();

/* leaflet.css đứng trước reco.css: phần bản đồ trong reco.css sửa lại mặc định của Leaflet */
let css = await readFile(A('vendor', 'leaflet.css'), 'utf8') + '\n' + await readFile(A('reco.css'), 'utf8');
for (const [name, uri] of fonts) css = css.replaceAll(`fonts/${name}`, uri);

let runtime = await readFile(A('reco.js'), 'utf8');
const store = await readFile(path.join(htmlDir, 'store.js'), 'utf8').catch(() => readFile(A('store.js'), 'utf8'));
const data = await readFile(A('data.js'), 'utf8');
const leaflet = await readFile(A('vendor', 'leaflet.js'), 'utf8');
const geo = await readFile(A('geo.js'), 'utf8');
const recoMap = await readFile(A('reco-map.js'), 'utf8');

console.log(`· Gộp ${PAGES.length} màn từ ${phase}/`);
const pages = {};
for (const name of PAGES) {
  const p = slice(await readFile(path.join(htmlDir, `${name}.html`), 'utf8'));
  if (p.css) css += `\n/* ${name} */\n${p.css}`;
  // Bản nhiều trang chờ DOMContentLoaded; bản gói chạy ngay sau khi màn được dựng.
  p.js = p.js.replaceAll("document.addEventListener('DOMContentLoaded',", 'RECO.run(');
  delete p.css;
  pages[name] = p;
  console.log(`   ${name.padEnd(22)} ${kb(p.html.length).padStart(8)} đánh dấu`);
}

/* Ảnh: nhúng thẳng trong CSS (chỉ vài chỗ dùng), còn trong đánh dấu và mã thì để lại
   thẻ @@i:tên@@ cho lúc chạy thay vào — giữ mỗi ảnh đúng một bản trong tệp. */
for (const [name, uri] of img) css = css.replaceAll(`assets/img/${name}`, uri);

function tokenize(s) {
  for (const name of img.keys()) s = s.replaceAll(`assets/img/${name}`, `@@i:${name}@@`);
  return s;
}
for (const p of Object.values(pages)) {
  p.html = tokenize(p.html);
  p.js = tokenize(p.js);
}
const dataJs = data;   // data.js gọi RECO.asset(), không cần thay chuỗi

const doc = `<title>RECO Sales Hub</title>
<meta name="description" content="Bản mô phỏng giao diện 20 màn Giai đoạn 1 của RECO Data-SalesHub.">
<style>
${css}
</style>
<div id="app"></div>
<script>
window.RECO_BUNDLE = true;
window.RECO_IMG = ${JSON.stringify(Object.fromEntries(img))};
window.RECO_TILES = ${JSON.stringify(Object.fromEntries(tiles))};
window.RECO_PAGES = ${JSON.stringify(pages)};
</script>
<script>
${leaflet}
</script>
<script>
${runtime}
</script>
<script>
${store}
</script>
<script>
${dataJs}
</script>
<script>
${geo}
</script>
<script>
${recoMap}
</script>
`;

await mkdir(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'reco-sales-hub.html');
await writeFile(out, doc, 'utf8');

const size = Buffer.byteLength(doc, 'utf8');
console.log(`\n✓ ${out}`);
console.log(`  ${(size / 1024 / 1024).toFixed(2)} MB — hạn mức Artifact là 16 MB`);
if (size > 15.5 * 1024 * 1024) console.log('  ⚠ Sát hạn mức, cần nén ảnh mạnh hơn.');
