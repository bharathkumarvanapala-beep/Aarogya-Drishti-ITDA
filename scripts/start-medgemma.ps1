$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$python = Join-Path $root '.local/medgemma-venv/Scripts/python.exe'
if (!(Test-Path $python)) { throw 'Create .local/medgemma-venv and install ai-service/requirements-demo.txt first.' }
Start-Process -FilePath $python -ArgumentList '-m uvicorn demo_api:app --host 127.0.0.1 --port 8002' -WorkingDirectory (Join-Path $root 'ai-service') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root '.local/medgemma.log') -RedirectStandardError (Join-Path $root '.local/medgemma-error.log')
Start-Process -FilePath $python -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8001' -WorkingDirectory (Join-Path $root 'ai-service') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root '.local/quality.log') -RedirectStandardError (Join-Path $root '.local/quality-error.log')
