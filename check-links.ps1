# check-links.ps1
# Run manually after any deploy. Checks:
#   1. Every legacy redirect in src/middleware.ts actually 301s correctly
#   2. Every live article slug in D1 renders (200), not 404/500
#
# Usage: powershell -ExecutionPolicy Bypass -File check-links.ps1

$ErrorActionPreference = "Continue"
$baseUrl = "https://ukfservices.com"
$failCount = 0

Write-Host "`n=== Checking legacy redirects (from src/middleware.ts) ===" -ForegroundColor Cyan

# Keep this list in sync with the legacyRedirects map in src/middleware.ts.
# It's duplicated here deliberately -- this script has no way to parse the
# TypeScript file, so update both when you add a new redirect.
$redirects = @{
    "/articles/article-fcl-vs-lcl"              = "/articles/fcl-vs-lcl-shipping-the-2026-decision-framework"
    "/articles/gcc-cross-border-shipping-guide" = "/articles/september-gcc-crossborder"
    "/articles/uae-export-documents-guide"      = "/articles/july-uae-export-documents"
    "/articles/how-jebel-ali-port-works"        = "/articles/september-jebel-ali-port"
    "/articles/dubai-cargo-village-guide"       = "/articles/august-dubai-cargo-village"
    "/articles/shipping-trends-2025"            = "/articles/shipping-trends-2026"
    "/articles/logistics-process"               = "/insights"
    "/insights/uae-us-trade-corridor"           = "/articles/uae-us-trade-corridor"
    "/tools/fcl-lcl-calculator"                 = "/tools/fcl-lcl-calculator.html"
    "/articles/index.html"                      = "/insights"
}

foreach ($old in $redirects.Keys) {
    $expected = $redirects[$old]
    $url = "$baseUrl$old"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue -UseBasicParsing
        $status = $response.StatusCode
        $location = $response.Headers.Location
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        $location = $_.Exception.Response.Headers.Location
    }

    if ($status -eq 301 -and $location -eq $expected) {
        Write-Host "  OK   $old -> $location" -ForegroundColor Green
    } else {
        Write-Host "  FAIL $old  (got status $status, location '$location', expected 301 -> $expected)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n=== Checking live article slugs render (200, not 404/500) ===" -ForegroundColor Cyan
Write-Host "  (Run the wrangler command below to get current slugs, then paste them into `$slugs below, or run this section manually.)" -ForegroundColor DarkGray
Write-Host "  wrangler d1 execute ukf-insights-db --command `"SELECT slug FROM articles;`" --remote`n"

# Update this list after adding/removing articles (last synced 09/07/2026, 34 slugs)
$slugs = @(
    "ai-air-freight-efficiency",
    "air-freight-vs-sea-freight",
    "august-dubai-cargo-village",
    "batam-free-trade-zone-indonesia-dubai-corridor",
    "china-to-dubai-trade-lane-strategy",
    "coffee-journey-12000-miles",
    "customs-clearance-dubai",
    "customs-clearance-electronics-uae",
    "dubai-gold-shipment-new-york",
    "dubai-jakarta-air-corridor",
    "fcl-vs-lcl-shipping-the-2026-decision-framework",
    "flower-cold-chain-logistics-dubai",
    "france-perfume-oil-freight-dubai",
    "halal-logistics-gcc-indonesia",
    "hammour-cold-chain-oman-dubai",
    "hormuz-crisis-2026-uae-freight",
    "hormuz-rerouting-uae-shippers-2026",
    "how-to-read-a-freight-quote",
    "how-to-ship-from-dubai-to-the-uk-the-complete-2026-guide",
    "indonesia-customs-red-lane-guide",
    "jebel-ali-port-regulations-2024",
    "jebel-ali-tanjung-priok-sea-freight",
    "july-uae-export-documents",
    "optimize-air-freight-costs",
    "september-gcc-crossborder",
    "september-jebel-ali-port",
    "shipping-trends-2026",
    "spain-perfume-oil-freight-dubai",
    "uae-china-trade-lane",
    "uae-customs-clearance-guide",
    "uae-to-europe-trade-lane",
    "uae-to-usa-trade-lane",
    "uae-us-trade-corridor",
    "vaccine_cold_chain_article"
)

foreach ($slug in $slugs) {
    $url = "$baseUrl/articles/$slug"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop -UseBasicParsing
        $status = $response.StatusCode
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
    }

    if ($status -eq 200) {
        Write-Host "  OK   $slug" -ForegroundColor Green
    } else {
        Write-Host "  FAIL $slug  (status $status)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
if ($failCount -eq 0) {
    Write-Host "All checks passed." -ForegroundColor Green
} else {
    Write-Host "$failCount check(s) failed -- see above." -ForegroundColor Red
}
