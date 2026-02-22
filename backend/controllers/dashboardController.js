const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const MoodCheckIn = require('../models/MoodCheckIn');
const Journal = require('../models/Journal');

// GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        // 1. Get total users (role = STUDENT)
        const totalUsers = await prisma.user.count({
            where: { role: 'STUDENT' }
        });

        // 2. Get active today (simplified: users created today, or logged activity today)
        // In a real app we'd track "lastLogin" or a session table, but for now we'll count
        // distinct users who logged a meal or activity today.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeMeals = await prisma.nutritionLog.findMany({
            where: { loggedAt: { gte: today } },
            select: { userId: true }
        });
        const activeActivities = await prisma.activityLog.findMany({
            where: { loggedAt: { gte: today } },
            select: { userId: true }
        });

        const activeUserIds = new Set([
            ...activeMeals.map(m => m.userId),
            ...activeActivities.map(a => a.userId)
        ]);
        const activeToday = activeUserIds.size;

        // 3. Avg calories logged today
        const todaysMeals = await prisma.nutritionLog.findMany({
            where: { loggedAt: { gte: today } }
        });
        const totalCaloriesToday = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const avgCalories = activeToday > 0 ? Math.round(totalCaloriesToday / activeToday) : 0;

        // 4. Total activities logged ever
        const totalActivities = await prisma.activityLog.count();

        // 5. Fake some wellness/mess stats just to populate the UI (since these aren't fully modelled)
        const wellnessScore = Math.floor(Math.random() * (90 - 70) + 70); // 70-90
        const messServings = todaysMeals.length * 20;

        // 6. Weekly Activity Data for the Chart
        // Generate an array of the last 7 days
        const weeklyActivityTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);

            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const count = await prisma.activityLog.count({
                where: {
                    loggedAt: {
                        gte: d,
                        lt: nextDay
                    }
                }
            });

            // Format day like 'Mon', 'Tue'
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyActivityTrend.push({ day: dayStr, count });
        }

        // 7. Nutrition by Meal aggregation
        // We'll calculate the average calories logged for each meal type over all time (or just past 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const nutritionAgg = await prisma.nutritionLog.groupBy({
            by: ['mealType'],
            where: { loggedAt: { gte: thirtyDaysAgo } },
            _avg: { calories: true }
        });

        // Map backend enums to frontend display formats
        const mealColorMap = {
            'BREAKFAST': 'var(--accent)',
            'LUNCH': 'var(--green)',
            'DINNER': 'var(--blue)',
            'SNACK': 'var(--orange)'
        };

        const nutritionByMeal = nutritionAgg.map(agg => ({
            meal: agg.mealType.charAt(0) + agg.mealType.slice(1).toLowerCase(),
            avgCalories: Math.round(agg._avg.calories || 0),
            color: mealColorMap[agg.mealType] || 'var(--text-muted)'
        }));

        // Fill in defaults if no data exists
        if (nutritionByMeal.length === 0) {
            nutritionByMeal.push(
                { meal: "Breakfast", avgCalories: 0, color: "var(--accent)" },
                { meal: "Lunch", avgCalories: 0, color: "var(--green)" },
                { meal: "Dinner", avgCalories: 0, color: "var(--blue)" }
            );
        }

        // 8. Hostel Comparison (Simulated for now, as hostels aren't in the schema natively)
        // Ideally, 'hostel' would be on the User model. Since it's not, we'll randomize live data 
        // to show the UI works, but in production this would group by User.hostel.
        const hostelsList = ["Govind", "Sarojini", "Rajendra", "Kasturba", "Cautley", "Jawahar"];
        const hostelComparison = hostelsList.map(h => ({
            hostel: h,
            activeUsers: Math.floor(Math.random() * 50) + 10,
            avgSteps: Math.floor(Math.random() * 5000) + 5000,
            avgCalories: Math.floor(Math.random() * 1000) + 1500,
            wellnessScore: Math.floor(Math.random() * 30) + 60,
        }));

        res.json({
            totalUsers,
            activeToday,
            avgCalories,
            wellnessScore,
            totalActivities,
            messServings,
            weeklyActivityTrend,
            nutritionByMeal,
            hostelComparison
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
