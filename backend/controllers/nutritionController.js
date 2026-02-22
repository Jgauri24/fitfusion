const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Log a meal (NutritionLog) for the authenticated user.
 */
const logMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mealType, foodItems, calories } = req.body;

        if (!mealType || !calories) {
            return res.status(400).json({ message: 'mealType and calories are required.' });
        }

        const log = await prisma.nutritionLog.create({
            data: {
                userId,
                mealType,
                foodGrams: foodItems?.length || 1,
                calories: parseFloat(calories),
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
            orderBy: { loggedAt: 'asc' }
        });

        const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);

        // Group by meal type
        const meals = {};
        logs.forEach(log => {
            if (!meals[log.mealType]) {
                meals[log.mealType] = { mealType: log.mealType, calories: 0, logged: true };
            }
            meals[log.mealType].calories += log.calories;
        });

        res.json({
            totalCalories,
            meals: Object.values(meals),
            logs
        });
    } catch (error) {
        console.error('getTodayNutrition error:', error);
        res.status(500).json({ message: 'Failed to fetch nutrition data.' });
    }
};

module.exports = { logMeal, getTodayNutrition };
