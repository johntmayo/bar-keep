const fs = require('fs');
const path = require('path');

// Load the bartender system prompt from the .md file
const systemPrompt = fs.readFileSync(
  path.join(__dirname, 'bartender-prompt.md'),
  'utf8'
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { query } = JSON.parse(event.body);

    if (!query || !query.trim()) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No drink query provided' })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: query.trim()
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to get recipe from bartender' })
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No response from bartender' })
      };
    }

    // Parse the JSON response (strip markdown code fences if present)
    let result;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message, content.substring(0, 300));
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Could not parse bartender response' })
      };
    }

    // Validate and normalize the recipe structure
    if (!result.recipe || !result.recipe.name) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Bartender returned an incomplete recipe' })
      };
    }

    // Normalize ingredients
    if (!Array.isArray(result.recipe.ingredients)) {
      result.recipe.ingredients = [];
    }
    result.recipe.ingredients = result.recipe.ingredients
      .map(ing => {
        if (typeof ing === 'string') return { name: ing.trim(), measure: '' };
        return {
          name: (ing.name || '').trim(),
          measure: (ing.measure || '').trim()
        };
      })
      .filter(ing => ing.name.length > 0);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipe: {
          name: result.recipe.name || '',
          glass: result.recipe.glass || '',
          ingredients: result.recipe.ingredients,
          instructions: result.recipe.instructions || '',
          notes: result.recipe.notes || ''
        },
        bartenderNote: result.bartenderNote || ''
      })
    };

  } catch (error) {
    console.error('Bartender function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
