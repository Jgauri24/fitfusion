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

        const response = await fetch(
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(q)}&pageSize=8&dataType=Survey%20(FNDDS)`,
        );

        if (!response.ok) {
            throw new Error(`USDA API error: ${response.status}`);
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
