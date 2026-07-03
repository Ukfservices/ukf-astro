# UKF Deploy Script — ukfservices
$ErrorActionPreference = "Stop"

# Load .env file if it exists
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
        }
    }
    Write-Host ".env loaded" -ForegroundColor DarkGray
}

Write-Host "Cleaning old builds..." -ForegroundColor Cyan
if (Test-Path "dist") { Remove-Item -Recurse -Force dist }
if (Test-Path ".astro") { Remove-Item -Recurse -Force .astro }
if (Test-Path ".wrangler") { Remove-Item -Recurse -Force .wrangler }

Write-Host "Building..." -ForegroundColor Cyan
npm run build

Write-Host "Preparing deploy files..." -ForegroundColor Cyan
if (Test-Path "dist\server\wrangler.json") { Remove-Item "dist\server\wrangler.json" }
if (Test-Path ".wrangler\deploy\config.json") { Remove-Item ".wrangler\deploy\config.json" }

Copy-Item "dist\server\entry.mjs" "dist\client\_worker.js"
Copy-Item "dist\server\virtual_astro_middleware.mjs" "dist\client\virtual_astro_middleware.mjs"
Copy-Item -Recurse -Force "dist\server\chunks" "dist\client\chunks"

Write-Host "Deploying to Cloudflare..." -ForegroundColor Cyan
npx wrangler pages deploy dist\client --project-name ukfservices --commit-dirty=true

Write-Host "Done!" -ForegroundColor Green
