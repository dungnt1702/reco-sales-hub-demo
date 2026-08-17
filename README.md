# Bản mô phỏng giao diện RECO Data-SalesHub

**Xem trực tiếp: https://dungnt1702.github.io/reco-sales-hub-demo/**

Bộ HTML tĩnh dựng 14 màn hình chính trong tài liệu *Yêu cầu các màn hình*
(`docs/05-user-experience/screen-requirements.md` của repo nội bộ `reco-sales-hub`), cộng một màn xem trước
Giai đoạn 2, bốn màn danh mục tính năng kèm báo giá của cả hai giai đoạn, và một màn bản đồ hệ thống —
tổng cộng 20 màn. Dùng để RECO xem và xác nhận thiết kế Giai đoạn 1 trước khi viết dòng mã đầu tiên, và để trình bày
phạm vi cùng giá ngay trong buổi demo mà không phải mở Excel hay PDF ra riêng.

Không cần cài đặt, không cần build. Mở `index.html` bằng trình duyệt là chạy — kể cả khi không có mạng.
Đẩy lên nhánh `main` là GitHub Pages tự dựng lại bản công khai ở đường dẫn trên.

## Bắt đầu từ đâu

`index.html` là bản đồ màn hình, kèm kịch bản trình bày 10 phút và danh sách điểm còn chờ RECO xác nhận.

`sitemap.html` là **bản đồ hệ thống**: đặt từng mục trong bộ mô tả `SaleHUB.pdf` RECO gửi ngày 17/08/2026
cạnh chỗ nó nằm trong hệ thống — 8 nhóm quyền, 8 tính năng ưu tiên, 3 khối nội dung — mỗi dòng gắn trạng thái
*Giai đoạn 1* / *Ngoài gói* / *Giai đoạn 2* và bấm được thẳng vào màn tương ứng. Đây là màn dùng khi cần
chứng minh không có mục nào của RECO bị bỏ sót hay hiểu lệch.

## Ba nút trên thanh đen ở đầu trang

Thanh này chỉ phục vụ buổi trình bày, sản phẩm thật không có.

| Nút | Tác dụng |
| --- | --- |
| **Đang xem với vai trò** | Đổi giữa 9 vai trò của RECO (QD-053 tách Kế toán khỏi Hành chính nhân sự và bổ sung Khách hàng). Nội dung, nút bấm và khu vực nội bộ trên mọi màn đổi theo đúng ma trận quyền đã chốt (`docs/07-security/role-permission-matrix.md`, repo `reco-sales-hub`). |
| **Xem bản điện thoại** | Nhúng màn đang xem vào khung 390 × 780 để trình bày bản mobile mà không cần mở DevTools. |
| **Ẩn thanh demo** | Ẩn thanh đen để xem hoặc chụp giao diện sạch. Bấm nút góc dưới phải để hiện lại. |

Trạng thái nằm trong URL (`?role=…&dev=m&bare=1`) nên gửi đường dẫn cho người khác vẫn giữ nguyên bối cảnh.

Điểm đáng xem nhất: mở `du-an-chi-tiet.html`, đổi sang **Nhân viên bán hàng** — khu vực 9
(Nội bộ Marketing và Kinh doanh) biến mất, thay bằng phần Kịch bản cá nhân; đổi lại sang
**Giám đốc dự án** thì khu vực 9 hiện đầy đủ kèm nút duyệt.

Cũng ở màn đó: mỗi tiêu đề khu vực có dấu **(i)** — trỏ chuột, Tab tới hoặc chạm đều hiện câu
giải thích khu vực đó dùng để làm gì. Cột trái bên dưới nav là danh sách **dự án cùng loại**,
bấm vào là sang thẳng dự án khác. Mở `du-an-chi-tiet.html?pj=palmy` (đất nền — dự án duy nhất
thuộc loại đó trong kho) để thấy cơ chế bù: khối đổi tiêu đề thành *Dự án khác* và mỗi dòng bù
ghi rõ *cùng khu vực* hay *loại khác*. Ở khổ điện thoại nav mục ẩn đi, danh sách này xuống cuối trang.

## Bản đồ tệp

| Tệp | Màn hình |
| --- | --- |
| `index.html` | Bản đồ prototype, kịch bản demo, câu hỏi còn mở |
| `sitemap.html` | Bản đồ hệ thống — đối chiếu từng mục `SaleHUB.pdf` với màn hình, kèm trạng thái giai đoạn |
| `dang-nhap.html` | MH-01 Đăng nhập |
| `trang-dau.html` | MH-02 Trang đầu |
| `du-an.html` | MH-03 Tìm kiếm và danh sách dự án |
| `du-an-chi-tiet.html` | MH-04 Chi tiết dự án (+ MH-06 hỏi đáp, MH-12 kịch bản, MH-13 gửi đề nghị) |
| `cay-thu-muc.html` | MH-11 Cây thư mục tài liệu — **chế độ xem mặc định của mục Tài liệu** |
| `thu-vien-tai-lieu.html` | MH-05 Thư viện tài liệu — danh sách phẳng có bộ lọc, đổi qua lại bằng cặp nút ở đầu màn |
| `soan-noi-dung.html` | MH-07 Chuẩn bị nội dung bán hàng |
| `trang-gui-khach.html` | MH-08 Trang công khai gửi khách |
| `link-het-han.html` | MH-14 Đường dẫn hết hiệu lực hoặc bị thu hồi |
| `chia-se.html` | Nhật ký và quản lý đường dẫn gửi khách |
| `quan-tri.html` | MH-09 Quản trị dữ liệu, nội dung và báo cáo vận hành |
| `nguoi-dung.html` | MH-10 Quản lý người dùng và quyền |
| `de-nghi-sua.html` | MH-13 Đề nghị sửa nội dung |
| `xem-truoc-gd2.html` | Xem trước Giai đoạn 2 — báo cáo giao dịch và hoa hồng, **số liệu giả**, ngoài gói đã báo giá |
| `tinh-nang-gd1.html` | Cây tính năng Giai đoạn 1 — 18 hạng mục theo sáu nhánh + nhánh Phần A |
| `chi-tiet-gd1.html` | Mô tả chi tiết 18 hạng mục, Phần A, chuỗi tính giá và mục Chưa bao gồm |
| `tinh-nang-gd2.html` | Cây tính năng Giai đoạn 2 — sáu phân hệ và bốn cách RECO chọn |
| `chi-tiet-gd2.html` | Mô tả chi tiết sáu phân hệ Giai đoạn 2 kèm phụ thuộc, rủi ro và tạm tính |

Tệp dùng chung nằm trong `assets/`: `reco.js` (nền tảng), `store.js` (kho dữ liệu), `data.js` (thẻ dự án),
`geo.js` + `reco-map.js` + `vendor/leaflet.js` + `tiles/` (bản đồ vị trí — xem mục dưới).

Bốn màn tính năng/báo giá vào được từ mục **Tính năng & báo giá** trên thanh trên cùng (vai trò Khách hàng
không thấy mục này). Hai màn cây dùng chung `.tree`/`.tnode` của cây thư mục; hai màn chi tiết dùng chung
`.detail-grid`/`.secnav` của màn chi tiết dự án — node trên cây neo thẳng tới hạng mục tương ứng
(`chi-tiet-gd1.html#hm-05`, `chi-tiet-gd2.html#gd2-01`).

**Số liệu của bốn màn này là bản sao, không phải nguồn.** Nguồn sự thật là
`reco-sales-hub/docs/08-delivery/feature-effort-pricing.md` (18 hạng mục, chuỗi giá, mục Chưa bao gồm) và
`reco-sales-hub/docs/08-delivery/phase-2-catalog.md` (Phần A, Phần B, bốn phương án). Đổi giá thì **sửa ở docs
trước**, chạy lại `tools/build-deliverables.ps1` bên repo đó, rồi mới sửa bốn màn này — bốn con số
`218` · `191.810.000` · `248.585.760` · `198.800.000` phải giống nhau ở markdown, Excel, hai PDF và ở đây.
Con số ở cây là **chi phí cốt lõi trước VAT**; tổng theo nhánh cộng lại đúng 191.810.000. Riêng Phần A và
Giai đoạn 2 hiển thị giá **sau ưu đãi 20%**, và tổng từng phần cố tình không cộng khớp với tổng khối
(làm tròn xuống 100.000 chỉ áp một lần cho khối được chốt) — chỗ nào cũng đã có ghi chú giải thích, đừng "sửa cho khớp".

`assets/` chứa `reco.css` (design token kế thừa từ reco-main-web), `reco.js` (vỏ giao diện, đổi vai trò,
hộp xác nhận, trạng thái đang xử lý, kiểm tra biểu mẫu, tìm kiếm toàn cục, chuông thông báo),
`store.js` (kho dữ liệu sống), `data.js` (vẽ thẻ dự án), cùng phông chữ và ảnh cục bộ.

## Dữ liệu thật của RECO trong bản mô phỏng

Từ 17/08/2026, dự án nổi bật của bản mô phỏng là **Le Parc Place — ParkCity Hanoi**, dựng theo bộ tài liệu
RECO cung cấp: 4 tòa A/B/C/D, 802 căn, các loại căn thật, **toàn bộ 88 câu hỏi đáp** của *Mẫu kịch bản bán
hàng — Câu hỏi thường gặp* (bản 17/08/2026), và 8 liên kết sống tới Google Drive của Chủ đầu tư.

**Cả bảy dự án nay là dự án thật của Nhà Ở Ngay RECO (QD-070)** — sáu dự án hư cấu cũ đã được thay bằng
đúng danh mục RECO đang phân phối, quy mô lấy từ trang dự án công khai. Trường `src` của từng dự án ghi
nguồn và ngày trích; `illus: true` nghĩa là **khoảng giá và bảng hàng là số minh họa** (RECO không công bố
giá trên web, mà buổi demo vẫn cần phiếu tính giá và giữ chỗ chạy đủ — QD-073), màn Chi tiết dự án nói
thẳng điều đó ngay dưới khối tổng quan.

| `id` | Dự án | Vị trí | Loại hình | Số liệu thật | Nguồn |
| --- | --- | --- | --- | --- | --- |
| `leparc` | Le Parc Place — ParkCity Hanoi | Dương Nội, Hà Đông | Chung cư | 4 tòa 29–35 tầng · 802 căn · 16.234 m² | Mẫu kịch bản bán hàng RECO · 17/08/2026 |
| `celestine` | Celestine Westlake | 300 Võ Chí Công, Tây Hồ | Chung cư | 2 tháp 23 tầng · 216 căn · 15.237 m² · CĐT VINAENCO · bàn giao từ 2027 | recogroup.vn/du-an/celestine-westlake |
| `la-perle` | La Perle Héritage | 16 Phước Long, Nha Trang | Chung cư | 39 tầng nổi + 41 nhà liền kề · **từ 65 triệu/m²** · CĐT Indochine Nha Trang | Bản trích 10/08/2026 — **trang đã rút khỏi recogroup.vn** |
| `palmy` | Palmy Biztown | Thanh Liệt, Thanh Trì | Thấp tầng | 142 căn thương mại liên kế 4–5 tầng · 20.499 m² | recogroup.vn/du-an/palmybiztown |
| `thien-duong` | Công Viên Thiên Đường | Lang Quán, Yên Sơn, Tuyên Quang | **Tâm linh** | Công viên nghĩa trang sinh thái · 5 dòng khuôn viên · CĐT chính RECO | recogroup.vn/du-an/cong-vien-thien-duong |
| `central` | Khu đô thị Việt Hàn | Hồng Tiến, Phổ Yên, Thái Nguyên | Đất nền | 5 dòng sản phẩm · lô 90 – 369 m² | khudothiviethan.com |
| `opening` | Gold Season — 47 Nguyễn Tuân | Thanh Xuân, Hà Nội | Chung cư · chuyển nhượng | 4 tòa Autumn/Five Seasons/Summer/Spring · ~1.500 căn · 22.000 m² · mật độ 36,4% · giá gốc từ 22 triệu/m² · hoàn thành Q2/2018 | reco.nhaongay.vn/du-an/gold-season |

Ba dự án còn giữ nguyên vai trò minh họa trạng thái khó (bản nháp chờ duyệt, tài liệu sắp hết hiệu lực,
liên kết Drive bị thu quyền) — chỉ tên và số liệu đổi theo dự án thật, còn trạng thái thì giữ.

**La Perle Héritage phải đọc kỹ hơn các dự án khác:** trang dự án đã bị rút khỏi `recogroup.vn` (404 ở cả
`/du-an/la-perle-heritage/` lẫn `/he-thong-san-pham/La-perle-heritage/`) nên số liệu chỉ còn bản trích
10/08/2026. Màn Chi tiết dự án hiện một khối cảnh báo *Cần xác nhận lại* cho đúng dự án này.

**Ảnh dự án phần lớn là ảnh phối cảnh thật của RECO:** `celestine.jpg`, `palmy.jpg`, `thien-duong.jpg` tải
từ chính `recogroup.vn/wp-content/uploads/2026/08/` (đối chiếu byte vẫn trùng bản gốc), `gold-season.jpg` là
đúng ảnh `og:image` của trang Gold Season trên `reco.nhaongay.vn`. Hai ngoại lệ: **Khu đô thị Việt Hàn** dùng
banner RECO trung tính vì `khudothiviethan.com` không trả ảnh qua HTTP thường và ảnh trong bản trích
10/08/2026 bị gán lẫn giữa các dự án; **La Perle Héritage** giữ ảnh cũ vì trang dự án đã bị rút. Ảnh dùng
lại ở khe mặt bằng, thư viện và thẻ mẹo vẫn là ảnh minh họa — dán ảnh của dự án khác lên đúng tên một dự án
thật thì tệ hơn là không có ảnh.

Loại hình thứ sáu **Bất động sản tâm linh** (`tamlinh`) được thêm vào danh mục chuẩn tại QD-071, nới
QD-057 vốn chốt đúng năm loại: `recogroup.vn` và `reco.nhaongay.vn` đều có danh mục tâm linh riêng, và
Công Viên Thiên Đường là dự án RECO tự làm chủ đầu tư. Màn Quản trị nay dựng hai ô chọn loại hình từ
`S.TYPES` thay vì tự chép lại danh mục — trước đó nhãn ở màn quản trị lệch nhãn của chính dữ liệu.

Bộ 88 câu giữ đúng thứ tự và hai cấp nhóm của tài liệu: nhóm cấp 1 là phạm vi (A khu đô thị 10 câu ·
B dự án 14 câu · C câu hỏi cụ thể 64 câu), cấp 2 là chủ đề (Nội thất 19 · Ngoại thất và khu chung 15 ·
Tiện ích 14 · Tổng quan 17 · Đỗ xe 8 · Pháp lý 4 · An ninh 3 · Khu mái 3 · Giá và chính sách 2 ·
Bàn giao 2 · Khác 1). Sáu bảng của tài liệu (hoàn thiện tường/sàn, cửa, sảnh tầng trệt, tiện ích ba tầng,
chỗ đỗ theo loại căn) vào thẳng ô trả lời bằng trường `tbl`, danh sách dài dùng `bul`.

Ba điểm đáng xem trên dữ liệu này:

- `du-an-chi-tiet.html` khu vực 07 — hỏi đáp **hai cấp nhóm** với khối chủ đề gập được (88 câu vẫn gọn
  trong một khu vực), công tắc *Bản đầy đủ / Bản gửi khách*, hai câu mang nhãn **Chờ cập nhật** (mốc bàn
  giao, phí quản lý) mà Chủ đầu tư chưa công bố, và 10 câu gắn chip **Cần Chủ đầu tư xác nhận** ở đúng
  những chỗ tài liệu tự ghi lệch số (công viên 4,2 hay 5,2 ha; tiện ích tầng 5 7.000 hay 8.000 m²; cảnh
  quan tầng 1 3.000 hay 3.200 m²; một hay hai phòng rác; SV01–SV05 hay SV01–SV13; số căn mỗi tầng).
  **Cột *Chia sẻ* của tài liệu còn trống nên không câu nào của Le Parc Place có bản gửi khách** — màn nói
  thẳng `0/88 câu`, bản rút gọn phải do RECO tự soạn. Muốn xem cơ chế hai bản trả lời thì mở
  `?pj=celestine` (dự án hư cấu, 4/8 câu đã có bản gửi khách).
- `du-an-chi-tiet.html` khu vực 05 — quy trình bán hàng và **thông tin tài khoản nhận cọc** kèm cú pháp
  nội dung chuyển khoản, bấm một cái là chép.
- `trang-gui-khach.html` — nút **Nhận báo giá / quan tâm căn**. Đây là hạng mục **ngoài gói đã báo giá**
  (QD-055), có gắn chip để không ai hiểu nhầm là đã bao gồm trong giá.

**Không có một con số giao dịch, hoa hồng hay nhân sự thật nào trong repo này.** Ba tệp Excel RECO gửi có
họ tên khách hàng, thư điện tử nhân viên, hoa hồng từng người và thuế thu nhập cá nhân — chúng nằm ngoài
repo, và mọi số liệu ở `xem-truoc-gd2.html` đều là số giả.

## Dữ liệu sống trong phiên

`assets/store.js` giữ 15 bộ dữ liệu dùng chung cho mọi màn: dự án, bảng hàng tới cấp căn/lô, tài liệu,
cây thư mục, hỏi đáp, kịch bản, ghi chú, đề nghị sửa, hàng chờ duyệt, đường dẫn chia sẻ, người dùng,
ảnh đã duyệt, mẫu nội dung, thông báo và màn vừa xem.

Nhờ vậy các màn không còn rời rạc: duyệt một mục ở màn Quản trị thì ô "Chờ tôi duyệt" ở Trang đầu giảm
theo; gửi đề nghị sửa từ màn Chi tiết dự án thì nó xuất hiện ở màn Đề nghị sửa; thu hồi một đường dẫn
thì bấm Xem sẽ ra màn Đường dẫn hết hiệu lực.

Trạng thái lưu trong `sessionStorage`. Mở bằng `file://` thì trình duyệt chặn, kho tự lùi về bộ nhớ
trong — bản gói một trang vẫn chạy đủ vì cả 20 màn nằm trong cùng một tài liệu.
Nút **"Đặt lại dữ liệu demo"** trên thanh đen đưa mọi thứ về trạng thái ban đầu để diễn lại kịch bản.

Bảy dự án phủ cả bốn dòng kinh doanh RECO đang chạy: chung cư (4 dự án, gồm một dự án chuyển nhượng),
thương mại liên kế, đất nền và bất động sản tâm linh. **Tên dự án, vị trí, quy mô và chủ đầu tư là dữ liệu
thật** (bảng nguồn ở mục *Dữ liệu thật của RECO trong bản mô phỏng*); **khoảng giá, bảng hàng, tên người và
mọi số liệu giao dịch là số minh họa** — màn Chi tiết dự án nói thẳng điều đó dưới khối tổng quan.

## Đưa nội dung vào hệ thống

Bốn lối thêm nội dung, đều ghi bản ghi thật vào kho nên màn khác thấy ngay:

| Thao tác | Ở đâu | Vai trò làm được |
| --- | --- | --- |
| Tải tài liệu lên | Thư viện tài liệu · Cây thư mục (theo đúng thư mục đang chọn) | Thư ký kinh doanh, Giám đốc dự án; Marketing chỉ nhánh 4 và 5 |
| Thêm ảnh vào thư viện | Cây thư mục, nhánh 5 | Marketing, Giám đốc dự án |
| Thêm phân khu, tòa, tầng và căn/lô | Quản trị, tab Dự án — cây phân khu cạnh bảng căn/lô | Thư ký kinh doanh, Giám đốc dự án |
| Thêm câu hỏi đáp | Chi tiết dự án, khu vực 07 | Thư ký kinh doanh, Giám đốc dự án |
| Sửa thành phần trang dự án | Chi tiết dự án, khu vực 01–04 và 08 — nút Sửa ngay trên từng khối | Tổng quan, Vị trí, Điểm bán: Thư ký kinh doanh + GĐDA · Mặt bằng: thêm Marketing · Nội dung được duyệt: Marketing + GĐDA |
| Soạn và duyệt kịch bản | Quản trị, tab Kịch bản | Soạn bản dùng chung: Thư ký kinh doanh, GĐDA · Duyệt đề xuất nâng lên chung: GĐDA, TGĐ |

**Tổng giám đốc xem toàn bộ và duyệt, không sửa nội dung hàng ngày và không cấp tài khoản** (chốt 14/08/2026,
theo ma trận nhánh). **HCNS & Kế toán** chỉ thấy nhánh 1 và phần số liệu ở nhánh 7 trong cây thư mục.

Kịch bản **cá nhân** của nhân viên không hiện nội dung ở màn Quản trị — chỉ đếm số lượng, đúng quy tắc
"chỉ chủ sở hữu xem được" (QD-032). Duyệt đề xuất nâng lên bản chung thì hệ thống **tạo bản sao**,
bản cá nhân gốc vẫn thuộc về người viết.

Ai **không** phải người duyệt cuối thì nội dung vừa tạo dừng ở trạng thái chờ duyệt (QD-006) và rơi vào hàng
chờ ở màn Quản trị — bấm Duyệt ở đó lật luôn bản ghi gốc, chip "Chưa duyệt" biến mất trước mắt người xem.

Ô chọn tệp là `<input type="file">` thật: hệ thống đọc tên, dung lượng và kiểu tệp từ máy anh/chị, kiểm hạn
mức (PDF, Word, Excel 50 MB · ảnh 20 MB · không nhận video) rồi chỉ ghi lại **thông tin mô tả**.
**Không có byte nào rời khỏi máy** — bản mô phỏng không có máy chủ để gửi lên. Ảnh được thu nhỏ ngay tại
trình duyệt (tối đa 480px) để hiện được trong thư viện; khoảng 80–100 ảnh là đầy `sessionStorage`, khi đó
hệ thống báo thật chứ không im lặng nuốt mất dữ liệu.

## Bốn quyết định chốt ngày 14/08/2026

Dựng phần quản trị buộc mọi câu hỏi về quyền phải có đúng một câu trả lời, và ba câu trước đây
có nhiều hơn một. Bản mô phỏng nay theo bốn quyết định dưới đây; tài liệu trong repo
`reco-sales-hub` đã được sửa cho khớp (QD-049 → QD-052 trong `docs/09-decisions/decision-log.md`).

| Mã | Quyết định | Vì sao |
| --- | --- | --- |
| QD-049 | **Tổng giám đốc** xem toàn bộ và duyệt nội dung đặc biệt, **không cập nhật dữ liệu và không cấp tài khoản**; vẫn xem được danh sách người dùng ở chế độ chỉ đọc | Ba tài liệu mô tả vai trò này theo ba kiểu khác nhau. Tách người quyền cao nhất khỏi cả việc tự sửa lẫn việc tự phát quyền, giữ được ranh giới ai sửa — ai duyệt |
| QD-050 | **Marketing không soạn kịch bản kinh doanh dùng chung**; việc soạn thuộc Thư ký kinh doanh và Giám đốc dự án. Marketing giữ mẫu nội dung và ảnh đã duyệt | Ma trận nhánh 7 cho Marketing đúng quyền xem; Thư ký kinh doanh đã được ghi rõ "Chỉ Kịch bản dùng chung" nên việc soạn có người nhận |
| QD-051 | **HCNS & Kế toán** trong cây thư mục chỉ thấy nhánh 1 và phần số liệu ở nhánh 7 | Bảng hàng, pháp lý, tài liệu bán hàng, ảnh và hỏi đáp không thuộc phạm vi nhân sự — kế toán |
| QD-052 | Bảng hàng quản lý theo **phân khu → tòa hoặc dãy → tầng → căn/lô**; khối *Vị trí và liên kết vùng* lưu trong `content_sections` | MH-09 đã hứa quản lý phân cấp nhưng chưa có giao diện; khối Vị trí chưa có bảng nào trong schema |

## Đọc trước khi code thật: kho của bản mô phỏng ≠ schema

Kho trong `store.js` được gom cho gọn để một tệp JS chạy được mọi màn. **Schema thật tách nhỏ hơn.**
Ai code Giai đoạn 1 phải theo `docs/12-architecture/database-schema.md`, không theo cấu trúc dưới đây.

| Kho trong bản mô phỏng | Bảng thật | Ghi chú khi chuyển |
| --- | --- | --- |
| `sections` `kind:'overview'` | `content_sections` (`branch_key='project_info'`) | |
| `sections` `kind:'point'` | `selling_points` | |
| `sections` `kind:'plan'` | **`documents`** nhánh `sales_docs`, `kind='matbang'` | Bản mô phỏng để riêng cho dễ sửa tại chỗ; thật thì mặt bằng là tài liệu, **đừng tạo bảng thứ hai** |
| `sections` `kind:'content'` | **`content_templates`** | Trùng vai trò với kho `templates` của màn Chuẩn bị nội dung — thật thì chỉ một bảng |
| `sections` `kind:'place'` | `content_sections` (`branch_key='project_info'`) | Mỗi điểm liên kết là một dòng: `title` = tên địa điểm, `body` = "2,1 km · 5 phút". Giai đoạn 1 chỉ hiển thị nên chưa tách số; muốn lọc theo khoảng cách hay chấm lên bản đồ thì Giai đoạn 2 mới cần bảng riêng |
| `media` | `documents` nhánh `media_library` | Schema không có bảng ảnh riêng |
| `qas` | `faq_groups` + `faq_items` | Bản mô phỏng gom hai cấp nhóm vào hai trường chuỗi `grp` + `topic`; hai trường `tbl` (bảng trong ô trả lời) và `bul` (gạch đầu dòng) là **nội dung định dạng của câu trả lời**, schema thật cần một kiểu lưu giữ được bảng chứ không phải hai cột riêng. `warn` là ghi chú "số liệu cần Chủ đầu tư xác nhận" gắn theo từng câu |
| `scripts` | `sales_scripts` + `script_promotion_requests` | `scope` thật là `shared`/`personal`; đề xuất là **bảng riêng**, không phải `scope:'proposal'` |
| `units` `state` `con/giu/ban/ngung` | `units.status` `available/hold/sold/stopped` | |
| `zones` + `units.zone` | `zones` + `units.zone_id` | Phân khu → tòa/dãy → tầng; `block` và `floor` trong bản mô phỏng là giá trị suy ra để hiển thị, **không phải nguồn sự thật** |
| `branch` 1–7 | `branch_definitions.branch_key` (chuỗi) | Thật dùng khoá chữ, không dùng số thứ tự |

Ba điểm nghiệp vụ dễ code sai, đã được bản mô phỏng thể hiện đúng — bám theo:

- **Duyệt đề xuất nâng kịch bản = tạo bản sao**, không đổi `scope` tại chỗ. Đổi tại chỗ là lấy mất ghi chú riêng của nhân viên (QD-022, QD-032).
- **Hạ nhãn xuống Công khai phải hỏi lại** (`RECO.guardLabel`) — MH-09. Còn nhãn con nới lỏng hơn cha thì **chặn hẳn**, không phải cảnh báo (ADR-0005).
- **Bảng hàng nguồn liên kết sống Drive thì RECO chỉ đọc** — không thêm/sửa căn trong Sales Hub (ADR-0003). Màn Quản trị khóa nút và nói rõ lý do.

## Bản đồ vị trí dự án

Ba màn có bản đồ street thật: **chi tiết dự án** (khu vực 02 *Vị trí và liên kết vùng*),
**trang gửi khách** (mục *Liên kết vùng*, chỉ ghim điểm mang nhãn Công khai) và
**xem trước Giai đoạn 2** (báo cáo *Theo khu vực địa lý*, bong bóng theo doanh thu).
Trỏ vào một ô trong danh sách liên kết vùng thì ghim tương ứng trên bản đồ nhảy lên, và ngược lại.

**Ô ảnh bản đồ nằm sẵn trong repo** (`assets/tiles/{z}/{x}/{y}.webp`, 258 ô ≈ 1,3 MB). Bản đồ vì thế
vẽ được trên GitHub Pages, khi mở bằng `file://` và trong bản một tệp gửi link — Artifact chặn mọi
yêu cầu ra máy chủ ngoài nên **không** thể gọi máy chủ ô ảnh lúc chạy.

```powershell
node tools/geocode.mjs         # tra toạ độ bằng Nominatim, dán tay kết quả vào assets/geo.js
node tools/fetch-tiles.mjs     # nướng ô ảnh vào assets/tiles (chạy lại được, bỏ qua ô đã có)
```

Đổi toạ độ hay mức phóng trong `assets/geo.js` thì phải chạy lại `fetch-tiles.mjs` rồi build lại bản gói —
`_check.html` nay mở bản đồ của **cả bảy dự án** nên quên bước này là bộ kiểm tra báo ô trống ngay.
Mỗi mức phóng thêm vào là thêm chừng 24 ô cho một dự án, nên chỉ Le Parc Place có ba mức (z14–z16),
Celestine hai mức, năm dự án còn lại một mức z15 (bản đồ không phóng được — nút phóng tự ẩn).

**Nguồn và ghi công.** Ô ảnh lấy từ `tile.openstreetmap.fr/osmfr` (dịch vụ miễn phí của cộng đồng
OSM France, kiểu nền OSM standard); dữ liệu © OpenStreetMap contributors, giấy phép ODbL — dòng ghi
công hiện ở góc mỗi bản đồ. **Không dùng `tile.openstreetmap.org`**: máy chủ chính của OSM trả về ảnh
*Access blocked* (mã 200, nội dung là ảnh thông báo) cho kiểu dùng lưu sẵn ô ảnh này, nên
`fetch-tiles.mjs` có chốt tự dừng khi nhận nhiều ô nhiều chi tiết giống nhau từng byte.
Đây là mức dùng của một bản mô phỏng (vài trăm ô, tải một lần). **Bản chạy thật của RECO phải tự dựng
máy chủ ô ảnh hoặc dùng nhà cung cấp có hợp đồng** — đừng mang cách này lên sản phẩm.

**Cả bảy dự án nay ghim theo địa chỉ thật** đã công bố trên trang dự án của RECO, toạ độ tra qua
Nominatim (`tools/geocode.mjs`). Nominatim không có điểm cho vài địa chỉ số nhà (300 Võ Chí Công,
47 Nguyễn Tuân, Khu đô thị Việt Hàn) nên lấy điểm gần nhất tra được **trên chính con đường hoặc khu đất
đó** — sai số vài trăm mét, đủ đúng để bản đồ không nói sai khu vực; chỗ nào lấy điểm thay thế đều có ghi
chú ngay trong `geo.js`. Các điểm liên kết vùng cũng là địa danh thật: Le Parc Place có LINC Mall,
ParkCity Club, Trường Quốc tế, Aeon Mall Hà Đông; Celestine Westlake có Ciputra, Hồ Tây, Lotte Mall Tây Hồ,
cầu Nhật Tân, Công viên nước Hồ Tây — khoảng cách trong dữ liệu tính từ chính hai bộ toạ độ đó.
Điểm nào ở quá xa khung ô ảnh đã tải (sân bay Nội Bài, phố cổ) mang cờ `far: true` trong `geo.js`:
vẫn hiện trong danh sách, không ghim lên bản đồ.

## Bản một tệp để gửi link (Claude Artifact)

```powershell
node build-artifact.mjs      # → dist/reco-sales-hub.html (~6,6 MB)
```

Gộp cả 20 màn, phông chữ và ảnh vào **một tệp HTML tự chứa**, không gọi ra máy chủ nào —
mở offline vẫn đủ. Điều hướng chuyển từ `du-an.html?role=nvbh` sang `#du-an?role=nvbh`,
mọi thứ khác giữ nguyên: đổi vai trò, khung điện thoại, ẩn thanh demo đều chạy.

Ảnh được nén xuống WebP tối đa 1400px và **giữ đúng một bản** trong `window.RECO_IMG`;
nếu nhúng data URI thẳng vào đánh dấu thì một tấm ảnh dùng ở năm màn sẽ bị chép năm lần
và tệp phình từ 2,8 MB lên 6,8 MB. Ô ảnh bản đồ đi theo cùng cách, trong `window.RECO_TILES`
tra theo khoá `z/x/y` — riêng phần này chiếm khoảng 3,7 MB của tệp.

`reco.js` chạy được cả hai chế độ, phân biệt qua `window.RECO_BUNDLE`. Sửa màn hình thì
sửa file `.html` gốc rồi chạy lại build — đừng sửa trực tiếp trong `dist/`.

## Công cụ kiểm tra

```powershell
.\shot.ps1                     # chụp mọi trang ở 1440 và 390, lưu vào screenshots\
.\shot.ps1 -Pages trang-dau    # chỉ một trang
.\shot.ps1 -Role nvbh          # chụp với vai trò Nhân viên bán hàng
```

```powershell
.\check-all.ps1                # chay ca nam bo kiem tra, in ra cac dong khong dat
.\check-all.ps1 -Only actions  # chi mot bo
```

| Bộ | Kiểm gì |
| --- | --- |
| `_check.html` | Tràn ngang ở **bảy khổ 360/390/768/1024/1152/1280/1440** (dải 1024–1280 trước đây phải đo tay), liên kết hỏng trên cả 20 trang, và bản đồ của **cả bảy dự án** cộng trang gửi khách và màn Giai đoạn 2 (ô ảnh tải được, không ô trống trong khung nhìn, đủ ghim, có ghi công) |
| `_check-roles.html` | 90 trường hợp ẩn/hiện theo vai trò |
| `_check-actions.html` | **Bấm thử từng phần tử** trên mọi màn, so nội dung trước/sau. Đạt khi DOM đổi, hoặc mở hộp thoại, hoặc phần tử mang `data-gd2`. Toast không tính — nó nằm ngoài vùng so sánh. Kiểm thêm: hành động khó hoàn tác có hỏi lại không, ô nhập có phản hồi không, còn liên kết cụt `href="#"` không, và biểu mẫu tải tài liệu có chặn lỗi rồi ghi thật vào kho không |
| `_check-bundle.html` | Bản một tệp: dựng màn, tràn ngang, liên kết, ảnh/phông/ô ảnh bản đồ nhúng sẵn (không tải gì ra ngoài), phân quyền, mã riêng từng màn |
| `_check-tim.html` | Tìm trong cây thư mục: con số trên chip phải bằng đúng số dòng người dùng với tới được, thư mục chứa tệp khớp phải hiện ra để bấm vào, ảnh cũng theo bộ lọc |
| `_check-mh04.html` | Chi tiết dự án: khối dự án cùng loại (số dòng, cơ chế bù, tiêu đề, đường dẫn) trên ba loại hình; nav mục dính không bắt nhầm liên kết dự án; mười dấu (i) — bấm/Escape/bấm ra ngoài, không tràn ngang ở 390px; và thẻ mẹo Trang đầu không bị lớp `.itip` giẫm lên |

Ba cạm bẫy khi tự viết bộ kiểm tra cho bộ này, đã trả giá rồi mới biết:
- Đổi hai bộ lọc liên tiếp trong nhịp chờ 250ms cho ra DOM y hệt nhau → tưởng ô lọc chết. Phải trả ô về giá trị cũ sau mỗi lần thử.
- Gỡ hẳn lớp phủ xem ảnh sau khi thử → lần bấm sau không còn phần tử để mở → mọi nút cùng loại bị chấm là hỏng. Phải đóng chứ không gỡ.
- `navigator.clipboard` treo vô hạn khi trang không giữ focus. Đây là lỗi thật với người dùng, không phải lỗi bộ kiểm tra — `RECO.copy` nay có hạn chờ rồi mới lùi về `execCommand`.

Đừng đo tràn ngang bằng `documentElement.scrollWidth` — `body` có `overflow-x:hidden` nên
giá trị bị kẹp và luôn báo "không tràn". Phải duyệt `getBoundingClientRect().right` từng phần tử.

Chrome không giao diện trên Windows không hạ được bề rộng cửa sổ xuống dưới ~500px, nên với khổ hẹp
`shot.ps1` nhúng trang qua `_shot-mobile.html` để có viewport thật. Chụp thẳng ở 390 sẽ ra ảnh bị cắt.

## Một giới hạn phải biết trước khi gửi link ra ngoài

Hai màn dành cho khách — `trang-gui-khach.html` và `link-het-han.html` — **hiển thị** đúng phần
Công khai, đã kiểm bằng máy: không một chuỗi nội bộ nào lọt vào nội dung trang. Nhưng chúng nạp
chung `assets/store.js` với các màn nội bộ, nên **mã nguồn** của trang vẫn chứa toàn bộ kho dữ liệu
mẫu, gồm cả tên "Chính sách hoa hồng", kịch bản kinh doanh và ghi chú nội bộ. Ai mở View Source
đều đọc được.

Đây là giới hạn của bản mô phỏng một tệp, không phải thiết kế của sản phẩm thật. Toàn bộ dữ liệu
trong đó là dữ liệu mẫu bịa ra để minh họa, không phải dữ liệu thật của RECO — nên rủi ro thực tế
bằng không. Nhưng đừng dùng bộ này để thử với dữ liệu thật.

Bản thật đã có rào chắn cho đúng chuyện này: luật cấu trúc số 3 cấm `src/public-view/` import bất cứ
thứ gì từ `src/server/documents/`, và ESLint chặn trong gate.
Trang gửi khách sẽ được máy chủ dựng sẵn với dữ liệu đã lọc theo dự án và nhãn Công khai.

## Phạm vi

Đây là bản duyệt thiết kế, **không phải nền để build tiếp**. Bản thật dùng Next.js 16 + Tailwind 4
theo ADR-0001 (`docs/12-architecture/adr/`, repo `reco-sales-hub`).
