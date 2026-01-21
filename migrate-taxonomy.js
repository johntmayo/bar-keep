/**
 * Barkeep Taxonomy Migration Script
 * 
 * Migrates cocktails.json from category/style/ibaCategory to template/tags system
 * 
 * Usage: node migrate-taxonomy.js
 */

const fs = require('fs');
const path = require('path');

// Template enum
const TEMPLATES = {
  STIRRED_SPIRIT_FORWARD: 'STIRRED_SPIRIT_FORWARD',
  SOUR: 'SOUR',
  HIGHBALL_FIZZ: 'HIGHBALL_FIZZ',
  TIKI_PUNCH: 'TIKI_PUNCH',
  CREAM_EGG: 'CREAM_EGG',
  HOT: 'HOT',
  TEMPLATE_UNCLASSIFIED: 'TEMPLATE_UNCLASSIFIED'
};

// Tag categories
const TAG_CATEGORIES = {
  VIBE: ['boozy', 'refreshing', 'bitter', 'tropical', 'rich', 'cozy_spiced', 'nightcap', 'brunch', 'dessert'],
  TEXTURE_FORMAT: ['sparkling', 'crushed_ice', 'up', 'rocks', 'blended'],
  INGREDIENT_FEATURE: ['coffee', 'chocolate', 'herbal', 'smoky', 'saline', 'citrus_forward', 'fruity'],
  CLASSIC_ERA: ['classic', 'modern'],
  INTERNAL: ['iba'] // Hidden tag for IBA reference
};

// Helper functions
function normalizeIngredientName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().trim();
}

function hasCitrus(ingredients) {
  const citrusKeywords = ['lemon', 'lime', 'orange', 'grapefruit', 'citrus'];
  return ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return citrusKeywords.some(keyword => name.includes(keyword + ' juice') || name.includes(keyword));
  });
}

function hasSweetener(ingredients) {
  const sweetKeywords = ['simple syrup', 'sugar', 'honey', 'agave', 'maple', 'demerara', 'gomme'];
  return ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return sweetKeywords.some(keyword => name.includes(keyword));
  });
}

function hasCreamOrEgg(ingredients) {
  const creamEggKeywords = ['cream', 'egg', 'milk', 'half and half', 'heavy cream'];
  return ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return creamEggKeywords.some(keyword => name.includes(keyword));
  });
}

function hasMultipleJuices(ingredients) {
  const juiceKeywords = ['juice', 'pineapple', 'passion fruit', 'guava', 'mango', 'papaya'];
  let juiceCount = 0;
  ingredients.forEach(ing => {
    const name = normalizeIngredientName(ing.name);
    if (juiceKeywords.some(keyword => name.includes(keyword))) {
      juiceCount++;
    }
  });
  return juiceCount >= 2;
}

function isLengthened(instructions, ingredients) {
  const lengthenKeywords = ['top', 'soda', 'champagne', 'prosecco', 'cava', 'tonic', 'ginger beer', 'cola'];
  const instLower = (instructions || '').toLowerCase();
  const hasLengthener = ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return lengthenKeywords.some(keyword => name.includes(keyword));
  });
  return hasLengthener || lengthenKeywords.some(keyword => instLower.includes(keyword));
}

function isHot(instructions, glass) {
  const hotKeywords = ['hot', 'warm', 'heated', 'steam'];
  const instLower = (instructions || '').toLowerCase();
  const glassLower = (glass || '').toLowerCase();
  return hotKeywords.some(keyword => 
    instLower.includes(keyword) || glassLower.includes(keyword)
  );
}

function isSpiritForward(ingredients) {
  // Count spirits/fortified wines
  const spiritKeywords = ['gin', 'vodka', 'whiskey', 'whisky', 'bourbon', 'rye', 'scotch', 'rum', 'tequila', 'mezcal', 'brandy', 'cognac', 'vermouth', 'sherry', 'port', 'madeira', 'amaro', 'campari', 'aperol', 'cynar', 'fernet', 'chartreuse', 'benedictine', 'lillet', 'cocchi', 'suze', 'salers'];
  let spiritCount = 0;
  let totalVolume = 0;
  let spiritVolume = 0;
  let hasBitters = false;
  
  ingredients.forEach(ing => {
    const name = normalizeIngredientName(ing.name);
    const measure = ing.measure || '';
    const mlMatch = measure.match(/(\d+(?:\.\d+)?)\s*ml/i);
    const ozMatch = measure.match(/(\d+(?:\/\d+)?(?:\s+\d+\/\d+)?)\s*oz/i);
    
    let volume = 0;
    if (mlMatch) {
      volume = parseFloat(mlMatch[1]);
    } else if (ozMatch) {
      const ozValue = ozMatch[1];
      // Simple fraction parsing
      if (ozValue.includes('/')) {
        const [num, den] = ozValue.split('/').map(Number);
        volume = (num / den) * 29.5735; // Convert to ml
      } else {
        volume = parseFloat(ozValue) * 29.5735;
      }
    }
    
    // Handle dashes/drops (small amounts, don't count as significant volume)
    if (measure.includes('dash') || measure.includes('drop') || measure.includes('dashes')) {
      volume = 1; // Minimal volume for dashes
    }
    
    totalVolume += volume;
    
    if (spiritKeywords.some(keyword => name.includes(keyword))) {
      spiritCount++;
      spiritVolume += volume;
    }
    
    if (name.includes('bitters')) {
      hasBitters = true;
    }
  });
  
  // If 70%+ of volume is spirits/fortifieds and no citrus/juice
  // OR if it's mostly spirits with just bitters/sugar (Old Fashioned style)
  const spiritRatio = totalVolume > 0 ? spiritVolume / totalVolume : 0;
  const isMostlySpirits = spiritRatio >= 0.7 && !hasCitrus(ingredients) && spiritCount > 0;
  const isOldFashionedStyle = spiritCount >= 1 && hasBitters && !hasCitrus(ingredients) && ingredients.length <= 4;
  
  return isMostlySpirits || isOldFashionedStyle;
}

function isTikiPunch(ingredients, instructions) {
  const tikiKeywords = ['rum', 'pineapple', 'passion fruit', 'orgeat', 'falernum', 'allspice', 'cinnamon', 'velvet falernum', 'pimento dram'];
  const hasTikiIngredients = tikiKeywords.some(keyword => 
    ingredients.some(ing => normalizeIngredientName(ing.name).includes(keyword))
  );
  const hasMultipleJuicesFlag = hasMultipleJuices(ingredients);
  const hasRum = ingredients.some(ing => 
    normalizeIngredientName(ing.name).includes('rum')
  );
  
  // Tiki drinks typically have 4+ ingredients with multiple juices/syrups
  const ingredientCount = ingredients.length;
  const hasComplexSyrups = ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('syrup') || name.includes('orgeat') || name.includes('falernum') || name.includes('honey') || name.includes('grenadine');
  });
  
  return (hasTikiIngredients || (hasRum && hasMultipleJuicesFlag && ingredientCount >= 4)) && hasComplexSyrups;
}

// Name-based classification (high confidence)
function classifyByName(name) {
  if (!name) return null;
  const nameLower = name.toLowerCase();
  
  // STIRRED_SPIRIT_FORWARD patterns (Manhattan riffs, Negroni riffs, etc.)
  const stirredSpiritForwardNames = [
    'negroni', 'manhattan', 'martini', 'old fashioned', 'boulevardier', 'americano',
    'rob roy', 'vieux carre', 'sazerac', 'rusty nail', 'godfather', 'black manhattan',
    'white negroni', 'kingston negroni', 'mezcal negroni', 'cardamom negroni',
    'aperol negroni', 'cynar negroni', 'rosita', 'hanky panky',
    'brooklyn', 'red hook', 'little italy', 'greenpoint', 'preakness',
    'monte carlo', 'tipperary', 'blood and sand', 'remember the maine',
    'gin martini', 'vodka martini', 'vesper', 'dirty martini',
    'perfect martini', 'gibson', 'dry martini', 'wet martini', 'fifty-fifty',
    'reverse martini', 'gin & it', 'gin and it', 'perfect manhattan', 'dry manhattan',
    'sweet manhattan', 'black manhattan', 'red hook', 'little italy', 'greenpoint',
    'brown derby', 'revolver', 'old pal', 'perfect', 'dry', 'sweet', 'reverse',
    'alaska', 'martinez', 'turkey', 'turkey shot', 'fancy free', 'improved whiskey',
    'improved', 'de la louisiane', 'la louisiane', 'benedictine', 'bobby burns',
    'bobby burns', 'bobby burn', 'tipperary', 'tipperary', 'tipperary'
  ];
  
  if (stirredSpiritForwardNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.STIRRED_SPIRIT_FORWARD;
  }
  
  // SOUR patterns (includes stirred sours like Paper Plane)
  const sourNames = [
    'sour', 'daisy', 'gimlet', 'margarita', 'sidecar', 'cosmopolitan', 'daiquiri',
    'whiskey sour', 'gin sour', 'rum sour', 'tequila sour', 'pisco sour',
    'amaretto sour', 'paper plane', 'division bell', 'industry sour', 'trinidad sour',
    'final ward', 'ward eight', 'aviation', 'corpse reviver', 'last word',
    'white lady', 'between the sheets', 'bee\'s knees', 'gin fizz', 'tom collins',
    'gin rickey', 'whiskey smash', 'mint julep', 'mojito', 'caipirinha', 'caipiroska',
    'naked and famous', 'jungle bird', 'eastern sour', 'new york sour', 'amaretto sour'
  ];
  
  if (sourNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.SOUR;
  }
  
  // HIGHBALL_FIZZ patterns
  const highballFizzNames = [
    'collins', 'rickey', 'fizz', 'spritz', 'sling', 'highball', 'buck', 'mule',
    'tonic', 'soda', 'ginger beer', 'champagne', 'prosecco', 'cava', 'aperol spritz',
    'campari spritz', 'negroni sbagliato', 'sbagliato', 'french 75', 'seventy-five',
    'bellini', 'mimosa', 'sangria', 'sangaree', 'shandy', 'radler', 'paloma',
    'cuba libre', 'dark and stormy', 'moscow mule', 'kentucky mule', 'gin mule',
    'tequila mule', 'vodka mule', 'whiskey mule', 'rum mule'
  ];
  
  if (highballFizzNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.HIGHBALL_FIZZ;
  }
  
  // TIKI_PUNCH patterns
  const tikiPunchNames = [
    'mai tai', 'zombie', 'painkiller', 'jungle bird', 'three dots and a dash',
    'scorpion', 'hurricane', 'fog cutter', 'navy grog', 'trader vic', 'don the beachcomber',
    'tiki', 'punch', 'bowl', 'swizzle', 'queen\'s park swizzle', 'corn and oil',
    'dark and stormy', 'planters punch', 'pina colada', 'bahama mama', 'blue hawaiian',
    'lava flow', 'mai tai', 'zombie', 'painkiller'
  ];
  
  if (tikiPunchNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.TIKI_PUNCH;
  }
  
  // CREAM_EGG patterns
  const creamEggNames = [
    'flip', 'nog', 'eggnog', 'white russian', 'black russian', 'mudslide',
    'grasshopper', 'brandy alexander', 'alexander', 'pink squirrel', 'golden cadillac',
    'brandy flip', 'port flip', 'sherry flip', 'rum flip', 'whiskey flip'
  ];
  
  if (creamEggNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.CREAM_EGG;
  }
  
  // HOT patterns
  const hotNames = [
    'hot toddy', 'toddy', 'hot buttered rum', 'mulled wine', 'gluhwein', 'glögg',
    'irish coffee', 'hot chocolate', 'café brûlot', 'coffee', 'warm', 'heated'
  ];
  
  if (hotNames.some(pattern => nameLower.includes(pattern))) {
    return TEMPLATES.HOT;
  }
  
  return null;
}

// Check if recipe is stirred (based on instructions)
function isStirred(instructions) {
  if (!instructions) return false;
  const instLower = instructions.toLowerCase();
  return instLower.includes('stir') && !instLower.includes('shake');
}

// Check if recipe is shaken
function isShaken(instructions) {
  if (!instructions) return false;
  const instLower = instructions.toLowerCase();
  return instLower.includes('shake') || instLower.includes('shaken');
}

// Classification function
function classifyRecipe(recipe) {
  const { name = '', ingredients = [], instructions = '', glass = '', style = '', ibaCategory = '', category = '' } = recipe;
  
  // 1. Name-based classification (highest confidence)
  const nameBasedTemplate = classifyByName(name);
  if (nameBasedTemplate) {
    return {
      template: nameBasedTemplate,
      tags: generateTags(recipe, nameBasedTemplate),
      confidence: 'high',
      method: 'name-based'
    };
  }
  
  // 2. HOT - Check early (very specific)
  if (isHot(instructions, glass)) {
    return {
      template: TEMPLATES.HOT,
      tags: generateTags(recipe, TEMPLATES.HOT),
      confidence: 'high',
      method: 'hot-detection'
    };
  }
  
  // 3. CREAM_EGG - Very specific ingredient pattern
  if (hasCreamOrEgg(ingredients)) {
    return {
      template: TEMPLATES.CREAM_EGG,
      tags: generateTags(recipe, TEMPLATES.CREAM_EGG),
      confidence: 'high',
      method: 'cream-egg-detection'
    };
  }
  
  // 4. HIGHBALL_FIZZ - Check before SOUR (lengthened drinks are distinct)
  if (isLengthened(instructions, ingredients)) {
    return {
      template: TEMPLATES.HIGHBALL_FIZZ,
      tags: generateTags(recipe, TEMPLATES.HIGHBALL_FIZZ),
      confidence: 'high',
      method: 'lengthened-detection'
    };
  }
  
  // 5. TIKI_PUNCH - Multi-juice, rum-forward, complex
  if (isTikiPunch(ingredients, instructions)) {
    return {
      template: TEMPLATES.TIKI_PUNCH,
      tags: generateTags(recipe, TEMPLATES.TIKI_PUNCH),
      confidence: 'high',
      method: 'tiki-detection'
    };
  }
  
  // 6. SOUR - Base + citrus + sweet (but not lengthened)
  // Note: Paper Plane, Last Word, etc. are sours even though stirred
  if (hasCitrus(ingredients) && hasSweetener(ingredients)) {
    // Check if it's a stirred sour (Paper Plane, Last Word, Aviation, etc.)
    // These have equal parts spirit + citrus + liqueur + sweetener
    const isStirredSour = isStirred(instructions) && hasCitrus(ingredients);
    
    // If stirred with citrus and has liqueur/amaro (not just spirits), it's a sour
    const hasLiqueur = ingredients.some(ing => {
      const name = normalizeIngredientName(ing.name);
      return name.includes('amaro') || name.includes('chartreuse') || name.includes('benedictine') ||
             name.includes('maraschino') || name.includes('cointreau') || name.includes('triple sec') ||
             name.includes('st germain') || name.includes('aperol') || name.includes('campari');
    });
    
    if (isStirredSour && hasLiqueur) {
      return {
        template: TEMPLATES.SOUR,
        tags: generateTags(recipe, TEMPLATES.SOUR),
        confidence: 'high',
        method: 'sour-detection-stirred'
      };
    }
    
    // Standard sour (shaken or unclear method)
    if (isShaken(instructions) || !isStirred(instructions)) {
      return {
        template: TEMPLATES.SOUR,
        tags: generateTags(recipe, TEMPLATES.SOUR),
        confidence: 'high',
        method: 'sour-detection'
      };
    }
  }
  
  // 7. STIRRED_SPIRIT_FORWARD - Mostly spirits, no citrus, typically stirred
  if (isSpiritForward(ingredients)) {
    // If stirred, definitely spirit-forward
    if (isStirred(instructions)) {
      return {
        template: TEMPLATES.STIRRED_SPIRIT_FORWARD,
        tags: generateTags(recipe, TEMPLATES.STIRRED_SPIRIT_FORWARD),
        confidence: 'high',
        method: 'spirit-forward-stirred'
      };
    }
    
    // If no instructions or unclear, assume stirred for spirit-forward
    return {
      template: TEMPLATES.STIRRED_SPIRIT_FORWARD,
      tags: generateTags(recipe, TEMPLATES.STIRRED_SPIRIT_FORWARD),
      confidence: 'medium',
      method: 'spirit-forward-default'
    };
  }
  
  // 8. Legacy style/category hints
  if (style === 'spirit-forward' || category === 'Cocktail') {
    return {
      template: TEMPLATES.STIRRED_SPIRIT_FORWARD,
      tags: generateTags(recipe, TEMPLATES.STIRRED_SPIRIT_FORWARD),
      confidence: 'medium',
      method: 'legacy-style'
    };
  }
  
  if (style === 'sour' || category === 'Sour') {
    return {
      template: TEMPLATES.SOUR,
      tags: generateTags(recipe, TEMPLATES.SOUR),
      confidence: 'medium',
      method: 'legacy-style'
    };
  }
  
  // 9. Fallback - needs review
  return {
    template: TEMPLATES.TEMPLATE_UNCLASSIFIED,
    tags: generateTags(recipe, TEMPLATES.TEMPLATE_UNCLASSIFIED),
    confidence: 'low',
    needsReview: true,
    method: 'fallback'
  };
}

// Generate tags based on recipe characteristics
function generateTags(recipe, template) {
  const tags = [];
  const { ingredients = [], instructions = '', glass = '', style = '', ibaCategory = '' } = recipe;
  
  // Vibe tags
  if (style === 'spirit-forward' || template === TEMPLATES.STIRRED_SPIRIT_FORWARD) {
    tags.push('boozy');
  }
  if (hasCitrus(ingredients) || template === TEMPLATES.HIGHBALL_FIZZ) {
    tags.push('refreshing');
  }
  if (ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('amaro') || name.includes('campari') || name.includes('aperol') || name.includes('cynar') || name.includes('fernet');
  })) {
    tags.push('bitter');
  }
  if (template === TEMPLATES.TIKI_PUNCH) {
    tags.push('tropical');
  }
  if (hasCreamOrEgg(ingredients) || ingredients.some(ing => normalizeIngredientName(ing.name).includes('chocolate'))) {
    tags.push('rich');
  }
  if (template === TEMPLATES.HOT || ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('cinnamon') || name.includes('nutmeg') || name.includes('clove');
  })) {
    tags.push('cozy_spiced');
  }
  if (template === TEMPLATES.STIRRED_SPIRIT_FORWARD && !hasCitrus(ingredients)) {
    tags.push('nightcap');
  }
  
  // Texture/format tags
  if (isLengthened(instructions, ingredients)) {
    tags.push('sparkling');
  }
  if (glass && (glass.toLowerCase().includes('coupe') || glass.toLowerCase().includes('cocktail'))) {
    tags.push('up');
  }
  if (glass && glass.toLowerCase().includes('rocks')) {
    tags.push('rocks');
  }
  if (instructions.toLowerCase().includes('blend') || instructions.toLowerCase().includes('blended')) {
    tags.push('blended');
  }
  
  // Ingredient/feature tags
  if (ingredients.some(ing => normalizeIngredientName(ing.name).includes('coffee'))) {
    tags.push('coffee');
  }
  if (ingredients.some(ing => normalizeIngredientName(ing.name).includes('chocolate'))) {
    tags.push('chocolate');
  }
  if (ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('chartreuse') || name.includes('benedictine') || name.includes('herbal');
  })) {
    tags.push('herbal');
  }
  if (ingredients.some(ing => normalizeIngredientName(ing.name).includes('smoke'))) {
    tags.push('smoky');
  }
  if (hasCitrus(ingredients) && ingredients.filter(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('juice');
  }).length >= 2) {
    tags.push('citrus_forward');
  }
  if (ingredients.some(ing => {
    const name = normalizeIngredientName(ing.name);
    return name.includes('pineapple') || name.includes('passion') || name.includes('mango') || name.includes('guava');
  })) {
    tags.push('fruity');
  }
  
  // Classic/era tags
  if (ibaCategory) {
    tags.push('classic');
    tags.push('iba'); // Internal reference
  }
  
  // Remove duplicates
  return [...new Set(tags)];
}

// Main migration function
function migrateRecipes(inputPath, outputPath) {
  console.log('Reading cocktails.json...');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  console.log(`Processing ${data.length} recipes...`);
  
  const migrated = [];
  const needsReview = [];
  const lowConfidence = [];
  
  data.forEach((recipe, index) => {
    const classification = classifyRecipe(recipe);
    
    // Create migrated recipe
    const migratedRecipe = {
      ...recipe,
      template: classification.template,
      tags: classification.tags,
      // Keep old fields for reference during migration (can remove later)
      _migration: {
        oldCategory: recipe.category,
        oldStyle: recipe.style,
        oldIbaCategory: recipe.ibaCategory,
        confidence: classification.confidence,
        method: classification.method
      }
    };
    
    // Track low confidence for review
    if (classification.confidence === 'low' || classification.confidence === 'medium') {
      lowConfidence.push({
        id: recipe.id,
        name: recipe.name,
        template: classification.template,
        confidence: classification.confidence,
        method: classification.method,
        reason: classification.confidence === 'low' ? 'Low confidence classification' : 'Medium confidence - may need verification'
      });
    }
    
    // Remove old taxonomy fields (optional - comment out if you want to keep them)
    delete migratedRecipe.category;
    delete migratedRecipe.style;
    // Keep ibaCategory as hidden tag only, remove from main field
    // delete migratedRecipe.ibaCategory;
    
    migrated.push(migratedRecipe);
    
    if (classification.needsReview) {
      needsReview.push({
        id: recipe.id,
        name: recipe.name,
        template: classification.template,
        reason: 'Could not be automatically classified'
      });
    }
  });
  
  // Write migrated data
  console.log(`Writing migrated data to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(migrated, null, 2));
  
  // Write review reports
  if (needsReview.length > 0) {
    const reviewPath = outputPath.replace('.json', '-needs-review.json');
    console.log(`Writing review report to ${reviewPath}...`);
    fs.writeFileSync(reviewPath, JSON.stringify(needsReview, null, 2));
    console.log(`\n⚠️  ${needsReview.length} recipes need manual review (unclassified)`);
    console.log(`   Review file: ${reviewPath}`);
  }
  
  if (lowConfidence.length > 0) {
    const lowConfPath = outputPath.replace('.json', '-low-confidence.json');
    console.log(`Writing low-confidence report to ${lowConfPath}...`);
    fs.writeFileSync(lowConfPath, JSON.stringify(lowConfidence, null, 2));
    console.log(`\n⚠️  ${lowConfidence.length} recipes have low/medium confidence (may need verification)`);
    console.log(`   Review file: ${lowConfPath}`);
  }
  
  if (needsReview.length === 0 && lowConfidence.length === 0) {
    console.log(`\n✅ All recipes classified automatically with high confidence!`);
  }
  
  // Show classification method breakdown
  const methodCounts = {};
  migrated.forEach(recipe => {
    const method = recipe._migration?.method || 'unknown';
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  });
  
  console.log('\nClassification methods:');
  Object.entries(methodCounts).sort((a, b) => b[1] - a[1]).forEach(([method, count]) => {
    console.log(`  ${method}: ${count}`);
  });
  
  // Summary statistics
  const templateCounts = {};
  migrated.forEach(recipe => {
    templateCounts[recipe.template] = (templateCounts[recipe.template] || 0) + 1;
  });
  
  console.log('\n✅ Migration complete!');
  console.log('\nTemplate distribution:');
  Object.entries(templateCounts).forEach(([template, count]) => {
    console.log(`  ${template}: ${count}`);
  });
  
  console.log(`\nTotal recipes: ${migrated.length}`);
  console.log(`Recipes with tags: ${migrated.filter(r => r.tags && r.tags.length > 0).length}`);
}

// Run migration
const inputFile = path.join(__dirname, 'cocktails.json');
const outputFile = path.join(__dirname, 'cocktails-migrated.json');

if (!fs.existsSync(inputFile)) {
  console.error(`Error: ${inputFile} not found`);
  process.exit(1);
}

migrateRecipes(inputFile, outputFile);

