const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new food item (Admin only)
 */
const createFoodItem = async (req, res) => {
    try {
        const { name, category, meal, portion, calories, protein, carbs, fats } = req.body;

        if (!name || !category || !meal || !portion || !calories) {
            return res.status(400).json({ message: 'name, category, meal, portion, and calories are required.' });
        }

        const item = await prisma.foodItem.create({
            data: {
                name,
                category,
                meal,
                portion,
                calories: parseInt(calories),
                protein: parseFloat(protein || 0),
                carbs: parseFloat(carbs || 0),
                fats: parseFloat(fats || 0),
            }
        });

        res.status(201).json({ message: 'Food item created successfully.', item });
    } catch (error) {
        console.error('createFoodItem error:', error);
        res.status(500).json({ message: 'Failed to create food item.' });
    }
};

/**
 * Get all food items
 */
const getAllFoodItems = async (req, res) => {
    try {
        const items = await prisma.foodItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        console.error('getAllFoodItems error:', error);
        res.status(500).json({ message: 'Failed to fetch food items.' });
    }
};

module.exports = { createFoodItem, getAllFoodItems };
