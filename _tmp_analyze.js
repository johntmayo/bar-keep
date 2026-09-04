const d = require('./cocktails.json');

const requested = [
  'Paper Plane', 'Penicillin', 'Last Word', 'Bloody Mary', 'Espresso Martini',
  'Hot Toddy', 'Aperol Spritz', 'Martini', 'Negroni', 'Margarita', 'Whiskey Sour',
  'Old Fashioned', 'Daiquiri', 'Mai Tai', 'Zombie', 'Painkiller', 'Gin and Tonic',
  'Highball', 'Toddy', 'White Russian', 'Irish Coffee', 'Corpse Reviver #2',
  'Naked and Famous', 'Sidecar', 'Cosmopolitan', 'French 75', 'Mojito',
  "Dark 'n' Stormy", 'Manhattan', 'Martinez', 'Vieux Carré', 'Sazerac',
  'Boulevardier', 'Americano', 'Piña Colada', 'Grasshopper', 'Alexander',
  'Ramos Gin Fizz', 'Clover Club', 'Pisco Sour', "Bee's Knees", 'Gimlet',
  'Bramble', 'Aviation', 'Champagne Cocktail', 'Mint Julep', 'Caipirinha',
  'Moscow Mule', 'Paloma', 'Tom Collins', 'Long Island Iced Tea', 'B-52',
  'Mudslide', 'Hot Buttered Rum', 'Dry Martini', 'Gin & Tonic', 'Whisky Highball',
  'Vodka Martini', 'White Negroni', 'Corpse Reviver No. 2'
];

function summarize(r) {
  const tags = [...(r.experience_tags || []), ...(r.occasion_tags || []), ...(r.structural_tags || [])];
  return {
    name: r.name,
    family: r.primary_family,
    template: r.primary_template,
    secondary: r.secondary_template || '',
    build: r.build_method,
    service: r.service_style,
    base: r.base_spirit,
    glass: r.glass,
    citrus: r.citrus_present,
    lengthened: r.lengthened,
    tags,
    note: r.classification_note || ''
  };
}

requested.forEach(q => {
  const exact = d.find(r => r.name.toLowerCase() === q.toLowerCase());
  const partial = d.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) && r.name.length < q.length + 20);
  console.log('---', q);
  if (exact) console.log(JSON.stringify(summarize(exact), null, 2));
  else if (partial.length) {
    console.log('PARTIAL:', partial.map(r => r.name).join(' | '));
    console.log(JSON.stringify(summarize(partial[0]), null, 2));
  } else console.log('NOT FOUND');
});
