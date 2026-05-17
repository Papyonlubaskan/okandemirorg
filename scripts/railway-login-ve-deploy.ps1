# Okan DEMIR Railway hesabi ile deploy (tek seferlik giris gerekir)
# PowerShell'de calistir: .\scripts\railway-login-ve-deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "1/4 Railway giris (tarayici acilacak - Okan DEMIR hesabi ile girin)..." -ForegroundColor Cyan
railway login

Write-Host "2/4 Proje secimi (okandemirorg / production servisi)..." -ForegroundColor Cyan
railway link

Write-Host "3/4 Deploy baslatiliyor..." -ForegroundColor Cyan
railway up --service web

Write-Host "4/4 GitHub secret guncelleme (Project Token olusturduysaniz)..." -ForegroundColor Cyan
Write-Host "Railway > Proje > Settings > Tokens > Project Token > gh secret set RAILWAY_TOKEN" -ForegroundColor Yellow
Write-Host "Tamamlandi." -ForegroundColor Green
