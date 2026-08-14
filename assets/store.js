/* RECO Data-SalesHub — kho dữ liệu sống của bản mô phỏng.
 *
 * Mọi màn đọc và ghi qua đây, nhờ vậy bấm Duyệt ở màn quản trị thì hàng chờ ở Trang đầu
 * giảm theo, tạo đường dẫn ở màn dự án thì nhật ký chia sẻ có ngay dòng mới.
 *
 * Trạng thái giữ trong sessionStorage để đi qua lại giữa các màn không mất.
 * Mở bằng file:// thì trình duyệt chặn sessionStorage — khi đó tự lùi về bộ nhớ trong,
 * bản gói một trang vẫn chạy đủ vì cả 14 màn nằm trong cùng một tài liệu.
 */
(function () {
  'use strict';

  var KEY = 'reco-salehub-demo';

  /* ---------- Dữ liệu gốc ---------- */
  function seed() {
    return {
      /* Dự án — nguồn cho thẻ dự án, danh sách, quản trị */
      projects: [
        { id: 'celestine', name: 'The Celestine Riverside', area: 'Hà Nội', place: 'Long Biên, Hà Nội',
          type: 'canho', typeName: 'Căn hộ chung cư', price: 3.4, priceText: '3,4 – 7,2 tỷ',
          size: 58, sizeText: '58 – 112 m²', status: 'live', statusText: 'Đang bán',
          featured: true, pinned: true, hidden: false, img: 'celestine.jpg', docs: 48, ready: 100,
          updated: '2 giờ trước', struct: '4 tòa · 27 tầng · 1.248 căn',
          owner: 'Công ty CP Đầu tư Celestine', handover: 'Quý II/2027' },
        { id: 'la-perle', name: 'La Perle Villas', area: 'Hà Nội', place: 'Hoài Đức, Hà Nội',
          type: 'thaptang', typeName: 'Nhà thấp tầng, biệt thự', price: 12.5, priceText: '12,5 – 28 tỷ',
          size: 128, sizeText: '128 – 300 m²', status: 'live', statusText: 'Đang bán',
          featured: true, pinned: true, hidden: false, img: 'la-perle.webp', docs: 36, ready: 92,
          updated: 'Hôm nay, 09:15', struct: '3 phân khu · 214 căn liền kề & biệt thự',
          owner: 'Công ty CP La Perle', handover: 'Quý IV/2026' },
        { id: 'palmy', name: 'Palmy Garden', area: 'Hưng Yên', place: 'Văn Giang, Hưng Yên',
          type: 'datnen', typeName: 'Đất nền', price: 2.8, priceText: '2,8 – 6,5 tỷ',
          size: 90, sizeText: '90 – 200 m²', status: 'live', statusText: 'Đang bán',
          featured: false, pinned: true, hidden: false, img: 'palmy.jpg', docs: 29, ready: 84,
          updated: 'Hôm qua, 16:40', struct: '1 phân khu · 6 dãy · 340 lô',
          owner: 'Công ty CP Palmy', handover: 'Đã có sổ' },
        { id: 'thien-duong', name: 'Thiên Đường Bay', area: 'Khánh Hòa', place: 'Cam Lâm, Khánh Hòa',
          type: 'thaptang', typeName: 'Nhà thấp tầng, biệt thự', price: 8.9, priceText: '8,9 – 21 tỷ',
          size: 150, sizeText: '150 – 320 m²', status: 'soon', statusText: 'Sắp mở bán',
          featured: true, pinned: false, hidden: false, img: 'thien-duong.jpg', docs: 17, ready: 46,
          updated: '3 ngày trước', struct: '2 phân khu · 96 căn',
          owner: 'Công ty CP Thiên Đường', handover: 'Quý I/2028' },
        { id: 'central', name: 'RECO Central Park', area: 'Hà Nội', place: 'Thanh Xuân, Hà Nội',
          type: 'canho', typeName: 'Căn hộ chung cư', price: 4.1, priceText: '4,1 – 9,6 tỷ',
          size: 62, sizeText: '62 – 140 m²', status: 'live', statusText: 'Đang bán',
          featured: false, pinned: false, hidden: false, img: 'reco-banner.jpg', docs: 41, ready: 96,
          updated: '5 giờ trước', struct: '2 tòa · 32 tầng · 864 căn',
          owner: 'RECO Group', handover: 'Quý III/2027' },
        { id: 'opening', name: 'Opening Residence', area: 'Hà Nội', place: 'Hà Đông, Hà Nội',
          type: 'canho', typeName: 'Căn hộ chung cư', price: 2.3, priceText: '2,3 – 4,4 tỷ',
          size: 45, sizeText: '45 – 78 m²', status: 'closed', statusText: 'Ngừng bán',
          featured: false, pinned: false, hidden: false, img: 'reco-opening.jpg', docs: 33, ready: 100,
          updated: '12/07/2026', struct: '1 tòa · 25 tầng · 402 căn',
          owner: 'RECO Group', handover: 'Đã bàn giao' }
      ],

      /* Bảng hàng — cấp căn/lô, dùng cho MH-04 và phiếu tính giá */
      units: [
        { id: 'A-12.05', pj: 'celestine', block: 'A', floor: 12, kind: '2PN + 1', area: 72.4, dir: 'Đông Nam', price: 4860, state: 'con' },
        { id: 'A-15.02', pj: 'celestine', block: 'A', floor: 15, kind: '3PN', area: 96.8, dir: 'Tây Bắc', price: 6420, state: 'giu' },
        { id: 'A-18.07', pj: 'celestine', block: 'A', floor: 18, kind: '2PN', area: 68.0, dir: 'Đông', price: 4520, state: 'con' },
        { id: 'B-05.03', pj: 'celestine', block: 'B', floor: 5, kind: '1PN + 1', area: 55.6, dir: 'Nam', price: 3280, state: 'con' },
        { id: 'B-22.09', pj: 'celestine', block: 'B', floor: 22, kind: '3PN + 1', area: 108.5, dir: 'Đông Nam', price: 7040, state: 'ban' },
        { id: 'C-08.11', pj: 'celestine', block: 'C', floor: 8, kind: '1PN + 1', area: 58.2, dir: 'Bắc', price: 3440, state: 'con' },
        { id: 'C-14.06', pj: 'celestine', block: 'C', floor: 14, kind: '2PN + 1', area: 74.1, dir: 'Đông Nam', price: 5120, state: 'con' },
        { id: 'C-21.03', pj: 'celestine', block: 'C', floor: 21, kind: '3PN + 1', area: 112.0, dir: 'Đông Nam', price: 7180, state: 'ban' },
        { id: 'D-09.08', pj: 'celestine', block: 'D', floor: 9, kind: '2PN', area: 70.2, dir: 'Tây', price: 4380, state: 'giu' },
        { id: 'D-25.01', pj: 'celestine', block: 'D', floor: 25, kind: '3PN', area: 99.4, dir: 'Đông Nam', price: 6890, state: 'con' },
        { id: 'RB-14', pj: 'la-perle', block: 'Ruby', floor: 0, kind: 'Liền kề', area: 128, dir: 'Đông', price: 12500, state: 'con' },
        { id: 'RB-15', pj: 'la-perle', block: 'Ruby', floor: 0, kind: 'Liền kề', area: 128, dir: 'Đông', price: 12500, state: 'ban' },
        { id: 'SP-02', pj: 'la-perle', block: 'Sapphire', floor: 0, kind: 'Biệt thự đơn lập', area: 300, dir: 'Nam', price: 28000, state: 'con' },
        { id: 'B4-07', pj: 'palmy', block: 'Dãy B4', floor: 0, kind: 'Lô góc', area: 200, dir: 'Đông Nam', price: 6500, state: 'con' },
        { id: 'B4-08', pj: 'palmy', block: 'Dãy B4', floor: 0, kind: 'Lô thường', area: 90, dir: 'Đông', price: 2800, state: 'con' },
        { id: 'B5-12', pj: 'palmy', block: 'Dãy B5', floor: 0, kind: 'Lô thường', area: 100, dir: 'Tây', price: 3100, state: 'giu' }
      ],

      /* Tài liệu — MH-05, MH-11, quản trị */
      documents: [
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

      /* Thư mục con bên trong bảy nhánh cố định */
      folders: [
        { id: 'f1', pj: 'celestine', branch: 1, name: 'Hồ sơ chủ đầu tư', label: 'internal' },
        { id: 'f2', pj: 'celestine', branch: 1, name: 'Tiến độ thi công', label: 'public' },
        { id: 'f3', pj: 'celestine', branch: 2, name: 'Bảng hàng theo đợt', label: 'internal' },
        { id: 'f4', pj: 'la-perle', branch: 4, name: 'Bộ tài liệu gửi khách', label: 'public' },
        { id: 'f5', pj: 'palmy', branch: 5, name: 'Ảnh hạ tầng theo tháng', label: 'public' }
      ],

      /* Hỏi đáp — MH-06 */
      qas: [
        { id: 'q1', pj: 'celestine', topic: 'phaply', q: 'Dự án đã có sổ hồng cho từng căn chưa?',
          a: 'Dự án đã có Giấy chứng nhận quyền sử dụng đất cho toàn khu và Giấy phép xây dựng. Sổ hồng từng căn được cấp sau khi bàn giao và nghiệm thu, dự kiến quý IV/2027.',
          ref: 'Hồ sơ pháp lý v2', label: 'public', state: 'approved' },
        { id: 'q2', pj: 'celestine', topic: 'gia', q: 'Khách vay được tối đa bao nhiêu phần trăm giá trị căn hộ?',
          a: 'Ngân hàng liên kết hỗ trợ tối đa 70% giá trị căn hộ, ân hạn gốc 18 tháng và hỗ trợ lãi suất 0% trong 18 tháng đầu cho đợt 3.',
          label: 'public', state: 'approved' },
        { id: 'q3', pj: 'celestine', topic: 'bangiao', q: 'Phí quản lý dự kiến là bao nhiêu?',
          a: '16.500 đ/m²/tháng theo thông báo của Chủ đầu tư ngày 02/08/2026. Con số này có thể thay đổi khi Ban quản trị được thành lập — khi tư vấn nên nói rõ đây là mức dự kiến.',
          label: 'public', state: 'approved' },
        { id: 'q4', pj: 'celestine', topic: 'gia', q: 'Có được chuyển nhượng hợp đồng trước khi bàn giao không?',
          a: 'Được, sau khi khách đã thanh toán đủ 30% và có xác nhận của Chủ đầu tư. Phí chuyển nhượng theo quy định của Chủ đầu tư.',
          label: 'public', state: 'approved' },
        { id: 'q5', pj: 'celestine', topic: 'tiendo', q: 'Tiến độ thi công hiện tại tới đâu?',
          a: 'Tòa A và B đã cất nóc, đang hoàn thiện mặt ngoài. Tòa C thi công tới tầng 18, tòa D tầng 11. Cập nhật ngày 10/08/2026.',
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
        { id: 'l1', slug: '/t/celestine-a1205', pj: 'celestine', kind: 'gia', note: 'Có bảng hàng và phiếu tính giá',
          by: 'Lê Thu Hà', at: '14/08/2026 · 08:20', days: 6, state: 'live' },
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
        { id: 'u7', name: 'Vũ Kim Chi', phone: '0908 686 333', role: 'hcns', roleName: 'HCNS & Kế toán',
          scope: 'Số liệu & hồ sơ nhân sự', state: 'on', ini: 'KC' },
        { id: 'u8', name: 'Ngô Thanh Tùng', phone: '0913 700 700', role: 'nvbh', roleName: 'Nhân viên bán hàng',
          scope: '—', state: 'off', ini: 'TT' }
      ],

      /* Ảnh đã duyệt — dùng cho màn chuẩn bị nội dung và khu Marketing */
      media: [
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
  function save() {
    if (!USE_SS || !mem) return;
    try { window.sessionStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* đầy bộ nhớ — bỏ qua */ }
  }

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
  var UNIT_STATE = {
    con: { text: 'Còn hàng', cls: 'st-live' },
    giu: { text: 'Đang giữ chỗ', cls: 'st-wait' },
    ban: { text: 'Đã bán', cls: 'st-stop' }
  };
  var BRANCHES = [
    'Thông tin dự án', 'Sản phẩm và Bảng hàng', 'Pháp lý và Chính sách', 'Tài liệu bán hàng',
    'Thư viện ảnh và video', 'Hỏi đáp và Điểm bán hàng', 'Nội bộ dành cho Marketing và Kinh doanh'
  ];
  var TOPICS = { phaply: 'Pháp lý', gia: 'Giá và chính sách', tiendo: 'Tiến độ', bangiao: 'Bàn giao' };

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
  /* Ai được xem nội dung mang nhãn này */
  function canSee(labelKey, role) {
    if (labelKey !== 'restricted') return true;
    return ['gd', 'gddu', 'qlkd', 'hcns'].indexOf(role) >= 0;
  }

  window.RECO = window.RECO || {};
  window.RECO.store = {
    get: get, find: find, update: update, add: add, remove: remove,
    on: on, reset: reset, save: save,
    LABELS: LABELS, UNIT_STATE: UNIT_STATE, BRANCHES: BRANCHES, TOPICS: TOPICS,
    BRANCH_LABEL: BRANCH_LABEL, RANK: RANK,
    label: label, money: money, billion: billion, projectName: projectName, canSee: canSee,
    myProjects: myProjects,
    atLeastAsStrict: atLeastAsStrict, stricter: stricter, canGrant: canGrant,
    TODAY: TODAY, parseVN: parseVN, daysLeft: daysLeft, lifeState: lifeState,
    persistent: USE_SS
  };
})();
