# Agent rules — reco-sales-hub-demo

Canonical ship policy: `dev-guides/ai-agent-guidelines/cursor-agents/git-shipper.md` and `dev-guides/ai-agent-guidelines/agent-working-rules.md` (mục RECO).

## Language
- User communication: Vietnamese
- Code, comments, commits: English

## Git / ship
- Live demo is GitHub Pages: `https://dungnt1702.github.io/reco-sales-hub-demo/` — it serves **`main` only**.
- When the user says **ship đi** (or `@ship`) for this demo: rebase onto `origin/main`, commit, **`git push origin main`** (no force). Do **not** leave work on an unmerged feature-branch PR.
- Account: `dungnt1702`.

## Quality gate — local only (repo không có CI)
- Repo không có `package.json`/npm toolchain — các trang là HTML/JS tĩnh, deploy = push thẳng `main` lên GitHub Pages, không qua bước build/bundle nào (trừ `build-artifact.mjs`, chỉ dùng riêng để đóng gói bản demo cho Claude Artifact).
- Trước khi push, chạy `.\security-check.ps1` (gitleaks + semgrep, cả hai cài global trên máy dev, không thêm dependency vào repo):
  - **Gitleaks** (secret scan): không có false positive nào tại lần chạy đầu (18/09/2026) — không cần `.gitleaks.toml`. Leak thật xuất hiện sau này → KHÔNG tự sửa, báo cho user.
  - **Semgrep** (`--config auto`, quét `assets/ gd01/ gd02/ tools/ build-artifact.mjs`): baseline hiện có 8 finding legacy trong `assets/reco.js` (raw-html-concat dòng 255/279/326/364/1347, non-literal-regexp dòng 1209, eval-with-expression + unsafe-format-string dòng 1862-1863) — tồn tại từ trước khi cài tool, KHÔNG tự sửa hàng loạt ngoài phạm vi task đang làm; chỉ chặn finding MỚI phát sinh ở code thay đổi.
- **Không cài Biome/Knip**: repo không có `package.json`, không có ES module (`import`/`export`) hay bundler — không có gì để Knip phân tích dependency graph, và Biome sẽ đòi dựng cả một npm toolchain mới chỉ để lint vài file JS tĩnh, không tương xứng với repo ship-thẳng-main không pipeline.
- **Không áp dụng**: dependency-cruiser (không có kiến trúc phân tầng), Trivy (không container/VPS), Schemathesis (không OpenAPI), Playwright E2E thật (chỉ là các trang `_check-*.html` tự chấm bằng Chrome headless qua `check-all.ps1`, không phải flow nghiệp vụ thật).
