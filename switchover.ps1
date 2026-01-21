# Barkeep Taxonomy Switchover Script (PowerShell)
# This backs up the original and replaces it with the migrated version

Write-Host "🔄 Barkeep Taxonomy Switchover" -ForegroundColor Cyan
Write-Host ""

# Backup original
if (Test-Path "cocktails.json") {
  Write-Host "📦 Creating backup: cocktails.json.backup" -ForegroundColor Yellow
  Copy-Item "cocktails.json" "cocktails.json.backup"
  Write-Host "✅ Backup created" -ForegroundColor Green
} else {
  Write-Host "⚠️  Warning: cocktails.json not found" -ForegroundColor Yellow
}

# Replace with migrated version
if (Test-Path "cocktails-migrated.json") {
  Write-Host "🔄 Replacing cocktails.json with migrated version..." -ForegroundColor Yellow
  Copy-Item "cocktails-migrated.json" "cocktails.json" -Force
  Write-Host "✅ Switchover complete!" -ForegroundColor Green
  Write-Host ""
  Write-Host "📊 New taxonomy is now active" -ForegroundColor Cyan
  Write-Host "💾 Original saved as: cocktails.json.backup" -ForegroundColor Gray
} else {
  Write-Host "❌ Error: cocktails-migrated.json not found" -ForegroundColor Red
  exit 1
}

