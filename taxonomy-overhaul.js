const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INGREDIENTS_PATH = path.join(ROOT, 'ingredients.json');
const COCKTAILS_PATH = path.join(ROOT, 'cocktails.json');

const CONTROLLED_BASE_SPIRITS = [
  'Gin',
  'Vodka',
  'Whiskey — Bourbon',
  'Whiskey — Rye',
  'Whiskey — Scotch',
  'Whiskey — Irish',
  'Rum — White',
  'Rum — Aged',
  'Rum — Overproof',
  'Tequila — Blanco',
  'Tequila — Reposado',
  'Tequila — Añejo',
  'Mezcal',
  'Brandy / Cognac',
  'Pisco',
  'Calvados',
  'Eau de vie',
  'Aquavit',
  'Shochu / Soju',
  'Other',
];

const FAMILY_IDS = [
  'old_fashioned',
  'aromatized',
  'bitter_aromatized',
  'sour',
  'daisy',
  'enhanced_sour',
  'collins',
  'highball',
  'rich_creamy',
  'tropical_punch',
];

const FAMILY_LABELS = {
  old_fashioned: 'Old-Fashioned',
  aromatized: 'Aromatized',
  bitter_aromatized: 'Bitter Aromatized',
  sour: 'Sour',
  daisy: 'Daisy',
  enhanced_sour: 'Enhanced Sour',
  collins: 'Collins',
  highball: 'Highball',
  rich_creamy: 'Rich & Creamy',
  tropical_punch: 'Tropical / Punch-derived',
};

const EXPERIENCE_TAGS = new Set([
  'Bitter', 'Tart', 'Sweet', 'Herbal', 'Savory', 'Smoky', 'Fruity', 'Floral', 'Nutty',
  'Oxidative', 'Coffee', 'Chocolate', 'Spiced', 'Umami', 'Spirit-forward', 'Refreshing',
  'Sessionable', 'Boozy', 'Bright', 'Plush', 'Warming', 'Light', 'Complex', 'Approachable',
]);

const OCCASION_TAGS = new Set([
  'Aperitivo', 'Digestivo', 'Nightcap', 'Brunch', 'Summer', 'Winter', 'Celebratory', 'Easy drinking',
]);

const STRUCTURAL_TAGS = new Set([
  'Equal-parts', 'Three-ingredient', 'No citrus', 'Low-ABV', 'High-ABV', 'Non-alcoholic',
  'Carbonated', 'Hot', 'Frozen', 'Classification review',
]);

const SUBSTITUTES = {
  'cointreau': ['triple-sec', 'orange-curacao', 'grand-marnier'],
  'campari': ['aperol', 'select-aperitivo', 'contratto-bitter', 'cappelletti-aperitivo'],
  'angostura-bitters': ['aromatic-bitters'],
  'sweet-vermouth': ['punt-e-mes'],
  'aperol': ['campari', 'select-aperitivo', 'cappelletti-aperitivo'],
  'dry-vermouth': ['blanc-vermouth', 'cocchi-americano'],
  'orange-curacao': ['cointreau', 'triple-sec', 'dry-curacao'],
};

const EXACT_TEMPLATE_OVERRIDES = {
  'old fashioned': 'Old-Fashioned',
  'manhattan': 'Manhattan',
  'perfect manhattan': 'Manhattan',
  'dry manhattan': 'Manhattan',
  'black manhattan': 'Manhattan',
  'martini': 'Martini',
  'dry martini': 'Martini',
  'wet martini': 'Martini',
  'perfect martini': 'Martini',
  'vodka martini': 'Martini',
  'dirty martini': 'Martini',
  'gibson': 'Martini',
  'vesper': 'Martini',
  'tuxedo': 'Martini',
  'negroni': 'Negroni',
  'white negroni': 'Negroni',
  'kingston negroni': 'Negroni',
  'mezcal negroni': 'Negroni',
  'boulevardier': 'Boulevardier',
  'old pal': 'Old Pal',
  'americano': 'Americano',
  'daiquiri': 'Daiquiri',
  'whiskey sour': 'Whiskey Sour',
  'gimlet': 'Gimlet',
  'margarita': 'Margarita',
  'sidecar': 'Sidecar',
  'white lady': 'White Lady',
  'cosmopolitan': 'Cosmopolitan',
  'paper plane': 'Paper Plane',
  'corpse reviver no. 2': 'Corpse Reviver No. 2',
  'last word': 'Last Word',
  'naked & famous': 'Last Word',
  'naked and famous': 'Last Word',
  'jungle bird': 'Jungle Bird',
  'tom collins': 'Tom Collins',
  'john collins': 'John Collins',
  'gin fizz': 'Gin Fizz',
  'moscow mule': 'Moscow Mule',
  'dark n stormy': 'Moscow Mule',
  'dark and stormy': 'Moscow Mule',
  'gin and tonic': 'Gin and Tonic',
  'whisky highball': 'Whisky Highball',
  'whiskey highball': 'Whisky Highball',
  'mai tai': 'Mai Tai',
  'planter s punch': "Planter's Punch",
  'planters punch': "Planter's Punch",
  'zombie': 'Zombie',
  'painkiller': 'Painkiller',
  'alexander': 'Alexander',
  'brandy alexander': 'Alexander',
  'irish coffee': 'Irish Coffee',
  'hot toddy': 'Hot Toddy',
};

const TEMPLATE_KEYWORDS = [
  ['negroni', 'Negroni'],
  ['boulevardier', 'Boulevardier'],
  ['old pal', 'Old Pal'],
  ['martini', 'Martini'],
  ['manhattan', 'Manhattan'],
  ['martinez', 'Martini'],
  ['daiquiri', 'Daiquiri'],
  ['gimlet', 'Gimlet'],
  ['sour', 'Whiskey Sour'],
  ['margarita', 'Margarita'],
  ['sidecar', 'Sidecar'],
  ['white lady', 'White Lady'],
  ['cosmo', 'Cosmopolitan'],
  ['cosmopolitan', 'Cosmopolitan'],
  ['paper plane', 'Paper Plane'],
  ['last word', 'Last Word'],
  ['corpse reviver', 'Corpse Reviver No. 2'],
  ['naked and famous', 'Last Word'],
  ['naked famous', 'Last Word'],
  ['collins', 'Tom Collins'],
  ['fizz', 'Gin Fizz'],
  ['mule', 'Moscow Mule'],
  ['buck', 'Moscow Mule'],
  ['spritz', 'Spritz'],
  ['highball', 'Whisky Highball'],
  ['mai tai', 'Mai Tai'],
  ['zombie', 'Zombie'],
  ['planter', "Planter's Punch"],
  ['jungle bird', 'Jungle Bird'],
  ['painkiller', 'Painkiller'],
  ['flip', 'Flip'],
  ['alexander', 'Alexander'],
];

const RESOLUTION_PATTERNS = [
  ['reposado tequila', 'tequila-reposado'],
  ['anejo tequila', 'tequila-anejo'],
  ['añejo tequila', 'tequila-anejo'],
  ['blanco tequila', 'tequila-blanco'],
  ['silver tequila', 'tequila-blanco'],
  ['rye whisky', 'rye-whiskey'],
  ['rye whiskey', 'rye-whiskey'],
  ['bourbon', 'bourbon'],
  ['irish whiskey', 'irish-whiskey'],
  ['canadian rye whisky', 'rye-whiskey'],
  ['canadian rye whiskey', 'rye-whiskey'],
  ['peated whisky', 'islay-scotch'],
  ['peated whiskey', 'islay-scotch'],
  ['scotch', 'blended-scotch'],
  ['mezcal', 'mezcal'],
  ['overproof white rum', 'overproof-rum'],
  ['151 demerara rum', 'demerara-overproof-rum'],
  ['demerara rum', 'demerara-rum'],
  ['jamaican rum', 'jamaican-rum'],
  ['unaged rum', 'white-rum'],
  ['dark rum', 'dark-rum'],
  ['aged rum', 'aged-rum'],
  [' rum', 'aged-rum'],
  ['gin', 'generic-gin'],
  ['vodka', 'vodka'],
  ['aquavit', 'aquavit'],
  ['amaro ramazzotti', 'amaro-ramazzotti'],
  ['ramazzotti amaro', 'amaro-ramazzotti'],
  ['gentian liqueur', 'suze'],
  ['gentian aperitif', 'suze'],
  ['salers gentiane aperitif', 'suze'],
  ['bergamot liqueur', 'italicus'],
  ['orange bitters', 'orange-bitters'],
  ['cherry liqueur', 'cherry-heering'],
  ['coffee liqueur', 'coffee-liqueur'],
  ['mr black', 'mr-black'],
  ['saline solution', 'salt'],
  ['saline', 'salt'],
  ['water', 'sparkling-mineral-water'],
  ['orgeat syrup', 'orgeat'],
  ['coconut syrup', 'orgeat'],
  ['rhubarb syrup', 'raspberry-syrup'],
  ['cranberry syrup', 'raspberry-syrup'],
  ['pineapple gum syrup', 'pineapple-juice'],
  ['white peach puree', 'peach-puree'],
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function stripDiacritics(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(value) {
  return stripDiacritics(String(value || ''))
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function titleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values) {
    if (!value && value !== false) continue;
    const key = typeof value === 'string' ? value : JSON.stringify(value);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function parseMixedNumber(text) {
  const input = String(text || '').trim();
  if (!input) return 0;
  if (/^\d+\/\d+$/.test(input)) {
    const [n, d] = input.split('/').map(Number);
    return d ? n / d : 0;
  }
  if (/^\d+\s+\d+\/\d+$/.test(input)) {
    const [whole, frac] = input.split(/\s+/);
    return parseFloat(whole) + parseMixedNumber(frac);
  }
  const cleaned = input.replace(',', '.');
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function extractLeadingAmount(text) {
  const match = String(text || '').trim().match(/^(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?|\d+\/\d+)/);
  return match ? parseMixedNumber(match[1]) : 0;
}

function parseMeasure(measureText) {
  const raw = String(measureText || '').trim();
  const lower = raw.toLowerCase();
  const optional = lower.includes('optional');
  const cleaned = lower.replace(/\(optional\)/g, '').trim();
  const amount = extractLeadingAmount(cleaned);

  if (!cleaned) {
    return { raw, optional, format: 'unknown', volumeMl: 0, structuralFormat: false };
  }
  if (cleaned.includes('to taste')) {
    return { raw, optional, format: 'to taste', volumeMl: 0, structuralFormat: false };
  }
  if (/\bto top\b|\btop\b/.test(cleaned)) {
    return { raw, optional, format: 'top', volumeMl: 0, structuralFormat: false };
  }
  if (cleaned.includes('rinse')) {
    return { raw, optional, format: 'rinse', volumeMl: 2, structuralFormat: false };
  }
  if (cleaned.includes('dash')) {
    return { raw, optional, format: 'dash', volumeMl: (amount || 1) * 2, structuralFormat: false };
  }
  if (cleaned.includes('drop')) {
    return { raw, optional, format: 'drop', volumeMl: (amount || 1) * 0.5, structuralFormat: false };
  }
  if (cleaned.includes('barspoon')) {
    return { raw, optional, format: 'barspoon', volumeMl: (amount || 1) * 5, structuralFormat: false };
  }
  if (cleaned.includes('splash')) {
    return { raw, optional, format: 'splash', volumeMl: (amount || 1) * 10, structuralFormat: false };
  }
  if (/\bcups?\b/.test(cleaned)) {
    return { raw, optional, format: 'cup', volumeMl: (amount || 1) * 240, structuralFormat: true };
  }
  if (/\btablespoons?\b|\btbsp\b/.test(cleaned)) {
    return { raw, optional, format: 'tablespoon', volumeMl: (amount || 1) * 15, structuralFormat: true };
  }
  if (/\bteaspoons?\b|\btsp\b/.test(cleaned)) {
    return { raw, optional, format: 'teaspoon', volumeMl: (amount || 1) * 5, structuralFormat: true };
  }
  if (/\bcl\b/.test(cleaned)) {
    return { raw, optional, format: 'cl', volumeMl: (amount || 0) * 10, structuralFormat: true };
  }
  if (/\bml\b/.test(cleaned)) {
    return { raw, optional, format: 'ml', volumeMl: amount || 0, structuralFormat: true };
  }
  if (/\boz\b|\bounce\b/.test(cleaned)) {
    return { raw, optional, format: 'oz', volumeMl: (amount || 0) * 30, structuralFormat: true };
  }
  if (/\bbottle\b/.test(cleaned)) {
    const inferredBottleSize = raw.includes('750') ? 750 : (amount || 1) * 750;
    return { raw, optional, format: 'bottle', volumeMl: inferredBottleSize, structuralFormat: true };
  }
  if (/^\d+(?:\.\d+)?$/.test(cleaned)) {
    return { raw, optional, format: 'count', volumeMl: amount || 0, structuralFormat: true };
  }
  return { raw, optional, format: 'unknown', volumeMl: amount || 0, structuralFormat: true };
}

function isAlwaysSeasoning(parsed) {
  return ['dash', 'drop', 'rinse', 'splash', 'barspoon', 'to taste', 'top'].includes(parsed.format);
}

function countsAsLengthener(entry) {
  if (!entry || entry.isOptional || !entry.roles.includes('lengthener')) return false;
  if (entry.parsed.format === 'top') return true;
  if (['dash', 'drop', 'rinse', 'splash', 'barspoon', 'to taste'].includes(entry.parsed.format)) return false;
  return entry.parsed.volumeMl > 0;
}

function ensureAliases(item, additions) {
  item.aliases = uniqueStrings([...(item.aliases || []), ...additions]).sort((a, b) => a.localeCompare(b));
}

function flattenIngredientContext(db) {
  const entries = [];
  for (const category of db.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const item of subcategory.items || []) {
        entries.push({ category, subcategory, item });
      }
    }
  }
  return entries;
}

function findIngredientContext(db, id) {
  return flattenIngredientContext(db).find((entry) => entry.item.id === id);
}

function removeIngredientById(db, id) {
  for (const category of db.categories || []) {
    for (const subcategory of category.subcategories || []) {
      const index = (subcategory.items || []).findIndex((item) => item.id === id);
      if (index >= 0) {
        return subcategory.items.splice(index, 1)[0];
      }
    }
  }
  return null;
}

function applyIngredientRecordFixes(db) {
  const bonal = findIngredientContext(db, 'bonal')?.item;
  if (bonal) {
    ensureAliases(bonal, ['bonal', 'bonal gentiane quina', 'bonal-gentiane-quina']);
    removeIngredientById(db, 'bonal-gentiane-quina');
  }

  const absinthe = findIngredientContext(db, 'absinthe')?.item;
  if (absinthe) {
    ensureAliases(absinthe, ['absinthe verte', 'absinthe-verte']);
    removeIngredientById(db, 'absinthe-verte');
  }

  const selectAperitivo = findIngredientContext(db, 'select-aperitivo')?.item;
  if (selectAperitivo) {
    ensureAliases(selectAperitivo, ['select bitter', 'select-bitter']);
    removeIngredientById(db, 'select-bitter');
  }

  const anchoChile = findIngredientContext(db, 'ancho-chile-liqueur')?.item;
  if (anchoChile) {
    ensureAliases(anchoChile, ['ancho reyes', 'ancho-reyes']);
    removeIngredientById(db, 'ancho-reyes');
  }

  const aliasAdditions = {
    'tequila-blanco': ['blanco tequila', 'silver tequila', 'white tequila'],
    'tequila-reposado': ['reposado tequila'],
    'tequila-anejo': ['anejo tequila', 'añejo tequila'],
    'rye-whiskey': ['rye whisky', 'canadian rye whisky', 'bonded rye'],
    'generic-gin': ['dry gin', 'japanese gin'],
    'gin': ['london dry gin', 'high-proof london dry gin'],
    'white-rum': ['unaged rum'],
    'overproof-rum': ['overproof white rum'],
    'demerara-overproof-rum': ['151 demerara rum'],
    'mezcal': ['joven mezcal', 'tomato-infused mezcal', 'beet-rested mezcal'],
    'amaro-ramazzotti': ['ramazzotti amaro'],
    'italicus': ['bergamot liqueur'],
    'suze': ['gentian liqueur', 'salers gentiane aperitif'],
    'salt': ['saline', 'saline solution'],
    'sweet-vermouth': ['italian vermouth'],
    'cherry-heering': ['cherry liqueur'],
    'orange-bitters': ['orange bitters such as angostura'],
    'mr-black': ['mr black'],
    'coffee-liqueur': ['coffee liqueur'],
    'orgeat': ['orgeat syrup', 'macadamia nut orgeat', 'pistachio orgeat'],
    'peach-puree': ['white peach puree'],
    'pineapple-juice': ['acid-adjusted pineapple juice', 'pineapple gum syrup'],
    'orange-juice': ['acid-adjusted orange juice'],
    'lime-juice': ['fresh lime juice', 'roses lime juice'],
    'lemon-juice': ['fresh lemon juice'],
  };

  for (const [id, aliases] of Object.entries(aliasAdditions)) {
    const item = findIngredientContext(db, id)?.item;
    if (item) ensureAliases(item, aliases);
  }
}

function inferIngredientType(entry) {
  const { category, subcategory, item } = entry;
  const id = item.id;
  const name = normalize(item.name);
  const categoryId = category.id;
  const subId = subcategory.id;

  if (categoryId === 'spirits') return 'base_spirit';
  if (subId === 'orange-liqueurs') return 'orange_liqueur';
  if (subId === 'nut-liqueurs') return 'nut_liqueur';
  if (subId === 'cream-liqueurs') return 'cream_liqueur';
  if (subId === 'coffee-liqueurs') return 'coffee_liqueur';
  if (subId === 'floral-liqueurs') return 'floral_liqueur';
  if (subId === 'fruit-liqueurs') return 'fruit_liqueur';
  if (subId === 'cocktail-bitters') return 'cocktail_bitters';
  if (subId === 'carbonated') return 'carbonated_mixer';
  if (subId === 'dairy' || subId === 'eggs') return 'dairy_egg';
  if (subId === 'citrus') return 'fresh_citrus';
  if (subId === 'herbs') return 'fresh_herb';
  if (subId === 'fruit') return 'fresh_fruit';
  if (subId === 'spicy') return 'spice_savory';
  if (categoryId === 'condiments') return 'condiment';
  if (categoryId === 'garnishes') return 'garnish';
  if (categoryId === 'coffee-tea') return 'coffee_tea';
  if (subId === 'sparkling') return 'sparkling_wine';
  if (subId === 'still-wine') return 'still_wine';
  if (subId === 'vermouth') return 'aromatized_wine';
  if (subId === 'sherry') return 'fortified_wine';
  if (subId === 'port-madeira') return 'fortified_wine';
  if (subId === 'aromatized-wines') {
    if (id === 'pineau-des-charentes') return 'fortified_wine';
    return 'aromatized_wine';
  }
  if (subId === 'juices') {
    if (['lemon-juice', 'lime-juice'].includes(id)) return 'sour_acid';
    return 'juice';
  }
  if (subId === 'sugars') return 'sweetener';
  if (subId === 'syrups') {
    if ([
      'simple-syrup', 'rich-simple-syrup', 'demerara-syrup', 'honey-syrup', 'agave-syrup',
      'maple-syrup', 'turbinado-syrup'
    ].includes(id)) {
      return 'sweetener';
    }
    return 'flavored_syrup';
  }
  if (subId === 'herbal-liqueurs') {
    if (['ancho-chile-liqueur'].includes(id)) return 'other_liqueur';
    return 'herbal_liqueur';
  }
  if (subId === 'amari') {
    if (['bonal', 'byrrh', 'byrrh-grande-quinquina', 'cardamaro'].includes(id)) return 'aromatized_wine';
    if (id === 'italicus') return 'floral_liqueur';
    return 'bitter_modifier';
  }
  if (subId === 'other-liqueurs') return 'other_liqueur';

  if (name.includes('juice')) return 'juice';
  return 'other_liqueur';
}

function inferUsageType(entry, ingredientType) {
  const { subcategory, item } = entry;
  const id = item.id;

  if (ingredientType === 'garnish') return 'garnish';
  if (ingredientType === 'cocktail_bitters') return 'dashes';
  if (ingredientType === 'carbonated_mixer') return 'top';
  if (ingredientType === 'fresh_herb' || ingredientType === 'fresh_fruit' || ingredientType === 'spice_savory') return 'muddled';
  if (ingredientType === 'fresh_citrus') return 'garnish';
  if (ingredientType === 'sparkling_wine') return 'top';
  if (ingredientType === 'condiment') return id === 'olive-brine' ? 'measured_small' : 'dashes';
  if (ingredientType === 'coffee_tea') return 'measured_full';
  if (ingredientType === 'dairy_egg') return 'measured_full';
  if (ingredientType === 'sweetener') {
    return subcategory.id === 'sugars' ? 'measured_small' : 'measured_full';
  }
  if (ingredientType === 'flavored_syrup') return 'measured_full';
  if (ingredientType === 'juice' || ingredientType === 'sour_acid') return 'measured_full';
  if (id === 'absinthe') return 'rinse';
  if (id === 'overproof-rum' || id === 'demerara-overproof-rum') return 'float';
  if (['maraschino-liqueur', 'creme-de-cassis', 'allspice-dram', 'pimento-dram', 'falernum', 'velvet-falernum'].includes(id)) {
    return 'measured_small';
  }
  return 'measured_full';
}

function inferCanBeStructuralBitter(entry, ingredientType) {
  const id = entry.item.id;
  if (!['bitter_modifier', 'herbal_liqueur'].includes(ingredientType)) return null;
  if ([
    'campari', 'aperol', 'cynar', 'suze', 'fernet-branca', 'amaro-nonino', 'amaro-averna',
    'amaro-montenegro', 'amaro-lucano', 'amaro-meletti', 'amaro-ramazzotti', 'amaro-nardini',
    'amaro-braulio', 'amaro-zucca', 'amaro-dell-etna', 'china-china', 'pelinkovac',
    'cappelletti-aperitivo', 'contratto-bitter', 'select-aperitivo', 'luxardo-bitter-bianco',
    'amaro-abano', 'becherovka'
  ].includes(id)) {
    return true;
  }
  return false;
}

function inferCanBeCoBase(entry, ingredientType) {
  const id = entry.item.id;
  if (!['aromatized_wine', 'fortified_wine', 'bitter_modifier'].includes(ingredientType)) return null;
  if (ingredientType === 'bitter_modifier') return false;
  if ([
    'sweet-vermouth', 'dry-vermouth', 'blanc-vermouth', 'punt-e-mes', 'rose-vermouth',
    'lillet-blanc', 'lillet-rose', 'lillet-rouge', 'cocchi-americano', 'cocchi-rosa',
    'dubonnet', 'dubonnet-rouge', 'dubonnet-blanc', 'bonal', 'byrrh-grande-quinquina',
    'byrrh', 'fino-sherry', 'manzanilla-sherry', 'amontillado-sherry', 'oloroso-sherry',
    'dry-sack-sherry', 'madeira', 'cardamaro'
  ].includes(id)) {
    return true;
  }
  return false;
}

function inferBitternessLevel(entry, ingredientType) {
  const id = entry.item.id;
  if (!['bitter_modifier', 'herbal_liqueur', 'aromatized_wine', 'cocktail_bitters'].includes(ingredientType)) return null;
  if (['aperol', 'amaro-montenegro', 'sweet-vermouth', 'blanc-vermouth', 'lillet-blanc', 'rose-vermouth'].includes(id)) return 'low';
  if (['campari', 'cynar', 'suze', 'amaro-nonino', 'select-aperitivo', 'contratto-bitter', 'bonal', 'cardamaro', 'byrrh', 'byrrh-grande-quinquina'].includes(id)) return 'medium';
  if (['angostura-bitters', 'peychauds-bitters', 'orange-bitters', 'chocolate-bitters', 'celery-bitters', 'grapefruit-bitters', 'black-walnut-bitters'].includes(id)) return 'high';
  if (['fernet-branca', 'pelinkovac', 'absinthe'].includes(id)) return 'very_high';
  return ingredientType === 'cocktail_bitters' ? 'high' : 'medium';
}

function inferSweetnessLevel(entry, ingredientType) {
  const id = entry.item.id;
  if (!['sweetener', 'flavored_syrup', 'fruit_liqueur', 'orange_liqueur', 'cream_liqueur', 'bitter_modifier', 'coffee_liqueur', 'nut_liqueur', 'floral_liqueur', 'other_liqueur', 'aromatized_wine', 'fortified_wine'].includes(ingredientType)) {
    return null;
  }
  if (['dry-vermouth', 'fino-sherry', 'manzanilla-sherry', 'amontillado-sherry', 'dry-white-wine'].includes(id)) return 'dry';
  if (['campari', 'suze', 'cynar', 'select-aperitivo', 'contratto-bitter', 'bonal', 'byrrh', 'byrrh-grande-quinquina'].includes(id)) return 'off_dry';
  if (['sweet-vermouth', 'blanc-vermouth', 'punt-e-mes', 'dubonnet', 'dubonnet-rouge', 'amaro-nonino', 'amaro-montenegro', 'amaro-lucano', 'amaro-ramazzotti', 'amaro-meletti', 'amaro-averna'].includes(id)) return 'medium';
  if (['cointreau', 'grand-marnier', 'orange-curacao', 'triple-sec', 'dry-curacao', 'drambuie', 'licor-43', 'falernum', 'velvet-falernum', 'amaretto', 'frangelico', 'baileys', 'coffee-liqueur', 'kahlua', 'tia-maria', 'mr-black'].includes(id)) return 'sweet';
  if (ingredientType === 'sweetener' || ingredientType === 'flavored_syrup' || ['creme-de-cassis', 'simple-syrup', 'rich-simple-syrup', 'grenadine'].includes(id)) return 'very_sweet';
  return ingredientType === 'bitter_modifier' ? 'medium' : 'sweet';
}

function inferAcidLevel(entry, ingredientType) {
  const id = entry.item.id;
  if (!['sour_acid', 'juice'].includes(ingredientType)) return null;
  if (id === 'lime-juice') return 'very_high';
  if (id === 'lemon-juice') return 'high';
  if (id === 'grapefruit-juice' || id === 'cranberry-juice' || id === 'pomegranate-juice') return 'medium';
  if (id === 'orange-juice' || id === 'apple-juice' || id === 'pineapple-juice' || id === 'peach-puree' || id === 'coconut-water') return 'low';
  return ingredientType === 'sour_acid' ? 'high' : 'low';
}

function inferAbvRange(entry, ingredientType) {
  const { category, subcategory, item } = entry;
  const id = item.id;

  if (['juice', 'sour_acid', 'sweetener', 'flavored_syrup', 'dairy_egg', 'fresh_herb', 'fresh_citrus', 'fresh_fruit', 'spice_savory', 'condiment', 'garnish', 'coffee_tea'].includes(ingredientType)) {
    return { min: 0.0, max: 0.0 };
  }
  if (ingredientType === 'carbonated_mixer') return { min: 0.0, max: 0.0 };
  if (ingredientType === 'still_wine') return { min: 0.12, max: 0.14 };
  if (ingredientType === 'sparkling_wine') return { min: 0.11, max: 0.12 };
  if (ingredientType === 'aromatized_wine') return { min: 0.15, max: 0.18 };
  if (ingredientType === 'fortified_wine') {
    if (id === 'ruby-port' || id === 'tawny-port' || id === 'white-port') return { min: 0.19, max: 0.21 };
    return { min: 0.15, max: 0.22 };
  }
  if (ingredientType === 'cocktail_bitters') return { min: 0.35, max: 0.45 };
  if (ingredientType === 'orange_liqueur') {
    if (id === 'cointreau') return { min: 0.40, max: 0.40 };
    return { min: 0.24, max: 0.40 };
  }
  if (ingredientType === 'bitter_modifier') {
    if (id === 'aperol') return { min: 0.11, max: 0.11 };
    if (id === 'campari') return { min: 0.24, max: 0.25 };
    if (id === 'fernet-branca') return { min: 0.39, max: 0.39 };
    return { min: 0.16, max: 0.35 };
  }
  if (['herbal_liqueur', 'fruit_liqueur', 'nut_liqueur', 'cream_liqueur', 'coffee_liqueur', 'floral_liqueur', 'other_liqueur'].includes(ingredientType)) {
    return { min: 0.15, max: 0.40 };
  }
  if (ingredientType === 'base_spirit') {
    if (subcategory.id === 'vodka') return { min: 0.37, max: 0.45 };
    if (subcategory.id === 'gin') return id === 'navy-strength-gin' ? { min: 0.57, max: 0.57 } : { min: 0.40, max: 0.47 };
    if (subcategory.id === 'rum') {
      if (['overproof-rum', 'demerara-overproof-rum'].includes(id)) return { min: 0.57, max: 0.75 };
      return { min: 0.38, max: 0.50 };
    }
    if (subcategory.id === 'agave') {
      if (id.includes('mezcal')) return { min: 0.40, max: 0.45 };
      return { min: 0.38, max: 0.42 };
    }
    if (subcategory.id === 'whiskey') {
      if (id === 'fireball-cinnamon-whiskey') return { min: 0.33, max: 0.33 };
      return { min: 0.40, max: 0.50 };
    }
    if (subcategory.id === 'brandy') return { min: 0.38, max: 0.45 };
    if (category.id === 'spirits') return { min: 0.25, max: 0.60 };
  }
  return { min: 0.0, max: 0.0 };
}

function inferFlavorProfile(entry, ingredientType) {
  const blob = normalize(`${entry.item.name} ${entry.item.description || ''} ${(entry.item.aliases || []).join(' ')}`);
  const flavors = new Set();

  const keywords = [
    ['bitter', 'bitter'],
    ['sweet', 'sweet'],
    ['syrup', 'sweet'],
    ['sour', 'sour'],
    ['salty', 'salty'],
    ['umami', 'umami'],
    ['herbal', 'herbal'],
    ['botanical', 'herbal'],
    ['floral', 'floral'],
    ['fruit', 'fruity'],
    ['berry', 'fruity'],
    ['cherry', 'fruity'],
    ['orange', 'citrus'],
    ['lemon', 'citrus'],
    ['lime', 'citrus'],
    ['grapefruit', 'citrus'],
    ['bergamot', 'citrus'],
    ['pineapple', 'tropical'],
    ['passion fruit', 'tropical'],
    ['banana', 'tropical'],
    ['coconut', 'tropical'],
    ['almond', 'nutty'],
    ['hazelnut', 'nutty'],
    ['walnut', 'nutty'],
    ['smok', 'smoky'],
    ['cinnamon', 'spiced'],
    ['clove', 'spiced'],
    ['spice', 'spiced'],
    ['earth', 'earthy'],
    ['oxidative', 'oxidative'],
    ['coffee', 'coffee'],
    ['espresso', 'coffee'],
    ['cacao', 'chocolate'],
    ['chocolate', 'chocolate'],
    ['anise', 'anise'],
    ['licorice', 'anise'],
    ['mint', 'mint'],
    ['vegetal', 'vegetal'],
    ['agave', 'vegetal'],
    ['artichoke', 'vegetal'],
    ['savory', 'savory'],
    ['oak', 'woody'],
    ['wood', 'woody'],
    ['caramel', 'caramel'],
    ['vanilla', 'vanilla'],
  ];

  for (const [needle, tag] of keywords) {
    if (blob.includes(needle)) flavors.add(tag);
  }

  if (ingredientType === 'base_spirit' && flavors.size === 0) flavors.add('woody');
  if (ingredientType === 'orange_liqueur') {
    flavors.add('citrus');
    flavors.add('sweet');
  }
  if (ingredientType === 'sour_acid') {
    flavors.add('sour');
    flavors.add('citrus');
  }
  if (ingredientType === 'sweetener') flavors.add('sweet');
  if (ingredientType === 'flavored_syrup') {
    flavors.add('sweet');
    if (entry.item.id === 'orgeat') flavors.add('nutty');
  }
  if (ingredientType === 'bitter_modifier' && !flavors.has('bitter')) flavors.add('bitter');
  if (ingredientType === 'aromatized_wine' && !flavors.has('herbal')) flavors.add('herbal');
  if (ingredientType === 'coffee_liqueur') flavors.add('coffee');
  if (ingredientType === 'cream_liqueur') {
    flavors.add('sweet');
    if (!flavors.size) flavors.add('vanilla');
  }

  return Array.from(flavors).slice(0, 5);
}

function inferTextureContribution(entry, ingredientType) {
  const id = entry.item.id;
  if (ingredientType === 'carbonated_mixer') return 'thins';
  if (ingredientType === 'flavored_syrup') return ['orgeat', 'grenadine'].includes(id) ? 'adds_viscosity' : 'adds_body';
  if (ingredientType === 'sweetener') return ['simple-syrup', 'rich-simple-syrup', 'demerara-syrup', 'honey-syrup', 'agave-syrup', 'maple-syrup', 'turbinado-syrup'].includes(id) ? 'adds_viscosity' : 'neutral';
  if (ingredientType === 'dairy_egg') {
    if (id === 'egg-white' || id === 'aquafaba') return 'adds_foam';
    if (id === 'whole-egg' || id === 'egg-yolk' || id === 'heavy-cream' || id === 'half-and-half' || id === 'whole-milk' || id === 'coconut-cream') return 'adds_richness';
    return 'adds_body';
  }
  if (ingredientType === 'juice') {
    if (['pineapple-juice', 'tomato-juice', 'peach-puree', 'passion-fruit-puree'].includes(id)) return 'adds_body';
    return 'neutral';
  }
  return 'neutral';
}

function inferStructuralRoles(entry, ingredientType, usageType, canBeCoBase, canBeStructuralBitter) {
  const id = entry.item.id;
  switch (ingredientType) {
    case 'base_spirit':
      return id === 'absinthe' ? ['seasoning'] : ['base'];
    case 'aromatized_wine':
      return canBeCoBase ? ['co_base'] : ['structural_modifier'];
    case 'fortified_wine':
      return canBeCoBase ? ['co_base'] : ['sweetener', 'structural_modifier'];
    case 'bitter_modifier':
      return canBeStructuralBitter ? ['structural_bitter', 'flavor_accent'] : ['flavor_accent'];
    case 'herbal_liqueur':
    case 'fruit_liqueur':
    case 'orange_liqueur':
    case 'nut_liqueur':
    case 'coffee_liqueur':
    case 'floral_liqueur':
    case 'other_liqueur':
      return ['structural_modifier', 'flavor_accent'];
    case 'cream_liqueur':
      return ['structural_modifier', 'sweetener'];
    case 'cocktail_bitters':
      return ['seasoning'];
    case 'sour_acid':
      return ['sour_acid'];
    case 'juice':
      return ['flavor_accent'];
    case 'sweetener':
      return ['sweetener'];
    case 'flavored_syrup':
      return ['sweetener', 'flavor_accent'];
    case 'carbonated_mixer':
      return ['lengthener'];
    case 'dairy_egg':
      return ['texture_agent'];
    case 'sparkling_wine':
      return ['lengthener', 'co_base'];
    case 'still_wine':
      return ['co_base'];
    case 'fresh_herb':
    case 'fresh_fruit':
    case 'spice_savory':
    case 'coffee_tea':
      return ['flavor_accent'];
    case 'fresh_citrus':
      return usageType === 'garnish' ? ['garnish'] : ['flavor_accent'];
    case 'condiment':
      return ['seasoning'];
    case 'garnish':
      return ['garnish'];
    default:
      return ['flavor_accent'];
  }
}

function inferFamilySignals(entry, ingredientType) {
  const id = entry.item.id;
  const signals = new Set();

  if (ingredientType === 'base_spirit') {
    ['old_fashioned', 'aromatized', 'bitter_aromatized', 'sour', 'daisy', 'enhanced_sour', 'collins', 'highball'].forEach((id) => signals.add(id));
    if (normalize(entry.item.name).includes('rum') || ['cachaca', 'rhum-agricole', 'rhum-agricole-blanc', 'rhum-agricole-vieux', 'jamaican-rum', 'demerara-rum', 'barbados-rum'].includes(id)) {
      signals.add('tropical_punch');
    }
  } else if (ingredientType === 'aromatized_wine' || ingredientType === 'fortified_wine') {
    signals.add('aromatized');
    signals.add('bitter_aromatized');
  } else if (ingredientType === 'bitter_modifier') {
    signals.add('bitter_aromatized');
    signals.add('enhanced_sour');
    if (['aperol', 'campari', 'select-aperitivo', 'cappelletti-aperitivo'].includes(id)) signals.add('highball');
  } else if (['orange_liqueur', 'fruit_liqueur', 'floral_liqueur', 'nut_liqueur'].includes(ingredientType)) {
    signals.add('daisy');
    signals.add('enhanced_sour');
  } else if (ingredientType === 'herbal_liqueur') {
    signals.add('enhanced_sour');
  } else if (ingredientType === 'other_liqueur') {
    signals.add('enhanced_sour');
    signals.add('daisy');
  } else if (ingredientType === 'sour_acid') {
    ['sour', 'daisy', 'enhanced_sour', 'collins'].forEach((id) => signals.add(id));
    if (entry.item.id === 'lime-juice') signals.add('tropical_punch');
  } else if (ingredientType === 'carbonated_mixer') {
    signals.add('collins');
    signals.add('highball');
  } else if (ingredientType === 'dairy_egg') {
    signals.add('rich_creamy');
    if (entry.item.id === 'egg-white') signals.add('sour');
  } else if (ingredientType === 'sweetener') {
    signals.add('old_fashioned');
    signals.add('sour');
    signals.add('collins');
  } else if (ingredientType === 'flavored_syrup') {
    signals.add('daisy');
    signals.add('enhanced_sour');
    if (['orgeat', 'passion-fruit-syrup', 'ginger-syrup', 'cinnamon-syrup', 'falernum', 'velvet-falernum'].includes(entry.item.id)) {
      signals.add('tropical_punch');
    }
  } else if (ingredientType === 'sparkling_wine') {
    signals.add('highball');
    signals.add('bitter_aromatized');
  }

  return FAMILY_IDS.filter((id) => signals.has(id));
}

function inferQualityTier(entry, ingredientType) {
  const id = entry.item.id;
  if (id === 'fireball-cinnamon-whiskey') return 'novelty';
  if (['peach-schnapps', 'midori', 'blue-curacao', 'passoa', 'pistachio-cream-liqueur'].includes(id)) return 'casual';
  if ([
    'angostura-bitters', 'peychauds-bitters', 'orange-bitters', 'sweet-vermouth', 'dry-vermouth',
    'campari', 'cointreau', 'simple-syrup', 'lemon-juice', 'lime-juice', 'egg-white'
  ].includes(id)) {
    return 'classic';
  }
  return 'craft';
}

function enrichIngredientEntry(entry) {
  const ingredientType = inferIngredientType(entry);
  const usageType = inferUsageType(entry, ingredientType);
  const canBeStructuralBitter = inferCanBeStructuralBitter(entry, ingredientType);
  const canBeCoBase = inferCanBeCoBase(entry, ingredientType);
  const structuralRoles = inferStructuralRoles(entry, ingredientType, usageType, canBeCoBase, canBeStructuralBitter);
  const enriched = {
    ...entry.item,
    ingredient_type: ingredientType,
    structural_roles: structuralRoles,
    can_be_structural_bitter: canBeStructuralBitter,
    can_be_co_base: canBeCoBase,
    bitterness_level: inferBitternessLevel(entry, ingredientType),
    sweetness_level: inferSweetnessLevel(entry, ingredientType),
    acid_level: inferAcidLevel(entry, ingredientType),
    abv_range: inferAbvRange(entry, ingredientType),
    flavor_profile: inferFlavorProfile(entry, ingredientType),
    texture_contribution: inferTextureContribution(entry, ingredientType),
    usage_type: usageType,
    family_signals: inferFamilySignals(entry, ingredientType),
    substitute_ids: SUBSTITUTES[entry.item.id] || [],
    cocktail_quality_tier: inferQualityTier(entry, ingredientType),
  };

  if (!enriched.aliases) enriched.aliases = [];
  return enriched;
}

function buildIngredientIndex(db) {
  const exact = new Map();
  const all = [];

  for (const entry of flattenIngredientContext(db)) {
    const item = entry.item;
    const tokens = uniqueStrings([item.id, slugify(item.id), item.name, ...(item.aliases || [])]);
    for (const token of tokens) {
      const key = normalize(token);
      if (!key) continue;
      if (!exact.has(key)) exact.set(key, entry);
    }
    all.push(entry);
  }

  return { exact, all };
}

function resolveIngredient(rawName, ingredientIndex) {
  const normalized = normalize(rawName);
  if (!normalized) return { entry: null, via: 'empty', raw: rawName };

  if (ingredientIndex.exact.has(normalized)) {
    return { entry: ingredientIndex.exact.get(normalized), via: 'exact', raw: rawName };
  }

  for (const [needle, ingredientId] of RESOLUTION_PATTERNS) {
    if (normalized.includes(needle)) {
      const match = ingredientIndex.all.find((entry) => entry.item.id === ingredientId);
      if (match) return { entry: match, via: 'pattern', raw: rawName };
    }
  }

  const candidates = [];
  for (const entry of ingredientIndex.all) {
    const parts = uniqueStrings([entry.item.name, ...(entry.item.aliases || []), entry.item.id]);
    for (const part of parts) {
      const partNorm = normalize(part);
      if (!partNorm || partNorm.length < 3) continue;
      if (normalized === partNorm || normalized.includes(partNorm) || partNorm.includes(normalized)) {
        candidates.push({ entry, score: partNorm.length });
      }
    }
  }

  if (candidates.length) {
    candidates.sort((a, b) => b.score - a.score);
    return { entry: candidates[0].entry, via: 'fuzzy', raw: rawName };
  }

  return { entry: null, via: 'unmatched', raw: rawName };
}

function mapBaseSpiritLabel(itemId, itemName, ingredientType, subcategoryId) {
  const name = normalize(itemName);
  if (ingredientType !== 'base_spirit') return 'Other';
  if (subcategoryId === 'gin') return 'Gin';
  if (subcategoryId === 'vodka') return 'Vodka';
  if (subcategoryId === 'rum') {
    if (name.includes('white') || name.includes('silver') || name.includes('light') || itemId === 'cuban-style-white-rum') return 'Rum — White';
    if (name.includes('overproof') || itemId.includes('overproof')) return 'Rum — Overproof';
    return 'Rum — Aged';
  }
  if (subcategoryId === 'whiskey') {
    if (name.includes('bourbon') || itemId === 'tennessee-whiskey') return 'Whiskey — Bourbon';
    if (name.includes('rye')) return 'Whiskey — Rye';
    if (name.includes('irish')) return 'Whiskey — Irish';
    if (name.includes('scotch')) return 'Whiskey — Scotch';
    return 'Other';
  }
  if (subcategoryId === 'agave') {
    if (name.includes('anejo') || name.includes('añejo')) return 'Tequila — Añejo';
    if (name.includes('reposado')) return 'Tequila — Reposado';
    if (name.includes('mezcal')) return 'Mezcal';
    if (name.includes('tequila')) return 'Tequila — Blanco';
    return 'Mezcal';
  }
  if (subcategoryId === 'brandy') {
    if (name.includes('pisco')) return 'Pisco';
    if (name.includes('calvados') || name.includes('applejack')) return 'Calvados';
    if (name.includes('eau de vie') || itemId === 'eau-de-vie') return 'Eau de vie';
    return 'Brandy / Cognac';
  }
  if (itemId === 'aquavit') return 'Aquavit';
  if (itemId === 'shochu' || itemId === 'soju') return 'Shochu / Soju';
  return 'Other';
}

function detectBuildMethod(drink) {
  const text = normalize(`${drink.instructions || ''} ${drink.name || ''}`);
  if (text.includes('blend')) return 'Blended';
  if (text.includes('swizzle')) return 'Swizzled';
  if (text.includes('throw')) return 'Thrown';
  if (text.includes('whip shake')) return 'Whipped';
  if (text.includes('shake')) return 'Shaken';
  if (text.includes('stir')) return 'Stirred';
  return 'Built';
}

function detectServiceStyle(drink) {
  const glass = normalize(drink.glass || '');
  const instructions = normalize(drink.instructions || '');
  if (instructions.includes('hot') || glass.includes('mug') || glass.includes('irish coffee')) return 'Hot';
  if (instructions.includes('frozen') || instructions.includes('blend') || glass.includes('frozen')) return 'Frozen';
  if (glass.includes('collins') || glass.includes('highball') || glass.includes('flute') || glass.includes('tall')) return 'Long / tall';
  if (instructions.includes('over ice') || glass.includes('rocks')) return 'Rocks';
  if (glass.includes('coupe') || glass.includes('martini') || glass.includes('cocktail') || glass.includes('nick') || glass.includes('sour glass')) return 'Up';
  if (glass.includes('snifter')) return 'Neat';
  return 'Rocks';
}

function inferPrimaryTemplate(drink, family) {
  const name = normalize(drink.name);
  if (EXACT_TEMPLATE_OVERRIDES[name]) return EXACT_TEMPLATE_OVERRIDES[name];
  for (const [needle, template] of TEMPLATE_KEYWORDS) {
    if (name.includes(needle)) return template;
  }
  if (family === 'Bitter Aromatized') return 'Negroni';
  if (family === 'Aromatized') return normalize(drink.name).includes('martini') ? 'Martini' : 'Manhattan';
  if (family === 'Collins') return normalize(drink.name).includes('john collins') ? 'John Collins' : 'Tom Collins';
  if (family === 'Highball') return normalize(drink.name).includes('mule') || normalize(drink.name).includes('buck') ? 'Moscow Mule' : titleCase(drink.name);
  return titleCase(drink.name);
}

function noteAppend(notes, text) {
  if (!text) return;
  if (!notes.includes(text)) notes.push(text);
}

function deriveRecipeIngredients(drink, ingredientIndex) {
  return (drink.ingredients || []).map((ingredient) => {
    const parsed = parseMeasure(ingredient.measure);
    const resolution = resolveIngredient(ingredient.name, ingredientIndex);
    const item = resolution.entry?.item || null;
    const subcategoryId = resolution.entry?.subcategory?.id || '';
    const ingredientType = item?.ingredient_type || inferIngredientType({
      category: { id: '' },
      subcategory: { id: '' },
      item: { id: slugify(ingredient.name), name: ingredient.name, aliases: [], description: '' }
    });
    return {
      rawName: ingredient.name,
      measure: ingredient.measure,
      parsed,
      resolution,
      item,
      subcategoryId,
      ingredientType,
      roles: item?.structural_roles || [],
      canBeStructuralBitter: item?.can_be_structural_bitter === true,
      canBeCoBase: item?.can_be_co_base === true,
      abvRange: item?.abv_range || { min: 0, max: 0 },
      usageType: item?.usage_type || 'measured_full',
      nameMismatch: item ? normalize(ingredient.name) !== normalize(item.name) && slugify(ingredient.name) !== item.id : true,
      isAlcoholic: !!item && ((item.abv_range?.max || 0) > 0),
      isOptional: parsed.optional,
    };
  });
}

function isIngredientStructural(entry, tsv) {
  if (!entry || entry.isOptional) return false;
  if (isAlwaysSeasoning(entry.parsed)) return false;
  if (tsv <= 0 || entry.parsed.volumeMl <= 0) return false;
  const ratio = entry.parsed.volumeMl / tsv;
  if (ratio >= 0.40) return true;
  return false;
}

function passesRemovalTest(entry, recipeName, familyHint) {
  const normalizedName = normalize(recipeName);
  if (entry.parsed.volumeMl <= 0) return false;
  if (entry.ingredientType === 'aromatized_wine' || entry.ingredientType === 'fortified_wine') return true;
  if (entry.ingredientType === 'sour_acid') return true;
  if (entry.roles.includes('structural_modifier') || entry.roles.includes('structural_bitter')) {
    if (normalizedName.includes('jungle bird') || normalizedName.includes('paper plane') || normalizedName.includes('last word')) return true;
    if (familyHint === 'tropical') return true;
  }
  return false;
}

function computeStructuralContext(recipeIngredients, drink) {
  const notes = [];
  const active = recipeIngredients.filter((entry) => !entry.isOptional);
  const baseSpirits = active.filter((entry) => entry.item?.ingredient_type === 'base_spirit' && entry.roles.includes('base'));
  let tsv = baseSpirits.reduce((sum, entry) => sum + entry.parsed.volumeMl, 0);

  if (tsv <= 0) {
    tsv = active.filter((entry) => entry.isAlcoholic).reduce((sum, entry) => sum + entry.parsed.volumeMl, 0);
    if (tsv > 0) {
      noteAppend(notes, 'No distilled base spirit identified; TSV calculated from all measured alcoholic components.');
    }
  }

  const decorated = active.map((entry) => {
    const roleRatio = tsv > 0 ? entry.parsed.volumeMl / tsv : 0;
    const structural = isIngredientStructural(entry, tsv) || (roleRatio >= 0.20 && roleRatio < 0.40 && passesRemovalTest(entry, drink.name, drink.category === 'Tiki' ? 'tropical' : ''));
    return { ...entry, roleRatio, structural };
  });

  const structuralBitters = decorated.filter((entry) => entry.structural && entry.canBeStructuralBitter);
  const structuralCoBases = decorated.filter((entry) => entry.structural && (entry.canBeCoBase || (entry.item?.ingredient_type === 'sparkling_wine' && tsv === active.filter((x) => x.isAlcoholic).reduce((sum, x) => sum + x.parsed.volumeMl, 0))));
  const structuralSourAcids = decorated.filter((entry) => entry.structural && entry.item?.ingredient_type === 'sour_acid');
  const structuralModifiers = decorated.filter((entry) => entry.structural && (entry.roles.includes('structural_modifier') || entry.roles.includes('structural_bitter')) && !entry.canBeCoBase);
  const lengtheners = decorated.filter((entry) => countsAsLengthener(entry));
  const flavoredLengthener = lengtheners.some((entry) => entry.item?.ingredient_type === 'carbonated_mixer' && !['club-soda', 'sparkling-mineral-water'].includes(entry.item?.id));
  const neutralLengthener = lengtheners.some((entry) => entry.item?.ingredient_type === 'carbonated_mixer' && ['club-soda', 'sparkling-mineral-water'].includes(entry.item?.id));
  const textureAgents = decorated.filter((entry) => entry.roles.includes('texture_agent'));

  const tropicalSignals = decorated.filter((entry) => {
    const id = entry.item?.id;
    return [
      'orgeat', 'falernum', 'velvet-falernum', 'allspice-dram', 'pimento-dram',
      'passion-fruit-syrup', 'passion-fruit-puree', 'pineapple-juice', 'coconut-cream',
      'coconut-milk', 'coconut-water'
    ].includes(id) || entry.item?.family_signals?.includes('tropical_punch');
  });

  const rumBaseCount = decorated.filter((entry) => entry.roles.includes('base') && mapBaseSpiritLabel(entry.item?.id, entry.item?.name, entry.item?.ingredient_type, entry.subcategoryId).startsWith('Rum')).length;
  const nonSeasoningCount = decorated.filter((entry) => !isAlwaysSeasoning(entry.parsed) && entry.parsed.volumeMl > 0).length;
  const tropicalLayered = (
    tropicalSignals.length >= 2 ||
    (rumBaseCount >= 1 && tropicalSignals.length >= 1 && structuralModifiers.length >= 1) ||
    (rumBaseCount >= 1 && decorated.filter((entry) => entry.item?.ingredient_type === 'juice').length >= 2)
  );

  const texturePrimary = textureAgents.some((entry) => {
    if (entry.parsed.format === 'count' && entry.parsed.volumeMl === 1) return true;
    return entry.structural || normalize(drink.name).includes('flip') || normalize(drink.name).includes('alexander') || normalize(drink.name).includes('eggnog');
  });

  return {
    notes,
    tsv,
    decorated,
    structuralBitters,
    structuralCoBases,
    structuralSourAcids,
    structuralModifiers,
    lengtheners,
    flavoredLengthener,
    neutralLengthener,
    textureAgents,
    tropicalLayered,
    nonSeasoningCount,
  };
}

function classifyFamily(drink, ctx) {
  const name = normalize(drink.name);
  const hasAnyCoBase = ctx.decorated.some((entry) => !entry.isOptional && entry.canBeCoBase && entry.parsed.volumeMl > 0);
  const nameExceptionAromatized = hasAnyCoBase && (
    name.includes('martini') ||
    ['gibson', 'vesper', 'bamboo', 'adonis', 'chrysanthemum', 'tuxedo', 'fifty fifty'].includes(name)
  );

  if (ctx.textureAgents.length > 0 && (ctx.textureAgents.some((entry) => entry.structural) || name.includes('flip') || name.includes('alexander') || name.includes('eggnog'))) {
    return 'Rich & Creamy';
  }

  if (ctx.tropicalLayered && !name.includes('jungle bird')) {
    return 'Tropical / Punch-derived';
  }

  if (ctx.structuralBitters.length > 0) {
    if (ctx.structuralCoBases.length > 0) return 'Bitter Aromatized';
    if (ctx.structuralSourAcids.length > 0) return 'Enhanced Sour';
    return 'Old-Fashioned';
  }

  if (ctx.structuralCoBases.length > 0) return 'Aromatized';
  if (nameExceptionAromatized) return 'Aromatized';

  if (ctx.structuralSourAcids.length > 0) {
    if (ctx.lengtheners.length > 0) {
      return ctx.flavoredLengthener ? 'Highball' : 'Collins';
    }
    if (ctx.structuralModifiers.length >= 2) return 'Enhanced Sour';
    if (ctx.structuralModifiers.length === 1) return 'Daisy';
    return 'Sour';
  }

  if (ctx.lengtheners.length > 0) return 'Highball';
  if (ctx.tropicalLayered) return 'Tropical / Punch-derived';
  return 'Old-Fashioned';
}

function approxDrinkAbv(recipeIngredients) {
  const active = recipeIngredients.filter((entry) => !entry.isOptional && entry.parsed.volumeMl > 0);
  const totalVolume = active.reduce((sum, entry) => sum + entry.parsed.volumeMl, 0);
  if (totalVolume <= 0) return 0;
  const alcoholVolume = active.reduce((sum, entry) => sum + entry.parsed.volumeMl * (entry.abvRange?.max || 0), 0);
  return alcoholVolume / totalVolume;
}

function isCitrusIngredient(entry) {
  const id = entry.item?.id || '';
  const name = normalize(entry.rawName);
  return ['lemon-juice', 'lime-juice', 'orange-juice', 'grapefruit-juice', 'blood-orange', 'orange', 'grapefruit', 'lemon', 'lime'].includes(id) ||
    name.includes('lemon juice') || name.includes('lime juice') || name.includes('orange juice') || name.includes('grapefruit juice');
}

function buildTags(drink, recipeIngredients, ctx, family, buildMethod, serviceStyle, baseSpirit) {
  const experience = new Set();
  const occasion = new Set();
  const structural = new Set();
  const abv = approxDrinkAbv(recipeIngredients);
  const active = recipeIngredients.filter((entry) => !entry.isOptional);

  if (ctx.structuralBitters.length > 0 || active.some((entry) => entry.item?.flavor_profile?.includes('bitter'))) experience.add('Bitter');
  if (active.some((entry) => isCitrusIngredient(entry) || entry.item?.ingredient_type === 'sour_acid')) {
    experience.add('Tart');
    experience.add('Bright');
  }
  if (active.some((entry) => ['sweetener', 'flavored_syrup', 'cream_liqueur'].includes(entry.item?.ingredient_type))) experience.add('Sweet');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('herbal'))) experience.add('Herbal');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('savory') || entry.item?.id === 'tomato-juice' || entry.item?.id === 'olive-brine')) experience.add('Savory');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('smoky'))) experience.add('Smoky');
  if (active.some((entry) => ['juice', 'fruit_liqueur', 'fresh_fruit'].includes(entry.item?.ingredient_type) || (entry.item?.flavor_profile || []).includes('fruity'))) experience.add('Fruity');
  if (active.some((entry) => ['floral_liqueur'].includes(entry.item?.ingredient_type) || (entry.item?.flavor_profile || []).includes('floral'))) experience.add('Floral');
  if (active.some((entry) => ['nut_liqueur'].includes(entry.item?.ingredient_type) || entry.item?.id === 'orgeat')) experience.add('Nutty');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('oxidative') || entry.item?.id?.includes('sherry') || entry.item?.id === 'madeira')) experience.add('Oxidative');
  if (active.some((entry) => ['coffee_liqueur', 'coffee_tea'].includes(entry.item?.ingredient_type))) experience.add('Coffee');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('chocolate'))) experience.add('Chocolate');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('spiced'))) experience.add('Spiced');
  if (active.some((entry) => (entry.item?.flavor_profile || []).includes('umami'))) experience.add('Umami');

  if (['Old-Fashioned', 'Aromatized', 'Bitter Aromatized'].includes(family) && serviceStyle !== 'Long / tall') experience.add('Spirit-forward');
  if (serviceStyle === 'Long / tall' || family === 'Collins' || family === 'Highball' || family === 'Tropical / Punch-derived') experience.add('Refreshing');
  if (family === 'Highball' || (abv > 0 && abv <= 0.16)) experience.add('Sessionable');
  if (abv >= 0.28 || ['Old-Fashioned', 'Aromatized', 'Bitter Aromatized'].includes(family)) experience.add('Boozy');
  if (ctx.textureAgents.length > 0 || active.some((entry) => ['cream_liqueur', 'dairy_egg'].includes(entry.item?.ingredient_type))) experience.add('Plush');
  if (buildMethod === 'Blended' || serviceStyle === 'Frozen' || abv <= 0.12) experience.add('Light');
  if (family === 'Tropical / Punch-derived' || family === 'Enhanced Sour' || active.length >= 5) experience.add('Complex');
  if (family === 'Highball' || family === 'Sour') experience.add('Approachable');
  if (family === 'Rich & Creamy' || serviceStyle === 'Hot' || baseSpirit.includes('Whiskey') || baseSpirit === 'Brandy / Cognac') experience.add('Warming');

  if (family === 'Bitter Aromatized' || active.some((entry) => ['campari', 'aperol', 'select-aperitivo', 'cappelletti-aperitivo', 'contratto-bitter'].includes(entry.item?.id))) occasion.add('Aperitivo');
  if (active.some((entry) => ['fernet-branca', 'amaro-averna', 'amaro-zucca', 'amaro-nardini', 'amaro-braulio'].includes(entry.item?.id))) occasion.add('Digestivo');
  if (['Old-Fashioned', 'Aromatized', 'Rich & Creamy'].includes(family) || experience.has('Boozy')) occasion.add('Nightcap');
  if (active.some((entry) => entry.item?.id === 'tomato-juice') || active.some((entry) => entry.item?.id === 'orange-juice' && recipeIngredients.some((x) => x.item?.ingredient_type === 'sparkling_wine'))) occasion.add('Brunch');
  if (experience.has('Refreshing') || family === 'Tropical / Punch-derived' || recipeIngredients.some((entry) => isCitrusIngredient(entry))) occasion.add('Summer');
  if (family === 'Rich & Creamy' || serviceStyle === 'Hot' || experience.has('Warming')) occasion.add('Winter');
  if (active.some((entry) => entry.item?.ingredient_type === 'sparkling_wine')) occasion.add('Celebratory');
  if (experience.has('Sessionable')) occasion.add('Easy drinking');

  const nonOptionalMeasured = active.filter((entry) => !isAlwaysSeasoning(entry.parsed) && entry.parsed.volumeMl > 0 && entry.item?.ingredient_type !== 'garnish');
  if (nonOptionalMeasured.length >= 3) {
    const volumes = nonOptionalMeasured.map((entry) => entry.parsed.volumeMl);
    const max = Math.max(...volumes);
    const min = Math.min(...volumes);
    if (max - min <= 2) structural.add('Equal-parts');
  }
  if (nonOptionalMeasured.length === 3) structural.add('Three-ingredient');
  if (!recipeIngredients.some((entry) => !entry.isOptional && isCitrusIngredient(entry))) structural.add('No citrus');
  if (abv > 0 && abv <= 0.16) structural.add('Low-ABV');
  if (abv >= 0.28) structural.add('High-ABV');
  if (abv === 0) structural.add('Non-alcoholic');
  if (ctx.lengtheners.length > 0 || active.some((entry) => entry.item?.ingredient_type === 'sparkling_wine')) structural.add('Carbonated');
  if (serviceStyle === 'Hot') structural.add('Hot');
  if (serviceStyle === 'Frozen') structural.add('Frozen');

  const experienceOut = Array.from(experience).filter((tag) => EXPERIENCE_TAGS.has(tag)).slice(0, 5);
  while (experienceOut.length < 2) {
    if (!experienceOut.includes('Complex')) experienceOut.push('Complex');
    else if (!experienceOut.includes('Approachable')) experienceOut.push('Approachable');
    else break;
  }

  return {
    experience_tags: experienceOut,
    occasion_tags: Array.from(occasion).filter((tag) => OCCASION_TAGS.has(tag)).slice(0, 3),
    structural_tags: Array.from(structural).filter((tag) => STRUCTURAL_TAGS.has(tag)).slice(0, 5),
  };
}

function classifyRecipe(drink, ingredientIndex) {
  const recipeIngredients = deriveRecipeIngredients(drink, ingredientIndex);
  const ctx = computeStructuralContext(recipeIngredients, drink);
  const notes = [...ctx.notes];
  const family = classifyFamily(drink, ctx);
  const buildMethod = detectBuildMethod(drink);
  const serviceStyle = detectServiceStyle(drink);

  if (normalize(drink.name) === 'dry martini') {
    noteAppend(notes, 'Dry vermouth falls below structural threshold by ratio, but the Name Exception Rule applies: removing vermouth would require renaming the canonical drink.');
  }
  if (normalize(drink.name) === 'jungle bird') {
    noteAppend(notes, 'Structural bitter present without co-base; lime provides sour structure, so this follows the addendum Jungle Bird rule to Enhanced Sour rather than Tropical / Punch-derived.');
  }
  if (normalize(drink.name) === 'paper plane') {
    noteAppend(notes, 'Aperol and Amaro Nonino are coequal structural modifiers alongside lemon juice; equal-parts Enhanced Sour.');
  }
  if (normalize(drink.name) === 'negroni') {
    noteAppend(notes, 'Campari is load-bearing bitter alongside sweet vermouth as co-base.');
  }
  if (normalize(drink.name) === 'whiskey sour' && recipeIngredients.some((entry) => entry.item?.id === 'egg-white' && !entry.isOptional)) {
    noteAppend(notes, 'Egg white adds texture, but citrus-sweet balance remains primary; classified as Sour rather than Rich & Creamy.');
  }

  const baseCandidates = recipeIngredients
    .filter((entry) => !entry.isOptional && entry.roles.includes('base'))
    .sort((a, b) => b.parsed.volumeMl - a.parsed.volumeMl);
  let baseSpirit = 'Other';
  if (baseCandidates[0]) {
    baseSpirit = mapBaseSpiritLabel(baseCandidates[0].item?.id, baseCandidates[0].item?.name, baseCandidates[0].item?.ingredient_type, baseCandidates[0].subcategoryId);
  } else if (recipeIngredients.some((entry) => entry.item?.ingredient_type === 'sparkling_wine')) {
    baseSpirit = 'Other';
  }
  if (!CONTROLLED_BASE_SPIRITS.includes(baseSpirit)) baseSpirit = 'Other';

  for (const ingredient of recipeIngredients) {
    if (!ingredient.item) {
      noteAppend(notes, `Ingredient "${ingredient.rawName}" could not be matched to a canonical ingredient record.`);
    }
  }

  const tags = buildTags(drink, recipeIngredients, ctx, family, buildMethod, serviceStyle, baseSpirit);
  if (notes.some((note) => note.includes('could not be matched'))) {
    tags.structural_tags = uniqueStrings([...tags.structural_tags, 'Classification review']).filter((tag) => STRUCTURAL_TAGS.has(tag));
  }

  const primaryTemplate = inferPrimaryTemplate(drink, family);
  const citrusPresent = recipeIngredients.some((entry) => !entry.isOptional && isCitrusIngredient(entry));
  const lengthened = ctx.lengtheners.length > 0 || serviceStyle === 'Long / tall';
  const textureAgents = recipeIngredients
    .filter((entry) => !entry.isOptional && entry.roles.includes('texture_agent'))
    .map((entry) => entry.item?.name || titleCase(entry.rawName));

  return {
    id: drink.id,
    name: drink.name,
    glass: drink.glass,
    ingredients: drink.ingredients,
    instructions: drink.instructions,
    primary_family: family,
    primary_template: primaryTemplate,
    secondary_template: '',
    build_method: buildMethod,
    service_style: serviceStyle,
    base_spirit: baseSpirit,
    citrus_present: citrusPresent,
    lengthened: lengthened,
    texture_agents: uniqueStrings(textureAgents),
    experience_tags: tags.experience_tags,
    occasion_tags: tags.occasion_tags,
    structural_tags: tags.structural_tags,
    classification_note: notes.join(' ')
  };
}

function fixMalformedCocktailRecords(cocktails) {
  return cocktails.map((drink) => {
    if (drink.id === 'dutch-kills-last-word') {
      const fixedIngredients = drink.ingredients.map((ingredient) => {
        if (normalize(ingredient.name) === '3 4 ounce lime juice') {
          return { name: 'lime juice', measure: '3/4 ounce' };
        }
        return ingredient;
      });
      return { ...drink, ingredients: fixedIngredients };
    }

    if (drink.id === 'l-alaska') {
      return {
        ...drink,
        ingredients: drink.ingredients.filter((ingredient) => normalize(ingredient.name) !== 'servings 9')
      };
    }

    if (drink.id === 'el-duderino') {
      return {
        ...drink,
        ingredients: drink.ingredients
          .filter((ingredient) => normalize(ingredient.name) !== 'servings 14 to 18')
          .map((ingredient) => {
            if (normalize(ingredient.name) === '750 ml bottle mezcal' && normalize(ingredient.measure) === '1') {
              return { name: 'mezcal', measure: '750 ml' };
            }
            return ingredient;
          })
      };
    }

    return drink;
  });
}

function main() {
  const ingredientsDb = readJson(INGREDIENTS_PATH);
  applyIngredientRecordFixes(ingredientsDb);

  for (const entry of flattenIngredientContext(ingredientsDb)) {
    Object.assign(entry.item, enrichIngredientEntry(entry));
  }

  const ingredientIndex = buildIngredientIndex(ingredientsDb);
  const cocktails = fixMalformedCocktailRecords(readJson(COCKTAILS_PATH));
  const migratedCocktails = cocktails.map((drink) => classifyRecipe(drink, ingredientIndex));

  writeJson(INGREDIENTS_PATH, ingredientsDb);
  writeJson(COCKTAILS_PATH, migratedCocktails);

  const sampleIds = ['negroni', 'dry-martini', 'paper-plane', 'jungle-bird', 'whiskey-sour'];
  const sample = migratedCocktails.filter((drink) => sampleIds.includes(drink.id));
  console.log('Overhaul complete.');
  console.log(JSON.stringify(sample, null, 2));
}

main();
