# Migration Script Improvements

## Enhanced Classification Rules

The migration script now uses a multi-layered approach to classify recipes with much higher accuracy:

### 1. **Name-Based Classification (Highest Priority)**
The script now recognizes cocktail names and families:
- **Negroni riffs**: All variations (White Negroni, Mezcal Negroni, etc.) → `STIRRED_SPIRIT_FORWARD`
- **Manhattan riffs**: Brooklyn, Red Hook, Little Italy, Greenpoint, etc. → `STIRRED_SPIRIT_FORWARD`
- **Sour family**: Paper Plane, Last Word, Aviation, etc. → `SOUR` (even though stirred!)
- **Highball/Fizz**: Collins, Rickey, Spritz, Mule variations → `HIGHBALL_FIZZ`
- **Tiki**: Mai Tai, Zombie, Painkiller, etc. → `TIKI_PUNCH`
- **Cream/Egg**: Flips, Nogs, White Russian, etc. → `CREAM_EGG`
- **Hot**: Hot Toddy, Irish Coffee, etc. → `HOT`

### 2. **Improved Pattern Detection**

#### Spirit-Forward Detection
- Lowered threshold from 80% to 70% spirit volume
- Added recognition of Old Fashioned-style drinks (spirit + bitters + sugar, ≤4 ingredients)
- Expanded spirit keywords to include more amari and fortified wines
- Better handling of dashes/drops (don't count as significant volume)

#### Sour Detection
- **Stirred Sours**: Now correctly identifies Paper Plane, Last Word, Aviation, etc. as sours
- Detects equal-parts cocktails with citrus + liqueur/amaro
- Distinguishes between stirred sours and spirit-forward drinks

#### Tiki Detection
- Requires complex syrups (orgeat, falernum, etc.)
- Looks for 4+ ingredients with multiple juices
- Better rum detection

### 3. **Method-Based Refinement**
- Checks instructions for "stir" vs "shake"
- Uses method hints to refine classification
- Paper Plane and similar stirred sours are correctly identified

### 4. **Legacy Field Support**
- Uses old `style` and `category` fields as hints when name/pattern matching fails
- Helps with edge cases during migration

## Output Files

The script now generates:
1. **cocktails-migrated.json** - All recipes with new schema
2. **cocktails-migrated-needs-review.json** - Only truly unclassified recipes
3. **cocktails-migrated-low-confidence.json** - Medium confidence classifications for verification
4. **Console output** - Shows classification method breakdown

## Expected Results

With these improvements, you should see:
- **90%+ automatic classification** with high confidence
- **<10 recipes** needing manual review (mostly edge cases)
- **Name-based classification** for most common cocktails
- **Better handling** of Manhattan riffs, Negroni riffs, and stirred sours

## Running the Migration

```bash
node migrate-taxonomy.js
```

Review the output files:
- Check `needs-review.json` for unclassified recipes
- Optionally review `low-confidence.json` for verification
- The console will show which classification methods were used most

