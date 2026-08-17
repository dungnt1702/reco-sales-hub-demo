/* RECO Data-SalesHub — kho dữ liệu sống của bản mô phỏng.
 *
 * Mọi màn đọc và ghi qua đây, nhờ vậy bấm Duyệt ở màn quản trị thì hàng chờ ở Trang đầu
 * giảm theo, tạo đường dẫn ở màn dự án thì nhật ký chia sẻ có ngay dòng mới.
 *
 * Trạng thái giữ trong sessionStorage để đi qua lại giữa các màn không mất.
 * Mở bằng file:// thì trình duyệt chặn sessionStorage — khi đó tự lùi về bộ nhớ trong,
 * bản gói một trang vẫn chạy đủ vì cả 20 màn nằm trong cùng một tài liệu.
 */
(function () {
  'use strict';

  var KEY = 'reco-salehub-demo';

  /* ---------- Dữ liệu gốc ---------- */
  function seed() {
    return {
      /* Dự án — nguồn cho thẻ dự án, danh sách, quản trị */
      projects: [
        /* Dự án thật do RECO cung cấp ngày 17/08/2026 — thông tin bán hàng công khai.
           Mọi số liệu giao dịch, hoa hồng và nhân sự trong bản mô phỏng vẫn là số giả. */
        { id: 'leparc', name: 'Le Parc Place — ParkCity Hanoi', code: 'LPP', area: 'Hà Nội', place: 'Dương Nội, Hà Đông, Hà Nội',
          type: 'canho', typeName: 'Chung cư', segment: 'cao', price: 4.6, priceText: '4,6 – 18 tỷ',
          size: 62, sizeText: '62 – 210 m²', status: 'live', statusText: 'Đang bán',
          featured: true, pinned: true, hidden: false, img: 'reco-banner.jpg', docs: 24, ready: 88,
          /* Ảnh tóm tắt dự án — mục "Tóm tắt dự án, dạng 1 ảnh" của SaleHUB (BR-DL-17, QD-065).
             Ảnh do RECO tải lên; dự án chưa có thì khu vực 1 hiện trạng thái trống. */
          summary: 'reco-banner.jpg',
          updated: 'Hôm nay, 08:30', struct: '4 tòa · 29–35 tầng · 802 căn',
          land: '16.234 m² · 1,62 ha', tenure: 'Sở hữu lâu dài',
          owner: 'ParkCity Holdings', handover: 'Chờ cập nhật',
          web: 'https://www.parkcityhanoi.com/le-parc-place',
          bank: { holder: 'Công Ty Cổ Phần Nhà Ở Ngay Reco', no: '774668888', at: 'Ngân hàng VPBank',
                  memo: '<Tên khách hàng> đặt cọc <mã căn> dự án Le Parc Place' },
          flow: [
            'Tư vấn và chốt căn — nhân viên gửi bảng hàng và phiếu tính giá đã duyệt.',
            'Đặt cọc — khách chuyển khoản theo đúng cú pháp nội dung ở khối bên dưới.',
            'Xác nhận cọc — Thư ký kinh doanh đối chiếu sao kê trong vòng 24 giờ.',
            'Ký thỏa thuận đặt cọc với Chủ đầu tư trong 7 ngày kể từ ngày cọc.',
            'Ký hợp đồng mua bán (SPA) theo lịch của Chủ đầu tư.',
            'Hoàn thiện hồ sơ giao dịch — nộp bản mềm lên hệ thống để tính hoa hồng.'
          ] },
        { id: 'celestine', name: 'The Celestine Riverside', area: 'Hà Nội', place: 'Long Biên, Hà Nội',
          type: 'canho', typeName: 'Chung cư', segment: 'cao', price: 3.4, priceText: '3,4 – 7,2 tỷ',
          size: 58, sizeText: '58 – 112 m²', status: 'live', statusText: 'Đang bán',
          featured: true, pinned: true, hidden: false, img: 'celestine.jpg', docs: 48, ready: 100,
          summary: 'celestine.jpg',
          updated: '2 giờ trước', struct: '4 tòa · 27 tầng · 1.248 căn',
          owner: 'Công ty CP Đầu tư Celestine', handover: 'Quý II/2027' },
        { id: 'la-perle', name: 'La Perle Villas', area: 'Hà Nội', place: 'Hoài Đức, Hà Nội',
          type: 'thaptang', typeName: 'Biệt thự, nhà liền kề, shophouse', segment: 'cao', price: 12.5, priceText: '12,5 – 28 tỷ',
          size: 128, sizeText: '128 – 300 m²', status: 'live', statusText: 'Đang bán',
          featured: true, pinned: true, hidden: false, img: 'la-perle.webp', docs: 36, ready: 92,
          updated: 'Hôm nay, 09:15', struct: '3 phân khu · 214 căn liền kề & biệt thự',
          owner: 'Công ty CP La Perle', handover: 'Quý IV/2026' },
        { id: 'palmy', name: 'Palmy Garden', area: 'Hưng Yên', place: 'Văn Giang, Hưng Yên',
          type: 'datnen', typeName: 'Đất nền', segment: 'trung', price: 2.8, priceText: '2,8 – 6,5 tỷ',
          size: 90, sizeText: '90 – 200 m²', status: 'live', statusText: 'Đang bán',
          featured: false, pinned: true, hidden: false, img: 'palmy.jpg', docs: 29, ready: 84,
          updated: 'Hôm qua, 16:40', struct: '1 phân khu · 6 dãy · 340 lô',
          owner: 'Công ty CP Palmy', handover: 'Đã có sổ' },
        { id: 'thien-duong', name: 'Thiên Đường Bay', area: 'Khánh Hòa', place: 'Cam Lâm, Khánh Hòa',
          type: 'thaptang', typeName: 'Biệt thự, nhà liền kề, shophouse', segment: 'cao', price: 8.9, priceText: '8,9 – 21 tỷ',
          size: 150, sizeText: '150 – 320 m²', status: 'soon', statusText: 'Sắp mở bán',
          featured: true, pinned: false, hidden: false, img: 'thien-duong.jpg', docs: 17, ready: 46,
          updated: '3 ngày trước', struct: '2 phân khu · 96 căn',
          owner: 'Công ty CP Thiên Đường', handover: 'Quý I/2028' },
        { id: 'central', name: 'RECO Central Park', area: 'Hà Nội', place: 'Thanh Xuân, Hà Nội',
          type: 'canho', typeName: 'Chung cư', segment: 'cao', price: 4.1, priceText: '4,1 – 9,6 tỷ',
          size: 62, sizeText: '62 – 140 m²', status: 'live', statusText: 'Đang bán',
          featured: false, pinned: false, hidden: false, img: 'reco-banner.jpg', docs: 41, ready: 96,
          updated: '5 giờ trước', struct: '2 tòa · 32 tầng · 864 căn',
          owner: 'RECO Group', handover: 'Quý III/2027' },
        { id: 'opening', name: 'Opening Residence', area: 'Hà Nội', place: 'Hà Đông, Hà Nội',
          type: 'canho', typeName: 'Chung cư', segment: 'trung', price: 2.3, priceText: '2,3 – 4,4 tỷ',
          size: 45, sizeText: '45 – 78 m²', status: 'closed', statusText: 'Ngừng bán',
          featured: false, pinned: false, hidden: false, img: 'reco-opening.jpg', docs: 33, ready: 100,
          updated: '12/07/2026', struct: '1 tòa · 25 tầng · 402 căn',
          owner: 'RECO Group', handover: 'Đã bàn giao' }
      ],

      /* Bảng hàng — cấp căn/lô, dùng cho MH-04 và phiếu tính giá */
      units: [
        { id: 'LPP-A.21.03', pj: 'leparc', zone: 'z-lpp-a-21', block: 'A', floor: 21, kind: '2PN — loại A1', area: 72.4, dir: 'Đông Nam', price: 5980, state: 'con' },
        { id: 'LPP-A.28.05', pj: 'leparc', zone: 'z-lpp-a-28', block: 'A', floor: 28, kind: '3PN — loại A4', area: 98.6, dir: 'Tây Nam', price: 8450, state: 'giu' },
        { id: 'LPP-B.12.07', pj: 'leparc', zone: 'z-lpp-b-12', block: 'B', floor: 12, kind: '1PN+1 — loại B2', area: 62.0, dir: 'Đông', price: 4620, state: 'con' },
        { id: 'LPP-B.24.02', pj: 'leparc', zone: 'z-lpp-b-24', block: 'B', floor: 24, kind: '3PN+1 — loại B', area: 112.5, dir: 'Đông Nam', price: 9780, state: 'con' },
        { id: 'LPP-B.31.09', pj: 'leparc', zone: 'z-lpp-b-31', block: 'B', floor: 31, kind: '2PN — loại B1', area: 74.8, dir: 'Bắc', price: 6240, state: 'ban' },
        { id: 'LPP-C.09.04', pj: 'leparc', zone: 'z-lpp-c-09', block: 'C', floor: 9, kind: '2PN — loại C1', area: 76.2, dir: 'Nam', price: 6350, state: 'con' },
        { id: 'LPP-C.18.01', pj: 'leparc', zone: 'z-lpp-c-18', block: 'C', floor: 18, kind: '4PN+1 — loại C', area: 138.0, dir: 'Đông Nam', price: 12400, state: 'con' },
        { id: 'LPP-D.11.06', pj: 'leparc', zone: 'z-lpp-d-11', block: 'D', floor: 11, kind: '2PN — loại E', area: 70.5, dir: 'Tây', price: 5720, state: 'giu' },
        { id: 'LPP-D.22.03', pj: 'leparc', zone: 'z-lpp-d-22', block: 'D', floor: 22, kind: '3PN thô — loại D2', area: 104.0, dir: 'Đông Nam', price: 8960, state: 'con' },
        { id: 'LPP-A.35.01', pj: 'leparc', zone: 'z-lpp-a-35', block: 'A', floor: 35, kind: 'Sky villa — SV01', area: 210.0, dir: 'Đông Nam', price: 18200, state: 'con' },
        { id: 'A-12.05', pj: 'celestine', zone: 'z-cel-a1-12', block: 'A', floor: 12, kind: '2PN + 1', area: 72.4, dir: 'Đông Nam', price: 4860, state: 'con' },
        { id: 'A-15.02', pj: 'celestine', zone: 'z-cel-a1-15', block: 'A', floor: 15, kind: '3PN', area: 96.8, dir: 'Tây Bắc', price: 6420, state: 'giu' },
        { id: 'A-18.07', pj: 'celestine', zone: 'z-cel-a1-18', block: 'A', floor: 18, kind: '2PN', area: 68.0, dir: 'Đông', price: 4520, state: 'con' },
        { id: 'B-05.03', pj: 'celestine', zone: 'z-cel-b1-05', block: 'B', floor: 5, kind: '1PN + 1', area: 55.6, dir: 'Nam', price: 3280, state: 'con' },
        { id: 'B-22.09', pj: 'celestine', zone: 'z-cel-b1-22', block: 'B', floor: 22, kind: '3PN + 1', area: 108.5, dir: 'Đông Nam', price: 7040, state: 'ban' },
        { id: 'C-08.11', pj: 'celestine', zone: 'z-cel-c1-08', block: 'C', floor: 8, kind: '1PN + 1', area: 58.2, dir: 'Bắc', price: 3440, state: 'con' },
        { id: 'C-14.06', pj: 'celestine', zone: 'z-cel-c1-14', block: 'C', floor: 14, kind: '2PN + 1', area: 74.1, dir: 'Đông Nam', price: 5120, state: 'con' },
        { id: 'C-21.03', pj: 'celestine', zone: 'z-cel-c1-21', block: 'C', floor: 21, kind: '3PN + 1', area: 112.0, dir: 'Đông Nam', price: 7180, state: 'ban' },
        { id: 'D-09.08', pj: 'celestine', zone: 'z-cel-d1-09', block: 'D', floor: 9, kind: '2PN', area: 70.2, dir: 'Tây', price: 4380, state: 'giu' },
        { id: 'D-25.01', pj: 'celestine', zone: 'z-cel-d1-25', block: 'D', floor: 25, kind: '3PN', area: 99.4, dir: 'Đông Nam', price: 6890, state: 'con' },
        { id: 'RB-14', pj: 'la-perle', block: 'Ruby', floor: 0, kind: 'Liền kề', area: 128, dir: 'Đông', price: 12500, state: 'con' },
        { id: 'RB-15', pj: 'la-perle', block: 'Ruby', floor: 0, kind: 'Liền kề', area: 128, dir: 'Đông', price: 12500, state: 'ban' },
        { id: 'SP-02', pj: 'la-perle', block: 'Sapphire', floor: 0, kind: 'Biệt thự đơn lập', area: 300, dir: 'Nam', price: 28000, state: 'con' },
        { id: 'B4-07', pj: 'palmy', block: 'Dãy B4', floor: 0, kind: 'Lô góc', area: 200, dir: 'Đông Nam', price: 6500, state: 'con' },
        { id: 'B4-08', pj: 'palmy', block: 'Dãy B4', floor: 0, kind: 'Lô thường', area: 90, dir: 'Đông', price: 2800, state: 'con' },
        { id: 'B5-12', pj: 'palmy', block: 'Dãy B5', floor: 0, kind: 'Lô thường', area: 100, dir: 'Tây', price: 3100, state: 'giu' }
      ],

      /* Tài liệu — MH-05, MH-11, quản trị */
      documents: [
        { id: 'lp10', pj: 'leparc', branch: 1, folder: 'lp-f1', name: 'Thông tin quy hoạch khu đô thị ParkCity Hanoi',
          kind: 'gioithieu', src: 'reco', label: 'public', ver: 'v1', from: '01/08/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'lp11', pj: 'leparc', branch: 2, folder: 'lp-f2', name: 'Bảng giá đợt 1 tòa A, B (đã hết hiệu lực)',
          kind: 'banghang', src: 'reco', label: 'internal', ver: 'v1', from: '01/06/2026', to: '31/07/2026',
          state: 'expired', icon: 'xls' },
        { id: 'lp0', pj: 'leparc', branch: 1, folder: null, name: 'Giới thiệu Le Parc Place — bản RECO tổng hợp',
          kind: 'gioithieu', src: 'reco', label: 'public', ver: 'v2', from: '15/08/2026', to: '31/12/2026',
          state: 'live', icon: 'pdf' },
        { id: 'lp1', pj: 'leparc', branch: 1, folder: null, name: 'Tổng quan dự án Le Parc Place',
          kind: 'gioithieu', src: 'drive', label: 'public', ver: '—', from: '05/08/2026', to: null,
          state: 'live', icon: 'pdf', note: 'Chủ đầu tư sở hữu — chỉ xem' },
        { id: 'lp2', pj: 'leparc', branch: 2, folder: null, name: 'Bảng giá Rumor tòa C, D',
          kind: 'banghang', src: 'drive', label: 'internal', ver: '—', from: '14/08/2026', to: '31/08/2026',
          state: 'live', icon: 'xls', note: 'Chủ đầu tư cập nhật 14/08/2026 — chưa công bố' },
        { id: 'lp3', pj: 'leparc', branch: 3, folder: null, name: 'Chính sách và tiến độ bán hàng',
          kind: 'chinhsach', src: 'drive', label: 'internal', ver: '—', from: '10/08/2026', to: '10/09/2026',
          state: 'live', icon: 'pdf' },
        { id: 'lp4', pj: 'leparc', branch: 2, folder: null, name: 'Mẫu phiếu tính giá',
          kind: 'phieutinhgia', src: 'drive', label: 'internal', ver: '—', from: '01/08/2026', to: null,
          state: 'live', icon: 'xls' },
        { id: 'lp5', pj: 'leparc', branch: 3, folder: null, name: 'Mẫu hợp đồng mua bán (SPA)',
          kind: 'phaply', src: 'drive', label: 'internal', ver: '—', from: '01/08/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'lp6', pj: 'leparc', branch: 3, folder: null, name: 'Sổ hồng — hồ sơ pháp lý dự án',
          kind: 'phaply', src: 'drive', label: 'internal', ver: '—', from: '20/07/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'lp7', pj: 'leparc', branch: 6, folder: null, name: 'Mẫu kịch bản bán hàng — câu hỏi thường gặp (88 câu)',
          kind: 'hoidap', src: 'reco', label: 'public', ver: '17/08/2026', from: '17/08/2026', to: '31/12/2026',
          state: 'live', icon: 'pdf', note: 'Nguồn của toàn bộ khu vực 07 — cột Chia sẻ còn trống' },
        { id: 'lp12', pj: 'leparc', branch: 4, folder: null, name: 'Bộ tài liệu bán hàng Le Parc Place',
          kind: 'gioithieu', src: 'drive', label: 'internal', ver: '—', from: '12/08/2026', to: null,
          state: 'live', icon: 'pdf', note: 'Chủ đầu tư sở hữu — nơi tra diện tích thông thủy và cơ cấu căn hộ' },
        { id: 'lp8', pj: 'leparc', branch: 5, folder: null, name: 'Bộ ảnh tiện ích tầng 5 và tầng 15',
          kind: 'anh', src: 'reco', label: 'public', ver: 'v1', from: '12/08/2026', to: null,
          state: 'live', icon: 'img' },
        { id: 'lp9', pj: 'leparc', branch: 7, folder: null, name: 'Chính sách hoa hồng Le Parc Place',
          kind: 'hoahong', src: 'reco', label: 'restricted', ver: 'v1', from: '05/08/2026', to: '30/09/2026',
          state: 'live', icon: 'pdf' },
        { id: 'd1', pj: 'celestine', branch: 1, folder: null, name: 'Tài liệu giới thiệu dự án — The Celestine Riverside',
          kind: 'gioithieu', src: 'reco', label: 'public', ver: 'v4', from: '01/01/2026', to: '31/12/2026',
          state: 'live', icon: 'pdf' },
        { id: 'd2', pj: 'celestine', branch: 2, folder: null, name: 'Bảng hàng đợt 3 — The Celestine Riverside',
          kind: 'banghang', src: 'drive', label: 'internal', ver: '—', from: '14/08/2026', to: null,
          state: 'live', icon: 'xls', note: 'Chủ đầu tư cập nhật 14/08/2026' },
        { id: 'd3', pj: 'palmy', branch: 2, folder: null, name: 'Bảng hàng phân khu B — Palmy Garden',
          kind: 'banghang', src: 'broken', label: 'internal', ver: '—', from: '02/08/2026', to: null,
          state: 'broken', icon: 'warn' },
        { id: 'd4', pj: 'celestine', branch: 3, folder: null, name: 'Chính sách bán hàng tháng 8/2026',
          kind: 'chinhsach', src: 'reco', label: 'internal', ver: 'v3', from: '01/08/2026', to: '20/08/2026',
          state: 'expiring', icon: 'pdf', daysLeft: 6 },
        { id: 'd5', pj: 'celestine', branch: 3, folder: null, name: 'Chính sách hoa hồng đợt 3',
          kind: 'chinhsach', src: 'reco', label: 'restricted', ver: 'v2', from: '01/08/2026', to: '17/08/2026',
          state: 'expiring', icon: 'pdf', daysLeft: 3 },
        { id: 'd6', pj: 'la-perle', branch: 4, folder: null, name: 'Mặt bằng phân khu Ruby — La Perle Villas',
          kind: 'matbang', src: 'reco', label: 'public', ver: 'v2', from: '22/07/2026', to: null,
          state: 'live', icon: 'img' },
        { id: 'd7', pj: 'la-perle', branch: 3, folder: null, name: 'Hồ sơ pháp lý — La Perle Villas',
          kind: 'chinhsach', src: 'reco', label: 'public', ver: 'v2', from: '05/06/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'd8', pj: 'palmy', branch: 5, folder: null, name: 'Bộ ảnh thực tế hạ tầng — Palmy Garden',
          kind: 'anhvideo', src: 'reco', label: 'public', ver: '—', from: '10/08/2026', to: null,
          state: 'live', icon: 'img', note: '24 ảnh · đã duyệt 10/08/2026' },
        { id: 'd9', pj: 'palmy', branch: 1, folder: null, name: 'Tài liệu giới thiệu — Palmy Garden (bản nháp v1)',
          kind: 'gioithieu', src: 'reco', label: 'internal', ver: 'v1', from: null, to: null,
          state: 'draft', icon: 'pdf' },
        { id: 'd10', pj: 'celestine', branch: 1, folder: 'f2', name: 'Thông tin quy hoạch khu vực',
          kind: 'gioithieu', src: 'reco', label: 'public', ver: 'v1', from: '12/05/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'd11', pj: 'celestine', branch: 1, folder: 'f1', name: 'Hồ sơ năng lực Chủ đầu tư',
          kind: 'gioithieu', src: 'reco', label: 'internal', ver: 'v2', from: '20/03/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'd12', pj: 'celestine', branch: 4, folder: null, name: 'Mặt bằng tầng điển hình tòa A',
          kind: 'matbang', src: 'reco', label: 'public', ver: 'v3', from: '18/06/2026', to: null,
          state: 'live', icon: 'img' },
        { id: 'd13', pj: 'celestine', branch: 5, folder: null, name: 'Video giới thiệu căn mẫu 2PN',
          kind: 'anhvideo', src: 'drive', label: 'public', ver: '—', from: '30/07/2026', to: null,
          state: 'live', icon: 'link' },
        { id: 'd14', pj: 'celestine', branch: 6, folder: null, name: 'Bộ hỏi đáp chuẩn — 32 câu',
          kind: 'gioithieu', src: 'reco', label: 'public', ver: 'v5', from: '09/08/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'd15', pj: 'celestine', branch: 7, folder: null, name: 'Ghi chú nội bộ đội kinh doanh',
          kind: 'chinhsach', src: 'reco', label: 'restricted', ver: '—', from: '13/08/2026', to: null,
          state: 'live', icon: 'pdf' },
        { id: 'd16', pj: 'la-perle', branch: 2, folder: null, name: 'Bảng hàng phân khu Ruby',
          kind: 'banghang', src: 'reco', label: 'internal', ver: 'v7', from: '10/08/2026', to: '18/08/2026',
          state: 'expiring', icon: 'xls', daysLeft: 4 },
        { id: 'd17', pj: 'palmy', branch: 2, folder: null, name: 'Phiếu tính giá mẫu đợt 3',
          kind: 'banghang', src: 'reco', label: 'internal', ver: 'v2', from: '01/08/2026', to: '14/08/2026',
          state: 'expiring', icon: 'xls', daysLeft: 0 }
      ],

      /* Phân cấp bảng hàng: phân khu → tòa (hoặc dãy) → tầng. Căn/lô treo vào nút lá.
         Đúng `zones` + `units.zone_id` của schema; căn hộ đủ ba cấp, đất nền và thấp tầng
         dừng ở cấp dãy nên nút lá chính là cấp 2. */
      zones: [
        { id: 'z-lpp', pj: 'leparc', parent: null, kind: 'khu', name: 'Le Parc Place — khối đế chung 4 tầng' },
        { id: 'z-lpp-a', pj: 'leparc', parent: 'z-lpp', kind: 'toa', name: 'Tòa A — 35 tầng · 197 căn' },
        { id: 'z-lpp-a-21', pj: 'leparc', parent: 'z-lpp-a', kind: 'tang', name: 'Tầng 21' },
        { id: 'z-lpp-a-28', pj: 'leparc', parent: 'z-lpp-a', kind: 'tang', name: 'Tầng 28' },
        { id: 'z-lpp-a-35', pj: 'leparc', parent: 'z-lpp-a', kind: 'tang', name: 'Tầng 35' },
        { id: 'z-lpp-b', pj: 'leparc', parent: 'z-lpp', kind: 'toa', name: 'Tòa B — 35 tầng · 272 căn' },
        { id: 'z-lpp-b-12', pj: 'leparc', parent: 'z-lpp-b', kind: 'tang', name: 'Tầng 12' },
        { id: 'z-lpp-b-24', pj: 'leparc', parent: 'z-lpp-b', kind: 'tang', name: 'Tầng 24' },
        { id: 'z-lpp-b-31', pj: 'leparc', parent: 'z-lpp-b', kind: 'tang', name: 'Tầng 31' },
        { id: 'z-lpp-c', pj: 'leparc', parent: 'z-lpp', kind: 'toa', name: 'Tòa C — 32 tầng · 177 căn' },
        { id: 'z-lpp-c-09', pj: 'leparc', parent: 'z-lpp-c', kind: 'tang', name: 'Tầng 9' },
        { id: 'z-lpp-c-18', pj: 'leparc', parent: 'z-lpp-c', kind: 'tang', name: 'Tầng 18' },
        { id: 'z-lpp-d', pj: 'leparc', parent: 'z-lpp', kind: 'toa', name: 'Tòa D — 29 tầng · 156 căn' },
        { id: 'z-lpp-d-11', pj: 'leparc', parent: 'z-lpp-d', kind: 'tang', name: 'Tầng 11' },
        { id: 'z-lpp-d-22', pj: 'leparc', parent: 'z-lpp-d', kind: 'tang', name: 'Tầng 22' },
        { id: 'z-cel-a', pj: 'celestine', parent: null, kind: 'khu', name: 'Phân khu Sông' },
        { id: 'z-cel-a1', pj: 'celestine', parent: 'z-cel-a', kind: 'toa', name: 'Tòa A' },
        { id: 'z-cel-a1-12', pj: 'celestine', parent: 'z-cel-a1', kind: 'tang', name: 'Tầng 12' },
        { id: 'z-cel-a1-15', pj: 'celestine', parent: 'z-cel-a1', kind: 'tang', name: 'Tầng 15' },
        { id: 'z-cel-a1-18', pj: 'celestine', parent: 'z-cel-a1', kind: 'tang', name: 'Tầng 18' },
        { id: 'z-cel-b1', pj: 'celestine', parent: 'z-cel-a', kind: 'toa', name: 'Tòa B' },
        { id: 'z-cel-b1-05', pj: 'celestine', parent: 'z-cel-b1', kind: 'tang', name: 'Tầng 5' },
        { id: 'z-cel-b1-22', pj: 'celestine', parent: 'z-cel-b1', kind: 'tang', name: 'Tầng 22' },
        { id: 'z-cel-c', pj: 'celestine', parent: null, kind: 'khu', name: 'Phân khu Vườn' },
        { id: 'z-cel-c1', pj: 'celestine', parent: 'z-cel-c', kind: 'toa', name: 'Tòa C' },
        { id: 'z-cel-c1-08', pj: 'celestine', parent: 'z-cel-c1', kind: 'tang', name: 'Tầng 8' },
        { id: 'z-cel-c1-14', pj: 'celestine', parent: 'z-cel-c1', kind: 'tang', name: 'Tầng 14' },
        { id: 'z-cel-c1-21', pj: 'celestine', parent: 'z-cel-c1', kind: 'tang', name: 'Tầng 21' },
        { id: 'z-cel-d1', pj: 'celestine', parent: 'z-cel-c', kind: 'toa', name: 'Tòa D' },
        { id: 'z-cel-d1-09', pj: 'celestine', parent: 'z-cel-d1', kind: 'tang', name: 'Tầng 9' },
        { id: 'z-cel-d1-25', pj: 'celestine', parent: 'z-cel-d1', kind: 'tang', name: 'Tầng 25' }
      ],

      /* Thành phần nội dung của màn Chi tiết dự án — khu vực 01 đến 04 và 08.
         Một kho chung, phân loại bằng `kind`, để mọi khu vực dùng chung một luồng
         thêm/sửa/xóa và một quy tắc nhãn quyền. */
      sections: [
        { id: 'lps19', pj: 'leparc', kind: 'point', label: 'restricted', title: 'Chính sách hoa hồng đợt mở bán tòa C, D',
          body: 'Chỉ vai trò được chỉ định xem được nội dung này.' },
        { id: 'lps1', pj: 'leparc', kind: 'overview', label: 'public',
          body: 'Dự án căn hộ lớn nhất khu đô thị ParkCity Hanoi: 4 tòa A, B, C, D cao 29–35 tầng trên khu đất 16.234 m² (1,62 ha), tổng 802 căn, chung khối đế 4 tầng; mật độ xây dựng khối đế 63,5% và khối tháp 37,3%. Ý tưởng kiến trúc và nội thất do Ronald Lu & Partners (Hong Kong) thực hiện, cảnh quan do ONE Landscape Design Firm tư vấn. Đối diện Công viên Trung tâm và hồ cảnh quan; tầng tiện ích tại tầng 5 rộng hơn 8.000 m² và tầng 15 dạng vườn trên cao. Sở hữu lâu dài; dự án không đủ điều kiện bán cho người nước ngoài.' },

        { id: 'lps2', pj: 'leparc', kind: 'place', label: 'public', title: 'The LINC Neighborhood Mall', body: '590 m · đi bộ 8 phút' },
        { id: 'lps3', pj: 'leparc', kind: 'place', label: 'public', title: 'ParkCity Club Hanoi', body: '640 m · đi bộ 9 phút' },
        { id: 'lps4', pj: 'leparc', kind: 'place', label: 'public', title: 'Trường Quốc tế ISPH', body: 'Trong khu đô thị · 5 phút' },
        { id: 'lps5', pj: 'leparc', kind: 'place', label: 'public', title: 'Aeon Mall Hà Đông', body: '1,5 km · 5 phút' },
        { id: 'lps6', pj: 'leparc', kind: 'place', label: 'public', title: 'Ga Metro Hà Đông — Cát Linh', body: '800 m · đi bộ 11 phút' },
        { id: 'lps7', pj: 'leparc', kind: 'place', label: 'public', title: 'Phố cổ Hà Nội', body: '10 km · 25 phút' },
        { id: 'lps20', pj: 'leparc', kind: 'place', label: 'public', title: 'Trạm BRT ParkCity Hanoi', body: '50 m · đi bộ 1 phút' },
        { id: 'lps21', pj: 'leparc', kind: 'place', label: 'public', title: 'Trường tiểu học quy hoạch', body: 'Đối diện dự án · dự kiến mở 2028' },
        { id: 'lps22', pj: 'leparc', kind: 'place', label: 'public', title: 'Park Kiara', body: '340 m · trong khu đô thị' },
        { id: 'lps23', pj: 'leparc', kind: 'place', label: 'public', title: 'Parc Regent', body: '360 m · trong khu đô thị' },
        { id: 'lps24', pj: 'leparc', kind: 'place', label: 'public', title: 'Khu biệt thự Le Jardin', body: '710 m · trong khu đô thị' },
        { id: 'lps25', pj: 'leparc', kind: 'place', label: 'public', title: 'CBD mới', body: '7 km · 15 phút' },

        { id: 'lps8', pj: 'leparc', kind: 'point', label: 'public', title: 'Dự án căn hộ lớn nhất ParkCity Hanoi',
          body: '802 căn so với 309 căn của Parc Regent — cộng đồng lớn hơn, dịch vụ nội khu bền hơn.' },
        { id: 'lps9', pj: 'leparc', kind: 'point', label: 'public', title: 'Tầng tiện ích tầng 5 hơn 8.000 m²',
          body: 'Gấp đôi quy mô 4.500 m² của Parc Regent: lap pool 40 m dùng công nghệ điện phân muối, sân pickleball tiêu chuẩn, gym và yoga 442 m². Hồ bơi 50 m chuẩn Olympic là của ParkCity Clubhouse, không thuộc dự án.' },
        { id: 'lps10', pj: 'leparc', kind: 'point', label: 'public', title: 'Đối diện Công viên Trung tâm 4,2 ha',
          body: 'Tầm nhìn xanh trực diện, là trung tâm giải trí và kết nối cộng đồng của khu đô thị.' },
        { id: 'lps11', pj: 'leparc', kind: 'point', label: 'public', title: 'Hệ đỗ xe cơ khí 2 tầng đầu tiên tại ParkCity',
          body: '599 chỗ thường, 188 chỗ tandem, 260 chỗ cơ khí, khoảng 1.090 chỗ xe máy.' },
        { id: 'lps12', pj: 'leparc', kind: 'point', label: 'internal', title: 'So sánh trực diện với Parc Regent',
          body: 'Chín điểm hơn đã được Chủ đầu tư xác nhận. Chỉ dùng khi tư vấn trực tiếp, không đăng công khai.' },
        { id: 'lps26', pj: 'leparc', kind: 'point', label: 'public', title: 'Ý tưởng thiết kế "Le Château"',
          body: 'Mặt đứng diễn giải đương đại của phong cách cổ điển hiện đại, cân bằng giữa tỷ lệ và tính đối xứng.' },
        { id: 'lps27', pj: 'leparc', kind: 'point', label: 'public', title: 'Thang máy 3 m/s, 39–54 căn trên một thang',
          body: 'Tải trọng 1.350 kg cho cả bốn tòa; tòa D chỉ 39 căn/thang, tòa B nhiều nhất 54 căn/thang.' },

        { id: 'lps13', pj: 'leparc', kind: 'plan', label: 'public', title: 'Mặt bằng tầng điển hình tòa A — 7 căn/tầng', img: 'celestine.jpg' },
        { id: 'lps14', pj: 'leparc', kind: 'plan', label: 'public', title: 'Mặt bằng tầng điển hình tòa B — 10 căn/tầng', img: 'la-perle.webp' },
        { id: 'lps15', pj: 'leparc', kind: 'plan', label: 'public', title: 'Mặt bằng tầng tiện ích — tầng 5', img: 'palmy.jpg' },
        { id: 'lps16', pj: 'leparc', kind: 'plan', label: 'internal', title: 'Mặt bằng khối đế và bãi đỗ xe', img: 'thien-duong.jpg' },
        { id: 'lps28', pj: 'leparc', kind: 'plan', label: 'public', title: 'Mặt bằng tầng 15 — vườn trên cao và tiện ích', img: 'reco-banner.jpg' },

        { id: 'lps17', pj: 'leparc', kind: 'content', label: 'public', title: 'Giới thiệu Le Parc Place — bản ngắn',
          body: 'Khoảng 90 từ, kèm 4 ảnh đã duyệt. Nêu quy mô 802 căn, tiện ích tầng 5 và vị trí đối diện Công viên Trung tâm.', at: '15/08/2026' },
        { id: 'lps18', pj: 'leparc', kind: 'content', label: 'public', title: 'Tiêu chuẩn bàn giao — bản gửi khách',
          body: 'Bảng vật liệu hoàn thiện theo từng loại căn, không kèm giá và chính sách chưa công bố.', at: '16/08/2026' },
        { id: 'sc1', pj: 'celestine', kind: 'overview', label: 'public',
          body: 'Khu căn hộ ven sông tại Long Biên, gồm bốn tòa cao 27 tầng trên tổng diện tích 6,4 ha, bàn giao theo ba đợt từ quý II/2027. Sản phẩm hướng tới nhóm khách gia đình trẻ và khách đầu tư cho thuê dài hạn.' },

        { id: 'sc2', pj: 'celestine', kind: 'place', label: 'public', title: 'Cầu Vĩnh Tuy', body: '2,1 km · 5 phút' },
        { id: 'sc3', pj: 'celestine', kind: 'place', label: 'public', title: 'Hồ Hoàn Kiếm', body: '7,4 km · 18 phút' },
        { id: 'sc4', pj: 'celestine', kind: 'place', label: 'public', title: 'Vành đai 3', body: '3,6 km · 8 phút' },
        { id: 'sc5', pj: 'celestine', kind: 'place', label: 'public', title: 'Bệnh viện Tâm Anh', body: '1,8 km · 4 phút' },
        { id: 'sc6', pj: 'celestine', kind: 'place', label: 'public', title: 'Trường liên cấp Vinschool', body: '1,2 km · 3 phút' },
        { id: 'sc7', pj: 'celestine', kind: 'place', label: 'public', title: 'Sân bay Nội Bài', body: '26 km · 38 phút' },

        { id: 'sc8', pj: 'celestine', kind: 'point', label: 'public', title: 'Ba mặt view sông Hồng',
          body: 'Tòa C và D có 62% số căn nhìn trực diện sông.' },
        { id: 'sc9', pj: 'celestine', kind: 'point', label: 'public', title: 'Bàn giao nội thất liền tường',
          body: 'Bếp, tủ âm, thiết bị vệ sinh thương hiệu châu Âu.' },
        { id: 'sc10', pj: 'celestine', kind: 'point', label: 'public', title: 'Hỗ trợ lãi suất 0% trong 18 tháng',
          body: 'Áp dụng cho đợt 3, ngân hàng liên kết.' },
        { id: 'sc11', pj: 'celestine', kind: 'point', label: 'internal', title: 'Chiết khấu thanh toán sớm 95%',
          body: 'Mức chiết khấu chưa công bố ra ngoài, chỉ dùng khi tư vấn trực tiếp.' },
        { id: 'sc12', pj: 'celestine', kind: 'point', label: 'restricted', title: 'Chính sách hoa hồng đợt 3',
          body: 'Chỉ vai trò được chỉ định xem được nội dung này.' },

        { id: 'sc13', pj: 'celestine', kind: 'plan', label: 'public', title: 'Mặt bằng tầng điển hình tòa A', img: 'celestine.jpg' },
        { id: 'sc14', pj: 'celestine', kind: 'plan', label: 'public', title: 'Mặt bằng căn 2 phòng ngủ', img: 'la-perle.webp' },
        { id: 'sc15', pj: 'celestine', kind: 'plan', label: 'public', title: 'Mặt bằng căn 3 phòng ngủ', img: 'palmy.jpg' },
        { id: 'sc16', pj: 'celestine', kind: 'plan', label: 'internal', title: 'Mặt bằng tổng thể khu', img: 'thien-duong.jpg' },

        { id: 'sc17', pj: 'celestine', kind: 'content', label: 'public', title: 'Giới thiệu dự án — bản ngắn',
          body: 'Khoảng 90 từ, kèm 4 ảnh đã duyệt. Dùng cho mọi kênh, nhân viên tự cắt gọt khi đăng.', at: '09/08/2026' },
        { id: 'sc18', pj: 'celestine', kind: 'content', label: 'public', title: 'Chính sách đợt 3 — bản gửi khách',
          body: 'Chỉ nêu phần chính sách được phép công bố, không có chiết khấu nội bộ.', at: '11/08/2026' },
        { id: 'sc19', pj: 'celestine', kind: 'content', label: 'public', title: 'Bộ ảnh căn mẫu 2PN',
          body: '12 ảnh đã duyệt, có thể tải hoặc chèn thẳng vào nội dung đăng.', at: '05/08/2026' }
      ],

      /* Thư mục con bên trong bảy nhánh cố định */
      folders: [
        { id: 'lp-f1', pj: 'leparc', branch: 1, name: 'Hồ sơ Chủ đầu tư ParkCity Holdings', label: 'public' },
        { id: 'lp-f2', pj: 'leparc', branch: 2, name: 'Bảng giá theo đợt mở bán', label: 'internal' },
        { id: 'lp-f3', pj: 'leparc', branch: 5, name: 'Ảnh tiện ích theo tầng', label: 'public' },
        { id: 'f1', pj: 'celestine', branch: 1, name: 'Hồ sơ chủ đầu tư', label: 'internal' },
        { id: 'f2', pj: 'celestine', branch: 1, name: 'Tiến độ thi công', label: 'public' },
        { id: 'f3', pj: 'celestine', branch: 2, name: 'Bảng hàng theo đợt', label: 'internal' },
        { id: 'f4', pj: 'la-perle', branch: 4, name: 'Bộ tài liệu gửi khách', label: 'public' },
        { id: 'f5', pj: 'palmy', branch: 5, name: 'Ảnh hạ tầng theo tháng', label: 'public' }
      ],

      /* Hỏi đáp — MH-06 */
      qas: [
        /* ===== Le Parc Place — nhập ĐỦ 88 câu của tài liệu RECO gửi ngày 17/08/2026
           ("Mẫu kịch bản bán hàng — Câu hỏi thường gặp", bảng 3 cột Câu hỏi/Trả lời/Chia sẻ),
           giữ đúng thứ tự và hai cấp nhóm của tài liệu.
           Cột "Chia sẻ" của tài liệu còn TRỐNG nên không câu nào có `a2`: bản gửi khách phải
           do RECO tự soạn, bản mô phỏng không tự viết thay.
           `warn` là những số liệu chính tài liệu ghi lệch nhau ở hai chỗ khác nhau — hiện
           chip "Cần Chủ đầu tư xác nhận" thay vì âm thầm chọn một số. */
        { id: 'lq1', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tongquan',
          q: 'Vị trí dự án ở đâu?',
          a: 'ParkCity Hanoi tọa lạc tại trung tâm phường Dương Nội, cách khu phố cổ Hà Nội khoảng 10 km, cách CBD mới khoảng 7 km và chỉ cách Aeon Mall Hà Đông khoảng 1,5 km — một trong những trung tâm mua sắm lớn tại Việt Nam. Khu đô thị có lợi thế lớn về sự thuận tiện và khả năng kết nối bằng ô tô cũng như giao thông công cộng như BRT, Metro và các tuyến xe buýt.',
          label: 'public', state: 'approved' },
        { id: 'lq2', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tongquan',
          q: 'Quy mô khu đô thị là bao nhiêu?',
          a: '77,4 ha.',
          label: 'public', state: 'approved' },
        { id: 'lq3', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tongquan',
          q: 'Ý tưởng phát triển của ParkCity Hanoi là gì?',
          a: 'ParkCity Hanoi được quy hoạch tổng thể bài bản, với các ý tưởng sống sáng tạo và khác biệt, đi kèm chất lượng thi công cao; dự án đã đạt nhiều giải thưởng trong nước và quốc tế. Khu đô thị được thiết kế với mục tiêu kiến tạo một cộng đồng hạnh phúc và khỏe mạnh thông qua không gian xanh rộng lớn, các khoảng mở khuyến khích hoạt động thể chất ngoài trời, đồng thời tạo ra các điểm gặp gỡ để cư dân giao lưu và kết nối xã hội.',
          label: 'public', state: 'approved' },
        { id: 'lq4', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tongquan',
          q: 'Các tuyến tiếp cận chính là gì?',
          a: 'Khu đô thị tiếp cận được từ nhiều trục lớn và ba loại giao thông công cộng:',
          bul: ['Đường Quang Trung — Nguyễn Trãi.',
                'Đường Nguyễn Văn Trác — Tố Hữu — Lê Văn Lương.',
                'Đường Lê Trọng Tấn — Đại lộ Thăng Long — Trung Hòa Nhân Chính.',
                'Đường Lê Trọng Tấn — Lê Quang Đạo — Từ Liêm.',
                'Vành đai 4 kết nối Sân bay Nội Bài và Sân bay Gia Bình; đường gom dự kiến hoàn thành năm 2026, cao tốc dự kiến hoàn thành năm 2027.',
                'Các tuyến đường lớn khác đi qua Dương Nội: Lê Trọng Tấn — Tố Hữu, đường 70, hầm chui Khuất Duy Tiến — Lê Văn Lương.',
                'Tuyến BRT đã vận hành, chỉ cách cổng ParkCity Hanoi khoảng 50 m.',
                'Tuyến MRT Hà Đông — Cát Linh, nhà ga cách cổng khoảng 800 m.',
                'VinBus E06 đang vận hành, điểm dừng chỉ cách cổng khoảng 5 m.'],
          label: 'public', state: 'approved' },
        { id: 'lq5', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tongquan',
          q: 'Khu đô thị gồm những hạng mục nào?',
          a: 'Sáu hạng mục chính:',
          bul: ['Khoảng 5.800 căn nhà ở thấp tầng và cao tầng.',
                'Khu phát triển hỗn hợp 16,9 ha, giai đoạn đầu là trung tâm thương mại The LINC Neighborhood Mall.',
                'ParkCity Hanoi Clubhouse rộng 1,7 ha với hệ tiện ích phong cách nghỉ dưỡng.',
                'Công viên và lối đi bộ dạng vòng kết nối các khu dân cư với The LINC.',
                'Quỹ đất trường học 8,4 ha, trong đó 2,4 ha dành cho trường quốc tế.',
                'Công viên Trung tâm và hồ cảnh quan 4,2 ha.'],
          label: 'public', state: 'approved' },
        { id: 'lq6', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'anninh',
          q: 'Hệ thống an ninh của khu đô thị như thế nào?',
          a: 'ParkCity Hanoi được quy hoạch là cộng đồng khép kín, có kiểm soát an ninh chặt chẽ. Chốt bảo vệ chính đặt ngay tại cổng vào khu đô thị; ngoài ra mỗi khu dân cư đều có chốt bảo vệ riêng, giúp đảm bảo an toàn tối đa cho toàn bộ cư dân.',
          label: 'public', state: 'approved' },
        { id: 'lq7', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tienich',
          q: 'Các điểm nổi bật của ParkCity Clubhouse là gì?',
          a: 'Clubhouse phong cách nghỉ dưỡng, từng đạt giải thưởng, rộng 17.000 m², gồm:',
          bul: ['1 sân tennis và 8 sân pickleball.',
                'Hồ bơi bốn mùa trong nhà chuẩn Olympic dài 50 m.',
                'Hồ bơi thư giãn ngoài trời.',
                'Hồ bơi trẻ em với thiết bị vui chơi nước.',
                'Khu vui chơi mạo hiểm.',
                'Phòng gym trong nhà.',
                'Lớp yoga và Group X.',
                'Sauna và steam.',
                'Đại sảnh tổ chức sự kiện riêng.',
                'Sảnh đa năng gồm 4 sân cầu lông, 1 sân bóng rổ và đường chạy bộ trong nhà trên cao.'],
          label: 'public', state: 'approved' },
        { id: 'lq8', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tienich',
          q: 'Tình trạng Trường Quốc tế ParkCity Hanoi (ISPH) hiện nay như thế nào?',
          a: 'International School at ParkCity Hanoi (ISPH) cung cấp chương trình giáo dục chuẩn quốc tế theo chương trình học của Vương quốc Anh cho học sinh từ 3 đến 18 tuổi. Từ khi khai trương năm 2019, ISPH đã phát triển mạnh và hiện được công nhận đầy đủ là Cambridge Examinations Centre, cấp chứng chỉ IGCSE được quốc tế công nhận; cộng đồng hiện hơn 350 học sinh đến từ hơn 10 quốc tịch. Năm 2026, ISPH được trao chứng nhận International Schools Quality Mark (ISQM) Gold Accreditation — cấp công nhận cao nhất từ Education Development Trust của Vương quốc Anh.',
          label: 'public', state: 'approved' },
        { id: 'lq9', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tienich',
          q: 'Công viên Trung tâm và hồ 4,2 ha nằm ở đâu? Có mở cho tất cả cư dân không?',
          a: 'Công viên Trung tâm và hồ nằm ở phía Nam khu đô thị ParkCity Hanoi, dễ dàng tiếp cận từ hai lối vào chính là ParkCity Boulevard và khu biệt thự Le Jardin. Công viên Trung tâm mở cho tất cả cư dân ParkCity Hanoi.',
          warn: 'Tài liệu ghi Công viên Trung tâm 4,2 ha ở phần khu đô thị nhưng 5,2 ha ở phần so sánh với Parc Regent.',
          label: 'public', state: 'approved' },
        { id: 'lq10', pj: 'leparc', grp: 'A · Khu đô thị ParkCity Hanoi', topic: 'tienich',
          q: 'Trung tâm thương mại nội khu đã vận hành chưa và có dịch vụ gì?',
          a: 'The LINC Neighborhood Mall đã đi vào vận hành từ tháng 12/2023, quy tụ nhiều thương hiệu và là điểm đến xã hội sôi động hằng ngày:',
          bul: ['Siêu thị: Tops Market.',
                'F&B: Highlands Coffee, MrP Bingsu & Tea, Dookki, Don Chicken, Dong Gogi, Mong Tea.',
                'Sức khỏe và tiện ích: Myrehab Matsuoka, Car Center.',
                'Giải trí và thời trang: Adidas Outlet, Cinestar Cinema, khu vui chơi trẻ em Lucky Games.'],
          label: 'public', state: 'approved' },

        { id: 'lq11', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Vị trí Le Parc Place ở đâu?',
          a: 'Le Parc Place nằm ngay tại giao lộ Spring Avenue — East Crescent Avenue:',
          bul: ['Phía Tây Bắc giáp The Mansions.',
                'Phía Đông Bắc giáp The Mansions.',
                'Phía Đông Nam giáp ParkCity Boulevard.',
                'Phía Tây Nam giáp đường Lê Trọng Tấn 1.'],
          label: 'public', state: 'approved' },
        { id: 'lq12', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Lối tiếp cận chính của Le Parc Place là gì?',
          a: 'Nằm ở trung tâm khu đô thị ParkCity Hanoi, dự án có thể tiếp cận qua 3 hướng:',
          bul: ['Đường Nguyễn Văn Trác — Lê Trọng Tấn 1.',
                'Đường Lê Trọng Tấn — East Crescent Avenue — Lê Trọng Tấn 1.',
                'Đường Lê Trọng Tấn — ParkCity Boulevard.'],
          label: 'public', state: 'approved' },
        { id: 'lq13', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Khoảng cách từ Le Parc Place đến các khu lân cận là bao nhiêu?',
          a: 'Dự án được bao quanh bởi các khu dân cư trong ParkCity Hanoi, với khoảng cách tham khảo:',
          bul: ['340 m đến Park Kiara.',
                '360 m đến Parc Regent.',
                '470 m đến Nadyne và Evelyne.',
                '710 m đến Le Jardin.',
                '640 m đến ParkCity Club Hanoi.',
                '590 m đến The LINC.'],
          label: 'public', state: 'approved' },
        { id: 'lq14', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Ý tưởng thiết kế và loại hình kiến trúc của dự án là gì?',
          a: 'Dự án căn hộ được phát triển theo ý tưởng thiết kế "Le Château" — một bản giao hưởng vượt thời gian của sự thanh lịch, nơi vẻ bề thế gặp gỡ nét duyên dáng. Mặt đứng công trình là cách diễn giải đương đại của phong cách cổ điển hiện đại, cân bằng giữa tỷ lệ và tính đối xứng để tạo nên một ngôn ngữ thị giác nổi bật; bố cục mặt đứng được tổ chức cẩn trọng, tạo nhịp điệu ổn định, phản ánh gu thẩm mỹ của nhóm cư dân tiềm năng.',
          label: 'public', state: 'approved' },
        { id: 'lq15', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Diện tích dự án là bao nhiêu?',
          a: '16.234 m², tương đương 1,62 ha.',
          label: 'public', state: 'approved' },
        { id: 'lq16', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Dự án có bao nhiêu tòa căn hộ?',
          a: 'Tổng cộng 4 tòa trên chung 4 tầng khối đế:',
          bul: ['Tòa A và Tòa B: 35 tầng.', 'Tòa C: 32 tầng.', 'Tòa D: 29 tầng.'],
          label: 'public', state: 'approved' },
        { id: 'lq17', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Khoảng cách giữa các tòa là bao nhiêu?',
          a: 'Tòa A kết nối với Tòa B, Tòa C kết nối với Tòa D. Tòa B và Tòa C cách nhau 15 m; Tòa B và Tòa D cách nhau 32 m.',
          label: 'public', state: 'approved' },
        { id: 'lq18', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Dự án có bao nhiêu căn hộ?',
          a: 'Tổng cộng 802 căn:',
          bul: ['Tòa A: 197 căn.', 'Tòa B: 272 căn.', 'Tòa C: 177 căn.', 'Tòa D: 156 căn.'],
          label: 'public', state: 'approved' },
        { id: 'lq19', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Mật độ xây dựng là bao nhiêu?',
          a: 'Khối đế 63,5%; khối tháp 37,3%.',
          label: 'public', state: 'approved' },
        { id: 'lq20', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'gia',
          q: 'Điểm bán hàng nổi bật của Le Parc Place là gì?',
          a: 'Mười ba điểm bán hàng theo tài liệu của Chủ đầu tư:',
          bul: ['Vị trí chiến lược ở trung tâm ParkCity Hanoi, ngay giao điểm hai trục huyết mạch ParkCity Boulevard và Lê Trọng Tấn 1.',
                'Dự án căn hộ có quy mô lớn nhất toàn khu đô thị, thiết lập chuẩn mực mới về quy mô, chất lượng kiến trúc và tiêu chuẩn sống.',
                'Không gian kiến trúc đa dạng kết hợp cảnh quan nhiều lớp: semi-outdoor lounge, private dining, khu tiệc hồ bơi, BBQ deck, jacuzzi mở, sân pickleball.',
                'Mật độ căn hộ 495 căn/ha; tốc độ thang máy 3 m/s; tòa A 7 căn/tầng với 4 thang (49 căn/thang), tòa B 10 căn/tầng với 5 thang (54 căn/thang), tòa C 177 căn với 4 thang (44 căn/thang), tòa D 7 căn/tầng với 3 thang (39 căn/thang).',
                'Tầng tiện ích phong cách nghỉ dưỡng tại tầng 5, dành riêng cho cư dân.',
                'Cảnh quan và mảng xanh quy mô lớn: tầng 1 khoảng 3.000 m², tầng 5 khoảng 7.000 m², tầng 15 khoảng 350 m² và khu mái.',
                'Sân pickleball kích thước tiêu chuẩn tại tầng 5.',
                'Đối diện Công viên Trung tâm và hồ — trung tâm giải trí và kết nối cộng đồng của khu đô thị.',
                'Khu căn hộ thuần cư trú, trên khu đất riêng có kiểm soát an ninh, chỉ cư dân được tiếp cận.',
                'Đối diện một trường tiểu học đang trong giai đoạn thiết kế, dự kiến khai trương năm 2028.',
                'Dự án đầu tiên tại ParkCity Hanoi được trang bị hệ thống đỗ xe cơ khí 2 tầng.',
                'Được phát triển và quản lý bởi ParkCity Holdings, nhà phát triển bất động sản uy tín đến từ Malaysia.'],
          warn: 'Cảnh quan tầng 5 ghi khoảng 7.000 m² ở đây nhưng hơn 8.000 m² ở phần so sánh với Parc Regent; cảnh quan tầng 1 ghi 3.000 m² ở đây và 3.200 m² ở phần ngoại thất.',
          label: 'public', state: 'approved' },
        { id: 'lq21', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'gia',
          q: 'Le Parc Place có điểm gì nổi bật so với Parc Regent?',
          a: 'Chín điểm hơn và năm điểm khác biệt theo tài liệu của Chủ đầu tư. Nội dung so sánh đối thủ chỉ dùng khi tư vấn trực tiếp, không đăng công khai.',
          bul: ['Vị trí trung tâm trên hai đại lộ lớn nhất khu đô thị rộng 40 m: ParkCity Boulevard và Lê Trọng Tấn 1.',
                'Dự án căn hộ lớn nhất khu đô thị: 802 căn so với 309 căn tại Parc Regent.',
                'Khả năng đi bộ vượt trội: tiếp cận các điểm đến chính trong khoảng 10 phút đi bộ.',
                'Đối diện Công viên Trung tâm 5,2 ha, tầm nhìn xanh rộng mở.',
                'Đối diện trường tiểu học quy hoạch, dự kiến mở cửa năm 2028.',
                'Tầng tiện ích tầng 5 rộng hơn 8.000 m², gấp đôi quy mô 4.500 m² của Parc Regent.',
                'Tầng lánh nạn tầng 15 được thiết kế thành vườn trên cao và khu tiện ích cư dân, khoảng 900 m².',
                'Hệ thống đỗ xe cơ khí 2 tầng đầu tiên tại ParkCity Hanoi.',
                'Sân pickleball kích thước tiêu chuẩn tại tầng 5.',
                'Khác biệt: hệ đỗ xe cơ khí 2 tầng tăng đáng kể sức chứa bãi đỗ so với giải pháp truyền thống.',
                'Khác biệt: cộng đồng cư dân lớn hơn, hỗ trợ tốt hơn cho dịch vụ nội khu và vận hành dài hạn.',
                'Khác biệt: mặt bằng điển hình đa dạng hơn, có loại 3+1 và 4+1 phòng ngủ.',
                'Khác biệt: ban công phòng ngủ sâu 1,4 m so với 1,2 m tại Parc Regent.',
                'Khác biệt: bề rộng thông thủy khu bếp 1,3 m so với 1,2 m.'],
          warn: 'Công viên Trung tâm ghi 5,2 ha ở đây nhưng 4,2 ha ở phần khu đô thị; tiện ích tầng 5 ghi hơn 8.000 m² ở đây nhưng khoảng 7.000 m² ở phần điểm bán hàng.',
          label: 'internal', state: 'approved' },
        { id: 'lq22', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Khoảng cách từ Park Kiara và Parc Regent đến các tòa Le Parc Place là bao nhiêu?',
          a: 'Từ Park Kiara: 165 m. Từ Parc Regent: 240 m.',
          label: 'public', state: 'approved' },
        { id: 'lq23', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Đơn vị kiến trúc của dự án là ai?',
          a: 'Bốn đơn vị tham gia thiết kế:',
          bul: ['Thiết kế ý tưởng kiến trúc: Ronald Lu & Partners (Hong Kong).',
                'Thiết kế kiến trúc địa phương: CPG Vietnam và INNO., JSC.',
                'Tư vấn cảnh quan: ONE Landscape Design Firm (Hong Kong).',
                'Tư vấn thiết kế nội thất: Ronald Lu & Partners (Hong Kong).'],
          label: 'public', state: 'approved' },
        { id: 'lq24', pj: 'leparc', grp: 'B · Le Parc Place — thông tin chung', topic: 'tongquan',
          q: 'Nhà thầu thi công dự án là ai?',
          a: 'Công tác cọc: Long Giang. Tài liệu của Chủ đầu tư chưa nêu nhà thầu của các hạng mục còn lại — không suy đoán khi tư vấn.',
          label: 'public', state: 'approved' },

        { id: 'lq25', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Mỗi tầng có bao nhiêu căn?',
          a: 'Tòa A 7 căn/tầng, tòa B 10 căn/tầng, tòa C 7 căn/tầng, tòa D 7 căn/tầng.',
          warn: 'Cùng một ô trả lời của tài liệu còn ghi bộ số thứ hai là tòa A 3, tòa B 4, tòa C 3, tòa D 3 — cần Chủ đầu tư xác nhận bộ số đúng.',
          label: 'public', state: 'approved' },
        { id: 'lq26', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Diện tích thông thủy của từng loại căn là bao nhiêu?',
          a: 'Tài liệu hỏi đáp không nêu số; tra trong bộ tài liệu bán hàng của Chủ đầu tư.',
          ref: 'Bộ tài liệu bán hàng Le Parc Place',
          label: 'public', state: 'approved' },
        { id: 'lq27', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Cơ cấu căn hộ như thế nào?',
          a: 'Tài liệu hỏi đáp không nêu chi tiết; tra trong bộ tài liệu bán hàng của Chủ đầu tư.',
          ref: 'Bộ tài liệu bán hàng Le Parc Place',
          label: 'public', state: 'approved' },
        { id: 'lq28', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Chiều cao tầng là bao nhiêu?',
          a: 'Căn điển hình 3,2 m; căn sky villa 4,5 m; tầng 15 của tòa A và tòa B là 4,6 m.',
          label: 'public', state: 'approved' },
        { id: 'lq29', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Tiêu chuẩn bàn giao của dự án là gì?',
          a: 'Ba mức bàn giao theo loại căn:',
          bul: ['Loại A, A1, A2, A4, A5, B, B1, B2, C, C1, E: hoàn thiện tiêu chuẩn.',
                'Loại D1, D2, D3, D4: bàn giao thô có tường phòng, tường phòng hoàn thiện đến lớp trát.',
                'Loại SV01 đến SV05: bàn giao thô có tường phòng.'],
          warn: 'Câu này ghi bàn giao thô cho SV01–SV05, câu về vật liệu hoàn thiện lại ghi SV01–SV13.',
          label: 'public', state: 'approved' },
        { id: 'lq30', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Chi tiết vật liệu hoàn thiện của dự án như thế nào?',
          a: 'Phân theo hai nhóm căn:',
          bul: ['Căn hoàn thiện tiêu chuẩn: A, A1, A2, A4, A5, B, B1, B2, C, C1, E.',
                'Căn bàn giao thô: D1, D2, D3, D4 và SV01 đến SV13.'],
          warn: 'Nhóm căn bàn giao thô ghi SV01–SV13 ở câu này nhưng SV01–SV05 ở câu tiêu chuẩn bàn giao.',
          label: 'public', state: 'approved' },
        { id: 'lq31', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Hoàn thiện tường và sàn như thế nào? Có giống Parc Regent không?',
          a: 'Có, hoàn thiện tương tự Parc Regent đối với các căn hoàn thiện tiêu chuẩn.',
          tbl: [{ cap: 'Vật liệu hoàn thiện theo khu vực',
                  head: ['Khu vực', 'Hoàn thiện sàn', 'Hoàn thiện tường'],
                  body: [['Phòng khách và ăn', 'Sàn gỗ laminate dày 12 mm, gạch 800x800 và len tường', 'Trát và sơn'],
                         ['Bếp khô và bếp chung', 'Gạch MML hoặc tương đương 800x800, len tường', 'Trát và sơn'],
                         ['Bếp ướt', 'Gạch MML hoặc tương đương 600x600', 'Gạch tường MML hoặc tương đương'],
                         ['Sảnh riêng', 'Gạch MML hoặc tương đương 800x800', 'Trát và sơn'],
                         ['Phòng ngủ', 'Sàn gỗ laminate dày 12 mm, lát xương cá, len tường tùy vị trí', 'Trát và sơn'],
                         ['Phòng tắm', 'Gạch MML hoặc tương đương 600x600', 'Gạch tường MML hoặc tương đương 600x300'],
                         ['Phòng vệ sinh phụ', 'Gạch MML hoặc tương đương 600x600', 'Gạch tường MML hoặc tương đương 600x300'],
                         ['Phòng tiện ích và sân phơi', 'Gạch MML hoặc tương đương 600x600, len tường', 'Trát và sơn'],
                         ['Ban công', 'Gạch MML hoặc tương đương 600x600, len tường', 'Trát và sơn']] }],
          label: 'public', state: 'approved' },
        { id: 'lq32', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Hoàn thiện trần như thế nào?',
          a: 'Áp dụng cho căn hoàn thiện tiêu chuẩn A, A1, A2, A4, A5, B, B1, B2, C, C1, E: trần thạch cao, bả skim coat, sơn nước hoàn thiện. Chiều cao thông thủy tối thiểu: phòng ngủ 2,8 m, phòng khách và ăn 2,8 m, bếp 2,56 m, phòng tắm 2,5 m.',
          label: 'public', state: 'approved' },
        { id: 'lq33', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Căn hộ được trang bị loại cửa sổ nào?',
          a: 'Nhìn chung sử dụng cửa sổ kính hộp Low-E. Chiều cao cửa trượt 2,5 m.',
          label: 'public', state: 'approved' },
        { id: 'lq34', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Chiều cao cửa sổ phòng ngủ là bao nhiêu?',
          a: '2,38 m.',
          label: 'public', state: 'approved' },
        { id: 'lq35', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Thiết bị vệ sinh và thiết bị bàn giao gồm những gì?',
          a: 'Danh mục thiết bị bàn giao theo tài liệu của Chủ đầu tư:',
          bul: ['Điều hòa phòng khách và phòng ăn: hệ âm trần nối ống gió, thương hiệu Daikin, Panasonic, LG, Mitsubishi hoặc tương đương.',
                'Điều hòa phòng ngủ: loại treo tường, cùng nhóm thương hiệu trên.',
                'Khóa cửa thông minh: Hafele hoặc tương đương.',
                'Chậu rửa, bồn cầu, sen tắm, bộ sen, bồn tắm, móc áo, siphon, van nhấn, vòi nước, phễu thoát sàn, vòi xịt, hộp giấy, thanh treo khăn: TOTO hoặc tương đương.',
                'Tủ bếp cao kịch trần; máy hút mùi, bếp, lò nướng, máy rửa bát: Bosch hoặc tương đương.',
                'Chậu rửa inox, vòi nước, máy nghiền rác thực phẩm: Teka hoặc tương đương.',
                'Phụ kiện kim khí: Hafele hoặc tương đương; giá bát kéo tích hợp trong tủ bếp.',
                'Tủ gương: có cung cấp.',
                'Có ổ điện cho bồn cầu để chủ sở hữu tự thay bồn cầu tự động sau này, và ổ điện cho đèn sưởi ở tất cả phòng tắm.',
                'Không cung cấp: tủ quần áo và tủ lạnh.'],
          label: 'public', state: 'approved' },
        { id: 'lq36', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Công suất và hệ điều hòa là gì?',
          a: 'Loại căn A, B, C, E dùng hệ thống Multi VRF inverter, thương hiệu Daikin, Panasonic, LG, Mitsubishi hoặc tương đương.',
          label: 'public', state: 'approved' },
        { id: 'lq37', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Điều hòa là loại treo tường hay âm trần?',
          a: 'Tất cả phòng ngủ dùng điều hòa treo tường; phòng khách và phòng ăn dùng điều hòa âm trần.',
          label: 'public', state: 'approved' },
        { id: 'lq38', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Phòng tắm có quạt hút không?',
          a: 'Có.',
          label: 'public', state: 'approved' },
        { id: 'lq39', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Căn hộ được bàn giao loại cửa nào? Chiều cao cửa chính và cửa phòng ngủ là bao nhiêu?',
          a: 'Loại cửa và kích thước theo từng khu vực:',
          tbl: [{ cap: 'Cửa bàn giao',
                  head: ['Khu vực', 'Loại cửa và hoàn thiện', 'Kích thước'],
                  body: [['Cửa chính', 'Cửa chống cháy, hoàn thiện veneer', '2,4 m x 1,6 m'],
                         ['Phòng ngủ', 'Cửa đặc, hoàn thiện laminate', '2,4 m x 0,9 m'],
                         ['Phòng tắm', 'Cửa đặc, hoàn thiện laminate', '2,4 m x 0,8 m'],
                         ['Bếp ướt', 'Cửa kính trượt', '2,4 m x 0,9 m'],
                         ['Bếp ra sân phơi', 'Cửa nhôm kính laminated', '2,4 m x 0,9 m'],
                         ['Phòng khách ra ban công', 'Cửa khung nhôm kính hộp Low-E', 'Cao 2,5 m, rộng tùy căn'],
                         ['Phòng tiện ích và phòng giúp việc', 'Tùy căn', 'Tùy căn']] }],
          label: 'public', state: 'approved' },
        { id: 'lq40', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Tủ bếp bàn giao như thế nào? Có bố trí được máy rửa bát không?',
          a: 'Các loại căn A, A1, A2, A4, A5, B, B1, B2, C, C1, E được bàn giao tủ bếp cao kịch trần kèm máy hút mùi, bếp, chậu rửa, máy rửa bát, máy nghiền rác thực phẩm và giá bát kéo. Máy rửa bát đã tích hợp trong tủ bếp, ngoài ra có lò nướng.',
          label: 'public', state: 'approved' },
        { id: 'lq41', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Ban công là kính hay lan can kim loại?',
          a: 'Ban công sử dụng kính kết hợp lan can inox.',
          label: 'public', state: 'approved' },
        { id: 'lq42', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Hành lang có điều hòa không?',
          a: 'Không.',
          label: 'public', state: 'approved' },
        { id: 'lq43', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'noithat',
          q: 'Căn hộ có hệ thống cách âm để tăng riêng tư không?',
          a: 'Cửa trượt từ phòng khách ra ban công và cửa sổ phòng ngủ sử dụng kính hộp, giảm ồn tốt hơn 60% so với kính đơn.',
          label: 'public', state: 'approved' },

        { id: 'lq44', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Tải trọng thang máy là bao nhiêu?',
          a: 'Tòa A, B, C, D: 1.350 kg.',
          label: 'public', state: 'approved' },
        { id: 'lq45', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Tốc độ thang máy là bao nhiêu?',
          a: 'Tòa A, B, C, D: 3,0 m/giây.',
          label: 'public', state: 'approved' },
        { id: 'lq46', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Hành lang chung rộng bao nhiêu?',
          a: '2,05 m.',
          label: 'public', state: 'approved' },
        { id: 'lq47', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Chiều cao trần hành lang chung là bao nhiêu?',
          a: 'Tối thiểu 2,6 m.',
          label: 'public', state: 'approved' },
        { id: 'lq48', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Hành lang chung có thông gió tự nhiên không?',
          a: 'Có.',
          label: 'public', state: 'approved' },
        { id: 'lq49', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Rác được thu gom và chuyển về khu rác như thế nào?',
          a: 'Phòng rác được bố trí tại mỗi tầng. Rác được vận chuyển hằng ngày về phòng rác tập trung tại tầng 1, nằm cách xa sảnh thang máy cư dân.',
          warn: 'Câu này ghi 1 phòng rác tập trung tại tầng 1, câu về ống xả rác lại ghi hai phòng rác tập trung.',
          label: 'public', state: 'approved' },
        { id: 'lq50', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Tổng diện tích cảnh quan là bao nhiêu?',
          a: 'Tầng 1 (tầng trệt): khoảng 3.200 m².',
          warn: 'Phần điểm bán hàng ghi cảnh quan tầng 1 khoảng 3.000 m².',
          label: 'public', state: 'approved' },
        { id: 'lq51', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Tầng trệt có bao nhiêu sảnh và các khu vực nào?',
          a: 'Ngoài các sảnh, tầng trệt còn có điểm đón trả chính, phòng thư, phòng nhận hàng, văn phòng quản lý, phòng kỹ thuật, kho, lounge sảnh và nhà vệ sinh.',
          tbl: [{ cap: 'Sảnh tầng trệt',
                  head: ['Hạng mục', 'Diện tích'],
                  body: [['Sảnh Tòa A', '25 m²'],
                         ['Sảnh Tòa B', '32 m²'],
                         ['Sảnh Tòa C và Tòa D', '130 m²'],
                         ['Sảnh chung và hành lang Tòa A, B', '225 m²'],
                         ['Sảnh chung và hành lang Tòa C, D', '195 m²']] }],
          label: 'public', state: 'approved' },
        { id: 'lq52', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Có bao nhiêu lounge và diện tích như thế nào?',
          a: 'Có 2 lounge: resident lounge tầng 5 rộng 516 m² và wine lounge tầng 15 rộng 158 m².',
          label: 'public', state: 'approved' },
        { id: 'lq53', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Dự án có sử dụng hệ thống lọc nước trung tâm của tòa nhà không?',
          a: 'Có bộ lọc cát cho nước.',
          label: 'public', state: 'approved' },
        { id: 'lq54', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Thiết bị bàn giao có tính năng smart home không?',
          a: 'Có: hệ thống video intercom, nhận diện khuôn mặt để tiếp cận thang máy và khu vực chung, cùng khóa cửa kỹ thuật số thông minh cho cửa chính.',
          label: 'public', state: 'approved' },
        { id: 'lq55', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Tầng lánh nạn nằm ở tầng nào?',
          a: 'Tầng 15.',
          label: 'public', state: 'approved' },
        { id: 'lq56', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Ban công có vòi nước không?',
          a: 'Có.',
          label: 'public', state: 'approved' },
        { id: 'lq57', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Ống xả rác nằm ở đâu trên mỗi tầng?',
          a: 'Dự án không sử dụng ống xả rác. Mỗi tầng có phòng rác riêng; rác được thu gom hằng ngày và chuyển về phòng rác tập trung tại tầng 1, bố trí xa sảnh thang máy cư dân.',
          warn: 'Câu này ghi hai phòng rác tập trung, câu về thu gom rác lại ghi một phòng.',
          label: 'public', state: 'approved' },
        { id: 'lq58', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'ngoaithat',
          q: 'Có khu riêng cho nhận hàng, bưu phẩm và giao đồ ăn không?',
          a: 'Có. Phòng parcel nằm tại tầng 1 gần lối vào tòa C và tòa D; khu parcel hoặc phòng thư nằm phía sau khu lễ tân.',
          label: 'public', state: 'approved' },

        { id: 'lq59', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Khu tiện ích chung nằm ở đâu? Cư dân có được sử dụng miễn phí không?',
          a: 'Tầng tiện ích nằm ở tầng 5 và tầng 15. Cư dân Le Parc Place được sử dụng miễn phí.',
          label: 'public', state: 'approved' },
        { id: 'lq60', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Cách tiếp cận tầng tiện ích như thế nào?',
          a: 'Tầng tiện ích ở tầng 5 có thể tiếp cận qua tất cả thang máy của các tòa A, B, C và D.',
          label: 'public', state: 'approved' },
        { id: 'lq61', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Các tiện ích tại tầng trệt và tầng tiện ích gồm những gì? Diện tích bao nhiêu?',
          a: 'Danh mục tiện ích theo từng tầng:',
          tbl: [{ cap: 'Tầng trệt',
                  head: ['Hạng mục', 'Diện tích'],
                  body: [['Sảnh Tòa A', '25 m²'], ['Sảnh Tòa B', '32 m²'], ['Sảnh Tòa C và D', '130 m²'],
                         ['Sảnh chung và hành lang Tòa A, B', '225 m²'], ['Sảnh chung và hành lang Tòa C, D', '195 m²'],
                         ['Văn phòng quản lý', '—'], ['Phòng thư Tòa A, B', '110 m²'], ['Phòng thư Tòa C, D', '26 m²'],
                         ['Phòng parcel', '16 m²'], ['Pocket Garden', '12 m²'], ['Community Corner', '220 m²'],
                         ['Đường chạy bộ', '12 m²'], ['Resident lounge', '440 m²']] },
                { cap: 'Tầng 5 — Social lounge',
                  head: ['Hạng mục', 'Diện tích'],
                  body: [['Social lounge', '250 m²'], ['Media room — karaoke và mini theatre', '39 m²'],
                         ['Game room', '145 m²'], ['Kid & teen room', '67 m²'], ['Golf simulation rooms', '56 m²'],
                         ['Private dining', '82 m²'], ['Multipurpose hall', '222 m²'], ['Gym và yoga', '442 m²'],
                         ['Yoga deck', '535 m²'], ['Phòng thay đồ có sauna', '53 m²'], ['Library', '194 m²']] },
                { cap: 'Tầng 5 — khu ngoài trời',
                  head: ['Hạng mục', 'Diện tích'],
                  body: [['Sân pickleball', '261 m²'], ['Pavilion', '31 m²'], ['Barbeque deck', '61 m²'],
                         ['Hồ bơi trẻ em', '151 m²'], ['Lap pool', '500 m²'], ['Tropical lagoon', '267 m²'],
                         ['Island garden', '116 m²'], ['Swimming pool pavilion', '47 m²'], ['Pool deck', '46 m²'],
                         ['Swimming sunken', '44 m²'], ['Jacuzzi', '60 m²'], ['Event lawn', '316 m²'],
                         ['Lawn pavilion', '48 m²'], ['Stepping garden', '80 m²'], ['Sunken garden', '22 m²'],
                         ['Children playground', '190 m²'], ['Viewing deck', '23 m²']] },
                { cap: 'Tầng 15 — khu lánh nạn',
                  head: ['Hạng mục', 'Diện tích'],
                  body: [['Khu lánh nạn', '443 m²'], ['Private studio', '207 m²'], ['Cooking room', '69 m²'],
                         ['Study và co-working', '158 m²'], ['Wine và cigar lounge', '158 m²'],
                         ['Reading area', '300 m²'], ['Viewing deck', '69 m²']] }],
          warn: 'Cột Ghi chú của bảng tầng trệt trong tài liệu bị lệch hàng (ví dụ phòng thư tòa A, B lại ghi vị trí tại tòa D) nên đã bỏ cột này; diện tích đường chạy bộ 12 m² cũng cần Chủ đầu tư xác nhận lại.',
          label: 'public', state: 'approved' },
        { id: 'lq62', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Hồ bơi dài và sâu bao nhiêu?',
          a: 'Lap pool dài khoảng 40 m, sâu 1,2 m, diện tích khoảng 500 m². Hồ sử dụng công nghệ điện phân muối.',
          label: 'public', state: 'approved' },
        { id: 'lq63', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Hồ bơi trẻ em rộng bao nhiêu?',
          a: 'Hồ bơi trẻ em dài khoảng 20 m, sâu 0,6 m, diện tích khoảng 150 m².',
          label: 'public', state: 'approved' },
        { id: 'lq64', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Có jacuzzi ngoài trời không? Kích thước bao nhiêu?',
          a: 'Có 1 jacuzzi tại tầng 5, diện tích khoảng 60 m², kích thước khoảng 8 m x 8 m.',
          label: 'public', state: 'approved' },
        { id: 'lq65', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Khách có được sử dụng tiện ích không?',
          a: 'Có. Khách có thể sử dụng tiện ích cho các buổi tiệc, BBQ hoặc gặp mặt do cư dân tổ chức, nhưng phải có cư dân đi cùng và đăng ký trước.',
          label: 'public', state: 'approved' },
        { id: 'lq66', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Cư dân có thể đặt khu tiện ích để tổ chức sự kiện hoặc gặp mặt không?',
          a: 'Có, tuy nhiên sẽ áp dụng phí vệ sinh.',
          label: 'public', state: 'approved' },
        { id: 'lq67', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Khu tiện ích có thân thiện với thú cưng không? Có khu riêng cho thú cưng không?',
          a: 'Thú cưng không được phép vào khu tiện ích.',
          label: 'public', state: 'approved' },
        { id: 'lq68', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'tienich',
          q: 'Khu tiện ích có phù hợp với người khuyết tật không?',
          a: 'Người khuyết tật có thể dễ dàng tiếp cận và sử dụng tiện ích theo cách phù hợp. Nhà vệ sinh trong khu tiện ích có phòng dành cho người khuyết tật.',
          label: 'public', state: 'approved' },

        { id: 'lq69', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Khối đỗ xe có bao nhiêu tầng?',
          a: '4 tầng, từ tầng 1 đến tầng 4.',
          label: 'public', state: 'approved' },
        { id: 'lq70', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Có bao nhiêu lối vào và lối ra?',
          a: 'Một lối tiếp cận cho cư dân và khách, kiểm soát bởi chốt bảo vệ; một lối tiếp cận dịch vụ.',
          label: 'public', state: 'approved' },
        { id: 'lq71', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Tổng số chỗ đỗ ô tô trong khối đỗ xe là bao nhiêu?',
          a: 'Theo tài liệu của Chủ đầu tư:',
          bul: ['Chỗ đỗ xe thông thường: 599.', 'Chỗ đỗ xe cho người khuyết tật: 13.',
                'Chỗ đỗ tandem: 188.', 'Chỗ đỗ cơ khí: 260.', 'Chỗ đỗ xe khách: 15.'],
          label: 'public', state: 'approved' },
        { id: 'lq72', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Kích thước mỗi chỗ đỗ xe là bao nhiêu?',
          a: 'Chỗ đỗ điển hình 2,4 m x 5 m; chỗ đỗ tandem 2,4 m x 10 m; chỗ đỗ cơ khí 2,55 m x 5 m.',
          label: 'public', state: 'approved' },
        { id: 'lq73', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Có bao nhiêu chỗ đỗ xe máy?',
          a: 'Khoảng 1.090 chỗ.',
          label: 'public', state: 'approved' },
        { id: 'lq74', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Có bao nhiêu trạm sạc xe điện?',
          a: 'Có trạm sạc cho 4 ô tô điện. Ngoài ra dự án có dự phòng công suất điện đủ để chuyển đổi 10% số chỗ đỗ ô tô sang chỗ sạc điện nếu cần.',
          label: 'public', state: 'approved' },
        { id: 'lq75', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Mỗi căn được phân bổ bao nhiêu chỗ đỗ ô tô?',
          a: 'Phân bổ theo loại căn:',
          tbl: [{ cap: 'Chỗ đỗ ô tô theo loại căn',
                  head: ['Loại căn', 'Số chỗ đỗ'],
                  body: [['A, A1, A2, A4, A5', '1 chỗ đơn'],
                         ['B, B1, B2', '1 chỗ đơn'],
                         ['C, C1', '2 chỗ cơ khí'],
                         ['E', '2 chỗ cơ khí'],
                         ['D1, D2, D3, D4', '2 chỗ tandem'],
                         ['TD SV01, TC SV02, TC SV01, TB SV02, TA SV01, TB SV05', '3 chỗ: 1 chỗ đơn và 2 chỗ tandem'],
                         ['TD SV02, TC SV03, TD SV03, TB SV01, TA SV03, TA SV02, TB SV03', '3 chỗ đơn']] }],
          label: 'public', state: 'approved' },
        { id: 'lq76', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'doxe',
          q: 'Có khu rửa xe không?',
          a: 'Không.',
          label: 'public', state: 'approved' },

        { id: 'lq77', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'khumai',
          q: 'Trên mái có tiện ích gì?',
          a: 'Relaxing Lawn.',
          label: 'public', state: 'approved' },
        { id: 'lq78', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'khumai',
          q: 'Có thang máy đi trực tiếp lên mái từ tầng căn hộ hoặc khối đỗ xe không?',
          a: 'Không. Có thể lên mái bằng cách đi thang máy đến tầng trên cùng, sau đó sử dụng cầu thang bộ.',
          label: 'public', state: 'approved' },
        { id: 'lq79', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'khumai',
          q: 'Khu mái có dành cho tất cả cư dân không?',
          a: 'Khu mái dành cho tất cả cư dân, ngoại trừ một số khu vườn được sử dụng riêng bởi cư dân penthouse.',
          label: 'public', state: 'approved' },

        { id: 'lq80', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'anninh',
          q: 'Dự án có những tính năng an ninh nào?',
          a: 'Sáu nhóm tính năng an ninh:',
          bul: ['Liên lạc âm thanh hai chiều qua intercom đến chốt bảo vệ.',
                'Một lối vào duy nhất có chốt bảo vệ và barie, được giám sát bằng CCTV độ phân giải cao.',
                'Hệ thống quản lý ra vào của khách tại chốt bảo vệ.',
                'An ninh chu vi bằng hàng rào, giám sát qua CCTV và kết nối hệ thống xử lý báo động bằng máy tính.',
                'Nguồn điện liên tục cho hệ thống xử lý báo động và hệ thống quản lý kiểm soát xe.',
                'Chốt bảo vệ, phòng điều khiển an ninh và tuần tra được quản lý 24/7.'],
          label: 'public', state: 'approved' },
        { id: 'lq81', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'anninh',
          q: 'Có nhân sự giám sát khu tiện ích hoặc cứu hộ tại hồ bơi không?',
          a: 'Có nhân viên cứu hộ tại hồ bơi và tuần tra an ninh trong giờ vận hành thông thường. Cư dân được kỳ vọng giữ gìn vệ sinh khu vực và tự chịu trách nhiệm về an toàn cũng như trải nghiệm của mình.',
          label: 'public', state: 'approved' },

        { id: 'lq82', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'bangiao',
          q: 'Khi nào dự án bàn giao?',
          a: 'Chủ đầu tư chưa công bố mốc bàn giao chính thức (tài liệu ghi TBC). Khi tư vấn, nói rõ là chưa có thông tin thay vì đưa ra mốc dự đoán.',
          label: 'public', state: 'pending_info' },
        { id: 'lq83', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'bangiao',
          q: 'Phí quản lý hằng tháng của một căn điển hình là bao nhiêu?',
          a: 'Chủ đầu tư chưa công bố mức phí quản lý (tài liệu ghi TBC). Không dùng mức phí của dự án lân cận để suy đoán khi tư vấn.',
          label: 'public', state: 'pending_info' },
        { id: 'lq84', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'khac',
          q: 'Cư dân có thể sử dụng dịch vụ tại The ParkCity Club Hanoi không? Có mất phí không?',
          a: 'Có. Có áp dụng phí thành viên.',
          label: 'public', state: 'approved' },
        { id: 'lq85', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'phaply',
          q: 'Hình thức sở hữu căn hộ như thế nào?',
          a: 'Sở hữu lâu dài.',
          label: 'public', state: 'approved' },
        { id: 'lq86', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'phaply',
          q: 'Hồ sơ mua bán là SPA hay tài liệu nào? Nếu chưa phải SPA thì khi nào ký?',
          a: 'SPA — hợp đồng mua bán, hoặc tài liệu tương ứng sẽ được cập nhật theo thông tin chính thức của Chủ đầu tư.',
          ref: 'Mẫu hợp đồng mua bán (SPA)',
          label: 'public', state: 'approved' },
        { id: 'lq87', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'phaply',
          q: 'Dự án có mở bán cho người nước ngoài không?',
          a: 'Không. Le Parc Place không đủ điều kiện sở hữu cho người nước ngoài vì nằm trong khu vực hạn chế. Tuy nhiên, nếu một bên vợ hoặc chồng là công dân Việt Nam, cặp vợ chồng có thể đủ điều kiện mua căn hộ dưới tên người vợ hoặc chồng Việt Nam, theo quy định pháp luật hiện hành.',
          label: 'public', state: 'approved' },
        { id: 'lq88', pj: 'leparc', grp: 'C · Câu hỏi cụ thể về Le Parc Place', topic: 'phaply',
          q: 'Chủ sở hữu hiện tại có thể chuyển nhượng căn hộ cho người nước ngoài không?',
          a: 'Căn hộ Le Parc Place không đủ điều kiện chuyển nhượng quyền sở hữu cho người mua nước ngoài, trừ trường hợp bên nhận chuyển nhượng kết hôn hợp pháp với công dân Việt Nam. Khi đó, việc chuyển nhượng có thể được thực hiện dưới tên người vợ hoặc chồng Việt Nam, theo quy định pháp luật hiện hành.',
          label: 'public', state: 'approved' },
        { id: 'q1', pj: 'celestine', topic: 'phaply', q: 'Dự án đã có sổ hồng cho từng căn chưa?',
          a: 'Dự án đã có Giấy chứng nhận quyền sử dụng đất cho toàn khu và Giấy phép xây dựng. Sổ hồng từng căn được cấp sau khi bàn giao và nghiệm thu, dự kiến quý IV/2027.',
          a2: 'Dự án đã có giấy chứng nhận quyền sử dụng đất và giấy phép xây dựng; sổ hồng từng căn dự kiến cấp trong quý IV/2027.',
          ref: 'Hồ sơ pháp lý v2', label: 'public', state: 'approved' },
        { id: 'q2', pj: 'celestine', topic: 'gia', q: 'Khách vay được tối đa bao nhiêu phần trăm giá trị căn hộ?',
          a: 'Ngân hàng liên kết hỗ trợ tối đa 70% giá trị căn hộ, ân hạn gốc 18 tháng và hỗ trợ lãi suất 0% trong 18 tháng đầu cho đợt 3.',
          a2: 'Ngân hàng liên kết hỗ trợ vay tối đa 70% giá trị căn hộ, ân hạn gốc và hỗ trợ lãi suất 0% trong 18 tháng đầu.',
          label: 'public', state: 'approved' },
        { id: 'q3', pj: 'celestine', topic: 'bangiao', q: 'Phí quản lý dự kiến là bao nhiêu?',
          a: '16.500 đ/m²/tháng theo thông báo của Chủ đầu tư ngày 02/08/2026. Con số này có thể thay đổi khi Ban quản trị được thành lập — khi tư vấn nên nói rõ đây là mức dự kiến.',
          a2: 'Phí quản lý dự kiến 16.500 đ/m²/tháng theo thông báo của Chủ đầu tư, có thể thay đổi khi Ban quản trị được thành lập.',
          label: 'public', state: 'approved' },
        { id: 'q4', pj: 'celestine', topic: 'gia', q: 'Có được chuyển nhượng hợp đồng trước khi bàn giao không?',
          a: 'Được, sau khi khách đã thanh toán đủ 30% và có xác nhận của Chủ đầu tư. Phí chuyển nhượng theo quy định của Chủ đầu tư.',
          label: 'public', state: 'approved' },
        { id: 'q5', pj: 'celestine', topic: 'tiendo', q: 'Tiến độ thi công hiện tại tới đâu?',
          a: 'Tòa A và B đã cất nóc, đang hoàn thiện mặt ngoài. Tòa C thi công tới tầng 18, tòa D tầng 11. Cập nhật ngày 10/08/2026.',
          a2: 'Tòa A và B đã cất nóc và đang hoàn thiện mặt ngoài; tòa C và D đang lên tầng, cập nhật ngày 10/08/2026.',
          label: 'public', state: 'approved' },
        { id: 'q6', pj: 'celestine', topic: 'bangiao', q: 'Bàn giao có nội thất gì?',
          a: 'Bàn giao nội thất liền tường: hệ tủ bếp, tủ âm phòng ngủ, thiết bị vệ sinh thương hiệu châu Âu, điều hòa âm trần khu vực phòng khách.',
          label: 'public', state: 'approved' },
        { id: 'q7', pj: 'celestine', topic: 'phaply', q: 'Người nước ngoài mua được không?',
          a: 'Được, trong hạn mức 30% số căn của mỗi tòa theo quy định. Hiện tòa A và C còn hạn mức.',
          label: 'public', state: 'pending' },
        { id: 'q8', pj: 'celestine', topic: 'gia', q: 'Chiết khấu thanh toán sớm là bao nhiêu?',
          a: 'Thanh toán sớm 95% được chiết khấu tới 8%. Mức này chưa công bố ra ngoài, chỉ dùng khi tư vấn trực tiếp.',
          label: 'internal', state: 'approved' }
      ],

      /* Kịch bản kinh doanh — MH-12 */
      scripts: [
        { id: 'lps-s1', pj: 'leparc', scope: 'shared', title: 'Mở đầu với khách đang so sánh Le Parc Place và Parc Regent',
          body: 'Bắt đầu từ nhu cầu ở hay đầu tư, rồi mới so quy mô tiện ích và số căn trên một thang máy.',
          label: 'internal', by: 'Trịnh Mai Lan', at: '15/08/2026' },
        { id: 'lps-s2', pj: 'leparc', scope: 'shared', title: 'Trả lời khi khách hỏi mốc bàn giao',
          body: 'Chủ đầu tư chưa công bố. Nói thẳng là chưa có mốc chính thức, hẹn báo lại ngay khi có.',
          label: 'internal', by: 'Hoàng Anh Tuấn', at: '16/08/2026' },
        { id: 'lps-s3', pj: 'leparc', scope: 'shared', title: 'Dẫn khách qua tầng tiện ích tầng 5',
          body: 'Có nhắc biên độ chiết khấu theo đợt — chỉ vai trò được chỉ định xem được.',
          label: 'restricted', by: 'Hoàng Anh Tuấn', at: '14/08/2026' },
        { id: 'lps-s4', pj: 'leparc', scope: 'mine', title: 'Cách mình mở đầu với khách có con học ISPH',
          body: 'Hỏi con đang học lớp mấy trước, rồi mới nói tới khoảng cách đi bộ tới trường.',
          label: 'internal', by: 'Lê Thu Hà', at: '16/08/2026', proposed: false },
        { id: 'lps-s5', pj: 'leparc', scope: 'proposal', title: 'Cách xử lý khi khách hỏi mua cho người nước ngoài',
          body: 'Nói rõ dự án không đủ điều kiện, nêu trường hợp vợ hoặc chồng là công dân Việt Nam.',
          label: 'internal', by: 'Lê Thu Hà', at: '16/08/2026',
          reason: 'Tuần này em gặp ba khách hỏi đúng câu này.', state: 'pending' },
        { id: 's1', pj: 'celestine', scope: 'shared', title: 'Mở đầu cuộc gọi với khách mới',
          body: 'Ba biến thể theo nhóm khách: mua ở, đầu tư cho thuê, đầu tư lướt.',
          label: 'internal', by: 'Đỗ Bảo Ngọc', at: '08/08/2026' },
        { id: 's2', pj: 'celestine', scope: 'shared', title: 'Xử lý phản đối về giá so với dự án lân cận',
          body: 'So sánh theo giá trên mét vuông và chi phí hoàn thiện.',
          label: 'internal', by: 'Đỗ Bảo Ngọc', at: '03/08/2026' },
        { id: 's3', pj: 'celestine', scope: 'shared', title: 'Chốt cọc trong buổi xem nhà mẫu',
          body: 'Có nhắc tới biên độ chiết khấu — chỉ vai trò được chỉ định xem được.',
          label: 'restricted', by: 'Hoàng Anh Tuấn', at: '01/08/2026' },
        { id: 's4', pj: 'celestine', scope: 'mine', title: 'Cách mình mở đầu với khách đến từ giới thiệu',
          body: 'Nhắc tên người giới thiệu ngay câu đầu, hỏi nhu cầu trước khi nói về dự án.',
          label: 'internal', by: 'Lê Thu Hà', at: '06/08/2026', proposed: false },
        { id: 's5', pj: 'celestine', scope: 'proposal', title: 'Cách trả lời khi khách hỏi về tiến độ chậm',
          body: 'Nói thẳng mốc thật, đưa ảnh công trường mới nhất, hẹn lịch dẫn khách ra công trường.',
          label: 'internal', by: 'Lê Thu Hà', at: '12/08/2026',
          reason: 'Nội dung này em dùng ba tháng nay, khách phản hồi tốt.', state: 'pending' }
      ],

      /* Ghi chú nội bộ */
      notes: [
        { id: 'lp-n1', pj: 'leparc', by: 'Trịnh Mai Lan', at: '16/08',
          body: 'Chủ đầu tư chưa chốt mốc bàn giao và phí quản lý. Hai câu này đang để trạng thái Chờ cập nhật trong bộ hỏi đáp — không tự đưa con số khi tư vấn.' },
        { id: 'lp-n2', pj: 'leparc', by: 'Hoàng Anh Tuấn', at: '14/08',
          body: 'Bảng giá Rumor tòa C, D là bản chưa công bố. Không gửi kèm trong bất kỳ đường dẫn nào gửi khách.' },
        { id: 'lp-n3', pj: 'leparc', by: 'Trịnh Mai Lan', at: '17/08',
          body: 'Bộ hỏi đáp 17/08/2026 có sáu chỗ tự lệch số, đã gắn chip Cần Chủ đầu tư xác nhận trên đúng câu: ' +
                'Công viên Trung tâm 4,2 ha hay 5,2 ha; cảnh quan tầng 5 khoảng 7.000 m² hay hơn 8.000 m²; ' +
                'cảnh quan tầng 1 3.000 m² hay 3.200 m²; tầng 1 có một hay hai phòng rác tập trung; ' +
                'căn bàn giao thô là SV01–SV05 hay SV01–SV13; số căn mỗi tầng là 7/10/7/7 hay 3/4/3/3. ' +
                'Đang chờ Chủ đầu tư trả lời — khi tư vấn thì đọc con số kèm chữ "theo tài liệu", không khẳng định.' },
        { id: 'n1', pj: 'celestine', by: 'Trịnh Mai Lan', at: '13/08',
          body: 'Chủ đầu tư báo sẽ khóa giỏ hàng tòa C từ 20/08 để rà lại giá. Tạm thời không nhận giữ chỗ mới cho tòa C.' },
        { id: 'n2', pj: 'celestine', by: 'Hoàng Anh Tuấn', at: '09/08',
          body: 'Chính sách hỗ trợ lãi suất chỉ áp dụng cho hợp đồng ký trước 30/09. Nhắc lại điểm này khi tư vấn.' }
      ],

      /* Đề nghị sửa nội dung — MH-13 */
      requests: [
        { id: 'r1', title: 'Sai diện tích căn A-12.05', pj: 'celestine', area: 'Khu vực 05 · Bảng hàng',
          by: 'Lê Thu Hà', byRole: 'Nhân viên bán hàng', at: '13/08/2026 16:41', state: 'new',
          body: 'Diện tích căn A-12.05 đang ghi 72,4 m² nhưng hợp đồng mẫu của Chủ đầu tư ghi 74,2 m².',
          ref: 'Hợp đồng mua bán mẫu bản v3, trang 4.' },
        { id: 'r2', title: 'Phí quản lý trong hỏi đáp đã cũ', pj: 'celestine', area: 'Khu vực 07 · Hỏi đáp',
          by: 'Phạm Hải Đăng', byRole: 'Quản lý kinh doanh', at: '13/08/2026 10:02', state: 'new',
          body: 'Hỏi đáp ghi 16.500 đ/m²/tháng, thông báo mới của Chủ đầu tư ngày 11/08 là 17.200 đ/m²/tháng.' },
        { id: 'r3', title: 'Thiếu ảnh thực tế hạ tầng phân khu B', pj: 'palmy', area: 'Khu vực 06 · Ảnh và tài liệu',
          by: 'Lê Thu Hà', byRole: 'Nhân viên bán hàng', at: '12/08/2026 09:30', state: 'new',
          body: 'Khách hỏi ảnh hạ tầng phân khu B nhưng thư viện chỉ có phân khu A.' },
        { id: 'r4', title: 'Chính sách vay ghi 65%, ngân hàng báo 70%', pj: 'celestine', area: 'Khu vực 03 · Điểm chính',
          by: 'Lê Thu Hà', byRole: 'Nhân viên bán hàng', at: '11/08/2026 14:20', state: 'doing',
          owner: 'Trịnh Mai Lan',
          body: 'Điểm bán hàng ghi vay tối đa 65%, ngân hàng liên kết xác nhận 70%.' },
        { id: 'r5', title: 'Bổ sung hướng ban công vào bảng hàng', pj: 'celestine', area: 'Khu vực 05 · Bảng hàng',
          by: 'Lê Thu Hà', byRole: 'Nhân viên bán hàng', at: '08/08/2026 11:12', state: 'done',
          owner: 'Trịnh Mai Lan', closedAt: '09/08/2026',
          body: 'Bảng hàng chưa có cột hướng ban công, khách hay hỏi.' },
        { id: 'r6', title: 'Đề nghị công khai bảng chiết khấu đợt 3', pj: 'celestine', area: 'Khu vực 03 · Điểm chính',
          by: 'Ngô Thanh Tùng', byRole: 'Nhân viên bán hàng', at: '04/08/2026 17:45', state: 'rejected',
          owner: 'Trịnh Mai Lan', closedAt: '05/08/2026',
          reason: 'Chiết khấu thuộc nhóm nội dung bắt buộc nội bộ theo QD-007, không được gán nhãn Công khai.',
          body: 'Khách hay so sánh, nên công khai luôn bảng chiết khấu cho minh bạch.' }
      ],

      /* Hàng chờ duyệt — MH-09 */
      approvals: [
        { id: 'a1', name: 'Bảng hàng đợt 3 — The Celestine Riverside', pj: 'celestine', kind: 'Bảng hàng',
          by: 'Trịnh Mai Lan', at: '2 giờ trước', label: 'internal', state: 'pending', icon: 'xls',
          doc: 'd2',
          preview: 'Cập nhật giá 12 căn tòa C, đánh dấu 3 căn đã bán, bổ sung cột hướng ban công.' },
        { id: 'a2', name: 'Tài liệu giới thiệu — Palmy Garden (bản nháp v1)', pj: 'palmy', kind: 'Tài liệu',
          by: 'Đỗ Bảo Ngọc', at: 'hôm qua', label: 'internal', state: 'pending', icon: 'pdf',
          doc: 'd9',
          preview: 'Bản giới thiệu 12 trang, gồm vị trí, tiện ích, mặt bằng phân lô và chính sách bán hàng.' },
        { id: 'a3', name: 'Bộ câu hỏi đáp mới — 4 câu về pháp lý', pj: 'celestine', kind: 'Hỏi đáp',
          by: 'Trịnh Mai Lan', at: '2 ngày trước', label: 'public', state: 'pending', icon: 'file',
          preview: 'Bốn câu về sổ hồng, hạn mức người nước ngoài, chuyển nhượng hợp đồng và thuế trước bạ.' }
      ],

      /* Đường dẫn gửi khách */
      shareLinks: [
        /* `agent` là BẢN CHỤP hồ sơ nhân viên lúc tạo đường dẫn (ADR-0006). Trang khách
           đọc từ đây, không truy vấn kho người dùng — nhân viên đổi số điện thoại hay
           nghỉ việc thì đường dẫn đã gửi vẫn hiển thị đúng thông tin lúc gửi. */
        { id: 'lp-link', slug: '/t/le-parc-place-a2103', pj: 'leparc', kind: 'gia', note: 'Có bảng hàng và phiếu tính giá',
          by: 'Lê Thu Hà', at: '17/08/2026 · 09:10', days: 7, state: 'live',
          agent: { name: 'Lê Thu Hà', roleName: 'Nhân viên bán hàng', phone: '0966 808 404', ini: 'TH' } },
        { id: 'l1', slug: '/t/celestine-a1205', pj: 'celestine', kind: 'gia', note: 'Có bảng hàng và phiếu tính giá',
          by: 'Lê Thu Hà', at: '14/08/2026 · 08:20', days: 6, state: 'live',
          agent: { name: 'Lê Thu Hà', roleName: 'Nhân viên bán hàng', phone: '0966 808 404', ini: 'TH' } },
        { id: 'l2', slug: '/t/celestine-gioi-thieu', pj: 'celestine', kind: 'chung', note: 'Trang giới thiệu chung',
          by: 'Lê Thu Hà', at: '09/08/2026 · 14:05', days: null, state: 'live' },
        { id: 'l3', slug: '/t/la-perle-ruby-12', pj: 'la-perle', kind: 'gia', note: 'Có chính sách nhạy cảm',
          by: 'Phạm Hải Đăng', at: '12/08/2026 · 17:41', days: 2, state: 'live' },
        { id: 'l4', slug: '/t/palmy-lo-b14', pj: 'palmy', kind: 'gia', note: 'Đã thu hồi ngày 11/08',
          by: 'Lê Thu Hà', at: '05/08/2026 · 10:12', days: 0, state: 'off' },
        { id: 'l5', slug: '/t/celestine-b0503', pj: 'celestine', kind: 'gia', note: 'Đã quá 7 ngày',
          by: 'Ngô Thanh Tùng', at: '06/08/2026 · 11:35', days: 0, state: 'live' }
      ],

      /* Người dùng — MH-10 */
      users: [
        { id: 'u1', name: 'Trần Minh Quang', phone: '0901 234 567', role: 'gd', roleName: 'Tổng giám đốc',
          scope: 'Toàn bộ dự án', state: 'on', ini: 'TQ' },
        { id: 'u2', name: 'Hoàng Anh Tuấn', phone: '0912 345 678', role: 'gddu', roleName: 'Giám đốc dự án',
          scope: 'Celestine · La Perle · Palmy', state: 'on', ini: 'HT' },
        { id: 'u3', name: 'Trịnh Mai Lan', phone: '0938 111 222', role: 'tkkd', roleName: 'Thư ký kinh doanh',
          scope: 'Celestine · La Perle · Palmy', state: 'on', ini: 'ML' },
        { id: 'u4', name: 'Phạm Hải Đăng', phone: '0977 555 121', role: 'qlkd', roleName: 'Quản lý kinh doanh',
          scope: 'Đội Miền Bắc', state: 'on', ini: 'HĐ' },
        { id: 'u5', name: 'Lê Thu Hà', phone: '0966 808 404', role: 'nvbh', roleName: 'Nhân viên bán hàng',
          scope: 'Celestine · Palmy', state: 'on', ini: 'TH' },
        { id: 'u6', name: 'Đỗ Bảo Ngọc', phone: '0944 232 909', role: 'mkt', roleName: 'Marketing',
          scope: 'Celestine · Thiên Đường Bay', state: 'on', ini: 'BN' },
        { id: 'u7', name: 'Vũ Kim Chi', phone: '0908 686 333', role: 'hcns', roleName: 'Hành chính nhân sự',
          scope: 'Tài khoản & hồ sơ nhân sự', state: 'on', ini: 'KC' },
        { id: 'u9', name: 'Ngô Thanh Bình', phone: '0987 404 118', role: 'ktoan', roleName: 'Kế toán',
          scope: 'Số liệu giao dịch & hoa hồng', state: 'on', ini: 'TB' },
        { id: 'u8', name: 'Ngô Thanh Tùng', phone: '0913 700 700', role: 'nvbh', roleName: 'Nhân viên bán hàng',
          scope: '—', state: 'off', ini: 'TT' }
      ],

      /* Ảnh đã duyệt — dùng cho màn chuẩn bị nội dung và khu Marketing */
      media: [
        { id: 'lp-m1', pj: 'leparc', img: 'reco-banner.jpg', name: 'Phối cảnh tổng thể Le Parc Place', label: 'public', state: 'approved', on: true },
        { id: 'lp-m2', pj: 'leparc', img: 'celestine.jpg', name: 'Tầng tiện ích tầng 5 — lap pool 40 m', label: 'public', state: 'approved', on: true },
        { id: 'lp-m3', pj: 'leparc', img: 'palmy.jpg', name: 'Sân pickleball tầng 5', label: 'public', state: 'approved', on: true },
        { id: 'lp-m4', pj: 'leparc', img: 'la-perle.webp', name: 'Wine lounge tầng 15', label: 'public', state: 'approved', on: false },
        { id: 'lp-m5', pj: 'leparc', img: 'thien-duong.jpg', name: 'Sảnh đón tầng trệt', label: 'internal', state: 'pending', on: false },
        { id: 'm1', pj: 'celestine', img: 'celestine.jpg', name: 'Phối cảnh tổng thể', label: 'public', state: 'approved', on: true },
        { id: 'm2', pj: 'celestine', img: 'reco-banner.jpg', name: 'Khu tiện ích nội khu', label: 'public', state: 'approved', on: true },
        { id: 'm3', pj: 'celestine', img: 'la-perle.webp', name: 'Mặt bằng căn 2 phòng ngủ', label: 'public', state: 'approved', on: true },
        { id: 'm4', pj: 'celestine', img: 'palmy.jpg', name: 'Cảnh quan ven sông', label: 'public', state: 'approved', on: true },
        { id: 'm5', pj: 'celestine', img: 'thien-duong.jpg', name: 'View sông từ tầng cao', label: 'public', state: 'approved', on: false },
        { id: 'm6', pj: 'celestine', img: 'reco-opening.jpg', name: 'Lễ mở bán đợt 2', label: 'public', state: 'approved', on: false },
        { id: 'm7', pj: 'celestine', img: 'reco-partnership.jpg', name: 'Ký kết hợp tác phân phối', label: 'internal', state: 'approved', on: false },
        { id: 'm8', pj: 'celestine', img: 'reco-team.jpg', name: 'Đội ngũ kinh doanh dự án', label: 'internal', state: 'pending', on: false }
      ],

      /* Mẫu nội dung dùng chung — QD-041: một mẫu cho mọi kênh */
      templates: [
        { id: 't-gt', name: 'Giới thiệu dự án — bản ngắn', pj: 'celestine', state: 'approved', at: '09/08/2026',
          body: 'THE CELESTINE RIVERSIDE — CĂN HỘ VEN SÔNG LONG BIÊN\n\n' +
                '· 4 tòa cao 27 tầng, tổng 1.248 căn trên diện tích 6,4 ha\n' +
                '· Căn 1–3 phòng ngủ, 58 – 112 m², giá từ 3,28 tỷ\n' +
                '· Bàn giao nội thất liền tường, dự kiến quý II/2027\n' +
                '· Hỗ trợ lãi suất 0% trong 18 tháng cho đợt 3\n\n' +
                'Thông tin do RECO tổng hợp từ tài liệu chính thức của Chủ đầu tư, cập nhật 14/08/2026.' },
        { id: 't-cs', name: 'Chính sách đợt 3 — bản gửi khách', pj: 'celestine', state: 'approved', at: '11/08/2026',
          body: 'CHÍNH SÁCH BÁN HÀNG ĐỢT 3 — THE CELESTINE RIVERSIDE\n\n' +
                '· Hỗ trợ lãi suất 0% trong 18 tháng, ân hạn gốc 18 tháng\n' +
                '· Vay tối đa 70% giá trị căn hộ qua ngân hàng liên kết\n' +
                '· Tiến độ thanh toán chuẩn 30 – 70\n\n' +
                'Chính sách áp dụng cho hợp đồng ký trước 30/09/2026.' },
        { id: 't-mb', name: 'Giới thiệu căn mẫu 2 phòng ngủ', pj: 'celestine', state: 'approved', at: '05/08/2026',
          body: 'CĂN MẪU 2 PHÒNG NGỦ — THE CELESTINE RIVERSIDE\n\n' +
                '· Diện tích 72,4 m², hai phòng ngủ và một phòng đa năng\n' +
                '· Ban công hướng Đông Nam, đón gió và nhìn ra sông\n' +
                '· Bàn giao bếp, tủ âm và thiết bị vệ sinh thương hiệu châu Âu\n\n' +
                'Anh/chị nhắn tin để em gửi mặt bằng chi tiết và bảng giá còn hàng.' }
      ],

      /* Thông báo — chuông trên thanh trên cùng */
      notifications: [
        { id: 'nt1', kind: 'warn', title: 'Bảng hàng Celestine vừa đổi', body: 'Chủ đầu tư cập nhật lúc 09:15 — 3 căn tòa C chuyển sang Đã bán.',
          at: '09:15 hôm nay', to: 'gd gddu tkkd qlkd nvbh mkt', read: false, go: 'du-an-chi-tiet.html#kv5' },
        { id: 'nt2', kind: 'expire', title: '4 tài liệu sắp hết hiệu lực', body: 'Chính sách bán hàng tháng 8 còn 6 ngày. Hệ thống nhắc trước 7 ngày.',
          at: '08:00 hôm nay', to: 'gd gddu tkkd', read: false, go: 'quan-tri.html' },
        { id: 'nt3', kind: 'broken', title: 'Liên kết Drive bị thu quyền', body: 'Bảng hàng phân khu B — Palmy Garden đã tự gỡ khỏi mọi trang gửi khách.',
          at: 'hôm qua', to: 'gd gddu tkkd', read: false, go: 'thu-vien-tai-lieu.html' },
        { id: 'nt4', kind: 'req', title: 'Đề nghị sửa mới', body: 'Lê Thu Hà báo sai diện tích căn A-12.05.',
          at: 'hôm qua', to: 'gd gddu tkkd mkt', read: true, go: 'de-nghi-sua.html' },
        { id: 'nt5', kind: 'ok', title: 'Đề nghị của anh/chị đã được cập nhật', body: 'Bảng hàng đã bổ sung cột hướng ban công.',
          at: '09/08', to: 'nvbh qlkd', read: true, go: 'de-nghi-sua.html' }
      ],

      /* Màn vừa xem — phục vụ ô tìm kiếm toàn cục */
      recent: []
    };
  }

  /* ---------- Lưu trữ ---------- */
  var mem = null;
  function canStore() {
    try { window.sessionStorage.setItem('__t', '1'); window.sessionStorage.removeItem('__t'); return true; }
    catch (e) { return false; }   // file:// bị trình duyệt chặn
  }
  var USE_SS = canStore();

  function load() {
    if (mem) return mem;
    if (USE_SS) {
      try {
        var raw = window.sessionStorage.getItem(KEY);
        if (raw) { mem = JSON.parse(raw); return mem; }
      } catch (e) { /* dữ liệu hỏng thì dựng lại từ gốc */ }
    }
    mem = seed();
    save();
    return mem;
  }
  /* Ảnh thêm vào thư viện được lưu dạng data URL nên kho phiên có thể đầy thật.
     Nuốt lỗi im lặng thì dữ liệu ngừng lưu mà không ai biết — trả cờ để màn báo cho người dùng. */
  var full = false;
  function save() {
    if (!USE_SS || !mem) return true;
    try { window.sessionStorage.setItem(KEY, JSON.stringify(mem)); full = false; return true; }
    catch (e) { full = true; return false; }
  }
  function isFull() { return full; }

  /* ---------- Phát tín hiệu ---------- */
  var subs = {};
  function emit(name) {
    (subs[name] || []).forEach(function (fn) { try { fn(get(name)); } catch (e) { console.error(e); } });
    (subs['*'] || []).forEach(function (fn) { try { fn(name); } catch (e) { console.error(e); } });
  }

  /* Tạo luôn kho chưa có trong dữ liệu gốc và gắn vào bộ nhớ —
     nếu trả mảng rời thì add() vào kho lạ sẽ mất dữ liệu mà không báo gì. */
  function get(name) {
    var m = load();
    if (!m[name]) m[name] = [];
    return m[name];
  }
  function find(name, id) {
    var list = get(name);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function update(name, id, patch) {
    var it = find(name, id);
    if (!it) return null;
    Object.keys(patch).forEach(function (k) { it[k] = patch[k]; });
    save(); emit(name);
    return it;
  }
  var seq = 0;
  function add(name, obj, atBottom) {
    var list = get(name);
    if (!obj.id) obj.id = name.slice(0, 2) + '-new-' + (++seq);
    if (atBottom) list.push(obj); else list.unshift(obj);
    save(); emit(name);
    return obj;
  }
  function remove(name, id) {
    var list = get(name);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { list.splice(i, 1); save(); emit(name); return true; }
    }
    return false;
  }
  function on(name, fn) {
    (subs[name] = subs[name] || []).push(fn);
    return function () { subs[name] = subs[name].filter(function (f) { return f !== fn; }); };
  }
  function reset() {
    mem = seed();
    save();
    Object.keys(subs).forEach(emit);
  }

  /* ---------- Tiện ích dùng chung cho nhiều màn ---------- */
  var LABELS = {
    public: { text: 'Công khai', cls: 'lb-public' },
    internal: { text: 'Nội bộ', cls: 'lb-internal' },
    restricted: { text: 'Nội bộ hạn chế', cls: 'lb-restricted' }
  };
  /* Bốn trạng thái căn/lô theo schema: available | hold | sold | stopped */
  var UNIT_STATE = {
    con: { text: 'Còn hàng', cls: 'st-live' },
    giu: { text: 'Đang giữ chỗ', cls: 'st-wait' },
    ban: { text: 'Đã bán', cls: 'st-stop' },
    ngung: { text: 'Ngừng bán', cls: 'st-off' }
  };
  var BRANCHES = [
    'Thông tin dự án', 'Sản phẩm và Bảng hàng', 'Pháp lý và Chính sách', 'Tài liệu bán hàng',
    'Thư viện ảnh và video', 'Hỏi đáp và Điểm bán hàng', 'Nội bộ dành cho Marketing và Kinh doanh'
  ];
  var TOPICS = { tongquan: 'Tổng quan', phaply: 'Pháp lý', gia: 'Giá và chính sách', tiendo: 'Tiến độ',
                 bangiao: 'Bàn giao', noithat: 'Nội thất', ngoaithat: 'Ngoại thất và khu chung',
                 tienich: 'Tiện ích', doxe: 'Đỗ xe', khumai: 'Khu mái', anninh: 'An ninh', khac: 'Khác' };
  /* Nhóm cấp 1 mặc định cho hỏi đáp chưa gắn nhóm — giữ dữ liệu cũ hiển thị đúng khi
     màn hỏi đáp chuyển sang hai cấp nhóm (BR-TX-17). */
  var QA_GROUP_DEFAULT = 'Hỏi đáp dự án';

  /* Danh mục chuẩn lấy theo dữ liệu vận hành thật của RECO (QD-057). Hai loại hình cuối
     chưa có dự án nào trong bản mô phỏng nhưng vẫn để trong bộ lọc — RECO đang phân loại
     bằng đúng năm giá trị này. */
  var TYPES = {
    canho: 'Chung cư',
    datnen: 'Đất nền',
    thaptang: 'Biệt thự, nhà liền kề, shophouse',
    chothue: 'Cho thuê',
    thocu: 'Nhà đất thổ cư'
  };
  var SEGMENTS = {
    thap: 'Giá thấp — dưới 25 triệu/m²',
    trung: 'Trung cấp — 25–35 triệu/m²',
    cao: 'Cao cấp — từ 35 triệu/m²'
  };

  /* Nhãn mặc định của bảy nhánh cố định. Nhánh 7 không bao giờ có phần Công khai. */
  var BRANCH_LABEL = ['public', 'internal', 'internal', 'public', 'public', 'public', 'restricted'];

  /* Thứ bậc nhãn: nội dung con chỉ được siết chặt hơn cha, không bao giờ nới lỏng hơn
     (quy tắc kế thừa nghiêm ngặt nhất thắng — ADR-0005). */
  var RANK = { public: 0, internal: 1, restricted: 2 };
  function atLeastAsStrict(child, parent) { return RANK[child] >= RANK[parent]; }
  function stricter(a, b) { return RANK[a] >= RANK[b] ? a : b; }
  /* Chỉ Giám đốc dự án cấp được nhãn Nội bộ hạn chế, trong phạm vi dự án phụ trách (QD-027). */
  function canGrant(labelKey, role) { return labelKey !== 'restricted' || role === 'gddu'; }

  /* "Hôm nay" của bản mô phỏng, chốt trùng dữ liệu mẫu để mọi màn tính ra cùng một số ngày. */
  var TODAY = '14/08/2026';
  function parseVN(s) {
    if (!s) return null;
    var a = String(s).split('/');
    if (a.length !== 3) return null;
    return new Date(+a[2], +a[1] - 1, +a[0]);
  }
  function daysLeft(to) {
    var end = parseVN(to), now = parseVN(TODAY);
    if (!end || !now) return null;
    return Math.round((end - now) / 86400000);
  }
  /* Trạng thái hiệu lực suy từ ngày hết hạn — nhắc trước 7 ngày theo QD-033. */
  function lifeState(doc) {
    if (doc.src === 'broken') return 'broken';
    if (doc.state === 'draft') return 'draft';
    var d = daysLeft(doc.to);
    if (d === null) return 'live';
    return d <= 7 ? 'expiring' : 'live';
  }

  /* ---------- Đưa tài liệu và ảnh vào hệ thống ---------- */
  var MB = 1048576;
  var LIMIT = { doc: 50 * MB, image: 20 * MB };
  /* Marketing chỉ có quyền Sửa ở nhánh 4 (Tài liệu bán hàng — mẫu và ảnh chờ duyệt) và
     nhánh 5 (Ảnh và video) theo ma trận nhánh. Nhánh 6 Hỏi đáp và Điểm bán chỉ cho Marketing
     quyền Xem, nên không đưa vào đây. */
  var MKT_BRANCHES = [4, 5];

  function fileSize(b) {
    if (!b && b !== 0) return '';
    if (b < 1024) return b + ' B';
    if (b < MB) return (b / 1024).toFixed(0) + ' KB';
    return (b / MB).toFixed(1).replace('.', ',') + ' MB';
  }
  function fileKind(f) {
    var t = (f.type || '').toLowerCase(), n = (f.name || '').toLowerCase();
    if (t.indexOf('video/') === 0 || /\.(mp4|mov|avi|mkv|webm)$/.test(n)) return 'video';
    if (t.indexOf('image/') === 0 || /\.(jpe?g|png|webp)$/.test(n)) return 'image';
    if (t === 'application/pdf' || /\.pdf$/.test(n)) return 'pdf';
    if (/sheet|excel/.test(t) || /\.(xlsx?|csv)$/.test(n)) return 'excel';
    if (/word|document/.test(t) || /\.docx?$/.test(n)) return 'word';
    return 'khac';
  }
  /* Kiểm ngay lúc chọn tệp. Thông điệp viết sẵn để màn đưa thẳng vào RECO.fieldError. */
  function checkFile(f) {
    var k = fileKind(f);
    if (k === 'video') return { ok: false, kind: k, msg: 'Hệ thống không nhận tệp video. Anh/chị gắn video bằng liên kết ngoài — chọn nguồn “Liên kết sống Google Drive”.' };
    if (k === 'khac') return { ok: false, kind: k, msg: 'Chỉ nhận PDF, Word, Excel và ảnh JPG, PNG, WebP.' };
    var max = k === 'image' ? LIMIT.image : LIMIT.doc;
    if (f.size > max) {
      return { ok: false, kind: k,
        msg: (k === 'image' ? 'Ảnh tối đa 20 MB.' : 'Tệp tối đa 50 MB.') + ' Tệp của anh/chị là ' + fileSize(f.size) + '.' };
    }
    return { ok: true, kind: k, icon: iconFor(k) };
  }
  function iconFor(kind) {
    if (kind === 'image') return 'img';
    if (kind === 'excel') return 'xls';
    if (kind === 'link') return 'link';
    return 'pdf';
  }
  /* Ảnh mẫu nằm trong assets/img, ảnh vừa thêm là data URL — đừng đưa data URL qua RECO.asset. */
  function imgSrc(m) {
    if (m.thumb) return m.thumb;
    return m.img ? window.RECO.asset(m.img) : '';
  }
  function todayVN() { return TODAY; }
  function stamp() {
    var d = new Date();
    var hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2);
    return TODAY + ' · ' + hh + ':' + mm;
  }
  /* Trạng thái hiệu lực suy từ ngày hết hạn — dùng chung cho luồng tải lên và luồng gia hạn. */
  function lifeFrom(isoTo) {
    if (!isoTo) return { to: null, state: 'live', daysLeft: null };
    var a = isoTo.split('-');
    var to = a[2] + '/' + a[1] + '/' + a[0];
    var d = daysLeft(to);
    return { to: to, state: d !== null && d <= 7 ? 'expiring' : 'live', daysLeft: d };
  }
  /* Từ QD-060, Tổng giám đốc sửa được toàn bộ nội dung — ma trận nhánh cho `ceo` có S ở cả
     bảy nhánh. Rào chắn không còn là cấm sửa mà là ghi vết: mọi thao tác của Tổng giám đốc
     đều vào nhật ký và hiện tên người sửa cuối. */
  function canUpload(role, branch) {
    if (['tkkd', 'gddu', 'gd'].indexOf(role) >= 0) return true;
    return role === 'mkt' && MKT_BRANCHES.indexOf(+branch) >= 0;
  }
  function uploadRoles(branch) {
    return MKT_BRANCHES.indexOf(+branch) >= 0 ? 'tkkd gddu gd mkt' : 'tkkd gddu gd';
  }

  /* Nhánh nào vai trò nào được nhìn thấy trong cây thư mục (QD-051).
     Hành chính nhân sự và Kế toán — hai vai trò riêng từ QD-053 — chỉ liên quan tới
     nhánh 1 (Thông tin dự án) và phần số liệu ở nhánh 7;
     Nhân viên bán hàng không có quyền trên nhánh 7 (trừ kịch bản cá nhân ở màn riêng). */
  var BRANCH_ROLES = [
    'gd gddu tkkd qlkd nvbh hcns ktoan mkt',
    'gd gddu tkkd qlkd nvbh mkt',
    'gd gddu tkkd qlkd nvbh mkt',
    'gd gddu tkkd qlkd nvbh mkt',
    'gd gddu tkkd qlkd nvbh mkt',
    'gd gddu tkkd qlkd nvbh mkt',
    'gd gddu tkkd qlkd hcns ktoan mkt'
  ];
  function canSeeBranch(branch, role) {
    return BRANCH_ROLES[(+branch || 1) - 1].split(' ').indexOf(role) >= 0;
  }
  /* Ai sửa được từng loại thành phần của màn Chi tiết dự án.
     Mặt bằng và Nội dung được duyệt là việc của Marketing, phần còn lại là dữ liệu dự án.
     Tổng giám đốc có mặt ở cả năm loại theo QD-060. */
  var SECTION_ROLES = {
    overview: 'tkkd gddu gd',
    place: 'tkkd gddu gd',
    point: 'tkkd gddu gd',
    plan: 'tkkd gddu gd mkt',
    content: 'mkt gddu gd'
  };
  var SECTION_NAME = {
    overview: 'Tổng quan', place: 'Điểm liên kết vùng', point: 'Điểm bán hàng',
    plan: 'Mặt bằng', content: 'Nội dung bán hàng được duyệt'
  };
  function canEditSection(kind, role) {
    return (SECTION_ROLES[kind] || '').split(' ').indexOf(role) >= 0;
  }

  /* Nhãn của cấp cha để chặn nới lỏng: thư mục con nếu có, không thì nhãn mặc định của nhánh. */
  function parentLabel(pj, branch, folderId) {
    var f = folderId && find('folders', folderId);
    return f ? f.label : BRANCH_LABEL[(+branch || 1) - 1];
  }

  function label(key) {
    var l = LABELS[key] || LABELS.internal;
    return '<span class="lb ' + l.cls + '">' + l.text + '</span>';
  }
  function money(trieu) {
    return Math.round(trieu * 1e6).toLocaleString('vi-VN') + ' đ';
  }
  /* Dự án trong phạm vi của một vai trò — đọc từ cột phạm vi của người dùng tương ứng,
     thay vì mỗi màn tự chép lại bản đồ vai trò → dự án. */
  function myProjects(role) {
    var all = get('projects').filter(function (p) { return !p.hidden; });
    if (role === 'gd' || role === 'hcns') return all;
    var u = get('users').filter(function (x) { return x.role === role && x.state === 'on'; })[0];
    if (!u || !u.scope || /toàn bộ/i.test(u.scope)) return all;
    var names = u.scope.split('·').map(function (s) { return s.trim().toLowerCase(); });
    var hit = all.filter(function (p) {
      return names.some(function (n) { return n && p.name.toLowerCase().indexOf(n) >= 0; });
    });
    return hit.length ? hit : all;   // phạm vi theo đội/vùng thì không lọc theo tên dự án
  }
  function billion(trieu) {
    return (trieu / 1000).toFixed(2).replace('.', ',') + ' tỷ';
  }
  function projectName(id) {
    var p = find('projects', id);
    return p ? p.name : id;
  }
  /* Ai được xem nội dung mang nhãn này. Danh sách restricted theo QD-027:
     chính sách hoa hồng mở cho Tổng giám đốc, Giám đốc dự án, Quản lý kinh doanh,
     Hành chính nhân sự và Kế toán. */
  function canSee(labelKey, role) {
    if (labelKey !== 'restricted') return true;
    return ['gd', 'gddu', 'qlkd', 'hcns', 'ktoan'].indexOf(role) >= 0;
  }

  window.RECO = window.RECO || {};
  window.RECO.store = {
    get: get, find: find, update: update, add: add, remove: remove,
    on: on, reset: reset, save: save,
    LABELS: LABELS, UNIT_STATE: UNIT_STATE, BRANCHES: BRANCHES, TOPICS: TOPICS, QA_GROUP_DEFAULT: QA_GROUP_DEFAULT, TYPES: TYPES, SEGMENTS: SEGMENTS,
    BRANCH_LABEL: BRANCH_LABEL, RANK: RANK,
    label: label, money: money, billion: billion, projectName: projectName, canSee: canSee,
    myProjects: myProjects,
    atLeastAsStrict: atLeastAsStrict, stricter: stricter, canGrant: canGrant,
    TODAY: TODAY, parseVN: parseVN, daysLeft: daysLeft, lifeState: lifeState,
    LIMIT: LIMIT, MKT_BRANCHES: MKT_BRANCHES,
    fileSize: fileSize, fileKind: fileKind, checkFile: checkFile, iconFor: iconFor,
    imgSrc: imgSrc, todayVN: todayVN, stamp: stamp, lifeFrom: lifeFrom,
    canUpload: canUpload, uploadRoles: uploadRoles, parentLabel: parentLabel,
    BRANCH_ROLES: BRANCH_ROLES, canSeeBranch: canSeeBranch,
    SECTION_ROLES: SECTION_ROLES, SECTION_NAME: SECTION_NAME, canEditSection: canEditSection,
    isFull: isFull,
    persistent: USE_SS
  };
})();
