# One-shot: copy content HTML into gd01/ and gd02/, rewrite asset paths.
# Do NOT write screen HTML at repo root — root only keeps index.html (portal) and shared tooling.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$pages = @(
  'index','sitemap','dang-nhap','trang-dau','du-an','du-an-chi-tiet',
  'thu-vien-tai-lieu','cay-thu-muc','soan-noi-dung','chia-se',
  'trang-gui-khach','link-het-han','quan-tri','nguoi-dung','de-nghi-sua',
  'xem-truoc-gd2','tinh-nang-gd1','chi-tiet-gd1','tinh-nang-gd2','chi-tiet-gd2','ha-tang'
)

New-Item -ItemType Directory -Force -Path 'gd01','gd02' | Out-Null
Copy-Item 'assets\store.js' 'gd01\store.js' -Force
Copy-Item 'assets\store.js' 'gd02\store.js' -Force

function Rewrite-PhaseHtml([string]$text) {
  $t = $text
  $t = $t -replace 'src="assets/store\.js"', 'src="store.js"'
  $t = $t -replace "src='assets/store\.js'", "src='store.js'"
  $t = $t -replace '(href|src)="assets/', '$1="../assets/'
  $t = $t -replace "(href|src)='assets/", "`$1='../assets/"
  $t = $t -replace "url\('assets/", "url('../assets/"
  $t = $t -replace 'url\("assets/', 'url("../assets/'
  return $t
}

foreach ($name in $pages) {
  $src = Join-Path $root ($name + '.html')
  if (-not (Test-Path $src)) {
    Write-Host "skip $name (no source at root — screens already live in gd01/gd02)"
    continue
  }
  $raw = Get-Content $src -Raw -Encoding UTF8
  $out = Rewrite-PhaseHtml $raw
  Set-Content -Path (Join-Path 'gd01' ($name + '.html')) -Value $out -Encoding UTF8 -NoNewline
  Set-Content -Path (Join-Path 'gd02' ($name + '.html')) -Value $out -Encoding UTF8 -NoNewline
}

Write-Host "Copied available pages into gd01/ and gd02/. Root stays portal + shared files only."
