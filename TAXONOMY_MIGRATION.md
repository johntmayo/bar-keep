# Barkeep Taxonomy Migration Guide

## Overview
This migration refactors the cocktail taxonomy from a dual category/style system to a single Template + Tags system.

## New Schema

### Template (Required - One per recipe)
- `STIRRED_SPIRIT_FORWARD` - Martini/Manhattan/Negroni/Old Fashioned zone
- `SOUR` - Base + citrus + sweet
- `HIGHBALL_FIZZ` - Lengthened/bubbly drinks
- `TIKI_PUNCH` - Multi-ingredient, layered juice/syrup
- `CREAM_EGG` - Flips, nogs, creamy/eggy drinks
- `HOT` - Served warm/hot
- `TEMPLATE_UNCLASSIFIED` - Fallback (should be rare)

### Tags (Optional - Array of strings)
Tags are flexible and can overlap. Categories:
- **Vibe**: boozy, refreshing, bitter, tropical, rich, cozy_spiced, nightcap, brunch, dessert
- **Texture/Format**: sparkling, crushed_ice, up, rocks, blended
- **Ingredient/Feature**: coffee, chocolate, herbal, smoky, saline, citrus_forward, fruity
- **Classic/Era**: classic, modern
- **Internal**: iba (hidden, for IBA reference only)

## Migration Steps

1. **Run migration script**: `node migrate-taxonomy.js`
   - This will create `cocktails-migrated.json` with new schema
   - Review `cocktails-migrated-needs-review.json` for edge cases
   - Manually review and fix any unclassified recipes

2. **Update codebase**:
   - Replace `filters.categories` with `filters.templates`
   - Update filter UI to show templates
   - Add Quick Browse presets
   - Update curated collections to use template/tags

3. **Replace cocktails.json**:
   - Backup original: `cp cocktails.json cocktails.json.backup`
   - Replace: `cp cocktails-migrated.json cocktails.json`
   - Remove migration metadata fields (`_migration`) if desired

## Quick Browse Presets

These are implemented as saved filter sets:
- **Boozy**: template=STIRRED_SPIRIT_FORWARD OR tags includes 'boozy'
- **Refreshing**: tags includes 'refreshing'
- **Bitter / Amaro**: tags includes 'bitter'
- **Tropical**: template=TIKI_PUNCH OR tags includes 'tropical'
- **Dessert**: tags includes 'dessert'
- **Nightcap**: tags includes 'nightcap'
- **Sparkling**: tags includes 'sparkling'

## Breaking Changes

- `category` field removed (replaced by `template`)
- `style` field removed (replaced by `tags`)
- `ibaCategory` can be kept for reference but should not be used in UI (use `tags.includes('iba')` instead)

