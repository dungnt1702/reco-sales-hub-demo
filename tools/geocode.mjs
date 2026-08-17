/* Tra toạ độ các điểm liên kết vùng bằng Nominatim — CHẠY MỘT LẦN, dán kết quả vào assets/geo.js.
 *
 *   node tools/geocode.mjs
 *
 * Bản mô phỏng không được gọi mạng lúc chạy (Artifact chặn host ngoài), nên toạ độ
 * phải nằm sẵn trong geo.js. Script này chỉ là công cụ soạn dữ liệu cho người viết code.
 * Nominatim yêu cầu User-Agent thật và tối đa 1 truy vấn/giây.
 */
const UA = 'reco-sales-hub-demo/1.0 (dungnt1@hasutech.com.vn)';

/* id khớp với sections kind:'place' trong assets/store.js */
const Q = [
  ['lps2', 'The LINC @ ParkCity Hanoi'],
  ['lps3', 'ParkCity Club Hanoi Duong Noi'],
  ['lps4', 'International School ParkCity Hanoi'],
  ['lps5', 'AEON Mall Ha Dong'],
  ['lps6', 'Ga Yen Nghia tuyen Cat Linh Ha Dong'],
  ['lps7', 'Ho Hoan Kiem Hanoi'],
  ['lps20', 'ParkCity Hanoi Le Trong Tan'],
  ['lps22', 'Park Kiara ParkCity Hanoi'],
  ['lps23', 'Parc Regent ParkCity Hanoi'],
  ['lps24', 'Le Jardin ParkCity Hanoi'],
  ['sc2', 'Cau Vinh Tuy Hanoi'],
  ['sc3', 'Ho Hoan Kiem Hanoi'],
  ['sc4', 'Duong Vanh Dai 3 Long Bien Hanoi'],
  ['sc5', 'Benh vien Da khoa Tam Anh Hanoi'],
  ['sc6', 'Vinschool Times City Hanoi'],
  ['sc7', 'San bay Noi Bai'],
  ['pj-leparc', 'Le Parc Place ParkCity Hanoi Duong Noi Ha Dong'],
  ['pj-celestine', 'Phuong Bo De Long Bien Hanoi'],
  ['pj-la-perle', 'An Khanh Hoai Duc Hanoi'],
  ['pj-palmy', 'Xuan Quan Van Giang Hung Yen'],
  ['pj-thien-duong', 'Bai Dai Cam Lam Khanh Hoa'],
  ['pj-central', 'Phuong Thanh Xuan Trung Thanh Xuan Hanoi'],
  ['pj-opening', 'Phuong Kien Hung Ha Dong Hanoi'],
  ['rg-hanoi', 'Hanoi Vietnam'],
  ['rg-quangbinh', 'Quang Binh Vietnam'],
  ['rg-bacgiang', 'Bac Giang Vietnam'],
  ['rg-thanhhoa', 'Thanh Hoa Vietnam']
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [id, q] of Q) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&q=' +
    encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'vi' } });
  const j = await res.json();
  if (!j.length) {
    console.log(`${id.padEnd(16)} KHÔNG THẤY   ${q}`);
  } else {
    const h = j[0];
    console.log(`${id.padEnd(16)} ${(+h.lat).toFixed(5)}, ${(+h.lon).toFixed(5)}   ${h.name || h.display_name.slice(0, 60)}`);
  }
  await sleep(1100);
}
