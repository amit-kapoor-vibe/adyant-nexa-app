# Nexa Speed Deploy Script for Vercel (via Git Push)
# Usage: .\deploy.ps1 "your commit message"

param (
    [Parameter(Mandatory=$true)]
    [string]$msg
)

Write-Host "INITIALIZING NEXA VERCEL DEPLOY..." -ForegroundColor Cyan

# 1. BUILD CHECK
Write-Host "Validating Build locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Check errors above before pushing." -ForegroundColor Red
    exit
}

# 2. GIT SYNC & AUTO VERCEL DEPLOY
Write-Host "Syncing with Git (Triggers Vercel Auto-Deploy)..." -ForegroundColor Yellow
git add .
git commit -m "$msg"
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed. Check network or remote." -ForegroundColor Red
    exit
}

Write-Host "SUCCESS: Pushed to GitHub. Vercel is now deploying live!" -ForegroundColor Green
