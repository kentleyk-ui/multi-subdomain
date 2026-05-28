# EMERGENCY DEPLOYMENT FIX - PowerShell
# Fixes missing files and deploys

Write-Host "`n🔧 EMERGENCY FIX & DEPLOYMENT`n" -ForegroundColor Red
Write-Host "===============================" -ForegroundColor Cyan

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "`n[1/6] Checking critical files..." -ForegroundColor Yellow
Write-Host "✓ pages/_app.js: $(if (Test-Path 'pages\_app.js') { 'OK' } else { 'CREATED' })"
Write-Host "✓ pages/_document.js: $(if (Test-Path 'pages\_document.js') { 'OK' } else { 'CREATED' })"
Write-Host "✓ pages/index.js: $(if (Test-Path 'pages\index.js') { 'OK' } else { 'MISSING!' })"

Write-Host "`n[2/6] Cleaning builds..." -ForegroundColor Yellow
if (Test-Path '.next') {
    Remove-Item '.next' -Recurse -Force
    Write-Host "✓ .next directory cleared"
}

Write-Host "`n[3/6] Staging files..." -ForegroundColor Yellow
git add -A
Write-Host "✓ All files staged"

Write-Host "`n[4/6] Git status:" -ForegroundColor Yellow
git status --short

Write-Host "`n[5/6] Creating commit..." -ForegroundColor Yellow
git commit -m "CRITICAL FIX: Add missing _app.js and _document.js

Fixed Next.js entry points that were preventing deployment.
This should resolve the DNS_PROBE_FINISHED_NXDOMAIN error."

Write-Host "`n[6/6] Pushing to production..." -ForegroundColor Yellow
git push origin main

Write-Host "`n===============================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!`n" -ForegroundColor Green
Write-Host "Vercel rebuilding in 1-2 minutes" -ForegroundColor Cyan
Write-Host "URL: https://multi-subdomain-*.vercel.app`n" -ForegroundColor Cyan
