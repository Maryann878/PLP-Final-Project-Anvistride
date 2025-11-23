# PowerShell script for Windows
# Dev script: Docker backend + local frontend

$ErrorActionPreference = "Stop"

# ========================
# Color output function
# ========================
function Write-Color($Text, $Color='White') {
    $originalColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $Color
    Write-Output $Text
    $Host.UI.RawUI.ForegroundColor = $originalColor
}

# ========================
# Cleanup function
# ========================
$frontendProcess = $null
function Cleanup {
    Write-Color "`n🛑 Shutting down..." Yellow

    if ($frontendProcess -and !$frontendProcess.HasExited) {
        Write-Color "Stopping frontend..." Cyan
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }

    Write-Color "🐳 Stopping Docker containers..." Cyan
    Set-Location server
    docker-compose down
    Set-Location ..
    Write-Color "✅ Cleanup complete" Green
    exit 0
}

# Register cleanup events
Register-EngineEvent PowerShell.Exiting -Action { Cleanup } | Out-Null
$null = Register-ObjectEvent -InputObject ([System.Console]) -EventName CancelKeyPress -Action { Cleanup }

# ========================
# Check Docker
# ========================
try {
    docker ps | Out-Null
} catch {
    Write-Color "❌ Docker is not running. Please start Docker Desktop first." Red
    exit 1
}

# ========================
# Start Docker containers
# ========================
Write-Color "🐳 Starting Docker containers..." Cyan
Set-Location server
docker-compose up -d
Set-Location ..

# ========================
# Wait for backend
# ========================
Write-Color "⏳ Waiting for backend to be ready..." Yellow
node scripts/wait-for-backend.js
if ($LASTEXITCODE -ne 0) {
    Write-Color "❌ Backend failed to start" Red
    Cleanup
}

# ========================
# Start frontend
# ========================
Write-Color "`n🚀 Starting frontend dev server..." Cyan
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev", "-w", "client" -NoNewWindow -PassThru

Write-Color "`n✨ Development environment is ready!" Green
Write-Output "   Frontend: http://localhost:5173"
Write-Output "   Backend:  http://localhost:5000"
Write-Color "`nPress Ctrl+C to stop all services" Yellow

# ========================
# Wait for frontend process
# ========================
try {
    Wait-Process -Id $frontendProcess.Id
} catch {
    # Frontend terminated unexpectedly
}

Cleanup
