/* Tải sẵn ô ảnh bản đồ về repo — CHẠY LẠI ĐƯỢC, bỏ qua ô đã có.
 *
 *   node tools/fetch-tiles.mjs
 *   → assets/tiles/{z}/{x}/{y}.webp
 *
 * Vì sao phải tải sẵn: bản demo còn được gói thành một tệp để gửi link, mà bản gói chặn
 * mọi yêu cầu ra máy chủ ngoài. Ô ảnh nằm trong repo thì bản nhiều trang, bản mở bằng
 * file:// và bản một tệp đều vẽ được bản đồ mà không cần mạng.
 *
 * Nguồn: tile.openstreetmap.fr/osmfr — dịch vụ miễn phí của cộng đồng OSM France, kiểu nền
 * OSM standard, dữ liệu © OpenStreetMap contributors (ODbL).
 * KHÔNG dùng tile.openstreetmap.org: máy chủ chính của OSM trả về ô "Access blocked" (mã 200,
 * nội dung là ảnh thông báo) cho kiểu dùng này — chính sách của họ chỉ dành cho người xem
 * trực tiếp trên osm.org, không cho ứng dụng lưu sẵn ô ảnh.
 *
 * Chỉ lấy vài trăm ô cho đúng vùng cần, tuần tự, có User-Agent thật và nghỉ giữa các lần gọi.
 * Bản chạy thật của RECO phải tự dựng máy chủ ô ảnh hoặc dùng nhà cung cấp có hợp đồng.
 */
import { readFile, writeFile, mkdir, stat, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('e:/Projects/RECO/reco-main-web/node_modules/sharp');

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, 'assets', 'tiles');
const UA = 'reco-sales-hub-demo/1.0 (+dungnt1@hasutech.com.vn)';
const HOSTS = ['a', 'b', 'c'];
const GAP = 300;

/* ---------- Đọc bảng toạ độ dùng chung với trình duyệt ---------- */
const geoSrc = await readFile(path.join(root, 'assets', 'geo.js'), 'utf8');
const win = {};
new Function('window', geoSrc)(win);
const GEO = win.RECO_GEO;

/* ---------- Web Mercator ---------- */
const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};

function box(lat, lng, rx, ry) {
  const dLat = ry / 111320;
  const dLng = rx / (111320 * Math.cos((lat * Math.PI) / 180));
  return [[lat - dLat, lng - dLng], [lat + dLat, lng + dLng]];
}

/* Danh sách ô cho một khung ở một mức phóng */
function tilesFor(bounds, z) {
  const [[s, w], [n, e]] = bounds;
  const out = [];
  for (let x = lon2x(w, z); x <= lon2x(e, z); x++) {
    for (let y = lat2y(n, z); y <= lat2y(s, z); y++) out.push({ z, x, y });
  }
  return out;
}

const wanted = new Map();   // 'z/x/y' → {z,x,y}
function want(list) {
  for (const t of list) wanted.set(`${t.z}/${t.x}/${t.y}`, t);
}

for (const [id, p] of Object.entries(GEO.projects)) {
  let n = 0;
  for (const lv of p.levels) {
    const list = tilesFor(box(p.lat, p.lng, lv.rx, lv.ry), lv.z);
    n += list.length;
    want(list);
  }
  console.log(`   ${id.padEnd(14)} ${String(n).padStart(4)} ô`);
}
{
  const ov = GEO.overview;
  let n = 0;
  for (const lv of ov.levels) {
    const list = tilesFor(ov.bounds, lv.z);
    n += list.length;
    want(list);
  }
  console.log(`   ${'tổng quan VN'.padEnd(14)} ${String(n).padStart(4)} ô`);
}

const all = [...wanted.values()].sort((a, b) => a.z - b.z || a.x - b.x || a.y - b.y);
console.log(`\n· ${all.length} ô sau khi bỏ trùng`);

/* ---------- Tải ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let got = 0, skipped = 0, failed = 0, bytes = 0;

/* Máy chủ ô ảnh khi từ chối vẫn trả mã 200 kèm ảnh thông báo "Access blocked", nên không thể
   tin vào mã trả về. Dấu hiệu: nhiều ô khác toạ độ mà giống nhau từng byte VÀ có nhiều chi tiết.
   Ô biển hay ô rừng cũng trùng nhau từng byte nhưng gần như một màu phẳng, nên phải đo độ lệch
   chuẩn để không báo động nhầm. */
const seenHash = new Map();
async function guard(buf, t) {
  const h = createHash('sha1').update(buf).digest('hex');
  const n = (seenHash.get(h) || 0) + 1;
  seenHash.set(h, n);
  if (n <= 6) return;
  const st = await sharp(buf).stats();
  const spread = st.channels.reduce((a, c) => a + c.stdev, 0) / st.channels.length;
  if (spread < 12) return;   // ô một màu — biển, rừng, vùng chưa có dữ liệu
  throw new Error(
    `Đã nhận ${n} ô ảnh nhiều chi tiết giống nhau từng byte (ô mới nhất ${t.z}/${t.x}/${t.y}).\n` +
    'Gần như chắc chắn máy chủ đang trả ảnh "Access blocked" thay vì bản đồ.\n' +
    'Kiểm tra lại nguồn ô ảnh và chính sách của nó trước khi chạy tiếp.'
  );
}

for (const t of all) {
  const dir = path.join(OUT, String(t.z), String(t.x));
  const file = path.join(dir, `${t.y}.webp`);
  try {
    const st = await stat(file);
    skipped++; bytes += st.size;
    continue;
  } catch { /* chưa có thì tải */ }

  const host = HOSTS[(t.x + t.y) % HOSTS.length];
  const url = `https://${host}.tile.openstreetmap.fr/osmfr/${t.z}/${t.x}/${t.y}.png`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    failed++;
    console.log(`   LỖI ${res.status}  ${t.z}/${t.x}/${t.y}`);
    await sleep(GAP);
    continue;
  }
  const png = Buffer.from(await res.arrayBuffer());
  await guard(png, t);

  /* q65 là mức đo được trên chính ô ảnh của dự án: nhãn đường vẫn đọc rõ như bản không mất
     dữ liệu (21 KB) mà chỉ còn ~11 KB — nhân với vài trăm ô là khác nhau vài megabyte. */
  const out = await sharp(png).webp({ quality: 65, effort: 6 }).toBuffer();

  await mkdir(dir, { recursive: true });
  await writeFile(file, out);
  got++; bytes += out.length;
  if (got % 25 === 0) console.log(`   ${got} ô mới…`);
  await sleep(GAP);
}

/* ---------- Dọn ô mồ côi ----------
   Đổi toạ độ hay mức phóng trong geo.js là bỏ lại một mớ ô của vùng cũ. Không dọn thì
   build-artifact quét cả thư mục và nhúng luôn chúng vào bản gói — nặng thêm mà không ai thấy. */
let pruned = 0;
async function prune(dir) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) { await prune(full); continue; }
    if (!name.name.endsWith('.webp')) continue;
    const rel = path.relative(OUT, full).split(path.sep).join('/').replace(/\.webp$/, '');
    if (wanted.has(rel)) continue;
    const st = await stat(full);
    bytes -= st.size;
    await rm(full);
    pruned++;
  }
}
try { await prune(OUT); } catch { /* chưa có thư mục thì không có gì để dọn */ }

const mb = (bytes / 1024 / 1024).toFixed(2);
console.log(`\n✓ ${got} ô mới · ${skipped} ô đã có · ${pruned} ô mồ côi đã dọn · ${failed} lỗi`);
console.log(`  assets/tiles ≈ ${mb} MB (base64 trong bản một tệp ≈ ${(bytes * 1.37 / 1024 / 1024).toFixed(2)} MB)`);
