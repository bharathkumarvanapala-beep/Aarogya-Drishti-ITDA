param(
    [Parameter(Mandatory=$false)]
    [string]$PythonCommand = "python",
    [Parameter(Mandatory=$false)]
    [string]$HfToken = $env:HF_TOKEN
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Aarogya Drishti - MedGemma 1.5 4B Environment Setup" -ForegroundColor Cyan
Write-Host "Foundation Model: google/medgemma-1.5-4b-it" -ForegroundColor Cyan
Write-Host "License: Health AI Developer Foundations (HAI-DEF)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$venvPath = ".local/ai-venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "[*] Creating Python virtual environment in $venvPath..." -ForegroundColor Yellow
    & $PythonCommand -m venv $venvPath
    if ($LASTEXITCODE -ne 0) { throw "Failed to create Python virtual environment." }
}

$venvPython = if ($IsWindows -or $env:OS -match "Windows") { "$venvPath/Scripts/python.exe" } else { "$venvPath/bin/python" }

Write-Host "[*] Upgrading pip and installing PyTorch, Transformers and dependencies..." -ForegroundColor Yellow
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install "torch>=2.2.0" "torchvision>=0.17.0" "transformers>=4.50.0" "accelerate>=0.30.0" "pillow>=10.0.0" "huggingface_hub>=0.23.0"
if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed." }

Write-Host "[*] Verifying MedGemma local inference script status..." -ForegroundColor Yellow
& $venvPython scripts/medgemma-inference.py --check
if ($LASTEXITCODE -ne 0) { throw "Model check failed." }

if ($HfToken) {
    Write-Host "[*] Downloading MedGemma 1.5 4B weights using provided token..." -ForegroundColor Yellow
    & $venvPython scripts/download-medgemma.py --token $HfToken
} else {
    Write-Host "[!] Note: Live weights download skipped because HF_TOKEN was not provided." -ForegroundColor DarkYellow
    Write-Host "    To download weights after accepting HAI-DEF terms at https://huggingface.co/google/medgemma-1.5-4b-it:" -ForegroundColor DarkYellow
    Write-Host "    powershell -File scripts/install-medgemma.ps1 -HfToken <your_token>" -ForegroundColor DarkYellow
}

Write-Host "[✓] MedGemma 1.5 4B environment preparation complete." -ForegroundColor Green

