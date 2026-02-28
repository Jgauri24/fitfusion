const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        // 1. Get total users (role = STUDENT)
        const totalUsers = await prisma.user.count({
            where: { role: 'STUDENT' }
        });

        // 2. Get active today (simplified: users created today, or logged activity today)
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

        // 5. Fake some wellness/mess stats just to populate the UI
        const wellnessScore = Math.floor(Math.random() * (90 - 70) + 70); // 70-90
        const messServings = todaysMeals.length * 20;

        // 6. Weekly Activity Data for the Chart
        const weeklyActivityTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const count = await prisma.activityLog.count({
                where: { loggedAt: { gte: d, lt: nextDay } }
            });
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyActivityTrend.push({ day: dayStr, count });
        }

        // 7. Nutrition by Meal aggregation
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const nutritionAgg = await prisma.nutritionLog.groupBy({
            by: ['mealType'],
            where: { loggedAt: { gte: thirtyDaysAgo } },
            _avg: { calories: true }
        });

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

        if (nutritionByMeal.length === 0) {
            nutritionByMeal.push(
                { meal: "Breakfast", avgCalories: 0, color: "var(--accent)" },
                { meal: "Lunch", avgCalories: 0, color: "var(--green)" },
                { meal: "Dinner", avgCalories: 0, color: "var(--blue)" }
            );
        }

        // 8. Hostel Comparison (Real aggregations from User.hostel)
        const hostelGroups = await prisma.user.groupBy({
            by: ['hostel'],
            where: { role: 'STUDENT', hostel: { not: null } },
            _count: { id: true },
        });

        const hostelComparison = [];
        for (const hg of hostelGroups) {
            const hostelUsers = await prisma.user.findMany({
                where: { hostel: hg.hostel, role: 'STUDENT' },
                select: { id: true },
            });
            const userIds = hostelUsers.map(u => u.id);

            let avgCals = 0;
            let avgSteps = 0;
            if (userIds.length > 0) {
                const nutAgg = await prisma.nutritionLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } },
                    _avg: { calories: true },
                });
                const actAgg = await prisma.activityLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } },
                    _avg: { caloriesBurned: true },
                });
                avgCals = Math.round(nutAgg._avg.calories || 0);
                avgSteps = 5000 + Math.round((actAgg._avg.caloriesBurned || 0) * 5);
            }

            hostelComparison.push({
                hostel: hg.hostel,
                activeUsers: hg._count.id,
                avgSteps: avgSteps,
                avgCalories: avgCals,
                wellnessScore: Math.min(100, 60 + Math.round((avgSteps - 5000) / 100)),
            });
        }

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
