# Nexa Speed Deploy Script
# Usage: .\deploy.ps1 "your commit message"

param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

Write-Host "🚀 INITIALIZING NEXA SPEED DEPLOY..." -ForegroundColor Cyan

# 1. GIT SYNC
Write-Host "📦 Syncing with Git..." -ForegroundColor Yellow
git add .
git commit -m "$msg"
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git sync failed. Aborting." -ForegroundColor Red
    exit
}

# 2. BUILD
Write-Host "🏗️ Creating Production Build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit
}

# 3. FIREBASE DEPLOY
Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy

Write-Host "✅ MISSION ACCOMPLISHED. SITE IS LIVE!" -ForegroundColor Green
