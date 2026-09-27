---
name: audit-doc
description: >-
  Tạo file audit/spec mới trong repo demo RECO theo đúng thư mục docs hiện có, lưu lại
  root cause, scope, phase fix và verify evidence bằng format mạch lạc.
---

# Audit Doc — RECO demo docs

## Khi nào dùng
`/audit-doc [chủ đề]` — khi cần ghi lại điều tra, sự cố, hoặc spec vào thư mục `docs/` hoặc `docs/contracts/`.

## Workflow

1. **Xác định nơi lưu đúng**:
   - Nếu là tài liệu hợp đồng/đặc tả dùng chung: `docs/contracts/`
   - Nếu là tài liệu tiến độ / repo thư mục demo: `docs/` hoặc thư mục `gd01/` / `gd02/` nếu đang mô tả màn hình cụ thể
2. **Đọc 2–3 file gần nhất** trong cùng mục để khớp format thực tế, không bịa template.
3. **Giữ đầu đề rõ**: `title`, `status`, `updated`, `scope`, `owner` nếu repo có frontmatter hoặc header tương tự.
4. **Thân bài**:
   - Nếu là audit/sự cố: Root cause → Impact → Phase fix → Verification.
   - Nếu là spec: Mục tiêu → Scope → Constraints → Acceptance → Risks.
5. **Không tạo file lặp một chủ đề đã có** — ưu tiên cập nhật file đang có thay vì tạo mới nếu nội dung tương đồng.
6. **Khi cần sửa index**, hãy đọc file readme trong cùng thư mục trước, rồi cập nhật nếu thực sự cần.

## Repo-specific rules

- Repo demo này không có `hasu_docs/` hay hệ thư mục HAUS. Thư mục nguồn thực tế là `docs/` và `docs/contracts/`.
- Đối với file mô tả demo UI, ưu tiên dùng tên mô tả màn hình / kịch bản, ví dụ: `gd01/...` hoặc `contracts/...`.
- Nội dung tiếng Việt; field name / endpoint / code vẫn giữ English nếu đó là tên kỹ thuật.
- Không tạo file tạm `DRAFT_*`, `PLANNING_*`, hay file không liên quan vào cùng thư mục chính.

## Nguyên tắc
- Chỉ lưu audit/spec khi có bằng chứng rõ ràng và product scope rõ.
- Không xóa file cũ nếu file đó vẫn là nguồn tham chiếu.
- Khi feature thực sự triển khai, cập nhật trạng thái thành "đã triển khai" hoặc "đã xác nhận".
