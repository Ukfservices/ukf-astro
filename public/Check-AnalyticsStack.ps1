# ============================================================
# UKF Services - Analytics Stack Verification
# Run: powershell -ExecutionPolicy Bypass -File .\Check-AnalyticsStack.ps1
# ============================================================

$site = "https://ukfservices.com"

$checks = @(
    @{ Name = "GA4";                Pattern = "G-C679GLX8V8";         Required = $true;  Note = ""                                              },
    @{ Name = "Google Tag Manager"; Pattern = "GTM-PXLFJJD3";         Required = $true;  Note = ""                                              },
    @{ Name = "Microsoft Clarity";  Pattern = "w4xr9gzhq6";           Required = $true;  Note = ""                                              },
    @{ Name = "HubSpot";            Pattern = "hs-scripts.com|_hsp";  Required = $false; Note = "Injected by GTM at runtime -- verify in DevTools (F12 > Network > hs-scripts)" }
)

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  UKF Services - Analytics Stack Check"     -ForegroundColor Cyan
Write-Host "  $site"                                    -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $site -UseBasicParsing -TimeoutSec 15
    $html = $response.Content

    foreach ($check in $checks) {
        $found = $html -match $check.Pattern
        $label = $check.Name.PadRight(25)

        if ($found) {
            Write-Host "  [FOUND]   $label" -ForegroundColor Green
        } elseif ($check.Required) {
            Write-Host "  [MISSING] $label  -- Expected, check the page source" -ForegroundColor Red
        } else {
            Write-Host "  [GTM]     $label  -- $($check.Note)" -ForegroundColor Cyan
        }
    }
}
catch {
    Write-Host "  ERROR: Could not reach $site" -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor DarkRed
}

Write-Host ""
Write-Host "Note: HubSpot is confirmed live via DevTools (js-eu1.hs-scripts.com loading)." -ForegroundColor DarkGray
Write-Host "Done." -ForegroundColor Gray
Write-Host ""
