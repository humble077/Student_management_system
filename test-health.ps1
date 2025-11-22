# PowerShell health check test script

Write-Host "Testing Student Management System Health Endpoint..." -ForegroundColor Green
Write-Host ""

# Test health endpoint
Write-Host "1. Testing /health endpoint:" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
    $healthResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test metrics endpoint
Write-Host "2. Testing /metrics endpoint:" -ForegroundColor Yellow
try {
    $metricsResponse = Invoke-WebRequest -Uri "http://localhost:3000/metrics" -Method Get
    $metricsResponse.Content.Split("`n")[0..19] | ForEach-Object { Write-Host $_ }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test API endpoint
Write-Host "3. Testing /api/students endpoint:" -ForegroundColor Yellow
try {
    $apiResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/students" -Method Get
    $apiResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "Health check complete!" -ForegroundColor Green

