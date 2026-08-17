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
  /* Celestine Westlake — 300 Võ Chí Công, Tây Hồ */
  ['sc2', 'Khu do thi Ciputra Nam Thang Long Hanoi'],
  ['sc3', 'Ho Tay Hanoi'],
  ['sc4', 'Lotte Mall West Lake Hanoi Vo Chi Cong'],
  ['sc5', 'Cau Nhat Tan Hanoi'],
  ['sc6', 'Benh vien Nam Thang Long Hanoi'],
  ['sc7', 'San bay Noi Bai'],
  ['pj-leparc', 'Le Parc Place ParkCity Hanoi Duong Noi Ha Dong'],
  ['pj-celestine', '300 Vo Chi Cong Tay Ho Hanoi'],
  ['pj-la-perle', '16 Phuoc Long Nha Trang Khanh Hoa'],
  ['pj-palmy', 'Thanh Liet Thanh Tri Hanoi'],
  ['pj-thien-duong', 'Lang Quan Yen Son Tuyen Quang'],
  ['pj-central', 'Hong Tien Pho Yen Thai Nguyen'],
  ['pj-opening', '47 Nguyen Tuan Thanh Xuan Hanoi'],
  /* Khu vực trong báo cáo Giai đoạn 2 — bốn tỉnh này là vùng phát sinh giao dịch THẬT trong
     báo cáo RECO gửi (Quảng Bình đi với Dolce Penisola), đừng đổi theo danh mục dự án của demo. */
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
