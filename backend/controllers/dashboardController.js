const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
    try {
        const { date, period } = req.query;

        // 1. Get total users (role = STUDENT)
        const totalUsers = await prisma.user.count({
            where: { role: 'STUDENT' }
        });

        // 2. Determine the target date for 'today' stats
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // 3. Get active on target date
        const activeMeals = await prisma.nutritionLog.findMany({
            where: { loggedAt: { gte: startOfDay, lte: endOfDay } },
            select: { userId: true }
        });
        const activeActivities = await prisma.activityLog.findMany({
            where: { loggedAt: { gte: startOfDay, lte: endOfDay } },
            select: { userId: true }
        });

        const activeUserIds = new Set([
            ...activeMeals.map(m => m.userId),
            ...activeActivities.map(a => a.userId)
        ]);
        const activeToday = activeUserIds.size;

        // 4. Avg calories logged on target date
        const targetDayMeals = await prisma.nutritionLog.findMany({
            where: { loggedAt: { gte: startOfDay, lte: endOfDay } }
        });
        const totalCaloriesTargetDay = targetDayMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const avgCalories = activeToday > 0 ? Math.round(totalCaloriesTargetDay / activeToday) : 0;

        // 5. Total activities logged ever
        const totalActivities = await prisma.activityLog.count();
        const messServings = targetDayMeals.length * 20;

        // 6. Activity Trend Data (based on period: Days/Weeks/Months)
        const activityTrend = [];
        const activePeriod = period || 'Days';

        if (activePeriod === 'Months') {
            // Last 6 months
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(startOfDay.getFullYear(), startOfDay.getMonth() - i, 1);
                const monthEnd = new Date(startOfDay.getFullYear(), startOfDay.getMonth() - i + 1, 0, 23, 59, 59, 999);
                const count = await prisma.activityLog.count({
                    where: { loggedAt: { gte: monthStart, lte: monthEnd } }
                });
                const label = monthStart.toLocaleDateString('en-US', { month: 'short' });
                activityTrend.push({ day: label, count });
            }
        } else if (activePeriod === 'Weeks') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const weekEnd = new Date(startOfDay);
                weekEnd.setDate(weekEnd.getDate() - (i * 7));
                weekEnd.setHours(23, 59, 59, 999);
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekStart.getDate() - 6);
                weekStart.setHours(0, 0, 0, 0);
                const count = await prisma.activityLog.count({
                    where: { loggedAt: { gte: weekStart, lte: weekEnd } }
                });
                const label = `W${4 - i}`;
                activityTrend.push({ day: label, count });
            }
        } else {
            // Days — last 7 days (default)
            for (let i = 6; i >= 0; i--) {
                const d = new Date(startOfDay);
                d.setDate(d.getDate() - i);
                const nextDay = new Date(d);
                nextDay.setDate(d.getDate() + 1);
                const count = await prisma.activityLog.count({
                    where: { loggedAt: { gte: d, lt: nextDay } }
                });
                const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
                activityTrend.push({ day: dayStr, count });
            }
        }

        // 7. Nutrition by Meal aggregation (Last 30 days from target date)
        const thirtyDaysAgo = new Date(startOfDay);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const nutritionAgg = await prisma.nutritionLog.groupBy({
            by: ['mealType'],
            where: { loggedAt: { gte: thirtyDaysAgo, lte: endOfDay } },
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

        // 8. Hostel Comparison (Last 30 days from target date)
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
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo, lte: endOfDay } },
                    _avg: { calories: true },
                });
                const actAgg = await prisma.activityLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo, lte: endOfDay } },
                    _avg: { caloriesBurned: true },
                });
                avgCals = Math.round(nutAgg._avg.calories || 0);
                avgSteps = 5000 + Math.round((actAgg._avg.caloriesBurned || 0) * 5);
            }

            const hostelWellness = Math.min(100, 60 + Math.round((avgSteps - 5000) / 100));

            // Count burnout flags: users with very low or no activity in last 30 days
            let burnoutFlags = 0;
            if (userIds.length > 0) {
                const activeUsersInHostel = await prisma.activityLog.findMany({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo, lte: endOfDay } },
                    select: { userId: true },
                    distinct: ['userId'],
                });
                const inactiveCount = userIds.length - activeUsersInHostel.length;
                // Flag ~1 per 50 inactive users, plus extra if wellness is low
                burnoutFlags = Math.round(inactiveCount / 50) + (hostelWellness < 70 ? 2 : hostelWellness < 75 ? 1 : 0);
            }

            hostelComparison.push({
                hostel: hg.hostel,
                activeUsers: hg._count.id,
                avgSteps: avgSteps,
                avgCalories: avgCals,
                wellnessScore: hostelWellness,
                burnoutFlags: burnoutFlags,
            });
        }

        // 9. Derive top-level wellness score as weighted average of hostel scores
        let wellnessScore = 0;
        if (hostelComparison.length > 0) {
            const totalHostelUsers = hostelComparison.reduce((s, h) => s + h.activeUsers, 0);
            if (totalHostelUsers > 0) {
                const weightedSum = hostelComparison.reduce((s, h) => s + h.wellnessScore * h.activeUsers, 0);
                wellnessScore = Math.round(weightedSum / totalHostelUsers);
            }
        }

        // 10. Total burnout alerts = sum of all hostel burnout flags
        const burnoutAlerts = hostelComparison.reduce((s, h) => s + h.burnoutFlags, 0);

        res.json({
            totalUsers,
            activeToday,
            avgCalories,
            wellnessScore,
            totalActivities,
            messServings,
            burnoutAlerts,
            weeklyActivityTrend: activityTrend,
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
