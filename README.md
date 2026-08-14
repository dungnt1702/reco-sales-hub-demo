# Bản mô phỏng giao diện RECO Data-SalesHub

**Xem trực tiếp: https://dungnt1702.github.io/reco-sales-hub-demo/**

Bộ HTML tĩnh dựng 14 màn hình chính trong tài liệu *Yêu cầu các màn hình*
(`docs/05-user-experience/screen-requirements.md` của repo nội bộ `reco-sales-hub`),
dùng để RECO xem và xác nhận thiết kế Giai đoạn 1 trước khi viết dòng mã đầu tiên.

Không cần cài đặt, không cần build. Mở `index.html` bằng trình duyệt là chạy — kể cả khi không có mạng.
Đẩy lên nhánh `main` là GitHub Pages tự dựng lại bản công khai ở đường dẫn trên.

## Bắt đầu từ đâu

`index.html` là bản đồ màn hình, kèm kịch bản trình bày 10 phút và danh sách điểm còn chờ RECO xác nhận.

## Ba nút trên thanh đen ở đầu trang

Thanh này chỉ phục vụ buổi trình bày, sản phẩm thật không có.

| Nút | Tác dụng |
| --- | --- |
| **Đang xem với vai trò** | Đổi giữa 7 vai trò của RECO. Nội dung, nút bấm và khu vực nội bộ trên mọi màn đổi theo đúng ma trận quyền đã chốt (`docs/07-security/role-permission-matrix.md`, repo `reco-sales-hub`). |
| **Xem bản điện thoại** | Nhúng màn đang xem vào khung 390 × 780 để trình bày bản mobile mà không cần mở DevTools. |
| **Ẩn thanh demo** | Ẩn thanh đen để xem hoặc chụp giao diện sạch. Bấm nút góc dưới phải để hiện lại. |

Trạng thái nằm trong URL (`?role=…&dev=m&bare=1`) nên gửi đường dẫn cho người khác vẫn giữ nguyên bối cảnh.

Điểm đáng xem nhất: mở `du-an-chi-tiet.html`, đổi sang **Nhân viên bán hàng** — khu vực 9
(Nội bộ Marketing và Kinh doanh) biến mất, thay bằng phần Kịch bản cá nhân; đổi lại sang
**Giám đốc dự án** thì khu vực 9 hiện đầy đủ kèm nút duyệt.

## Bản đồ tệp

| Tệp | Màn hình |
| --- | --- |
| `index.html` | Bản đồ prototype, kịch bản demo, câu hỏi còn mở |
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

`assets/` chứa `reco.css` (design token kế thừa từ reco-main-web), `reco.js` (vỏ giao diện, đổi vai trò,
hộp xác nhận, trạng thái đang xử lý, kiểm tra biểu mẫu, tìm kiếm toàn cục, chuông thông báo),
`store.js` (kho dữ liệu sống), `data.js` (vẽ thẻ dự án), cùng phông chữ và ảnh cục bộ.

## Dữ liệu sống trong phiên

`assets/store.js` giữ 15 bộ dữ liệu dùng chung cho mọi màn: dự án, bảng hàng tới cấp căn/lô, tài liệu,
cây thư mục, hỏi đáp, kịch bản, ghi chú, đề nghị sửa, hàng chờ duyệt, đường dẫn chia sẻ, người dùng,
ảnh đã duyệt, mẫu nội dung, thông báo và màn vừa xem.

Nhờ vậy các màn không còn rời rạc: duyệt một mục ở màn Quản trị thì ô "Chờ tôi duyệt" ở Trang đầu giảm
theo; gửi đề nghị sửa từ màn Chi tiết dự án thì nó xuất hiện ở màn Đề nghị sửa; thu hồi một đường dẫn
thì bấm Xem sẽ ra màn Đường dẫn hết hiệu lực.

Trạng thái lưu trong `sessionStorage`. Mở bằng `file://` thì trình duyệt chặn, kho tự lùi về bộ nhớ
trong — bản gói một trang vẫn chạy đủ vì cả 14 màn nằm trong cùng một tài liệu.
Nút **"Đặt lại dữ liệu demo"** trên thanh đen đưa mọi thứ về trạng thái ban đầu để diễn lại kịch bản.

Sáu dự án phủ đúng ba nhóm bất động sản Giai đoạn 1: căn hộ chung cư, đất nền, nhà thấp tầng và biệt thự.
Tên dự án, con số và ảnh đều là dữ liệu mẫu dùng để minh họa giao diện.

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
| `qas` | `faq_groups` + `faq_items` | Bản mô phỏng bỏ tầng nhóm hỏi đáp |
| `scripts` | `sales_scripts` + `script_promotion_requests` | `scope` thật là `shared`/`personal`; đề xuất là **bảng riêng**, không phải `scope:'proposal'` |
| `units` `state` `con/giu/ban/ngung` | `units.status` `available/hold/sold/stopped` | |
| `zones` + `units.zone` | `zones` + `units.zone_id` | Phân khu → tòa/dãy → tầng; `block` và `floor` trong bản mô phỏng là giá trị suy ra để hiển thị, **không phải nguồn sự thật** |
| `branch` 1–7 | `branch_definitions.branch_key` (chuỗi) | Thật dùng khoá chữ, không dùng số thứ tự |

Ba điểm nghiệp vụ dễ code sai, đã được bản mô phỏng thể hiện đúng — bám theo:

- **Duyệt đề xuất nâng kịch bản = tạo bản sao**, không đổi `scope` tại chỗ. Đổi tại chỗ là lấy mất ghi chú riêng của nhân viên (QD-022, QD-032).
- **Hạ nhãn xuống Công khai phải hỏi lại** (`RECO.guardLabel`) — MH-09. Còn nhãn con nới lỏng hơn cha thì **chặn hẳn**, không phải cảnh báo (ADR-0005).
- **Bảng hàng nguồn liên kết sống Drive thì RECO chỉ đọc** — không thêm/sửa căn trong Sales Hub (ADR-0003). Màn Quản trị khóa nút và nói rõ lý do.

## Bản một tệp để gửi link (Claude Artifact)

```powershell
node build-artifact.mjs      # → dist/reco-sales-hub.html (~2,8 MB)
```

Gộp cả 14 màn, phông chữ và ảnh vào **một tệp HTML tự chứa**, không gọi ra máy chủ nào —
mở offline vẫn đủ. Điều hướng chuyển từ `du-an.html?role=nvbh` sang `#du-an?role=nvbh`,
mọi thứ khác giữ nguyên: đổi vai trò, khung điện thoại, ẩn thanh demo đều chạy.

Ảnh được nén xuống WebP tối đa 1400px và **giữ đúng một bản** trong `window.RECO_IMG`;
nếu nhúng data URI thẳng vào đánh dấu thì một tấm ảnh dùng ở năm màn sẽ bị chép năm lần
và tệp phình từ 2,8 MB lên 6,8 MB.

`reco.js` chạy được cả hai chế độ, phân biệt qua `window.RECO_BUNDLE`. Sửa màn hình thì
sửa file `.html` gốc rồi chạy lại build — đừng sửa trực tiếp trong `dist/`.

## Công cụ kiểm tra

```powershell
.\shot.ps1                     # chụp mọi trang ở 1440 và 390, lưu vào screenshots\
.\shot.ps1 -Pages trang-dau    # chỉ một trang
.\shot.ps1 -Role nvbh          # chụp với vai trò Nhân viên bán hàng
```

```powershell
.\check-all.ps1                # chay ca bon bo kiem tra, in ra cac dong khong dat
.\check-all.ps1 -Only actions  # chi mot bo
```

| Bộ | Kiểm gì |
| --- | --- |
| `_check.html` | Tràn ngang ở 360/390/768/1440 và liên kết hỏng trên cả 14 trang |
| `_check-roles.html` | 82 trường hợp ẩn/hiện theo vai trò |
| `_check-actions.html` | **Bấm thử từng phần tử** trên mọi màn, so nội dung trước/sau. Đạt khi DOM đổi, hoặc mở hộp thoại, hoặc phần tử mang `data-gd2`. Toast không tính — nó nằm ngoài vùng so sánh. Kiểm thêm: hành động khó hoàn tác có hỏi lại không, ô nhập có phản hồi không, còn liên kết cụt `href="#"` không, và biểu mẫu tải tài liệu có chặn lỗi rồi ghi thật vào kho không |
| `_check-bundle.html` | Bản một tệp: dựng màn, tràn ngang, liên kết, ảnh và phông nhúng sẵn, phân quyền, mã riêng từng màn |

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
