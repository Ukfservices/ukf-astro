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

# --- Post-deploy link/redirect check (informational only, never blocks) ---
# Runs check-links.ps1 against the live site to catch broken redirects or
# article pages that 404/500. This never fails the deploy itself -- the
# deploy above has already completed successfully by this point. Any
# failures printed here are a signal to investigate, not a rollback trigger.
Write-Host "`nRunning post-deploy link check..." -ForegroundColor Cyan
Start-Sleep -Seconds 5   # brief pause for Cloudflare edge propagation
try {
    & "$PSScriptRoot\check-links.ps1"
} catch {
    Write-Host "Link check itself failed to run (this does not mean the deploy failed): $_" -ForegroundColor Yellow
}

