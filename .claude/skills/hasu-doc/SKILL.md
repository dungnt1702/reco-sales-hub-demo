---
name: hasu-doc
description: >-
  Tạo tài liệu mới trong repo demo RECO theo cấu trúc docs thật hiện có: docs/, docs/contracts/,
  và các màn hình gd01/gd02 khi cần mô tả demo UI hoặc kịch bản.
---

# HASU Doc — RECO demo documentation

## Cấu trúc thư mục hiện có

```
reco-sales-hub-demo/
├── README.md
├── docs/
│   └── contracts/
├── gd01/
├── gd02/
├── assets/
├── tools/
└── screenshots/
```

## Khi nào dùng
`/hasu-doc [loại] [tên]`

Ví dụ:
- `/hasu-doc contract pricing-flow`
- `/hasu-doc demo gd01-homepage`
- `/hasu-doc spec sales-pipeline`

## Workflow

1. Xác định file sẽ nằm ở đâu:
   - docs hợp đồng / spec → `docs/contracts/`
   - mô tả màn demo → `gd01/` hoặc `gd02/` nếu có đúng màn tương ứng
   - readme / mô tả repo chung → `README.md` hoặc docs/ tương ứng
2. Đọc 2–3 file tương tự trước khi tạo mới để học format thực tế.
3. Nếu chủ đề đã có file gần giống, ưu tiên update file sẵn thay vì tạo copy mới.
4. Tạo file với tên mô tả rõ, không bịa `hasu_docs/` hay cấu trúc giả.
5. Nếu thêm tài liệu mới có ảnh hưởng tới đọc lại toàn repo, cập nhật README hoặc index tương ứng.

## Template chuẩn

```markdown
# [Tên tài liệu]

## Mục tiêu
[Mô tả ngắn gọn]

## Scope
- [ ] ...

## Nguồn / dữ liệu liên quan
- [ ] ...

## Luồng / nội dung chính
1. ...
2. ...

## Acceptance / check
- [ ] ...

## Ghi chú
- ...
```

## Rules
- Tiếng Việt cho nội dung, chỉ giữ English cho tên field / code / kịch bản kỹ thuật nếu cần.
- Không tạo file với thư mục giả `hasu_docs/` hoặc `03-applications/...` vì repo hiện tại không có cấu trúc đó.
- Tài liệu tại repo demo chủ yếu là mô tả UI, kịch bản, hợp đồng, hoặc mô hình số liệu demo.
- Không bịa nguồn dữ liệu; nếu không có nguồn thật, ghi rõ là "mô phỏng / demo".
