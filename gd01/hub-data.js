/* Copy modal cho hub Báo giá và Bản đồ. Không phải nguồn sự thật — số liệu khớp trang demo. */
window.HUB_ITEMS = {
  'hm-01': {
    tag: 'HẠNG MỤC 1',
    title: 'Hạ tầng',
    body: '<p class="small">Chuẩn bị kho mã, quy trình kiểm tra tự động, máy chủ, ba môi trường và sao lưu. Ba môi trường tách biệt — phát triển, kiểm thử và chạy thật — để việc thử nội dung mới không bao giờ diễn ra trực tiếp trên dữ liệu thật của RECO. Tiền thuê máy chủ, tên miền và dung lượng lưu trữ không nằm trong hạng mục này.</p>',
    days: '8 ngày',
    cost: '7.260.000 đ',
    links: [{ href: 'ha-tang.html', label: 'Hạ tầng và chi phí vận hành' }]
  },
  'hm-02': {
    tag: 'HẠNG MỤC 2',
    title: 'Thiết kế giao diện',
    body: '<p class="small">Thiết kế các màn Giai đoạn 1 đang có trong bản mô phỏng, bộ thành phần dùng chung và cách hiển thị trên ba cỡ thiết bị. Trong phạm vi: Trang đầu (vinh danh đầy khối, cảnh báo, slider SP Hot), danh sách dự án, chi tiết dự án tám khu vực đang hiện, catalog và chi tiết căn, cây tài liệu / danh sách phẳng, thư viện mẫu, màn mẫu hai cột, trang gửi khách, quản trị, người dùng. Không gồm hỏi đáp 88 câu, kịch bản MH-12, soạn bài riêng từng kênh.</p>',
    days: '7 ngày',
    cost: '6.380.000 đ',
    links: [{ href: 'sitemap.html#man-hinh', label: 'Bản đồ màn hình' }]
  },
  'hm-03': {
    tag: 'HẠNG MỤC 3',
    title: 'Mô hình dữ liệu',
    body: '<p class="small">Tổ chức dự án, cây khối/tòa/tầng/căn, mẫu chia sẻ và thẻ liên kết. Đây là hạng mục quyết định về sau RECO có thêm được báo cáo hay lưới bảng hàng hay không: dữ liệu Giai đoạn 2 vẫn đọc từ mô hình này, nên làm chặt ngay từ đầu rẻ hơn nhiều so với sửa sau.</p>',
    days: '6 ngày',
    cost: '5.500.000 đ'
  },
  'hm-04': {
    tag: 'HẠNG MỤC 4 · BR-PQ-03, BR-PQ-08',
    title: 'Xác thực và phiên sử dụng',
    body: '<p class="small">Đăng nhập bằng số điện thoại hoặc email cùng mật khẩu — Giai đoạn 1 không dùng mã xác thực một lần. Kèm quản lý phiên, đăng xuất và đặt lại mật khẩu.</p>',
    days: '10 ngày',
    cost: '8.620.000 đ',
    links: [{ href: 'dang-nhap.html', label: 'Xem màn đăng nhập' }]
  },
  'hm-05': {
    tag: 'HẠNG MỤC 5 · BR-PQ-01…08',
    title: 'Phân quyền',
    body: '<p class="small">Vai trò, ba cấp nhãn nội dung — Công khai, Nội bộ, Nội bộ hạn chế — và phạm vi dự án được giao. Nhãn của mục cha kế thừa xuống mục con theo nguyên tắc nghiêm ngặt nhất thắng: nhãn con không được nới lỏng hơn nhãn cha. Nếu RECO duyệt BS-03 thì số vai trò tăng lên chín.</p>',
    days: '11 ngày',
    cost: '9.320.000 đ',
    links: [{ href: 'nguoi-dung.html', label: 'Xem màn người dùng và quyền' }]
  },
  'hm-06': {
    tag: 'HẠNG MỤC 6 · QD-074',
    title: 'Quản trị dự án + thẻ link + cây tài liệu',
    body: '<p class="small">Hồ sơ dự án đủ để đội bán hàng tra cứu trên tám khu vực đang hiện: tổng quan, vị trí, điểm chính, mặt bằng, SP Hot, mẫu chia sẻ, tài liệu nguồn (thẻ URL Drive) và kho ảnh/tài liệu. Drive của Chủ đầu tư chỉ hiện <strong>thẻ liên kết URL</strong> — hệ thống không kéo tệp vào, không sao chép, không đối chiếu Drive. Cây thư mục bảy nhánh và danh sách phẳng nằm trên dock Tài liệu để duyệt nguồn; nhân viên mở tệp CĐT bằng cách bấm thẻ.</p>',
    days: '13 ngày',
    cost: '11.260.000 đ',
    links: [
      { href: 'du-an-chi-tiet.html', label: 'Chi tiết dự án' },
      { href: 'cay-thu-muc.html', label: 'Cây tài liệu' },
      { href: 'quan-tri.html', label: 'Quản trị' }
    ]
  },
  'hm-07': {
    tag: 'HẠNG MỤC 7 · QD-075',
    title: 'Cây khối/tòa/tầng/căn + catalog',
    body: '<p class="small">Mỗi dự án có cây khối → tòa → tầng → căn. <strong>Sản phẩm là căn</strong> trong cây đó. Catalog (menu Sản phẩm) tìm theo mã căn và lọc dự án, loại hình, số PN, tình trạng; màn chi tiết căn không hiện giá — giá đối chiếu bảng hàng Chủ đầu tư. Giai đoạn 1 không có form phiếu tính giá trong Hub và không lấy lưới bảng hàng làm mô hình sản phẩm (QD-074, QD-075).</p>',
    days: '10 ngày',
    cost: '8.840.000 đ',
    links: [
      { href: 'danh-muc-san-pham.html', label: 'Catalog' },
      { href: 'san-pham.html?pj=celestine&unit=T1-08.02', label: 'Chi tiết căn' }
    ]
  },
  'hm-08': {
    tag: 'HẠNG MỤC 8 · QD-075',
    title: 'SP Hot + pitch',
    body: '<p class="small">SP Hot là căn được quản lý đánh dấu kèm một đoạn pitch. Trang đầu và chi tiết dự án trượt <strong>từng thẻ</strong> (nút trước/sau, chấm). Không có trường giá trên Hot. Nhân viên bán hàng không tự gắn Hot; chỉ người được phân quyền quản lý mới gắn và gỡ.</p>',
    days: '9 ngày',
    cost: '7.960.000 đ',
    links: [
      { href: 'trang-dau.html', label: 'Trang đầu' },
      { href: 'du-an-chi-tiet.html', label: 'Chi tiết dự án' },
      { href: 'danh-muc-san-pham.html', label: 'Catalog' }
    ]
  },
  'hm-09': {
    tag: 'HẠNG MỤC 9 · QD-076',
    title: 'Thư viện mẫu',
    body: '<p class="small">Hai kho: mẫu <strong>dùng chung</strong> phải được Giám đốc dự án duyệt, và mẫu <strong>cá nhân</strong> chỉ gắn với người tạo. Lọc theo ô tìm (tiêu đề + nội dung), dự án, rồi sản phẩm (căn catalog của dự án đã chọn) và loại mẫu (dự án / sản phẩm). Cấm nhúng URL Drive trong mẫu. Không đếm lượt xem — thống kê hành vi khách không thuộc Giai đoạn 1.</p>',
    days: '12 ngày',
    cost: '10.600.000 đ',
    links: [{ href: 'chia-se.html', label: 'Thư viện mẫu' }]
  },
  'hm-10': {
    tag: 'HẠNG MỤC 10 · QD-076',
    title: 'Soạn tin + trang khách + mở kênh',
    body: '<p class="small">Nhân viên tick mục công khai và tối đa <strong>một</strong> mẫu Hot; lúc soạn, khối hiện ngay trên mẫu (xem trước). Sao chép tin Zalo hoặc đường dẫn trang khách. Nhóm kênh (Zalo, Facebook, Batdongsan, Muaban, Homedy, Chợ Tốt, Alonhadat): hệ thống <strong>sao chép payload đã điền</strong> (tin + link khách, không giá), mở tab kênh, hướng dẫn dán — không tự đăng, không tự điền form trang ngoài. Trang khách hiện nội dung đã tick, gắn thông tin nhân viên phụ trách; <strong>không</strong> hiện phiếu tính giá. Mẫu riêng từng kênh, lịch đăng và theo dõi tương tác thuộc Giai đoạn 2.</p>',
    days: '17 ngày',
    cost: '14.820.000 đ',
    links: [
      { href: 'chia-se.html', label: 'Thư viện mẫu' },
      { href: 'mau.html?tpl=st5', label: 'Màn mẫu' },
      { href: 'trang-gui-khach.html', label: 'Trang gửi khách' }
    ]
  },
  'hm-11': {
    tag: 'HẠNG MỤC 11 · QD-076',
    title: 'Duyệt mẫu',
    body: '<p class="small">Luồng duyệt mẫu dùng chung: người soạn gửi, Giám đốc dự án duyệt hoặc trả về có lý do. Mẫu cá nhân không đi qua luồng này. Chỉ mẫu đã duyệt mới được tick công khai ra trang khách.</p>',
    days: '4 ngày',
    cost: '3.520.000 đ',
    links: [{ href: 'de-nghi-sua.html', label: 'Đề nghị sửa' }]
  },
  'hm-12': {
    tag: 'HẠNG MỤC 12',
    title: 'Kiểm thử',
    body: '<p class="small">Kiểm tra quyền theo từng vai trò, các luồng chính trên trình duyệt và biên nội dung công khai — khách không thấy nhãn Nội bộ, không thấy URL Drive nhúng trong mẫu, không thấy phiếu tính giá. Cộng thời gian sửa lỗi phát hiện được. Với hệ thống mà giá trị nằm ở chỗ “ai được thấy gì”, đây là hạng mục không nên cắt.</p>',
    days: '10 ngày',
    cost: '7.540.000 đ'
  },
  'hm-13': {
    tag: 'HẠNG MỤC 13',
    title: 'Dữ liệu mẫu + đào tạo',
    body: '<p class="small">Hướng dẫn nhập dữ liệu mẫu và một buổi đào tạo bàn giao. Việc nhập toàn bộ dữ liệu các dự án còn lại do RECO thực hiện, không nằm trong hai ngày công này.</p>',
    days: '2 ngày',
    cost: '2.200.000 đ'
  },
  'hm-14': {
    tag: 'HẠNG MỤC 14',
    title: 'Quản lý dự án',
    body: '<p class="small">Họp định kỳ, báo cáo tiến độ và phối hợp trong khoảng sáu tuần dương. Đây là ngày công của người quản lý dự án kiêm phân tích nghiệp vụ — đầu mối RECO làm việc trực tiếp.</p>',
    days: '4 ngày',
    cost: '4.400.000 đ'
  },
  'bs-01': {
    tag: 'Ngoài gói · QD-055',
    title: 'BS-01 · Khách gửi yêu cầu từ trang công khai',
    body: '<p class="small">Nút “Nhận báo giá / quan tâm căn” trên trang gửi khách: khách nhập họ tên và số điện thoại, chọn căn nếu trang có bảng hàng; hệ thống báo cho nhân viên chủ đường dẫn và lưu danh sách yêu cầu. Có chặn gửi trùng, giới hạn tần suất, thông báo tại chỗ về việc thu thập dữ liệu và xoá theo thời hạn. Khách vẫn <strong>không</strong> tự nhập thông số để tính giá — QD-010 giữ nguyên.</p><div class="note note-danger mt-3"><strong>BS-01 kéo theo một nghĩa vụ nằm ngoài kỹ thuật.</strong> Giai đoạn 1 như đã báo giá không thu thập bất kỳ dữ liệu nào của khách hàng. Tám ngày công đã gồm thông báo tại chỗ, chống bơm và xoá theo thời hạn; <strong>chưa gồm</strong> rà soát pháp lý và quy trình xử lý khi khách yêu cầu xoá dữ liệu của mình.</div>',
    days: '8 ngày',
    cost: '5.700.000 đ',
    costLabel: 'Tạm tính sau ưu đãi',
    links: [{ href: 'trang-gui-khach.html', label: 'Trang gửi khách' }]
  },
  'bs-02': {
    tag: 'Ngoài gói · QD-053',
    title: 'BS-02 · Vai trò Khách hàng có tài khoản',
    body: '<p class="small">Khách đăng nhập bằng số điện thoại, xem đúng phần nội dung nhân viên bán hàng đã chia sẻ cho mình, không duyệt cây thư mục, không thấy dự án chưa được chia sẻ và không thấy dữ liệu nội bộ. Nhân viên cấp và thu tài khoản khách trong phạm vi của mình.</p>',
    days: '14 ngày',
    cost: '10.100.000 đ',
    costLabel: 'Tạm tính sau ưu đãi'
  },
  'bs-03': {
    tag: 'Ngoài gói · QD-053, QD-054',
    title: 'BS-03 · Tách vai trò Kế toán và phân cấp cấp tài khoản',
    body: '<p class="small">Nâng số vai trò từ bảy lên chín: tách Kế toán khỏi Hành chính nhân sự, cho Hành chính nhân sự tạo tài khoản và gán vai trò thường, giữ việc gán vai trò quản lý cho người quản trị chung. Nếu RECO muốn giữ nguyên giá và thời gian đã chốt thì hai hạng mục trên chuyển sang Giai đoạn 2, riêng BS-03 nên giữ lại — rẻ, nhưng chạm vào toàn bộ ma trận quyền, làm sau sẽ phải sửa lại nhiều chỗ đã xong.</p>',
    days: '3 ngày',
    cost: '2.000.000 đ',
    costLabel: 'Tạm tính sau ưu đãi',
    links: [{ href: 'nguoi-dung.html', label: 'Người dùng và quyền' }]
  },
  app: {
    tag: 'Tùy chọn · QD-080',
    title: 'Ứng dụng iOS và Android',
    body: '<p class="small">Không nằm trong 89.900.000 VNĐ của gói Web. Nếu RECO chọn làm cùng Giai đoạn 1, giá chào là <strong>20.000.000 VNĐ</strong> đã gồm VAT 8% — ưu đãi đã gộp, không nhân ngày công (QD-080). Phạm vi: ứng dụng iOS và Android dùng chung dữ liệu và quyền với Web, phủ đúng các màn Giai đoạn 1 — đăng nhập, tra cứu dự án và căn, SP Hot, mẫu chia sẻ. Chưa gồm phí tài khoản Apple/Google.</p>',
    cost: '20.000.000 đ',
    costLabel: 'Đã gồm VAT'
  },
  'gd2-01': {
    tag: 'GD2-01',
    title: 'Giao dịch, doanh thu và báo cáo kinh doanh',
    body: '<p class="small"><strong>Phạm vi.</strong> Ghi nhận giao dịch từ lúc đặt cọc tới giao dịch thành công; chia doanh thu môi giới cho nhiều nhân viên theo tỷ lệ ghi công; danh mục dự án, đơn vị và nhân sự; công cụ nhập dữ liệu quá khứ từ Excel; bảy báo cáo theo khu vực, loại hình, phân khúc giá, đơn vị, dự án, nhân sự bán và số phòng ngủ; xuất tệp; mẫu thư công bố kết quả tuần.</p><p class="small mt-2"><strong>Nguồn.</strong> <em>Mẫu Báo cáo giao dịch.xlsx</em>, <em>Mẫu báo cáo kinh doanh tổng hợp.xlsx</em>.</p><div class="note mt-3"><strong>Phụ thuộc và rủi ro.</strong> Danh mục chuẩn đã có (QD-057), nhưng cần RECO xác nhận đây là mẫu đích. Khối lượng nhập dữ liệu lịch sử tính riêng, không nằm trong 70 ngày.</div>',
    days: '70 ngày',
    list: '73.560.960 đ',
    after: '51.400.000 đ',
    links: [{ href: 'xem-truoc-gd2.html', label: 'Xem trước bảy báo cáo' }]
  },
  'gd2-02': {
    tag: 'GD2-02',
    title: 'Hoa hồng và thuế thu nhập cá nhân',
    body: '<p class="small"><strong>Phạm vi.</strong> Bảng kê hoa hồng theo kỳ; chia hoa hồng cho nhiều người trên cùng một giao dịch theo tỷ lệ hỗ trợ; thưởng chủ đầu tư và thưởng thêm; trả làm nhiều kỳ có trừ tạm ứng; tính thuế thu nhập cá nhân gộp lương và hoa hồng nhiều tháng.</p><div class="note note-danger mt-3"><strong>Rủi ro cao nhất trong toàn bộ danh mục.</strong> Sai một dòng là sai tiền và sai thuế của người thật. Nếu RECO chọn làm, phải có một kỳ đối chiếu song song với bảng Excel hiện tại.</div>',
    days: '40 ngày',
    list: '41.627.520 đ',
    after: '29.100.000 đ',
    links: [{ href: 'xem-truoc-gd2.html', label: 'Xem trước bảng kê hoa hồng' }]
  },
  'gd2-03': {
    tag: 'GD2-03',
    title: 'Công lương, KPI và đồng bộ chấm công',
    body: '<p class="small"><strong>Phạm vi.</strong> Hồ sơ nhân sự phục vụ tính công; phiếu biểu liên quan công và lương; chỉ số KPI theo nhân viên và theo đơn vị. 35 ngày công <strong>chưa gồm</strong> việc kết nối với ứng dụng chấm công — cần RECO cho biết tên ứng dụng và tài liệu kết nối.</p>',
    days: '35 ngày',
    list: '37.041.840 đ',
    after: '25.900.000 đ'
  },
  'gd2-04': {
    tag: 'GD2-04',
    title: 'Đào tạo và kiểm tra kỹ năng',
    body: '<p class="small"><strong>Phạm vi.</strong> Thư viện video đào tạo kỹ năng; bộ hỏi đáp về quy trình và hướng dẫn; bài kiểm tra kỹ năng có chấm điểm; theo dõi ai đã học, ai đã đạt. Module cấp công ty, nằm ngoài cây bảy nhánh của dự án (QD-056). Nếu RECO chỉ cần chỗ đặt video, phần đó khoảng 6 ngày công.</p>',
    days: '30 ngày',
    list: '31.505.760 đ',
    after: '22.000.000 đ'
  },
  'gd2-05': {
    tag: 'GD2-05',
    title: 'Phân bổ khách hàng và kết nối nền tảng quảng cáo',
    body: '<p class="small"><strong>Phạm vi.</strong> Hồ sơ khách hàng; nhân viên tạo và cập nhật thông tin khách; Chủ sàn và Marketing phân bổ khách theo quy tắc; quản lý nội dung marketing đang chạy; biểu mẫu đăng ký marketing thay Google Form; nhận khách tiềm năng tự động từ <strong>một</strong> nền tảng quảng cáo đầu tiên.</p>',
    days: '40 ngày',
    list: '42.269.040 đ',
    after: '29.500.000 đ'
  },
  'gd2-06': {
    tag: 'GD2-06',
    title: 'Mẫu biểu nghiệp vụ',
    body: '<p class="small"><strong>Phạm vi.</strong> Ba nhóm biểu mẫu điền trực tuyến, có luồng duyệt: form hoàn thiện giao dịch, đề xuất marketing, form công tác và bù công. Kèm bộ dựng biểu mẫu để RECO tự thêm mẫu mới. Nếu chỉ cần chỗ tải mẫu về điền tay, việc đó đã nằm trong Giai đoạn 1 qua cây thư mục.</p>',
    days: '20 ngày',
    list: '21.003.840 đ',
    after: '14.700.000 đ'
  },
  'map-bang-hang': {
    tag: 'Tính năng ưu tiên · SaleHUB mục 3',
    title: 'Truy cập nhanh bảng hàng',
    body: '<p class="small">Đúng tên trong bộ mô tả SaleHUB ngày 17/08. Form lưới bảng hàng trong Hub đã cắt khỏi Giai đoạn 1 (QD-074). Giai đoạn 1 thay bằng cây khối/tòa/tầng/căn + catalog căn không giá + thẻ URL Drive bảng hàng Chủ đầu tư. Form phiếu tính giá là mục 4, cũng thuộc Giai đoạn 2.</p>',
    links: [
      { href: 'danh-muc-san-pham.html', label: 'Catalog GĐ1 (thay thế)' },
      { href: 'tinh-nang-gd1.html#gd2', label: 'Tạm tính GĐ2' }
    ]
  },
  'map-kich-ban': {
    tag: 'Nội dung dự án · Giai đoạn 2',
    title: 'Kịch bản tiếp khách — dạng toggle',
    body: '<p class="small">Bộ hỏi đáp hai cấp nhóm (MH-06, khu vực 07) và kịch bản kinh doanh (MH-12, khu vực 09). Trên bản mô phỏng Giai đoạn 1 hai khu này <strong>ẩn</strong>. Nằm trong GD2-04.</p>',
    links: [{ href: 'tinh-nang-gd1.html#gd2-04', label: 'Xem GD2-04' }]
  }
};
