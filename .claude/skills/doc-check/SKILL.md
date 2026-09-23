---
name: doc-check
description: >-
  Kiểm tra tài liệu trong repo demo RECO trước khi commit: naming, đúng thư mục,
  format, không trùng topic, và nội dung có rõ nguồn dữ liệu hay không.
---

# Doc Check — Verify docs trước commit

## Khi nào dùng
`/doc-check [file hoặc thư mục]` — trước khi commit docs mới hoặc sau khi sửa document.

## Checklist theo repo thật

1. **Tên và vị trí đúng**
   - File trong `docs/` hoặc `docs/contracts/` phải phản ánh đúng chủ đề, không đặt tên ngẫu nhiên.
   - Nếu là docs demo mô tả màn/luồng, nên đặt tên theo màn (ví dụ `gd01/...`) hoặc theo hợp đồng cụ thể, không tạo tên lặp.
2. **Không trùng topic**
   - `rg`/`grep` chủ đề trước khi tạo mới.
   - Nếu nội dung tương tự đã có, ưu tiên update file cũ thay vì tạo mới.
3. **Format rõ**
   - Có heading, mục tiêu, scope, trạng thái hoặc link nếu cần.
   - Đối với audit/spec, có phần root cause / impact / fix / verification.
4. **Ngôn ngữ**
   - Nội dung tiếng Việt; tên field / API / code giữ English nếu đó là tên kỹ thuật.
   - Không để đoạn văn bằng tiếng Anh lẻ tẻ trong doc tiếng Việt nếu không cần thiết.
5. **Thư mục đúng**
   - Docs mô tả quy trình/hợp đồng → `docs/contracts/` hoặc `docs/`.
   - Docs màn hình / giai đoạn → `gd01/` / `gd02/` hoặc thư mục tương ứng.
6. **Dữ liệu có nguồn**
   - Nếu doc mô tả số liệu, giá, timeline, hoặc flow, phải có nguồn tham chiếu rõ; không để con số “màu mè” nằm khép kín.
7. **Index / README**
   - Nếu thêm file mới có ảnh hưởng tới danh mục đọc, kiểm README hoặc danh sách tương ứng trong cùng thư mục.
8. **Không file tạm**
   - Không để `DRAFT_*`, `PLANNING_*`, `TODO_*` trong thư mục chính nếu không phải là file chuẩn.

## Output
Báo cáo dạng checklist ✓/✗, kèm đường dẫn và nguyên nhân. Không tự xóa file; chỉ nêu việc cần sửa hoặc cần hỏi xác nhận trước khi cập nhật index dùng chung.
