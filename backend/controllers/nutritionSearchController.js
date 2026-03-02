/**
 * Nutrition Search Controller
 * Uses USDA FoodData Central API (completely free, no registration needed).
 * Endpoint: GET /api/student/nutrition/search?q=paneer tikka
 */

const searchFood = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters.', items: [] });
        }

        const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
        const isDemo = apiKey === 'DEMO_KEY';

        console.log(`[NutritionSearch] Query: "${q}" | Key: ${isDemo ? 'DEMO_KEY' : `Configured (ends in ...${apiKey.slice(-4)})`}`);

        const params = new URLSearchParams({
            query: q,
            pageSize: '8',
            dataType: 'Survey (FNDDS),Branded' // Expanded search
        });

        // Some data.gov APIs prefer Headers, let's include it there and keep as fallback in URL
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?${params.toString()}&api_key=${apiKey}`;

        const response = await fetch(url, {
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let errorMessage = `USDA API error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage += ` - ${JSON.stringify(errorData)}`;
            } catch (e) {
                // If not JSON, try text
                const errorText = await response.text().catch(() => '');
                if (errorText) errorMessage += ` - ${errorText.substring(0, 200)}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Transform USDA response to our app format
        const results = (data.foods || []).slice(0, 8).map((food, idx) => {
            // Extract key nutrients from the nutrient array
            const getNutrient = (id) => {
                const n = food.foodNutrients?.find(n => n.nutrientId === id);
                return n ? Math.round(n.value * 10) / 10 : 0;
            };

            return {
                id: `api_${food.fdcId || idx}`,
                name: formatFoodName(food.description || 'Unknown'),
                kcal: Math.round(getNutrient(1008)),     // Energy (kcal)
                protein: getNutrient(1003),                // Protein (g)
                carbs: getNutrient(1005),                  // Carbohydrates (g)
                fats: getNutrient(1004),                   // Total fat (g)
                fiber: getNutrient(1079),                  // Fiber (g)
                sugar: getNutrient(2000),                  // Sugars (g)
                servingSize: 100,                          // per 100g
                icon: '🔍',
                source: 'api'
            };
        });

        res.json({ items: results, query: q });
    } catch (error) {
        console.error('searchFood error:', error);
        res.status(500).json({ message: 'Failed to search food nutrition data.', items: [] });
    }
};

/** Clean up USDA food names (they come in ALL CAPS) */
function formatFoodName(name) {
    return name
        .toLowerCase()
        .split(',')[0]  // Take just the main name
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

module.exports = { searchFood };
