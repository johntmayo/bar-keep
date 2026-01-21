#!/bin/bash
# Barkeep Taxonomy Switchover Script
# This backs up the original and replaces it with the migrated version

echo "🔄 Barkeep Taxonomy Switchover"
echo ""

# Backup original
if [ -f "cocktails.json" ]; then
  echo "📦 Creating backup: cocktails.json.backup"
  cp cocktails.json cocktails.json.backup
  echo "✅ Backup created"
else
  echo "⚠️  Warning: cocktails.json not found"
fi

# Replace with migrated version
if [ -f "cocktails-migrated.json" ]; then
  echo "🔄 Replacing cocktails.json with migrated version..."
  cp cocktails-migrated.json cocktails.json
  echo "✅ Switchover complete!"
  echo ""
  echo "📊 New taxonomy is now active"
  echo "💾 Original saved as: cocktails.json.backup"
else
  echo "❌ Error: cocktails-migrated.json not found"
  exit 1
fi

