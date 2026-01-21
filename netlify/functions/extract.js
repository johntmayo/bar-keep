exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { image } = JSON.parse(event.body);
    
    if (!image) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No image provided' })
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

    // Detect image format (assume jpeg by default, but could be png)
    const imageFormat = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageFormat,
                  data: image
                }
              },
              {
                type: 'text',
                text: `Extract the cocktail recipe information from this image. You MUST return a JSON object with the following EXACT structure:
{
  "name": "Cocktail name",
  "category": "Cocktail category (e.g., Cocktail, Sour, Spirit Forward, Highball, Tiki, Spritz, Martini, Flip, Hot Drink, Other)",
  "glass": "Glass type (e.g., Rocks Glass, Coupe, Martini Glass, Highball Glass, Collins Glass, Champagne Flute)",
  "ingredients": [
    {
      "name": "Ingredient name",
      "measure": "Amount and unit (e.g., '2 oz', '1/2 oz', '1 dash')"
    }
  ],
  "instructions": "Step-by-step preparation instructions",
  "notes": "Any additional notes or garnish information (optional)"
}

CRITICAL: The "ingredients" array is REQUIRED and must contain ALL ingredients listed in the recipe. Each ingredient must have both "name" and "measure" fields. Do not omit any ingredients. If you cannot determine a measurement, use an empty string for "measure" but still include the ingredient name.

Be precise with ingredient names and measurements. If any field cannot be determined, use an empty string. Return ONLY valid JSON, no markdown code blocks, no explanations, just the raw JSON object.`
              }
            ]
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
        body: JSON.stringify({ error: 'Failed to extract recipe from image' })
      };
    }

    const data = await response.json();
    
    // Log full response for debugging
    console.log('API response structure:', JSON.stringify(data, null, 2));
    
    const content = data.content?.[0]?.text;
    
    if (!content) {
      console.error('No content in response. Full response:', JSON.stringify(data, null, 2));
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No content returned from API', debug: 'Check server logs' })
      };
    }
    
    console.log('Extracted content length:', content.length);
    console.log('Content preview:', content.substring(0, 200));

    // Parse the JSON response (handle markdown code blocks if present)
    let recipeData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipeData = JSON.parse(cleanedContent);
      
      // Log parsed data structure
      console.log('Parsed recipe data keys:', Object.keys(recipeData));
      console.log('Ingredients in parsed data:', recipeData.ingredients ? `Array with ${recipeData.ingredients.length} items` : 'MISSING');
      if (recipeData.ingredients) {
        console.log('First ingredient sample:', recipeData.ingredients[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Content that failed to parse:', content.substring(0, 500));
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to parse recipe data', details: parseError.message })
      };
    }

    // Ensure ingredients array exists and has the correct structure
    if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
      console.warn('Ingredients missing or invalid, defaulting to empty array');
      recipeData.ingredients = [];
    }
    
    // Normalize ingredients structure
    recipeData.ingredients = recipeData.ingredients.map((ing, index) => {
      // Handle string format
      if (typeof ing === 'string') {
        console.log(`Ingredient ${index} is string: "${ing}"`);
        return { name: ing.trim(), measure: '' };
      }
      
      // Handle object format
      if (typeof ing === 'object' && ing !== null) {
        // Handle { name, amount, unit } format
        if (!ing.measure && ing.amount) {
          ing.measure = ing.unit ? `${ing.amount} ${ing.unit}` : String(ing.amount);
        }
        
        const normalized = {
          name: (ing.name || '').trim(),
          measure: (ing.measure || '').trim()
        };
        
        // Log if name is missing
        if (!normalized.name) {
          console.warn(`Ingredient ${index} has no name:`, ing);
        }
        
        return normalized;
      }
      
      console.warn(`Ingredient ${index} has unexpected format:`, ing);
      return { name: '', measure: '' };
    }).filter(ing => ing.name.length > 0); // Remove empty ingredients
    
    console.log(`Normalized ${recipeData.ingredients.length} ingredients`);

    // Ensure all required fields exist
    const result = {
      name: recipeData.name || '',
      category: recipeData.category || 'Cocktail',
      glass: recipeData.glass || '',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || '',
      notes: recipeData.notes || ''
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};

