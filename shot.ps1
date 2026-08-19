# Chụp ảnh màn hình prototype bằng Chrome không giao diện.
#   .\shot.ps1                    -> chụp tất cả trang ở 1440 và 390
#   .\shot.ps1 -Pages trang-dau   -> chỉ chụp một trang
#   .\shot.ps1 -Widths 1440       -> chỉ một bề ngang
#   .\shot.ps1 -Role nvbh         -> chụp với một vai trò khác
#
# Luu y: Chrome headless tren Windows khong ha duoc be rong cua so xuong duoi ~500px.
# Chup truc tiep o 390 se ra anh bi CAT chu khong phai bo cuc dien thoai that.
# Voi moi be rong < 500, script nhung trang vao _shot-mobile.html de co viewport that.
param(
  [string[]]$Pages,
  [int[]]$Widths = @(1440, 390),
  [string]$Role
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) { throw "Khong tim thay Chrome tai $chrome" }

$out = Join-Path $root 'screenshots'
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

if (-not $Pages) {
  $phase = Join-Path $root 'gd01'
  $Pages = Get-ChildItem $phase -Filter *.html |
           ForEach-Object { $_.BaseName }
}

$suffix = ''
if ($Role) { $suffix = "-$Role" }

foreach ($p in $Pages) {
  $file = Join-Path (Join-Path $root 'gd01') "$p.html"
  if (-not (Test-Path $file)) { Write-Host "  bo qua $p (khong co file)"; continue }
  foreach ($w in $Widths) {
    $png = Join-Path $out "$p-$w$suffix.png"
    $h = 1400
    if ($w -lt 500) {
      $q = "p=$p&w=$w&h=$h"
      if ($Role) { $q += "&role=$Role" }
      $url = "file:///" + (($root -replace '\\', '/') + "/_shot-mobile.html") + "?$q"
      $winW = 520
    } else {
      $q = 'bare=1'
      if ($Role) { $q += "&role=$Role" }
      $url = "file:///" + ($file -replace '\\', '/') + "?$q"
      $winW = $w
    }
    # Khong redirect stderr: PowerShell 5.1 bien stderr cua exe thanh NativeCommandError
    Start-Process -FilePath $chrome -Wait -NoNewWindow -ArgumentList @(
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
      '--virtual-time-budget=5000', "--window-size=$winW,$h", "--screenshot=$png", $url
    ) | Out-Null
    if (Test-Path $png) {
      $kb = [math]::Round((Get-Item $png).Length / 1KB)
      Write-Host ("  {0,-22} {1,5}px  {2,6} KB" -f $p, $w, $kb)
    } else {
      Write-Host ("  {0,-22} {1,5}px  LOI" -f $p, $w)
    }
  }
}
Write-Host "Xong. Anh nam o $out"
