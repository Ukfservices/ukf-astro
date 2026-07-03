# ============================================================
# UKF Services - Install GTM on all HTML pages
# Run: powershell -ExecutionPolicy Bypass -File .\Install-GTM.ps1
# ============================================================

$rootPath = "C:\ukf-services-site"
$gtmHead  = @"
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PXLFJJD3');</script>
<!-- End Google Tag Manager -->
"@

$gtmBody  = @"
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PXLFJJD3"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
"@

$ga4Pattern = '(?s)<!-- Google tag \(gtag\.js\) -->.*?</script>'

$files = Get-ChildItem -Path $rootPath -Filter "*.html" -Recurse
$total = $files.Count
$modified = 0
$skipped = 0

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  UKF Services - GTM Installer" -ForegroundColor Cyan
Write-Host "  Found $total HTML files" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $changed = $false
    $relativePath = $file.FullName.Replace($rootPath + "\", "")

    # Skip if GTM head snippet already present
    if ($content -match "GTM-PXLFJJD3") {
        Write-Host "  [SKIP]   $relativePath  -- GTM already present" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    # Remove hardcoded GA4 tag
    if ($content -match $ga4Pattern) {
        $content = [regex]::Replace($content, $ga4Pattern, "")
        Write-Host "  [GA4]    $relativePath  -- Removed hardcoded GA4 tag" -ForegroundColor Yellow
        $changed = $true
    }

    # Insert GTM head snippet immediately after <head>
    if ($content -match "(?i)<head[^>]*>") {
        $content = $content -replace "(?i)(<head[^>]*>)", "`$1`n$gtmHead"
        $changed = $true
    } else {
        Write-Host "  [WARN]   $relativePath  -- No <head> tag found, skipping" -ForegroundColor Red
        continue
    }

    # Insert GTM body snippet immediately after <body>
    if ($content -match "(?i)<body[^>]*>") {
        $content = $content -replace "(?i)(<body[^>]*>)", "`$1`n$gtmBody"
        $changed = $true
    } else {
        Write-Host "  [WARN]   $relativePath  -- No <body> tag found, skipping body snippet" -ForegroundColor Red
    }

    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  [DONE]   $relativePath" -ForegroundColor Green
        $modified++
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Modified : $modified files" -ForegroundColor Green
Write-Host "  Skipped  : $skipped files (GTM already present)" -ForegroundColor DarkGray
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Run .\Check-AnalyticsStack.ps1 to verify" -ForegroundColor Gray
Write-Host "  2. git add . && git commit -m 'Install GTM-PXLFJJD3, remove hardcoded GA4' && git push" -ForegroundColor Gray
Write-Host "  3. In GTM: add a GA4 Configuration tag with ID G-C679GLX8V8, trigger = All Pages" -ForegroundColor Gray
Write-Host ""
