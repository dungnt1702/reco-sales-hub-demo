/* RECO Data-SalesHub — bảng toạ độ cho bản đồ vị trí.
 *
 * Toạ độ tra một lần bằng Nominatim (xem tools/geocode.mjs) rồi ghi cứng ở đây: bản mô phỏng
 * phải chạy được khi không có mạng — bản một tệp gửi link chặn mọi yêu cầu ra máy chủ ngoài.
 *
 * Không nhập vào store.js: kho dùng sessionStorage nên tab đang mở giữ bản dữ liệu gốc cũ,
 * thêm trường mới vào đó thì phiên cũ không có toạ độ. Ở đây khớp theo id của bản ghi.
 *
 * far: true — điểm nằm ngoài khung bản đồ đã tải sẵn (sân bay, phố cổ...). Vẫn hiện trong
 * danh sách liên kết vùng, không ghim lên bản đồ.
 *
 * Cả BẢY dự án nay là dự án thật của Nhà Ở Ngay RECO (QD-070): toạ độ tra theo đúng địa chỉ
 * công bố trên trang dự án. Nominatim không có điểm cho vài địa chỉ số nhà (300 Võ Chí Công,
 * 47 Nguyễn Tuân, KĐT Việt Hàn) nên lấy điểm gần nhất tra được trên chính con đường / khu đất
 * đó — sai số vài trăm mét, đủ đúng để bản đồ vị trí không nói sai khu vực.
 */
(function () {
  'use strict';

  /* Vùng tải sẵn của TỪNG mức phóng, tính bằng mét từ tâm dự án theo hai trục.
     Phải phủ được khung rộng nhất đang dùng (1024×576 trên trang gửi khách) cộng một
     khoảng để kéo: hẹp hơn là màn rộng hiện ô trống. Càng phóng gần vùng càng hẹp, nếu
     không số ô tăng theo bình phương và bản một tệp phình quá hạn mức.
     Ở vĩ độ 21°, một ô 256px trải khoảng 2283 m ở z14, 1142 m ở z15, 571 m ở z16. */
  var Z14 = { z: 14, rx: 5900, ry: 3900 };
  var Z15 = { z: 15, rx: 2950, ry: 1950 };
  var Z16 = { z: 16, rx: 1480, ry: 980 };

  /* Số mức phóng chia theo mức được dùng trong buổi demo, vì mỗi mức thêm vào là thêm
     khoảng 24 ô ảnh cho một dự án — nướng cả ba mức cho bảy dự án là bản một tệp vượt 9 MB.
       CLOSE — Le Parc Place, dự án thật, màn chính của buổi demo: phóng được tới mức đường phố
       MID   — Celestine, dự án dùng ở trang gửi khách
       SPOT  — năm dự án còn lại: một mức, đủ để bản đồ không bao giờ trống chỗ */
  var CLOSE = [Z14, Z15, Z16];
  var MID = [Z14, Z15];
  var SPOT = [Z15];

  window.RECO_GEO = {
    /* Dự án — zoom là mức mở mặc định, levels là các mức đã tải sẵn ô ảnh */
    projects: {
      leparc:        { lat: 20.96190, lng: 105.75470, zoom: 15, levels: CLOSE, real: true },
      /* 300 Võ Chí Công, Tây Hồ — điểm trên đúng đoạn Võ Chí Công cạnh Xuân La, cách Hồ Tây 1,1 km */
      celestine:     { lat: 21.06464, lng: 105.80595, zoom: 15, levels: MID, real: true },
      /* 16 Phước Long, Nha Trang */
      'la-perle':    { lat: 12.21203, lng: 109.19620, zoom: 15, levels: SPOT, real: true },
      /* Thanh Liệt, Thanh Trì — khu Vành đai 3.5 phía Nam Hà Nội */
      palmy:         { lat: 20.97192, lng: 105.81989, zoom: 15, levels: SPOT, real: true },
      /* Lang Quán, Yên Sơn, Tuyên Quang */
      'thien-duong': { lat: 21.84765, lng: 105.11423, zoom: 15, levels: SPOT, real: true },
      /* Hồng Tiến, Phổ Yên, Thái Nguyên — khu tái định cư Hồng Tiến cạnh tổ hợp Yên Bình */
      central:       { lat: 21.45069, lng: 105.89798, zoom: 15, levels: SPOT, real: true },
      /* 47 Nguyễn Tuân, Thanh Xuân — điểm giữa đường Nguyễn Tuân */
      opening:       { lat: 20.99886, lng: 105.80291, zoom: 15, levels: SPOT, real: true }
    },

    /* Điểm liên kết vùng — id khớp sections kind:'place' trong store.js.
       Điểm người dùng tự thêm trong lúc demo không có toạ độ nên chỉ vào danh sách. */
    pois: {
      /* Le Parc Place — ParkCity Hanoi, Dương Nội, Hà Đông */
      lps2:  { lat: 20.96567, lng: 105.75649, cat: 'mall' },
      lps3:  { lat: 20.96295, lng: 105.75978, cat: 'leisure' },
      lps4:  { lat: 20.96282, lng: 105.76089, cat: 'school' },
      lps5:  { lat: 20.98945, lng: 105.75063, cat: 'mall' },
      lps6:  { lat: 20.96382, lng: 105.76680, cat: 'transit' },
      lps7:  { lat: 21.02883, lng: 105.85254, cat: 'landmark', far: true },
      lps20: { lat: 20.96150, lng: 105.75530, cat: 'transit' },
      lps21: { lat: 20.96120, lng: 105.75380, cat: 'school' },
      lps22: { lat: 20.96386, lng: 105.75662, cat: 'home' },
      lps23: { lat: 20.96430, lng: 105.75300, cat: 'home' },
      lps24: { lat: 20.96020, lng: 105.76080, cat: 'home' },
      lps25: { lat: 21.00600, lng: 105.81300, cat: 'landmark', far: true },

      /* Celestine Westlake — 300 Võ Chí Công, Tây Hồ */
      sc2: { lat: 21.07320, lng: 105.80794, cat: 'home' },
      sc3: { lat: 21.05804, lng: 105.81397, cat: 'landmark' },
      sc4: { lat: 21.07602, lng: 105.81255, cat: 'mall' },
      sc5: { lat: 21.09831, lng: 105.82321, cat: 'transit' },
      sc6: { lat: 21.07594, lng: 105.81591, cat: 'leisure' },
      sc7: { lat: 21.21695, lng: 105.79375, cat: 'transit', far: true }
    },

    /* Bản đồ tổng quan cho màn xem trước Giai đoạn 2 — báo cáo "Theo khu vực địa lý".
       Số liệu lấy đúng bảng đang hiện trên màn đó; "Khác" không có toạ độ nên không ghim. */
    overview: {
      levels: [{ z: 6 }],
      /* Rộng hơn hẳn phần đất Việt Nam: ở z6 một khung 560px đã trải hơn 12° kinh độ,
         lấy đúng khung Việt Nam thì hai mép trái phải rơi ra ngoài vùng đã tải. */
      bounds: [[6.0, 98.0], [25.0, 114.0]],
      center: [16.8, 107.0],
      zoom: 6,
      /* side: phía đặt tên khu vực. Ở mức phóng 6, Hà Nội và Bắc Giang chỉ cách nhau chừng
         30px nên để tên mặc định dưới bong bóng là hai nhãn đè lên nhau. */
      regions: [
        { name: 'Hà Nội',     lat: 21.02833, lng: 105.85404, deals: 61, revenue: 4.94, side: 'left' },
        { name: 'Quảng Bình', lat: 17.51572, lng: 106.62254, deals: 27, revenue: 1.68, side: 'right' },
        { name: 'Bắc Giang',  lat: 21.37401, lng: 106.46632, deals: 8,  revenue: 0.64, side: 'right' },
        { name: 'Thanh Hóa',  lat: 19.97816, lng: 105.48161, deals: 7,  revenue: 1.52, side: 'bottom' }
      ]
    }
  };
})();
