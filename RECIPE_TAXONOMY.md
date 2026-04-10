\# Cocktail Taxonomy Spec Sheet — v1  
\#\#\# The Architecture of the Glass

\*\*\*

\#\# How to Use This Document

This spec sheet defines the v1 taxonomy for the cocktail app's classification system. It is the authoritative reference for how drinks are classified and how classification decisions are made consistently.

The taxonomy is built on three layers:

\- \*\*Primary Family\*\* — the structural balancing logic of the drink. One required per drink.  
\- \*\*Template\*\* — the recognizable classic pattern the drink descends from. Zero to two allowed per drink.  
\- \*\*Tags\*\* — experiential, structural, and occasion descriptors. Many allowed per drink.

\*\*The governing rule: Family \= structure. Template \= lineage. Tags \= experience.\*\*

\*\*\*

\#\# Taxonomy Layers Reference

| Layer | Answers | Cardinality | Examples |  
|---|---|---|---|  
| Primary Family | What balancing logic holds this drink together? | Exactly 1 | Bitter Aromatized, Sour, Highball |  
| Template | Which recognizable classic does this descend from? | 0–2 | Negroni, Martini, Daiquiri |  
| Build method | How is it prepared? | 1–2 | Stirred, Shaken, Built, Blended |  
| Service style | How is it served? | 1 | Up, Rocks, Long, Neat |  
| Base spirit | What is the primary distilled base? | 1–2 | Gin, Rum, Whiskey, Tequila |  
| Experience tags | How does it feel to drink? | Many | Spirit-forward, Refreshing, Bitter |  
| Occasion tags | When is it typically consumed? | Many | Aperitivo, Nightcap, Brunch |  
| Structural tags | What structural or format properties apply? | Many | Equal-parts, Three-ingredient, No citrus |

\*\*\*

\#\# Primary Family Definitions

\*\*\*

\#\#\# 1\. Old-Fashioned

\*\*One-sentence definition:\*\*  
Spirit sweetened and seasoned, with no sour element and no co-base modifier.

\*\*Structural rule:\*\*  
The drink's balance depends almost entirely on the base spirit, with sugar and bitters functioning as amplifiers rather than structural counterforces.

\*\*Inclusion rule:\*\*  
Include when the drink is spirit-led, has no citrus balance, and has no aromatized wine or substantial bitter modifier as a structural co-base.

\*\*Exclusion rule:\*\*  
Exclude if citrus is structurally present (→ Sour family), if vermouth or aromatized wine is a co-base (→ Aromatized), or if a major bitter modifier is structural (→ Bitter Aromatized).

\*\*Anchor templates:\*\*  
\- Old-Fashioned  
\- Sazerac  
\- Toronto

\*\*Canonical examples:\*\*  
Whiskey Old-Fashioned, Rum Old-Fashioned, Oaxacan Old-Fashioned, Mezcal Old-Fashioned, Brandy Old-Fashioned, Sazerac, Toronto, Revolver

\*\*Helper copy (UI):\*\*  
"Spirit, sweetener, seasoning — and the spirit does the rest."

\*\*\*

\#\#\# 2\. Aromatized

\*\*One-sentence definition:\*\*  
Spirit plus fortified or aromatized wine as a meaningful structural co-base.

\*\*Structural rule:\*\*  
The vermouth, sherry, or similar aromatized modifier is not a flavoring agent. It is sharing structural load — providing dilution, softening alcohol, contributing botanical complexity.

\*\*Inclusion rule:\*\*  
Include when an aromatized or fortified wine is a substantial, named component that would fundamentally alter the drink's structure if removed or replaced with a neutral modifier.

\*\*Exclusion rule:\*\*  
Exclude if a major bitter component is also structural (→ Bitter Aromatized). Exclude if the drink is primarily citrus-balanced. A mere rinse or dash of vermouth is not sufficient for inclusion.

\*\*Anchor templates:\*\*  
\- Martini  
\- Manhattan  
\- Bamboo

\*\*Canonical examples:\*\*  
Dry Martini, Wet Martini, Perfect Martini, Manhattan, Perfect Manhattan, Rob Roy, Bamboo, Adonis, Chrysanthemum, Gibson, Tuxedo, Vesper

\*\*Helper copy (UI):\*\*  
"Spirit and fortified wine, working together."

\*\*Naming note:\*\*  
"Aromatized" refers to the technical category of aromatized wine, of which vermouth is the most common example. The term is intentionally precise. It describes a real modifier category, not a flavor profile.

\*\*\*

\#\#\# 3\. Bitter Aromatized

\*\*One-sentence definition:\*\*  
An aromatized structure with a substantial bitter modifier that is structurally load-bearing.

\*\*Structural rule:\*\*  
The drink has both an aromatized wine co-base and a major bitter component. Neither is incidental. Remove either and the drink's structural identity collapses.

\*\*Inclusion rule:\*\*  
Include when the drink clearly meets the Aromatized inclusion rule AND has an additional bitter modifier (amaro, bitter liqueur, aperitivo bitter) that is structural, not decorative.

\*\*Exclusion rule:\*\*  
Exclude if the bitter component is present as a few dashes of bitters (→ Aromatized or Old-Fashioned). The bitter modifier must be a measured, structural component, not a seasoning.

\*\*Anchor templates:\*\*  
\- Negroni  
\- Boulevardier  
\- Old Pal

\*\*Canonical examples:\*\*  
Negroni, Boulevardier, Old Pal, Cardinale, Kingston Negroni, White Negroni, Rosita, Mezcal Negroni, Americano, Sbagliato

\*\*Helper copy (UI):\*\*  
"Spirit, aromatized wine, and a bitter that earns its place."

\*\*Naming note:\*\*  
"Bitter Aromatized" is preferred over "Bitter Aperitivo." Aperitivo describes function and occasion; Bitter Aromatized describes structure. This taxonomy classifies structure first.

\*\*\*

\#\#\# 4\. Sour

\*\*One-sentence definition:\*\*  
Spirit, citrus, and sweetener in a simple acid-balance triangle.

\*\*Structural rule:\*\*  
The drink is balanced by a direct counterforce between sour citrus and sweet modifier, with the spirit as the backbone. No secondary modifier is structural.

\*\*Inclusion rule:\*\*  
Include when the drink is built on the spirit-citrus-sweetener triangle and no additional component is structurally load-bearing.

\*\*Exclusion rule:\*\*  
Exclude if the sweet modifier has a strong, distinct identity of its own (→ Daisy). Exclude if the drink has multiple coequal modifiers (→ Enhanced Sour). Exclude if the drink is lengthened with soda (→ Collins).

\*\*Anchor templates:\*\*  
\- Daiquiri  
\- Whiskey Sour  
\- Gimlet

\*\*Canonical examples:\*\*  
Classic Daiquiri, Whiskey Sour, Gimlet, Pisco Sour, Jack Rose, Aviation (border case), Bee's Knees, Clover Club, Army and Navy

\*\*Helper copy (UI):\*\*  
"Spirit, citrus, sweetener. The triangle that never fails."

\*\*\*

\#\#\# 5\. Daisy

\*\*One-sentence definition:\*\*  
A sour whose structural identity depends on a liqueur or other distinct modifier in place of simple sweetener.

\*\*Structural rule:\*\*  
The sweet component is not neutral sugar syrup — it is a modifier with a strong flavor identity (orange, elderflower, raspberry, etc.) that meaningfully shapes the drink's character. The modifier is structural, not interchangeable.

\*\*Inclusion rule:\*\*  
Include when the drink follows sour logic (spirit, acid, sweet) but the sweet component is a liqueur or flavored modifier with its own distinct identity. Swapping the modifier for plain sugar should produce a categorically different drink.

\*\*Exclusion rule:\*\*  
Exclude if the sweetener is essentially neutral (→ Sour). Exclude if there are multiple coequal structural modifiers (→ Enhanced Sour).

\*\*Anchor templates:\*\*  
\- Margarita  
\- Sidecar  
\- White Lady

\*\*Canonical examples:\*\*  
Margarita, Sidecar, White Lady, Cosmopolitan, Between the Sheets, Kamikaze, French Martini (border case), Elderflower Sour variants

\*\*Helper copy (UI):\*\*  
"Like a sour — but the sweetener has a personality."

\*\*\*

\#\#\# 6\. Enhanced Sour

\*\*One-sentence definition:\*\*  
A sour built on multiple coequal balancing modifiers, none of which is incidental.

\*\*Structural rule:\*\*  
The drink's identity depends on two or more substantial modifiers, each of which contributes a distinct flavor axis beyond simple sweetness. Remove any one of them and the drink is not simplified — it is broken.

\*\*Inclusion rule:\*\*  
Include when the drink has sour logic at its base, but two or more named, structurally significant modifiers are present and coequal. The equal-parts format is a strong signal but not a requirement.

\*\*Exclusion rule:\*\*  
Exclude if the drink is adequately described as a Sour or Daisy with an interesting modifier. The test is whether the second modifier is structural or merely flavorful.

\*\*Anchor templates:\*\*  
\- Last Word  
\- Paper Plane  
\- Corpse Reviver No. 2

\*\*Canonical examples:\*\*  
Last Word, Paper Plane, Corpse Reviver No. 2, The Naked and Famous, equal-parts cocktails with multiple spirit-level modifiers

\*\*Helper copy (UI):\*\*  
"A sour where every ingredient is load-bearing."

\*\*v2 note:\*\*  
This family is a candidate for splitting into Equal-Parts Sour (liqueur-driven, strict equal-parts) and Complex Sour (multi-axis balance without strict equal-parts). For v1, they belong together.

\*\*\*

\#\#\# 7\. Collins

\*\*One-sentence definition:\*\*  
A sour that has been lengthened with carbonated water.

\*\*Structural rule:\*\*  
The drink is sour-structured first — spirit, citrus, sweetener — and then extended by carbonation. The soda is not flavor; it is dilution and effervescence as a structural choice.

\*\*Inclusion rule:\*\*  
Include when the drink is clearly built on sour logic and then lengthened with sparkling water, soda, or similar neutral carbonation.

\*\*Exclusion rule:\*\*  
Exclude if the lengthener contributes significant flavor (→ Highball — e.g., ginger beer, tonic). Exclude if the drink has no sour architecture despite being long (→ Highball).

\*\*Anchor templates:\*\*  
\- Tom Collins  
\- John Collins  
\- Gin Fizz (border case — up vs. long)

\*\*Canonical examples:\*\*  
Tom Collins, John Collins, Vodka Collins, Singapore Sling (border case), Ramos Gin Fizz (border case — cream element), Sloe Gin Fizz

\*\*Helper copy (UI):\*\*  
"A sour, lengthened."

\*\*\*

\#\#\# 8\. Highball

\*\*One-sentence definition:\*\*  
Spirit plus a lengthening mixer, without sour architecture.

\*\*Structural rule:\*\*  
The lengthener does the structural work of dilution and character extension. There is no acid-sweet counterforce at the heart of the drink. The relationship between spirit and mixer is the structure.

\*\*Inclusion rule:\*\*  
Include when the drink is a long serve built around spirit and mixer, and the mixer contributes meaningful character (carbonation, bitterness, spice, etc.) rather than merely diluting.

\*\*Exclusion rule:\*\*  
Exclude if the drink has clear citrus-balance sour logic as its base (→ Collins or Sour). A wedge of lime as garnish is not citrus structure. A half-ounce of lime juice as a balancing acid is.

\*\*Anchor templates:\*\*  
\- Whisky Highball  
\- Gin and Tonic  
\- Moscow Mule / Buck family

\*\*Canonical examples:\*\*  
Whisky Highball, Gin and Tonic, Vodka Soda, Moscow Mule, Dark and Stormy, Ranch Water, Paloma (border case), Americano (Highball version)

\*\*Helper copy (UI):\*\*  
"Spirit and mixer — where simplicity is the point."

\*\*\*

\#\#\# 9\. Rich & Creamy

\*\*One-sentence definition:\*\*  
Drinks in which egg, cream, dairy, or similar enrichment is a structural component.

\*\*Structural rule:\*\*  
Texture is not a garnish or a modifier in these drinks — it is a foundational element that changes the drink's entire balance logic. The richness counteracts the spirit's sharpness and creates a density that defines the experience.

\*\*Inclusion rule:\*\*  
Include when the drink contains egg (whole, yolk, or white as primary structural element), cream, or dairy in a measured, structural quantity. The texture must be integral to the drink's identity.

\*\*Exclusion rule:\*\*  
Exclude if cream or egg white is used as a topping or garnish only. Exclude if the egg white is present purely for foam/texture without contributing to the drink's structural balance (this is a judgment call — assess whether removing it changes the fundamental character).

\*\*Anchor templates:\*\*  
\- Flip  
\- Eggnog  
\- Alexander

\*\*Canonical examples:\*\*  
Whiskey Flip, Port Flip, Eggnog, Brandy Alexander, Grasshopper, Ramos Gin Fizz, Tom and Jerry, Mudslide (border case), Milk Punch

\*\*Helper copy (UI):\*\*  
"Rich, textured, and built differently."

\*\*\*

\#\#\# 10\. Tropical / Punch-derived

\*\*One-sentence definition:\*\*  
Layered, modifier-rich drinks shaped by punch logic, where multiple modifiers, fruit, spice, and dilution work together as a system.

\*\*Structural rule:\*\*  
No single modifier dominates. The drink's identity emerges from the interaction of layered components — fruit juice, flavored syrups, multiple spirits or liqueurs, spice — inherited from the punch tradition.

\*\*Inclusion rule:\*\*  
Include when the drink's structure relies on layered modifier logic, where multiple components contribute coequal character and the drink's identity cannot be attributed to one primary balancing counterforce.

\*\*Exclusion rule:\*\*  
Exclude if the drink is simply a fruit-forward sour (→ Sour or Daisy). The distinction is complexity of modifier layering, not the presence of fruit or rum.

\*\*Anchor templates:\*\*  
\- Mai Tai  
\- Planter's Punch  
\- Zombie

\*\*Canonical examples:\*\*  
Mai Tai, Planter's Punch, Zombie, Jungle Bird, Painkiller, Three Dots and a Dash, Missionary's Downfall, Navy Grog, Scorpion Bowl

\*\*Helper copy (UI):\*\*  
"Layered, complex, and built for depth."

\*\*\*

\#\# Border Cases and Classification Rules

Some drinks sit on the edge between two families. The following principles govern classification decisions:

\*\*1. The removal test.\*\*  
If you remove the component in question and the drink's structural identity collapses, it is structural. If the drink survives with a simpler substitute, it is not.

\*\*2. Sour vs. Daisy.\*\*  
Ask: could you replace the sweet modifier with plain sugar syrup and still have the same drink in spirit? If yes, Sour. If no, Daisy.

\*\*3. Aromatized vs. Bitter Aromatized.\*\*  
A few dashes of bitters do not make a drink Bitter Aromatized. The bitter modifier must be a measured, named, structural component — typically at least half an ounce and contributing distinct identity beyond seasoning.

\*\*4. Collins vs. Highball.\*\*  
Does the drink have a sour architecture (spirit \+ citrus \+ sweet) that is then lengthened? Collins. Is the mixer doing the primary structural work without sour logic? Highball.

\*\*5. Enhanced Sour vs. Daisy.\*\*  
Is there one named modifier doing the structural sweetening? Daisy. Are there two or more coequal modifiers, each contributing distinct flavor axes? Enhanced Sour.

\*\*6. Tropical vs. Enhanced Sour.\*\*  
Enhanced Sour drinks are sour-logic driven with complex modifiers. Tropical / Punch-derived drinks inherit punch structure — layered, multi-component, not organized around a single citrus-sweet balance. If there is clear sour architecture at the base, it is Enhanced Sour; if the structure is a layered punch system, it is Tropical.

\*\*\*

\#\# Controlled Vocabulary

\#\#\# Build Methods  
\`Stirred\` · \`Shaken\` · \`Built\` · \`Blended\` · \`Swizzled\` · \`Thrown\` · \`Whipped\`

\#\#\# Service Styles  
\`Up\` · \`Rocks\` · \`Large rock\` · \`Long / tall\` · \`Neat\` · \`Frozen\` · \`Hot\`

\#\#\# Base Spirits  
\`Gin\` · \`Vodka\` · \`Whiskey — Bourbon\` · \`Whiskey — Rye\` · \`Whiskey — Scotch\` · \`Whiskey — Irish\` · \`Rum — White\` · \`Rum — Aged\` · \`Rum — Overproof\` · \`Tequila — Blanco\` · \`Tequila — Reposado\` · \`Tequila — Añejo\` · \`Mezcal\` · \`Brandy / Cognac\` · \`Pisco\` · \`Calvados\` · \`Eau de vie\` · \`Aquavit\` · \`Shochu / Soju\` · \`Other\`

\#\#\# Experience Tags (controlled)  
\*\*Profile:\*\* \`Bitter\` · \`Tart\` · \`Sweet\` · \`Herbal\` · \`Savory\` · \`Smoky\` · \`Fruity\` · \`Floral\` · \`Nutty\` · \`Oxidative\` · \`Coffee\` · \`Chocolate\` · \`Spiced\` · \`Umami\`

\*\*Character:\*\* \`Spirit-forward\` · \`Refreshing\` · \`Sessionable\` · \`Boozy\` · \`Bright\` · \`Plush\` · \`Warming\` · \`Light\` · \`Complex\` · \`Approachable\`

\*\*Occasion:\*\* \`Aperitivo\` · \`Digestivo\` · \`Nightcap\` · \`Brunch\` · \`Summer\` · \`Winter\` · \`Celebratory\` · \`Easy drinking\`

\*\*Structural:\*\* \`Equal-parts\` · \`Three-ingredient\` · \`No citrus\` · \`Low-ABV\` · \`High-ABV\` · \`Non-alcoholic\` · \`Carbonated\` · \`Hot\` · \`Frozen\`

\*\*\*

\#\# Required Fields Per Drink Record

| Field | Type | Required | Notes |  
|---|---|---|---|  
| \`name\` | String | Yes | Canonical name |  
| \`primary\_family\` | Enum | Yes | One of the 10 families |  
| \`primary\_template\` | Enum / String | No | Named classic template |  
| \`secondary\_template\` | Enum / String | No | Secondary lineage if relevant |  
| \`build\_method\` | Enum | Yes | From controlled vocabulary |  
| \`service\_style\` | Enum | Yes | From controlled vocabulary |  
| \`base\_spirit\` | Enum | Yes | From controlled vocabulary |  
| \`modifier\_classes\` | Array | No | Named modifier categories |  
| \`citrus\_present\` | Boolean | Yes | True/false |  
| \`lengthened\` | Boolean | Yes | True/false |  
| \`texture\_agents\` | Array | No | Egg, cream, dairy, etc. |  
| \`experience\_tags\` | Array | Yes | Min 2, from controlled vocabulary |  
| \`occasion\_tags\` | Array | No | From controlled vocabulary |  
| \`structural\_tags\` | Array | No | From controlled vocabulary |  
| \`classification\_note\` | String | No | Brief rationale for placement, especially for border cases |

\*\*\*

\#\# Example Records

\#\#\# Negroni

| Field | Value |  
|---|---|  
| Name | Negroni |  
| Primary family | Bitter Aromatized |  
| Primary template | Negroni |  
| Build method | Stirred |  
| Service style | Rocks |  
| Base spirit | Gin |  
| Citrus present | No |  
| Lengthened | No |  
| Experience tags | Bitter, Spirit-forward, Complex |  
| Occasion tags | Aperitivo |  
| Structural tags | Equal-parts |  
| Classification note | Campari is structural, not decorative — load-bearing bitter alongside sweet vermouth co-base. |

\*\*\*

\#\#\# Last Word

| Field | Value |  
|---|---|  
| Name | Last Word |  
| Primary family | Enhanced Sour |  
| Primary template | Last Word |  
| Build method | Shaken |  
| Service style | Up |  
| Base spirit | Gin |  
| Citrus present | Yes |  
| Lengthened | No |  
| Experience tags | Herbal, Tart, Complex, Bright |  
| Occasion tags | — |  
| Structural tags | Equal-parts |  
| Classification note | Maraschino and Chartreuse are both coequal structural modifiers — neither is incidental sweetener. |

\*\*\*

\#\#\# Daiquiri

| Field | Value |  
|---|---|  
| Name | Daiquiri |  
| Primary family | Sour |  
| Primary template | Daiquiri |  
| Build method | Shaken |  
| Service style | Up |  
| Base spirit | Rum — White |  
| Citrus present | Yes |  
| Lengthened | No |  
| Experience tags | Tart, Refreshing, Bright |  
| Occasion tags | Summer |  
| Structural tags | Three-ingredient |  
| Classification note | Simple sugar performs as neutral sweetener; no modifier with its own structural identity. Canonical Sour. |

\*\*\*

\#\#\# Margarita

| Field | Value |  
|---|---|  
| Name | Margarita |  
| Primary family | Daisy |  
| Primary template | Margarita |  
| Build method | Shaken |  
| Service style | Rocks or Up |  
| Base spirit | Tequila — Blanco |  
| Citrus present | Yes |  
| Lengthened | No |  
| Experience tags | Tart, Bright, Refreshing |  
| Occasion tags | Summer |  
| Structural tags | — |  
| Classification note | Cointreau/triple sec is structural — contributes orange character and alcoholic body, not replaceable with plain sugar without category shift. |

\*\*\*

\#\#\# Mai Tai

| Field | Value |  
|---|---|  
| Name | Mai Tai |  
| Primary family | Tropical / Punch-derived |  
| Primary template | Mai Tai |  
| Build method | Shaken / built |  
| Service style | Rocks |  
| Base spirit | Rum — Aged |  
| Citrus present | Yes |  
| Lengthened | No |  
| Experience tags | Fruity, Complex, Refreshing, Boozy |  
| Occasion tags | Summer |  
| Structural tags | — |  
| Classification note | Orgeat and curaçao are both coequal structural modifiers; punch-derived layered logic dominates over simple sour architecture. |

\*\*\*

\#\# v2 Candidate Splits

These families are structurally sound for v1 but contain internal variation that may warrant subdivision in future versions:

| Family | Potential v2 split | Rationale |  
|---|---|---|  
| Enhanced Sour | Equal-Parts Sour / Complex Sour | Equal-parts liqueur-driven drinks (Last Word) vs. multi-axis complex sours (Corpse Reviver No. 2\) have distinct structural logics |  
| Highball / Collins | Separate families | Collins is sour-first then lengthened; Highball is mixer-first without sour architecture. Philosophically distinct, kept together in v1 for simplicity |  
| Tropical / Punch-derived | Tiki / Modern Tropical | Classic tiki structures (Zombie, Mai Tai) vs. modern tropical punches may warrant separation as the database grows |

\*\*\*

\*Taxonomy v1 — April 2026\. The Architecture of the Glass.\*  
