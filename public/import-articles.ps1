$articles = @(
    @{slug="ai-air-freight-efficiency"; category="Air Freight"; image="blog-air.jpg"},
    @{slug="air-freight-vs-sea-freight"; category="Air Freight"; image="blog-air.jpg"},
    @{slug="article-fcl-vs-lcl"; category="Sea Freight"; image="blog-FCL-LCL.jpg"},
    @{slug="august-dubai-cargo-village"; category="Market Updates"; image="blog-jebel-ali.jpg"},
    @{slug="china-to-dubai-trade-lane-strategy"; category="Trade Lanes"; image="blog-china.jpg"},
    @{slug="coffee-journey-12000-miles"; category="Trade Lanes"; image="blog-coffee.jpg"},
    @{slug="customs-clearance-dubai"; category="Customs Clearance"; image="blog-customs.jpg"},
    @{slug="customs-clearance-electronics-uae"; category="Customs Clearance"; image="blog-electronics-customs.jpg"},
    @{slug="dubai-gold-shipment-new-york"; category="Trade Lanes"; image="blog-gold.jpg"},
    @{slug="dubai-jakarta-air-corridor"; category="Trade Lanes"; image="blog-dubai-jakarta-corridor.jpg"},
    @{slug="fcl-vs-lcl-shipping-the-2026-decision-framework"; category="Sea Freight"; image="blog-FCL-LCL.jpg"},
    @{slug="halal-logistics-gcc-indonesia"; category="Trade Lanes"; image="blog-halal.jpg"},
    @{slug="hormuz-crisis-2026-uae-freight"; category="Trade Disruption"; image="blog-Hormuz.jpg"},
    @{slug="how-to-read-a-freight-quote"; category="Customs Clearance"; image="blog-logistics.jpg"},
    @{slug="how-to-ship-from-dubai-to-the-uk-the-complete-2026-guide"; category="Trade Lanes"; image="blog-uk.jpg"},
    @{slug="indonesia-customs-red-lane-guide"; category="Customs Clearance"; image="blog-redline.jpg"},
    @{slug="jebel-ali-port-regulations-2024"; category="Market Updates"; image="blog-Port Regulations.jpg"},
    @{slug="jebel-ali-tanjung-priok-sea-freight"; category="Sea Freight"; image="blog-jakarta.jpg"},
    @{slug="july-uae-export-documents"; category="Customs Clearance"; image="blog-customs.jpg"},
    @{slug="optimize-air-freight-costs"; category="Air Freight"; image="blog-air.jpg"},
    @{slug="september-gcc-crossborder"; category="Trade Lanes"; image="blog-gcc-cross-border.jpg"},
    @{slug="september-jebel-ali-port"; category="Market Updates"; image="blog-jebel-ali.jpg"},
    @{slug="shipping-trends-2026"; category="Market Updates"; image="blog-shipping-trends.jpg"},
    @{slug="uae-china-trade-lane"; category="Trade Lanes"; image="blog-china.jpg"},
    @{slug="uae-customs-clearance-guide"; category="Customs Clearance"; image="blog-customs.jpg"},
    @{slug="uae-to-europe-trade-lane"; category="Trade Lanes"; image="blog-europe.jpg"},
    @{slug="uae-to-usa-trade-lane"; category="Trade Lanes"; image="blog-usa.jpg"},
    @{slug="uae-us-trade-corridor"; category="Trade Lanes"; image="blog-usa.jpg"},
    @{slug="vaccine_cold_chain_article"; category="Trade Lanes"; image="blog-logistics.jpg"}
)

foreach ($article in $articles) {
    $file = "articles\$($article.slug).html"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Extract title
        $title = ""
        if ($content -match '<title>([^|]+)\|') {
            $title = $matches[1].Trim()
        }
        
        # Extract description
        $excerpt = ""
        if ($content -match 'name="description" content="([^"]+)"') {
            $excerpt = $matches[1].Trim()
        }
        
        # Extract read time if present
        $readTime = "5 min read"
        if ($content -match '(\d+)\s*min\s*read') {
            $readTime = "$($matches[1]) min read"
        }
        
        # Clean for SQL
        $title = $title -replace "'", "''"
        $excerpt = $excerpt -replace "'", "''"
        $slug = $article.slug
        $category = $article.category
        $image = "/images/$($article.image)"
        
        $sql = "INSERT OR IGNORE INTO articles (title, slug, excerpt, category, image_url, read_time, published_date, featured, trending) VALUES ('$title', '$slug', '$excerpt', '$category', '$image', '$readTime', '2026-01-01', 0, 0);"
        
        Write-Host "Inserting: $title"
        wrangler d1 execute ukf-insights-db --remote --command $sql 2>$null
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Done! All articles imported."