# ==============================================================================
# POWERSHELL SETUP SCRIPT FOR AI-HRMS DEV ENVIRONMENT
# ==============================================================================

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Initializing AI-HRMS Development Environment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# --- Check Python Version ---
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "✔ Found Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✘ Python not found. Please install Python 3.12+" -ForegroundColor Red
    Exit
}

# --- Check Node.js Version ---
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✔ Found NodeJS: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✘ Node.js not found. Please install Node v18+" -ForegroundColor Red
    Exit
}

# --- Set Up Backend Environment ---
Write-Host "`nStep 1: Setting up Python Backend Virtual Environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.venv")) {
    python -m venv backend\.venv
    Write-Host "✔ Virtual environment created at backend\.venv" -ForegroundColor Green
} else {
    Write-Host "✔ Virtual environment already exists." -ForegroundColor Green
}

Write-Host "Installing Python Backend dependencies..." -ForegroundColor Yellow
& "backend\.venv\Scripts\pip" install -r backend\requirements.txt

# --- Set Up Frontend Environment ---
Write-Host "`nStep 2: Installing Next.js Frontend NPM Packages..." -ForegroundColor Yellow
Push-Location frontend
npm install
Pop-Location
Write-Host "✔ Frontend dependencies installed." -ForegroundColor Green

# --- Copy Environment Variables ---
Write-Host "`nStep 3: Creating Environment Configs..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host "✔ Created .env configuration file from example template." -ForegroundColor Green
} else {
    Write-Host "✔ .env file already exists." -ForegroundColor Green
}

Write-Host "`n=============================================" -ForegroundColor Green
Write-Host "Scaffolding Environment Setup Successful!" -ForegroundColor Green
Write-Host "To run the stack locally, run: docker compose up" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
