# Quet secret + bug pattern JS truoc khi push. Chay local (repo nay khong co CI).
#   .\security-check.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== gitleaks (secret scan) ===" -ForegroundColor Cyan
& gitleaks detect --source $root -v --redact
if ($LASTEXITCODE -ne 0) { Write-Host "gitleaks: co finding, xem log tren" -ForegroundColor Red }
else { Write-Host "gitleaks: PASS" -ForegroundColor Green }

Write-Host ""
Write-Host "=== semgrep (JS security patterns: assets, gd01, gd02, tools, build-artifact.mjs) ===" -ForegroundColor Cyan
& semgrep --config auto assets gd01 gd02 tools build-artifact.mjs
if ($LASTEXITCODE -ne 0) { Write-Host "semgrep: co finding, xem log tren (baseline hien co: assets/reco.js, xem AGENTS.md)" -ForegroundColor Yellow }
else { Write-Host "semgrep: PASS" -ForegroundColor Green }
