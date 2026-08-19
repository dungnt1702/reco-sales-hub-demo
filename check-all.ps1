# Chay ca bon bo kiem tra bang Chrome khong giao dien, in ra cac dong khong dat.
#   .\check-all.ps1            -> chay het
#   .\check-all.ps1 -Only actions
param([string]$Only)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chrome)) { throw "Khong tim thay Chrome tai $chrome" }

$suites = @(
  @{ key = 'layout';  file = '_check.html';         label = 'Tran ngang + lien ket';        budget = 40000 },
  @{ key = 'roles';   file = '_check-roles.html';   label = 'Phan quyen theo vai tro';      budget = 25000 },
  @{ key = 'actions'; file = '_check-actions.html'; label = 'Moi nut co tac dung that';     budget = 90000 },
  @{ key = 'bundle';  file = '_check-bundle.html';  label = 'Ban goi mot trang';            budget = 60000 },
  @{ key = 'tim';     file = '_check-tim.html';     label = 'Tim trong cay thu muc';        budget = 30000 },
  @{ key = 'nhip';    file = '_check-nhip.html';    label = 'Nhip gian cach giua cac khoi';  budget = 40000 },
  @{ key = 'mh04';    file = '_check-mh04.html';    label = 'MH-04 du an cung loai + goi y'; budget = 40000 }
)

$bad = 0
foreach ($s in $suites) {
  if ($Only -and $s.key -ne $Only) { continue }
  $path = Join-Path $root $s.file
  if (-not (Test-Path $path)) { Write-Host "  bo qua $($s.file)"; continue }
  $tmp = Join-Path $env:TEMP ("reco-" + $s.key + ".html")
  $url = "file:///" + ($path -replace '\\', '/')

  Write-Host ""
  Write-Host "=== $($s.label) ===" -ForegroundColor Cyan
  Start-Process -FilePath $chrome -Wait -NoNewWindow -ArgumentList @(
    '--headless=new', '--disable-gpu', '--allow-file-access-from-files',
    "--virtual-time-budget=$($s.budget)", "--timeout=$($s.budget + 25000)",
    '--dump-dom', $url
  ) -RedirectStandardOutput $tmp

  $html = Get-Content $tmp -Raw
  if ($html -match '(?s)<pre id="out">(.*?)</pre>') {
    $txt = $matches[1] -replace '&lt;', '<' -replace '&gt;', '>' -replace '&amp;', '&' -replace '&quot;', '"'
    $lines = $txt -split "`n"
    # Dong chi tiet cua mot muc hong bat dau bang mui ten; dong trong khong tinh
    $fails = $lines | Where-Object { $_ -match '^(HONG|TRAN|LOI)' -or $_ -match '↳' }
    if ($fails) { $bad++; $fails | ForEach-Object { Write-Host $_ -ForegroundColor Red } }
    $lines | Where-Object { $_ -match '^===' -or $_ -match '^Da bam' } | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
  } else {
    $bad++
    Write-Host "  KHONG DOC DUOC KET QUA (bo kiem tra co the da nem loi)" -ForegroundColor Red
  }
}

Write-Host ""
if ($bad -eq 0) { Write-Host "TAT CA BO KIEM TRA DEU XANH" -ForegroundColor Green }
else { Write-Host "$bad bo kiem tra co muc hong" -ForegroundColor Red }
