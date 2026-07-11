# Barkeep — Shippability Assessment

**Date:** July 11, 2026  
**Assessor:** First-principles review of repo state  
**Goal:** Get to a shippable product as fast as possible

---

## Executive Summary

**Barkeep is closer to shippable than it looks.** The core product loop works today:

> Add bottles to your bar → see what you can make → browse 244 recipes → save keepers / try-list / custom recipes → use offline as a PWA.

The main gap is not missing features — it is **unfinished data migration** and a few **production-readiness fixes**. The UI already expects the new taxonomy (`template`, `tags`), but `cocktails.json` still uses the old schema (`category`, `style`). Migration artifacts are ready; switchover has not been run.

**Estimated time to a credible v1 launch:**

| Phase | Effort | Outcome |
|-------|--------|---------|
| Phase 0 — Unblock | 2–4 hours | Deployable, filters/collections work |
| Phase 1 — Ship quality | 1–2 days | Fast, stable, scan feature works |
| Phase 2 — Polish | 1–2 weeks | Maintainable, store-ready |

---

## What This App Is

A **static PWA** (single `index.html` + JSON data) deployed on **Netlify**:

- **Mix (Home):** Personalized views — Can Make, Almost Make, Keepers, Try, Custom, Collections
- **Bar:** Multi-bar inventory with ingredient matching and substitution groups
- **Notebook (Library):** Browse all recipes + ingredient reference + gateway-bottle suggestions
- **Settings:** Import/export, theme, units (oz/ml), shared recipe import

**Stack:** React 18 + Babel-in-browser + Tailwind CDN + Lucide icons + localStorage + Service Worker. One Netlify serverless function (`extract.js`) for AI recipe scanning via Anthropic Claude.

**Data:**

| Asset | Count | Status |
|-------|-------|--------|
| Curated recipes | 244 | Loaded from `cocktails.json` |
| Ingredients | 340 | All have descriptions in `ingredients.json` |
| User data | — | localStorage only (no backend auth) |

---

## What Already Works (Ship-Ready Core)

These are functional and do not need re-architecture to launch:

1. **Recipe browsing & search** — 244 cocktails load, detail view, unit conversion
2. **Bar inventory + "Can Make" / "Almost Make"** — Ingredient normalization, alias map, substitution groups
3. **Multiple bars** — Create, switch, duplicate, manage
4. **Personal workflow** — Keepers, Try list, custom recipes, made-count, per-recipe notes
5. **Import/export** — Full backup/restore of user data
6. **PWA basics** — `manifest.json`, `sw.js`, offline caching, update prompt
7. **Theme + units** — Light/dark, oz/ml preference
8. **Ingredient library** — 340 entries with descriptions (README is stale; see below)
9. **Share recipe** — Web Share API with clipboard fallback

The product has a clear value proposition and a complete user journey without accounts or a backend.

---

## Critical Blockers (Fix Before Calling It "Shipped")

### 1. Taxonomy migration not applied ⚠️ HIGHEST PRIORITY

**Problem:** Code expects `template` and `tags` on every recipe. Live data has neither.

```
cocktails.json:     template=0, tags=0, style=155/244
cocktails-migrated.json: template=244, tags=244 (verified)
```

**Impact:**

- Template filters in browse are empty / useless
- Quick Browse presets (Boozy, Tropical, etc.) do nothing meaningful
- Curated **Classics** collection is broken: tag rule skips drinks with no tags, so **all 244 recipes match**
- Tiki curated collection uses old `category: ['Tiki']` — only 11 recipes have `style: tiki`, not `category: Tiki`

**Fix (already scripted):**

```powershell
.\switchover.ps1
# or: Copy-Item cocktails-migrated.json cocktails.json -Force
node verify-migration.js
```

Then smoke-test: browse → template filters, Quick Browse presets, Classics collection (~91 recipes expected).

**Effort:** 30 minutes + testing  
**Risk:** Low — rollback via `cocktails.json.backup`

---

### 2. Scan Recipe modal API mismatch 🐛

**Problem:** `ScanRecipeModal` expects `{ recipe: {...} }` but `netlify/functions/extract.js` returns a flat object.

```javascript
// ScanRecipeModal (broken path)
if (!data.recipe) throw new Error('No recipe found in response');

// extract.js (actual response)
{ name, category, glass, ingredients, instructions, notes }
```

**Impact:** Desktop "Scan Recipe" button (Camera icon in browse header) always fails.

**Note:** `AddDrinkModal` image scan uses the flat response correctly — that path works.

**Fix options (pick one):**

- A) Change `ScanRecipeModal` to use flat response (mirror AddDrinkModal) — **fastest**
- B) Wrap response in `extract.js` as `{ recipe: result }`
- C) Remove ScanRecipeModal and route all scanning through AddDrinkModal

**Effort:** 15–30 minutes

---

### 3. Production CDN dependencies

**Problem:** `index.html` loads:

- `react.development.js` / `react-dom.development.js` (not production builds)
- `@babel/standalone` (compiles JSX in browser on every load)
- `tailwindcss.com` CDN (runtime CSS generation)

**Impact:** Slow first load (~350KB HTML + large JS parse), React dev warnings in console, fragile offline behavior for Tailwind.

**Fix for ASAP ship (no build pipeline):**

```html
<!-- Swap to production React -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

For Tailwind: either pre-build a minimal CSS file or accept CDN for v1 and track as tech debt.

**Effort:** 1–2 hours for production React swap; 4–8 hours for pre-built CSS

---

### 4. Netlify env var for AI scan

**Problem:** `extract.js` requires `ANTHROPIC_API_KEY`. Without it, scan returns 500.

**Fix:** Set env var in Netlify dashboard → Site settings → Environment variables. Optionally hide/disable scan UI when not on Netlify or when a feature flag is off.

**Effort:** 10 minutes (plus API key provisioning)

---

### 5. Unpushed commits

Branch is **3 commits ahead of `origin/main`**. Push before deploy so production matches local.

---

## High Priority (Should Fix for v1 Quality)

### 6. Broken CSS animation class names

Lines 133–136 in `index.html`:

```css
. { animation: fadeIn 0.2s ease; }   /* missing class name */
```

Animations for fade/slide/scale are defined but not applied. Low user impact, easy fix — restore class names like `.animate-fade-in`.

---

### 7. Curated collection rules still reference legacy fields

After taxonomy switchover, update `CURATED_COLLECTIONS` to use `template` / `tags` instead of `style` / `category`:

| Collection | Current rule | Should become |
|------------|--------------|---------------|
| Tiki | `category: ['Tiki']` | `templates: ['TIKI_PUNCH']` or `tags: ['tropical']` |
| Spirit Forward | `style: ['spirit-forward']` | `templates: ['STIRRED_SPIRIT_FORWARD']` |
| Classics | `tags: ['classic', 'iba']` | OK after switchover; fix tag-matching logic |

**Tag-matching bug** (lines 1928–1937): If a drink has no tags, the tag rule is skipped and the drink passes. After switchover this mostly resolves, but the logic should require a match when tags are specified:

```javascript
// Safer logic
if (rules.tags?.length) {
  const drinkTags = drink.tags || [];
  if (!rules.tags.some(tag => drinkTags.includes(tag))) return false;
}
```

---

### 8. Stale README

README claims ~30 ingredients have descriptions. Actual count: **340/340**. Update README so future you doesn't re-do completed work.

---

### 9. No `.gitignore`

Repo has no `.gitignore`. Add one to exclude OS files, editor dirs, env files, and backup artifacts (`cocktails.json.backup`, `*.pptx` in icons/).

---

### 10. Scan feature: `mode` parameter ignored

`ScanRecipeModal` sends `mode: 'full' | 'menu'` but `extract.js` ignores it. Menu mode either needs a different prompt or the UI toggle should be removed until supported.

---

## Defer Until After Launch

These are real issues but not launch blockers for a personal/small-audience v1:

| Item | Why defer |
|------|-----------|
| Split 7,570-line `index.html` into modules | Works today; refactor when adding features |
| Proper build pipeline (Vite/esbuild) | Significant effort; CDN swap gets 80% of perf win |
| Automated tests | No test infra exists; manual smoke test sufficient for v1 |
| Ingredient content migration from markdown | **Already done** — deprioritize |
| Remaining recipe source files in `/recipes` | 244 recipes already in JSON |
| Account sync / multi-device | localStorage + export is enough for v1 |
| App Store packaging (TWA/Capacitor) | PWA install works; store is a separate project |
| Privacy policy / ToS | Needed for public App Store or if collecting analytics; optional for personal Netlify deploy |
| Rate limiting on `extract.js` | Add when scan feature is public-facing |
| Remove `_migration` metadata from JSON | Cosmetic; harmless |

---

## Architecture Notes (First Principles)

### Strengths

- **Zero backend complexity** for core app — fast to deploy, no server costs except AI scan
- **Offline-first** — bar inventory and favorites work without network
- **Data-driven** — recipes and ingredients are JSON; content updates don't require code changes
- **Thoughtful domain model** — bars, keepers, try-list, gateway bottles, substitution groups

### Weaknesses

- **Monolith HTML file** — high merge conflict risk, no type checking, hard to test
- **Runtime JSX compilation** — unusual for production; acceptable short-term
- **Dual scan implementations** — ScanRecipeModal vs AddDrinkModal image scan (DRY violation, caused bug)
- **Schema in transition** — UI, migration scripts, and live data out of sync

### Core loop (what must not break)

```
Inventory → normalizeIngredient() → canMakeDrink() → Home "Can Make" → Recipe detail → Keeper/Try
```

Everything else is secondary for v1.

---

## Recommended Ship Path

### Phase 0 — Today (2–4 hours): "It works correctly"

- [ ] Run `switchover.ps1` and verify with `node verify-migration.js`
- [ ] Fix ScanRecipeModal response handling
- [ ] Fix curated collection tag-matching logic
- [ ] Update Tiki / Spirit Forward collection rules to use `template`
- [ ] Set `ANTHROPIC_API_KEY` on Netlify
- [ ] Push 3 pending commits
- [ ] Deploy to Netlify
- [ ] Manual smoke test checklist:
  - [ ] App loads, 244 recipes visible
  - [ ] Add gin + vermouth → Manhattan appears in Can Make
  - [ ] Template filters show 6 templates
  - [ ] Classics collection ≈ 91 recipes
  - [ ] Quick Browse "Boozy" preset filters correctly
  - [ ] Add custom recipe, export, import
  - [ ] PWA install on phone
  - [ ] Scan recipe (both entry points)

### Phase 1 — This week (1–2 days): "It feels production-ready"

- [ ] Swap React to production builds
- [ ] Fix CSS animation class names
- [ ] Add `.gitignore`
- [ ] Update README (ingredients complete, deploy instructions, env vars)
- [ ] Remove or hide scan Menu mode until supported
- [ ] Bump `sw.js` cache version after data migration
- [ ] Optional: pre-build Tailwind CSS for faster load

### Phase 2 — Post-launch (when you have users)

- [ ] Vite build pipeline — split components, tree-shake, minify
- [ ] Basic smoke tests (Playwright: load app, can-make flow)
- [ ] Rate limit / auth on extract function
- [ ] Privacy policy if going public
- [ ] Analytics (Plausible/Fathom) to learn what features get used

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Migration breaks recipe display | Low | High | Backup + verify script + rollback |
| AI scan costs spike | Medium | Medium | Rate limit; disable when key missing |
| localStorage data loss | Medium | High | Export prompt in Settings; already have export |
| Slow mobile load | High | Medium | Production React; pre-built CSS |
| Ingredient match false negatives | Medium | Medium | Debug panel exists in Settings for unmatched ingredients |

---

## Definition of "Shippable"

For Barkeep v1, shippable means:

1. **Correct** — Filters, collections, and can-make logic reflect real recipe data
2. **Deployable** — Netlify site loads fast enough on mobile, PWA installable
3. **Complete loop** — User can stock a bar, find drinks, save favorites, add custom recipes
4. **Recoverable** — Export/import works; no silent data loss
5. **Honest** — Features that don't work (scan menu mode) are hidden or fixed

It does **not** require: accounts, app store presence, perfect code architecture, or 100% ingredient alias coverage.

---

## Bottom Line

**Do not rebuild. Do not add features. Finish the migration and fix the scan bug.**

The fastest path to shippable:

1. Run switchover (`cocktails-migrated.json` → `cocktails.json`)
2. Fix ScanRecipeModal API mismatch
3. Push and deploy with `ANTHROPIC_API_KEY` set
4. Swap to production React builds

That is a half-day of work to go from " impressive prototype with broken filters" to "usable v1 product."
