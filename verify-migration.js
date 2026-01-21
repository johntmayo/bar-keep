/**
 * Verify migration completeness
 */

const fs = require('fs');
const path = require('path');

const migratedFile = path.join(__dirname, 'cocktails-migrated.json');
const data = JSON.parse(fs.readFileSync(migratedFile, 'utf8'));

const templates = {};
const unclassified = [];
const missingTags = [];

data.forEach(recipe => {
  const template = recipe.template;
  templates[template] = (templates[template] || 0) + 1;
  
  if (template === 'TEMPLATE_UNCLASSIFIED') {
    unclassified.push({
      id: recipe.id,
      name: recipe.name
    });
  }
  
  if (!recipe.tags || recipe.tags.length === 0) {
    missingTags.push({
      id: recipe.id,
      name: recipe.name,
      template: template
    });
  }
});

console.log('\n📊 Migration Status Report\n');
console.log('Template distribution:');
Object.entries(templates).sort((a, b) => b[1] - a[1]).forEach(([template, count]) => {
  console.log(`  ${template}: ${count}`);
});

console.log(`\nTotal recipes: ${data.length}`);
console.log(`✅ Classified: ${data.length - unclassified.length}`);
console.log(`⚠️  Unclassified: ${unclassified.length}`);

if (unclassified.length > 0) {
  console.log('\n❌ Unclassified recipes:');
  unclassified.forEach(r => {
    console.log(`  - ${r.name} (${r.id})`);
  });
}

console.log(`\n📋 Recipes with tags: ${data.length - missingTags.length}`);
console.log(`⚠️  Recipes missing tags: ${missingTags.length}`);

if (missingTags.length > 0 && missingTags.length <= 20) {
  console.log('\nRecipes missing tags (first 20):');
  missingTags.slice(0, 20).forEach(r => {
    console.log(`  - ${r.name} (${r.template})`);
  });
}

// Check if ready for switchover
const isReady = unclassified.length === 0;
console.log(`\n${isReady ? '✅ READY FOR SWITCHOVER' : '❌ NOT READY - Please classify remaining recipes'}\n`);

