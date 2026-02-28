const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Log a meal (NutritionLog) for the authenticated user.
 * If a foodItemId is provided, macros are auto-populated from the FoodItem catalog.
 */
const logMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mealType, foodItems, calories, protein, carbs, fats, foodItemId } = req.body;

        if (!mealType || !calories) {
            return res.status(400).json({ message: 'mealType and calories are required.' });
        }

        let macros = {
            protein: parseFloat(protein || 0),
            carbs: parseFloat(carbs || 0),
            fats: parseFloat(fats || 0),
        };

        // If a foodItemId is provided, auto-populate from the catalog
        if (foodItemId) {
            const foodItem = await prisma.foodItem.findUnique({ where: { id: foodItemId } });
            if (foodItem) {
                macros.protein = macros.protein || foodItem.protein;
                macros.carbs = macros.carbs || foodItem.carbs;
                macros.fats = macros.fats || foodItem.fats;
            }
        }

        const log = await prisma.nutritionLog.create({
            data: {
                userId,
                mealType,
                foodGrams: foodItems?.length || 1,
                calories: parseFloat(calories),
                protein: macros.protein,
                carbs: macros.carbs,
                fats: macros.fats,
                foodItemId: foodItemId || null,
            }
        });

        res.status(201).json({ message: 'Meal logged successfully.', log });
    } catch (error) {
        console.error('logMeal error:', error);
        res.status(500).json({ message: 'Failed to log meal.' });
    }
};

/**
 * Get today's nutrition summary for the authenticated user.
 * Now includes macronutrient totals (protein, carbs, fats).
 */
const getTodayNutrition = async (req, res) => {
    try {
        const userId = req.user.id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const logs = await prisma.nutritionLog.findMany({
            where: {
                userId,
                loggedAt: { gte: startOfDay }
            },
            orderBy: { loggedAt: 'asc' },
            include: { foodItem: true }
        });

        const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);
        const totalProtein = logs.reduce((sum, l) => sum + l.protein, 0);
        const totalCarbs = logs.reduce((sum, l) => sum + l.carbs, 0);
        const totalFats = logs.reduce((sum, l) => sum + l.fats, 0);

        // Group by meal type
        const meals = {};
        logs.forEach(log => {
            if (!meals[log.mealType]) {
                meals[log.mealType] = { mealType: log.mealType, calories: 0, protein: 0, carbs: 0, fats: 0, logged: true };
            }
            meals[log.mealType].calories += log.calories;
            meals[log.mealType].protein += log.protein;
            meals[log.mealType].carbs += log.carbs;
            meals[log.mealType].fats += log.fats;
        });

        res.json({
            totalCalories,
            totalProtein: Math.round(totalProtein * 10) / 10,
            totalCarbs: Math.round(totalCarbs * 10) / 10,
            totalFats: Math.round(totalFats * 10) / 10,
            meals: Object.values(meals),
            logs
        });
    } catch (error) {
        console.error('getTodayNutrition error:', error);
        res.status(500).json({ message: 'Failed to fetch nutrition data.' });
    }
};

module.exports = { logMeal, getTodayNutrition };
