# push-all-repos.ps1
# Creates GitHub repos and pushes all portfolio projects for manikandan-santhosh
# Run AFTER: gh auth login

$GH_USER = "monkey-d-luffy9888888"

$projects = @(
    @{
        folder = "ADM-Retail(work)"
        repo   = "adm-retail-platform"
        desc   = "Full-stack retail data management platform with AI product enrichment, taxonomy classification, and Shopify integration"
        topics = "python,nodejs,react,mongodb,fastapi,google-gemini,aws,retail,ai"
    },
    @{
        folder = "AI_Trading_Extension_Complete (2)"
        repo   = "ai-trading-extension"
        desc   = "Chrome extension for real-time candlestick pattern detection and AI trade recommendations using Binance API"
        topics = "chrome-extension,python,flask,binance,trading,javascript,technical-analysis"
    },
    @{
        folder = "RS_PRO angler changor_Consolide_Script"
        repo   = "rspro-scraper-consolidator"
        desc   = "Python utility that transforms multi-category web scraper output into standardized ODS spreadsheets"
        topics = "python,pandas,web-scraping,data-transformation,spreadsheet"
    },
    @{
        folder = "docx to pdf convertor"
        repo   = "docx-pdf-converter"
        desc   = "Cross-platform FastAPI service for batch DOCX-to-PDF and PDF-to-DOCX conversion with a web UI"
        topics = "python,fastapi,pdf,docx,document-conversion,api"
    },
    @{
        folder = "dtlp_extension (v.2)"
        repo   = "dtlp-data-extraction-extension"
        desc   = "Chrome extension for AI-powered structured product data extraction using Perplexity and Google Gemini"
        topics = "chrome-extension,javascript,ai,google-gemini,perplexity,data-extraction,indexeddb"
    },
    @{
        folder = "excel-auditor-pro (final)"
        repo   = "excel-auditor-pro"
        desc   = "React app for AI-powered Excel spreadsheet quality auditing with Google Gemini and exportable reports"
        topics = "react,typescript,vite,google-gemini,excel,ai,data-quality,audit"
    },
    @{
        folder = "ocr-pdf-analyzer-complete (1410)"
        repo   = "ocr-pdf-analyzer"
        desc   = "Full-stack tool for extracting technical specifications from PDF drawings using OCR (Tesseract + pdf-parse)"
        topics = "nodejs,express,javascript,ocr,tesseract,pdf,data-extraction"
    },
    @{
        folder = "pasternack web scraping without html link_220526"
        repo   = "pasternack-product-scraper"
        desc   = "Python CLI scraper that reads Excel part numbers, searches Pasternack's website, and fills product data back into the sheet"
        topics = "python,web-scraping,beautifulsoup4,pandas,excel,automation"
    }
)

$baseDir = "d:\Protfolio"
$successCount = 0
$failCount = 0

foreach ($p in $projects) {
    $fullPath = Join-Path $baseDir $p.folder
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Project: $($p.repo)" -ForegroundColor Yellow
    Write-Host "Folder:  $($p.folder)" -ForegroundColor Gray

    if (-not (Test-Path $fullPath)) {
        Write-Host "ERROR: Folder not found — skipping" -ForegroundColor Red
        $failCount++
        continue
    }

    Push-Location $fullPath

    # Init git if not already
    if (-not (Test-Path ".git")) {
        git init -b main | Out-Null
        Write-Host "  git init done" -ForegroundColor Green
    } else {
        Write-Host "  git already initialized" -ForegroundColor Gray
    }

    # Stage all files
    git add .
    $staged = git diff --cached --name-only | Measure-Object -Line
    Write-Host "  Staged $($staged.Lines) files" -ForegroundColor Green

    # Commit
    $commitMsg = "Initial commit: $($p.repo)"
    git commit -m $commitMsg --allow-empty 2>&1 | Out-Null
    Write-Host "  Committed" -ForegroundColor Green

    # Create GitHub repo and push
    Write-Host "  Creating GitHub repo..." -ForegroundColor Cyan
    $ghResult = gh repo create $p.repo `
        --public `
        --description $p.desc `
        --source=. `
        --remote=origin `
        --push 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  PUSHED: https://github.com/$GH_USER/$($p.repo)" -ForegroundColor Green

        # Add topics
        gh repo edit "$GH_USER/$($p.repo)" --add-topic $p.topics.Split(",")[0] 2>&1 | Out-Null

        $successCount++
    } else {
        Write-Host "  ERROR: $ghResult" -ForegroundColor Red
        $failCount++
    }

    Pop-Location
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Done! Success: $successCount  Failed: $failCount" -ForegroundColor Yellow
Write-Host "`nView your repos at: https://github.com/$GH_USER?tab=repositories" -ForegroundColor Cyan
