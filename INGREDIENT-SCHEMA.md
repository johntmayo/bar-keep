# Ingredient Schema — Functional Properties Layer
### The Architecture of the Glass — v1

---

## Overview

The current ingredient database is strong on identity — names, aliases, descriptions, and category placement are thorough and well-written. What it is missing is a **functional properties layer**: structured fields that tell the classification system what role any given ingredient can play in a drink.

Without this layer, the database cannot support automated or semi-automated drink family classification. A classification engine cannot tell that sweet vermouth is a candidate co-base for the Aromatized family, or that Campari is a structural bitter for the Bitter Aromatized family, or that lemon juice is a sour acid — not from the current data.

This document defines the new fields to add to every ingredient record, organized by type.

The governing principle mirrors the drink taxonomy:
> **An ingredient's functional properties describe what structural roles it can fill, not just what it tastes like.**

---

## What Is Not Changing

The existing fields are solid and should be preserved as-is:

| Field | Keep |
|---|---|
| `id` | Yes |
| `name` | Yes |
| `aliases` | Yes |
| `description` | Yes |
| `category` (top-level) | Yes |
| `subcategory` | Yes |

The new fields below are **additive only** — they sit alongside the existing fields, not replacing them.

---

## New Fields: Master Schema

Each ingredient record should gain the following fields. Not all fields apply to every ingredient — use `null` or omit where not applicable.

---

### `ingredient_type`

**Type:** Enum (single value)
**Required:** Yes

The ingredient's fundamental nature. This is not the same as the existing `category` field — it is a tighter classification used for structural matching.

**Allowed values:**

| Value | Covers |
|---|---|
| `base_spirit` | Distilled spirits: whiskey, gin, rum, vodka, tequila, mezcal, brandy, etc. |
| `aromatized_wine` | Vermouth, Lillet, Cocchi Americano, Dubonnet, Bonal, Byrrh, quinquinas |
| `fortified_wine` | Sherry, port, Madeira, Marsala, Pineau des Charentes |
| `bitter_modifier` | Campari, Aperol, Cynar, Suze, amari, Fernet, Select, Contratto |
| `herbal_liqueur` | Chartreuse, Bénédictine, Strega, Genevy, Jägermeister |
| `fruit_liqueur` | Maraschino, Chambord, cherry Heering, fruit crèmes |
| `orange_liqueur` | Cointreau, triple sec, Grand Marnier, curaçao |
| `nut_liqueur` | Amaretto, Frangelico, Nocino |
| `cream_liqueur` | Baileys, Mozart, crème de cacao, crème de menthe |
| `coffee_liqueur` | Kahlúa, Tia Maria, Mr Black |
| `floral_liqueur` | St-Germain, crème de violette, Parfait Amour |
| `other_liqueur` | Falernum, allspice dram, Drambuie, Licor 43 |
| `cocktail_bitters` | Angostura, Peychaud's, orange bitters, all dasher-format bitters |
| `sour_acid` | Lemon juice, lime juice, citric acid, verjuice |
| `juice` | Non-acid juices: OJ, pineapple, cranberry, tomato, grapefruit |
| `sweetener` | Simple syrup, demerara syrup, honey syrup, agave syrup, sugar |
| `flavored_syrup` | Orgeat, grenadine, falernum syrup, ginger syrup, passion fruit syrup |
| `carbonated_mixer` | Club soda, tonic water, ginger beer, cola, sparkling water |
| `dairy_egg` | Cream, egg white, egg yolk, whole egg, aquafaba |
| `sparkling_wine` | Champagne, Prosecco, Cava, sparkling rosé |
| `still_wine` | Dry white, red, rosé |
| `fresh_herb` | Mint, basil, rosemary, thyme |
| `fresh_citrus` | Whole lemons, limes, oranges, grapefruit — used for peel/twist/wedge |
| `fresh_fruit` | Strawberry, raspberry, pineapple, cucumber |
| `spice_savory` | Jalapeño, ginger root, horseradish, celery |
| `condiment` | Worcestershire, Tabasco, salt, brine |
| `garnish` | Cocktail cherry, olive, dehydrated citrus, edible flowers |
| `coffee_tea` | Espresso, cold brew, tea |
| `water` | Still water, ice (when specified as ingredient) |

---

### `structural_roles`

**Type:** Array of enums
**Required:** Yes (for all alcoholic and functional ingredients; `null` acceptable for pure garnishes)

The structural roles this ingredient **can** fill in a drink. This is the core field for classification. An ingredient can have multiple roles.

**Allowed values:**

| Role | Meaning | Example ingredients |
|---|---|---|
| `base` | Primary distilled spirit — the drink's alcoholic backbone | Gin, bourbon, rum, tequila, vodka |
| `co_base` | Aromatized or fortified wine sharing structural load with the base | Sweet vermouth, dry vermouth, Lillet Blanc, sherry |
| `structural_bitter` | A major bitter modifier that is load-bearing in a drink | Campari, Aperol, Cynar, Suze, Fernet |
| `structural_modifier` | A liqueur or other spirit whose flavor identity is structural, not incidental | Cointreau, Chartreuse, maraschino, Amaretto |
| `sweetener` | Provides sweetness as primary function | Simple syrup, demerara syrup, orgeat, honey syrup |
| `sour_acid` | Provides citric or comparable acidity | Lemon juice, lime juice |
| `lengthener` | Extends the drink without fundamentally changing its balance logic | Club soda, tonic water, ginger beer |
| `seasoning` | Used in dashes or small quantities to enhance, not define | Angostura bitters, Peychaud's, orange bitters, absinthe (rinse) |
| `texture_agent` | Contributes texture (foam, richness, weight) as a structural component | Egg white, whole egg, cream, aquafaba |
| `float` | Typically used as a final layer on top of a drink | Overproof rum, dark rum (float), cream (float) |
| `flavor_accent` | Used for flavor contribution in small quantities — not structural | Elderflower liqueur (in some builds), flavored syrups |
| `garnish` | Decorative or aromatic finish only | Cocktail cherry, olive, citrus twist |

---

### `can_be_structural_bitter`

**Type:** Boolean
**Required:** For all `bitter_modifier` and `herbal_liqueur` types

`true` if this ingredient is commonly used as a structural, load-bearing bitter in a drink (i.e., it qualifies a drink for the Bitter Aromatized family).
`false` if the ingredient is bitter but typically used as a seasoning or small modifier.

**Decision rule:** If an ingredient is typically measured in full ounces and its removal would collapse the drink's structural identity, `true`. If typically used in dashes or small sub-half-ounce quantities, `false`.

| Ingredient | Value | Reason |
|---|---|---|
| Campari | `true` | Full measure; structural in Negroni |
| Aperol | `true` | Full measure; structural in Paper Plane |
| Cynar | `true` | Full measure in Cynar-based builds |
| Suze | `true` | Full measure in White Negroni |
| Angostura Bitters | `false` | Measured in dashes; seasoning only |
| Peychaud's Bitters | `false` | Measured in dashes; seasoning only |
| Fernet Branca | `true` / borderline | Can be structural (Toronto) or finishing accent |
| Amaro Nonino | `true` | Structural in Paper Plane |
| Amaro Averna | `true` | Can anchor a Black Manhattan |

---

### `can_be_co_base`

**Type:** Boolean
**Required:** For all `aromatized_wine`, `fortified_wine`, and `bitter_modifier` types

`true` if this ingredient is commonly used as a genuine structural co-base alongside a base spirit (qualifying a drink for the Aromatized or Bitter Aromatized family).

| Ingredient | Value |
|---|---|
| Sweet vermouth | `true` |
| Dry vermouth | `true` |
| Blanc vermouth | `true` |
| Lillet Blanc | `true` |
| Cocchi Americano | `true` |
| Fino sherry | `true` |
| Bonal | `true` |
| Byrrh | `true` |
| Ruby port | `false` (accent only in most builds) |
| PX sherry | `false` (sweetener/accent only) |

---

### `bitterness_level`

**Type:** Enum
**Required:** For `bitter_modifier`, `herbal_liqueur`, `aromatized_wine`, `cocktail_bitters`

A relative bitterness classification for sorting within the bitter taxonomy.

**Allowed values:** `low` · `medium` · `high` · `very_high`

| Ingredient | Value |
|---|---|
| Aperol | `low` |
| Amaro Montenegro | `low` |
| Campari | `medium` |
| Cynar | `medium` |
| Suze | `medium` |
| Fernet Branca | `very_high` |
| Angostura Bitters | `high` (concentrated; used in dashes) |

---

### `sweetness_level`

**Type:** Enum
**Required:** For `sweetener`, `flavored_syrup`, `fruit_liqueur`, `orange_liqueur`, `cream_liqueur`, and `bitter_modifier` types

**Allowed values:** `dry` · `off_dry` · `medium` · `sweet` · `very_sweet`

| Ingredient | Value |
|---|---|
| Dry vermouth | `dry` |
| Campari | `off_dry` |
| Sweet vermouth | `medium` |
| Cointreau | `sweet` |
| Crème de cassis | `very_sweet` |
| Simple syrup | `very_sweet` |

---

### `acid_level`

**Type:** Enum
**Required:** For `sour_acid` and `juice` types

**Allowed values:** `none` · `low` · `medium` · `high` · `very_high`

| Ingredient | Value |
|---|---|
| Orange juice | `low` |
| Grapefruit juice | `medium` |
| Lemon juice | `high` |
| Lime juice | `very_high` |

---

### `abv_range`

**Type:** Object with `min` and `max` (floats, 0.0–1.0)
**Required:** For all alcoholic ingredients

Approximate ABV range expressed as a decimal. Used to calculate approximate drink strength for experience tags like `boozy` or `low_abv`.

| Ingredient | `min` | `max` |
|---|---|---|
| Club soda | `0.0` | `0.0` |
| Aperol | `0.11` | `0.11` |
| Cointreau | `0.40` | `0.40` |
| Campari | `0.25` | `0.25` |
| Sweet vermouth | `0.15` | `0.18` |
| London Dry Gin | `0.40` | `0.47` |
| Overproof rum | `0.57` | `0.75` |

---

### `flavor_profile`

**Type:** Array of strings (from controlled vocabulary)
**Required:** Yes for all non-garnish, non-water ingredients

**Controlled vocabulary:**

`bitter` · `sweet` · `sour` · `salty` · `umami` · `herbal` · `floral` · `fruity` · `citrus` · `tropical` · `nutty` · `smoky` · `spiced` · `earthy` · `oxidative` · `coffee` · `chocolate` · `anise` · `mint` · `vegetal` · `savory` · `woody` · `caramel` · `vanilla`

---

### `texture_contribution`

**Type:** Enum
**Required:** For `dairy_egg`, `juice`, `flavored_syrup` types

How this ingredient affects a drink's texture and body.

**Allowed values:** `none` · `thins` · `neutral` · `adds_body` · `adds_richness` · `adds_foam` · `adds_viscosity`

| Ingredient | Value |
|---|---|
| Club soda | `thins` |
| Pineapple juice | `adds_body` |
| Egg white | `adds_foam` |
| Cream | `adds_richness` |
| Orgeat | `adds_viscosity` |

---

### `usage_type`

**Type:** Enum
**Required:** Yes

How this ingredient is characteristically measured and used in recipes.

**Allowed values:**

| Value | Meaning | Examples |
|---|---|---|
| `measured_full` | Measured in oz/ml; primary ingredient | Spirits, vermouth, citrus juice |
| `measured_small` | Measured in small quantities (¼ oz or less, or barspoons) | Absinthe, maraschino, grenadine in some builds |
| `dashes` | Measured in dashes | All cocktail bitters |
| `rinse` | Used as a rinse only | Absinthe (Sazerac) |
| `float` | Poured as a float on top | Overproof rum float, cream float |
| `garnish` | Decorative/aromatic only | Cherry, olive, twist |
| `muddled` | Used by muddling | Fresh mint, fresh lime, cucumber |
| `top` | Used to top up a drink | Sparkling wine, soda |

---

### `family_signals`

**Type:** Array of enums
**Required:** For all alcoholic ingredients and sour acids

The drink families this ingredient's presence is a positive signal for. This is the key lookup field for classification assistance.

**Allowed values:** The 10 family IDs:
`old_fashioned` · `aromatized` · `bitter_aromatized` · `sour` · `daisy` · `enhanced_sour` · `collins` · `highball` · `rich_creamy` · `tropical_punch`

| Ingredient | `family_signals` |
|---|---|
| Bourbon | `["old_fashioned", "aromatized", "bitter_aromatized", "sour", "daisy", "enhanced_sour", "collins", "highball"]` |
| Sweet vermouth | `["aromatized", "bitter_aromatized"]` |
| Dry vermouth | `["aromatized", "bitter_aromatized"]` |
| Campari | `["bitter_aromatized"]` |
| Lemon juice | `["sour", "daisy", "enhanced_sour", "collins"]` |
| Lime juice | `["sour", "daisy", "enhanced_sour", "collins", "tropical_punch"]` |
| Cointreau | `["daisy", "enhanced_sour"]` |
| Green Chartreuse | `["enhanced_sour"]` |
| Club soda | `["collins", "highball"]` |
| Ginger beer | `["highball"]` |
| Egg white | `["sour", "rich_creamy"]` |
| Whole egg | `["rich_creamy"]` |
| Heavy cream | `["rich_creamy"]` |
| Orgeat | `["tropical_punch"]` |
| Falernum | `["tropical_punch"]` |

---

### `substitute_ids`

**Type:** Array of ingredient IDs
**Required:** No (editorial field)

IDs of ingredients that can substitute for this one in most builds. Used for "Can Make" / "Almost Make" logic.

| Ingredient | Substitutes |
|---|---|
| Cointreau | `["triple-sec", "orange-curacao", "grand-marnier"]` |
| Campari | `["aperol", "select-aperitivo", "contratto-bitter"]` |
| Angostura Bitters | `["aromatic-bitters"]` |
| Sweet vermouth | `["punt-e-mes"]` (in a pinch; flavor shifts significantly) |

---

### `cocktail_quality_tier`

**Type:** Enum
**Required:** Yes

A rough classification of the ingredient's typical use context. Used to flag ingredients like Fireball that are correctly in the database but should not surface in serious cocktail recommendations.

**Allowed values:**

| Value | Meaning |
|---|---|
| `craft` | Standard cocktail bar ingredient; used in serious builds |
| `classic` | Specifically a historical or canonical cocktail ingredient |
| `casual` | Common in casual or home bar settings; not typically in craft builds |
| `novelty` | Novelty or flavored product; rarely in serious cocktail recipes |

| Ingredient | Tier |
|---|---|
| Angostura Bitters | `classic` |
| Campari | `craft` |
| Sweet vermouth | `craft` |
| Peach Schnapps | `casual` |
| Fireball Cinnamon Whiskey | `novelty` |
| Midori | `casual` |
| Blue Curaçao | `casual` |

---

## Duplicate and Misclassification Fixes

These should be resolved alongside the schema migration:

| Issue | Affected Records | Resolution |
|---|---|---|
| Bonal appears in both `amari` and `aromatized_wines` | `bonal-gentiane-quina` (amari) and `bonal` (aromatized_wines) | Keep one canonical record under `aromatized_wines`; add `bitter_modifier` as a secondary signal via `family_signals`; remove duplicate |
| Absinthe appears in both `other-spirits` and `herbal-liqueurs` as `absinthe-verte` | `absinthe` and `absinthe-verte` | Canonicalize under `other-spirits`; remove duplicate; add `usage_type: rinse` and `usage_type: measured_small` as allowed values |
| Fireball in whiskey subcategory | `fireball-cinnamon-whiskey` | Move to a new `flavored_spirits` subcategory under spirits, or remain in whiskey with `cocktail_quality_tier: novelty` |
| `select-bitter` duplicates `select-aperitivo` | `select-bitter` | Alias only; remove as standalone record |
| `ancho-reyes` appears twice under `herbal-liqueurs` and `other-liqueurs` | `ancho-chile-liqueur` and `ancho-reyes` | Keep one record; add both names as aliases |

---

## Subcategory Refinement for Amari

The current `amari` subcategory conflates several meaningfully distinct ingredient types. For classification purposes, the following internal split is recommended — using the new `ingredient_type` field rather than restructuring the JSON, so the change is non-breaking:

| Current subcategory | Ingredients | Recommended `ingredient_type` |
|---|---|---|
| Amari & Bitter Liqueurs | Fernet, Averna, Nonino, Meletti, Nardini, Braulio, Zucca, Ramazzotti | `bitter_modifier` |
| Amari & Bitter Liqueurs | Campari, Aperol, Select, Contratto, Cappelletti | `bitter_modifier` (aperitivo subtype) |
| Amari & Bitter Liqueurs | Suze, Amer Picon, Luxardo Bitter Bianco | `bitter_modifier` |
| Amari & Bitter Liqueurs | Bonal, Byrrh, Cardamaro | `aromatized_wine` (move or dual-tag) |
| Amari & Bitter Liqueurs | Italicus | `floral_liqueur` (move; not a bitter) |

This does not require restructuring the JSON category hierarchy. The `ingredient_type` field carries the functional distinction; the existing category grouping can remain as a user-facing organizational choice.

---

## Example: Updated Record

Here is what a fully populated ingredient record looks like under the new schema:

```json
{
  "id": "campari",
  "name": "Campari",
  "aliases": ["campari bitter"],
  "description": "Bright red Italian bitter with herbal and citrus notes. Defines Negronis and Americanos.",
  "ingredient_type": "bitter_modifier",
  "structural_roles": ["structural_bitter", "flavor_accent"],
  "can_be_structural_bitter": true,
  "can_be_co_base": false,
  "bitterness_level": "medium",
  "sweetness_level": "off_dry",
  "abv_range": { "min": 0.245, "max": 0.245 },
  "flavor_profile": ["bitter", "herbal", "citrus", "fruity"],
  "texture_contribution": "neutral",
  "usage_type": "measured_full",
  "family_signals": ["bitter_aromatized"],
  "substitute_ids": ["aperol", "select-aperitivo", "contratto-bitter", "cappelletti-aperitivo"],
  "cocktail_quality_tier": "craft"
}
```

```json
{
  "id": "sweet-vermouth",
  "name": "Sweet Vermouth",
  "aliases": ["red vermouth", "rosso vermouth"],
  "description": "Red vermouth with herbal, spiced sweetness. Core of Manhattans and Negronis.",
  "ingredient_type": "aromatized_wine",
  "structural_roles": ["co_base"],
  "can_be_structural_bitter": false,
  "can_be_co_base": true,
  "bitterness_level": "low",
  "sweetness_level": "medium",
  "abv_range": { "min": 0.15, "max": 0.18 },
  "flavor_profile": ["herbal", "sweet", "spiced", "fruity", "bitter"],
  "texture_contribution": "adds_body",
  "usage_type": "measured_full",
  "family_signals": ["aromatized", "bitter_aromatized"],
  "substitute_ids": ["punt-e-mes", "blanc-vermouth"],
  "cocktail_quality_tier": "craft"
}
```

```json
{
  "id": "lemon-juice",
  "name": "Lemon Juice",
  "aliases": ["fresh lemon"],
  "description": "Tart, high-acid citrus juice with clean sharpness. Used in sours, fizzes, and shaken builds to cut sweetness and add structure.",
  "ingredient_type": "sour_acid",
  "structural_roles": ["sour_acid"],
  "can_be_structural_bitter": false,
  "can_be_co_base": false,
  "acid_level": "high",
  "sweetness_level": "dry",
  "abv_range": { "min": 0.0, "max": 0.0 },
  "flavor_profile": ["sour", "citrus"],
  "texture_contribution": "neutral",
  "usage_type": "measured_full",
  "family_signals": ["sour", "daisy", "enhanced_sour", "collins"],
  "cocktail_quality_tier": "craft"
}
```

---

## Field Summary Table

| Field | Type | Required | Purpose |
|---|---|---|---|
| `ingredient_type` | Enum | Yes | Fundamental nature of the ingredient |
| `structural_roles` | Array | Yes* | What structural roles it can fill |
| `can_be_structural_bitter` | Boolean | For bitter types | Flags load-bearing bitter vs. seasoning |
| `can_be_co_base` | Boolean | For aromatized/fortified | Flags genuine co-base vs. accent |
| `bitterness_level` | Enum | For bitter types | Relative bitterness for sorting/filtering |
| `sweetness_level` | Enum | For sweet/modifier types | Relative sweetness |
| `acid_level` | Enum | For acid types | Relative acidity |
| `abv_range` | Object | Yes (alcoholic) | Min/max ABV for strength estimation |
| `flavor_profile` | Array | Yes | Flavor descriptors from controlled vocab |
| `texture_contribution` | Enum | For relevant types | How ingredient affects drink texture |
| `usage_type` | Enum | Yes | How it is characteristically measured/used |
| `family_signals` | Array | Yes (alcoholic) | Which drink families this signals |
| `substitute_ids` | Array | No | Substitutes for Can Make logic |
| `cocktail_quality_tier` | Enum | Yes | Craft / classic / casual / novelty |

---

## Agent Instructions

When populating these fields for all 300 ingredients:

1. **Start with `ingredient_type`** — this is the most important field and should be assigned first. When in doubt, use the ingredient's most common structural role in classic cocktails, not its edge cases.

2. **`structural_roles` should be plural where genuinely applicable**, but err toward fewer roles per ingredient. An ingredient that can theoretically do many things but is almost always used one way should reflect its typical use.

3. **`family_signals` should be conservative** — only include a family if this ingredient's presence is a meaningful positive signal for that family. Gin signals almost every family except `rich_creamy` and `tropical_punch` by default; Campari signals only `bitter_aromatized`.

4. **`can_be_structural_bitter` and `can_be_co_base` are the two most consequential fields** for drink family classification. Assign them carefully. When in doubt, refer to the drink taxonomy spec sheet for the inclusion/exclusion rules of the Aromatized and Bitter Aromatized families.

5. **`cocktail_quality_tier` should not be judgmental of casual enjoyment** — it is a classification tool for filtering results in context, not a value judgment. Peach Schnapps is `casual`, not `bad`.

6. **Resolve all duplicate records** listed in the Duplicate and Misclassification Fixes section before populating new fields, to avoid propagating errors.

7. **`substitute_ids` is editorial** — do not populate it mechanically. Only list substitutes that a knowledgeable bartender would actually accept in a classic build.

---

*Ingredient Schema v1 — April 2026. The Architecture of the Glass.*
