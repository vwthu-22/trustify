# LibreTranslate Docker Management Script
# Usage: .\libretranslate.ps1 [start|stop|restart|status|logs]

param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'restart', 'status', 'logs', 'help')]
    [string]$Command = 'help'
)

$ComposeFile = "docker-compose.libretranslate.yml"
$ServiceUrl = "http://localhost:5001"

function Show-Help {
    Write-Host "🌐 LibreTranslate Docker Management" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\libretranslate.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start    - Start LibreTranslate container"
    Write-Host "  stop     - Stop LibreTranslate container"
    Write-Host "  restart  - Restart LibreTranslate container"
    Write-Host "  status   - Check container status"
    Write-Host "  logs     - View container logs"
    Write-Host "  help     - Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\libretranslate.ps1 start"
    Write-Host "  .\libretranslate.ps1 logs"
}

function Start-LibreTranslate {
    Write-Host "🚀 Starting LibreTranslate..." -ForegroundColor Cyan
    docker-compose -f $ComposeFile up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ LibreTranslate started successfully!" -ForegroundColor Green
        Write-Host "📍 Access at: $ServiceUrl" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 Update your .env.local:" -ForegroundColor Cyan
        Write-Host "   LIBRE_TRANSLATE_URL=http://localhost:5001" -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to start LibreTranslate" -ForegroundColor Red
        Write-Host "💡 Make sure Docker Desktop is running" -ForegroundColor Yellow
    }
}

function Stop-LibreTranslate {
    Write-Host "🛑 Stopping LibreTranslate..." -ForegroundColor Cyan
    docker-compose -f $ComposeFile down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ LibreTranslate stopped successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to stop LibreTranslate" -ForegroundColor Red
    }
}

function Restart-LibreTranslate {
    Write-Host "🔄 Restarting LibreTranslate..." -ForegroundColor Cyan
    docker-compose -f $ComposeFile restart
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ LibreTranslate restarted successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to restart LibreTranslate" -ForegroundColor Red
    }
}

function Show-Status {
    Write-Host "📊 LibreTranslate Status:" -ForegroundColor Cyan
    docker-compose -f $ComposeFile ps
    
    Write-Host ""
    Write-Host "🔍 Testing connection to $ServiceUrl..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $ServiceUrl -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ LibreTranslate is running and accessible!" -ForegroundColor Green
    } catch {
        Write-Host "❌ LibreTranslate is not accessible" -ForegroundColor Red
        Write-Host "💡 Try running: .\libretranslate.ps1 start" -ForegroundColor Yellow
    }
}

function Show-Logs {
    Write-Host "📜 LibreTranslate Logs (Ctrl+C to exit):" -ForegroundColor Cyan
    docker-compose -f $ComposeFile logs -f
}

# Main execution
switch ($Command) {
    'start'   { Start-LibreTranslate }
    'stop'    { Stop-LibreTranslate }
    'restart' { Restart-LibreTranslate }
    'status'  { Show-Status }
    'logs'    { Show-Logs }
    'help'    { Show-Help }
    default   { Show-Help }
}
