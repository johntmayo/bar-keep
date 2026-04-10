# Ingredient Schema — Addendum: Quantity Threshold Rule
### The Architecture of the Glass — v1.1

---

## Purpose

The base schema (`INGREDIENT-SCHEMA.md`) defines what structural roles each ingredient *can* fill in principle. This addendum defines the rules for determining whether a given ingredient is *actually filling* a structural role in a specific recipe — as opposed to playing an accent, seasoning, or garnish role in that context.

This rule is required for automated recipe family classification. Without it, a small wash of dry vermouth in a recipe would incorrectly qualify a drink for the Aromatized family, or two dashes of Campari would trigger Bitter Aromatized. The threshold rule is what makes classification consistent and repeatable.

---

## The Core Principle

> An ingredient's `structural_roles` field describes what it **can** do.
> The quantity threshold rule determines what it is **actually doing** in this specific recipe.

These are two separate questions. Answer them separately, in that order.

---

## Step 1 — Calculate Total Spirit Volume (TSV)

Before applying any threshold, calculate the **Total Spirit Volume** of the recipe.

**TSV = the sum of all measured volumes of all `base_spirit` ingredients in the recipe.**

For recipes with a single base spirit this is straightforward. For split-base recipes (e.g., a Zombie with three rums), sum all base spirit volumes.

**Unit conversion for TSV calculation only:**

| Format | Convert to ml |
|---|---|
| `X oz` | X × 30 ml |
| `X ml` | X ml |
| `X cl` | X × 10 ml |
| `1 barspoon` | 5 ml |
| `dash` / `dashes` | 2 ml (but see Seasoning Rule below — dashes never qualify as structural regardless of count) |
| `splash` | 10 ml (context-dependent; treat as non-structural) |
| `rinse` | 2 ml (never structural) |
| `top` / `to top` | Non-structural by definition |
| `to taste` | Non-structural by definition |

If a recipe has **no identifiable base spirit** (e.g., a liqueur-only drink like an Aperol Spritz), set TSV = sum of all measured alcoholic components. Note this in `classification_note`.

---

## Step 2 — Apply the Structural Threshold

For each non-base-spirit ingredient in the recipe, calculate its **Role Ratio**:

**Role Ratio = ingredient volume ÷ TSV**

Then apply:

| Role Ratio | Classification |
|---|---|
| ≥ 0.40 (40% of TSV) | **Co-structural** — ingredient is load-bearing. Qualifies for Aromatized, Bitter Aromatized, or Enhanced Sour families. |
| 0.20–0.39 (20–39% of TSV) | **Supporting structural** — ingredient is meaningful but subordinate. Qualifies a drink for the relevant family only if it also passes the Removal Test (see below). |
| 0.10–0.19 (10–19% of TSV) | **Accent** — ingredient contributes flavor but is not structurally load-bearing. Does not qualify for family assignment on its own. |
| < 0.10 (under 10% of TSV) | **Seasoning / garnish** — regardless of ingredient type. Does not affect family classification. |

### The Absolute Seasoning Override

Regardless of calculated Role Ratio, the following formats are **always seasoning** and never structural:

- `dashes` (any count)
- `drops`
- `rinse`
- `splash`
- `barspoon` (single barspoon of a non-spirit modifier)
- `to taste`
- `to top` / `top`

---

## Step 3 — The Removal Test (for 0.20–0.39 range)

When an ingredient falls in the supporting structural range (20–39% of TSV), apply the Removal Test:

> **If you removed this ingredient and replaced it with a neutral substitute of the same volume, would the resulting drink have a different structural identity — not just a different flavor, but a categorically different drink?**

- If **yes** → structural. Qualifies for family assignment.
- If **no** → accent. Does not qualify for family assignment on its own.

**Example:**
- Manhattan: rye 50ml (TSV = 50ml), sweet vermouth 20ml. Role Ratio = 20/50 = 0.40. Co-structural. → Aromatized. No removal test needed.
- A hypothetical variant: rye 60ml, sweet vermouth 15ml. Role Ratio = 15/60 = 0.25. Supporting structural range. Removal test: remove vermouth → becomes an Old-Fashioned with bitters. Categorically different. → Still Aromatized.
- A drink with bourbon 60ml, sweet vermouth 10ml. Role Ratio = 10/60 = 0.17. Accent. → Old-Fashioned family, not Aromatized.

---

## Step 4 — Apply Family Logic

With structural roles confirmed for all ingredients in the recipe, apply the following decision tree:

```
1. Does the recipe have a texture agent (egg, cream, dairy) as the PRIMARY structural logic?
   YES → Rich & Creamy
   NO  → Continue

2. Does the recipe have layered punch modifier logic (multiple coequal components,
   punch tradition, no single dominant structural balance)?
   YES → Tropical / Punch-derived
   NO  → Continue

3. Does the recipe have a structural bitter (can_be_structural_bitter: true) at structural threshold?
   YES → Does it also have a co_base at structural threshold?
         YES → Bitter Aromatized
         NO  → Sour acid present at structural threshold?
               YES → Enhanced Sour (Jungle Bird case)
               NO  → Old-Fashioned (bitter accent without sour or co-base)
   NO  → Continue

4. Does the recipe have a co_base (can_be_co_base: true) at structural threshold?
   YES → Aromatized
   NO  → Continue

5. Does the recipe have a sour acid at structural threshold?
   YES → Does it have a lengthener?
         YES → Is the lengthener flavored (ginger beer, tonic, cola)?
               YES → Highball
               NO  → Collins
         NO  → Are there two or more coequal structural modifiers?
               YES → Enhanced Sour
               NO  → One named structural modifier present?
                     YES → Daisy
                     NO  → Sour
   NO  → Continue

6. Does the recipe have a lengthener without sour architecture?
   YES → Highball
   NO  → Old-Fashioned
```

---

## Worked Examples

### Negroni
- Gin: 30ml → TSV = 30ml
- Campari: 30ml → Role Ratio = 1.00 → Co-structural bitter ✓
- Sweet vermouth: 30ml → Role Ratio = 1.00 → Co-structural co-base ✓
- **→ Bitter Aromatized**

### Dry Martini (60ml gin / 10ml dry vermouth)
- Gin: 60ml → TSV = 60ml
- Dry vermouth: 10ml → Role Ratio = 0.17 → Accent by ratio
- **Name Exception Rule applies:** A martini without vermouth is not a martini — it is cold gin. If removing an ingredient would require renaming the canonical recipe, classify it as structural regardless of ratio. Apply conservatively to canonical recipes only.
- **→ Aromatized** via Name Exception. `classification_note` required.

### Manhattan (50ml rye / 20ml sweet vermouth / 1 dash Angostura)
- Rye: 50ml → TSV = 50ml
- Sweet vermouth: 20ml → Role Ratio = 0.40 → Co-structural co-base ✓
- Angostura: dashes → Absolute Seasoning Override → seasoning only
- **→ Aromatized**

### Whiskey Sour (45ml bourbon / 30ml lemon juice / 15ml simple syrup)
- Bourbon: 45ml → TSV = 45ml
- Lemon juice: 30ml → Role Ratio = 0.67 → Co-structural sour acid ✓
- Simple syrup: 15ml → neutral sweetener, not a named structural modifier
- **→ Sour**

### Jungle Bird (45ml dark rum / 22ml Campari / 45ml pineapple juice / 15ml lime juice / 15ml simple syrup)
- Dark rum: 45ml → TSV = 45ml
- Campari: 22ml → Role Ratio = 0.49 → Co-structural bitter ✓
- Lime juice: 15ml → Role Ratio = 0.33 → Supporting structural sour acid (passes Removal Test)
- Pineapple juice: 45ml → Role Ratio = 1.00 → juice (not sour_acid type), coequal structural axis
- No co-base. Structural bitter + sour acid + fruit juice = multiple coequal axes.
- **→ Enhanced Sour**
- `classification_note`: "Campari is structural bitter but no co-base present. Sour + bitter + tropical juice axes are coequal. Classified Enhanced Sour rather than Bitter Aromatized."

### Paper Plane (equal parts bourbon / Aperol / Amaro Nonino / lemon juice, ~22ml each)
- Bourbon: 22ml → TSV = 22ml
- Aperol: Role Ratio = 1.00 → Co-structural bitter ✓
- Amaro Nonino: Role Ratio = 1.00 → Co-structural bitter ✓
- Lemon juice: Role Ratio = 1.00 → Co-structural sour acid ✓
- Two structural bitters + sour acid + spirit all equal.
- **→ Enhanced Sour** | Structural tags: `Equal-parts`

### Aperol Spritz (60ml Aperol / 90ml Prosecco / splash club soda — no base spirit)
- No distilled base spirit → TSV = sum of alcoholic components = 60 + 90 = 150ml
- Aperol: Role Ratio = 60/150 = 0.40 → Co-structural bitter ✓ (primary alcohol)
- Prosecco: Role Ratio = 90/150 = 0.60 → sparkling co-base
- **→ Bitter Aromatized**
- `classification_note`: "No distilled base spirit. Aperol is primary alcohol and structural bitter. Prosecco functions as sparkling co-base. Structural tags: Spritz format, Low-ABV."

---

## Classification Priority Order

When multiple family signals are present, resolve in this order. Lower numbers win.

| Priority | Family | Wins when... |
|---|---|---|
| 1 | Rich & Creamy | Texture agent is the primary structural logic |
| 2 | Tropical / Punch-derived | Punch layering logic dominates |
| 3 | Bitter Aromatized | Structural bitter + co-base both present |
| 4 | Aromatized | Co-base present, no structural bitter |
| 5 | Enhanced Sour | Multiple coequal structural modifiers + sour acid |
| 6 | Daisy | One named structural modifier + sour acid |
| 7 | Collins | Sour architecture + neutral carbonation lengthener |
| 8 | Highball | Flavored lengthener, or lengthener without sour architecture |
| 9 | Sour | Sour acid + spirit + neutral sweetener, no other structural modifiers |
| 10 | Old-Fashioned | Default: spirit-led, no sour, no co-base, no structural bitter |

---

## Agent Instructions for Ambiguous Records

For any recipe where family assignment is genuinely ambiguous after applying all rules:

1. Assign the most defensible family given the decision tree.
2. Note the second candidate family in `classification_note`.
3. Flag the record with `"Classification review"` in `structural_tags`.

**Do not leave `primary_family` blank.** Every drink gets a classification. Uncertainty is documented, not avoided.

---

*Ingredient Schema Addendum v1.1 — April 2026. The Architecture of the Glass.*
