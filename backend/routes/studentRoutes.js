const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logMeal, getTodayNutrition } = require('../controllers/nutritionController');
const { searchFood } = require('../controllers/nutritionSearchController');
const { logActivity, getWeeklyActivity, deleteActivity } = require('../controllers/activityController');
const { saveMoodCheckIn, saveJournalEntry, getWeeklyMood, getJournals, getMoodDashboard, deleteJournal } = require('../controllers/moodController');
const { getEvents, joinEvent, leaveEvent } = require('../controllers/wellnessController');
const { getAllZones } = require('../controllers/environmentController');
const { chat } = require('../controllers/chatController');

// Apply auth constraints to all student routes
router.use(verifyToken);
router.use(requireRole('STUDENT'));

// Dashboard — real wellness scoring from student data
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        // ── Nutrition Score (0-100) ──
        // Based on today's calorie intake vs 2000 kcal goal
        const todayMeals = await prisma.nutritionLog.findMany({
            where: { userId, loggedAt: { gte: todayStart } },
        });
        const totalCalToday = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
        const calorieGoal = 2000;
        const nutritionScore = totalCalToday > 0
            ? Math.min(100, Math.round((totalCalToday / calorieGoal) * 100))
            : 0;

        // ── Activity Score (0-100) ──
        // Based on workout consistency (days active out of 7) and total minutes
        const weeklyActivities = await prisma.activityLog.findMany({
            where: { userId, loggedAt: { gte: sevenDaysAgo } },
        });
        const activeDays = new Set(
            weeklyActivities.map(a => new Date(a.loggedAt).toDateString())
        ).size;
        const totalMinutes = weeklyActivities.reduce((s, a) => s + (a.durationMins || 0), 0);
        // 5+ active days = 100, scale linearly; bonus for total minutes
        const activityScore = Math.min(100, Math.round(
            (activeDays / 5) * 70 + Math.min(30, (totalMinutes / 150) * 30)
        ));

        // ── Mood Score (0-100) ──
        // From average mood check-in score (1-5 mapped to 0-100)
        const weeklyMoods = await prisma.moodCheckIn.findMany({
            where: { userId, createdAt: { gte: sevenDaysAgo } },
        });
        const avgMood = weeklyMoods.length > 0
            ? weeklyMoods.reduce((s, m) => s + m.moodScore, 0) / weeklyMoods.length
            : 0;
        const moodScore = weeklyMoods.length > 0
            ? Math.round((avgMood / 5) * 100)
            : 0;

        // ── Environment Score (fixed from zone averages) ──
        const zones = await prisma.environmentZone.findMany();
        const envScore = zones.length > 0
            ? Math.round(zones.reduce((s, z) => {
                // Score based on AQI (lower is better) and temp comfort
                let zScore = 75;
                if (z.aqi) zScore = Math.max(30, 100 - z.aqi);
                if (z.temperature) {
                    const comfort = Math.abs(z.temperature - 24);
                    zScore = Math.round((zScore + Math.max(40, 100 - comfort * 5)) / 2);
                }
                return s + zScore;
            }, 0) / zones.length)
            : 70;

        // ── Overall PWS ──
        const overallScore = Math.round(
            nutritionScore * 0.3 + activityScore * 0.3 + moodScore * 0.25 + envScore * 0.15
        );

        // ── 7-Day Trend (daily wellness scores) ──
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const dayMeals = await prisma.nutritionLog.count({
                where: { userId, loggedAt: { gte: dayStart, lt: dayEnd } },
            });
            const dayActs = await prisma.activityLog.count({
                where: { userId, loggedAt: { gte: dayStart, lt: dayEnd } },
            });
            const dayMoods = await prisma.moodCheckIn.findMany({
                where: { userId, createdAt: { gte: dayStart, lt: dayEnd } },
            });
            const dayMoodAvg = dayMoods.length > 0
                ? dayMoods.reduce((s, m) => s + m.moodScore, 0) / dayMoods.length
                : 2.5;

            // Simple daily score: meals logged + activities done + mood quality
            const dayScore = Math.min(100, Math.round(
                (dayMeals > 0 ? 30 : 0) +
                (dayActs > 0 ? 30 : 0) +
                (dayMoodAvg / 5) * 40
            ));
            trend.push(dayScore);
        }

        // ── Smart Nudge ──
        let nudge = "You're doing great! Keep up the momentum.";
        if (nutritionScore === 0) nudge = "You haven't logged any meals today. Head to the mess and track your nutrition!";
        else if (activityScore < 40) nudge = "Your activity is looking low this week. A brisk walk or quick gym session could help.";
        else if (moodScore < 40 && moodScore > 0) nudge = "Your mood has been low lately. Consider journaling or joining a wellness event.";
        else if (nutritionScore < 50) nudge = "You're behind on your calorie goal. A balanced meal could bring you back on track.";

        res.json({
            score: overallScore,
            nutrition: nutritionScore,
            activity: activityScore,
            mood: moodScore,
            environment: envScore,
            trend,
            nudge,
        });
    } catch (error) {
        console.error('student dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard.' });
    }
});

// Nutrition - Common Canteen Items
router.get('/nutrition/canteen', (req, res) => {
    const commonItems = [
        { id: 1, name: "Poha", kcal: 180, protein: 4, carbs: 35, fats: 2, icon: "🍚" },
        { id: 2, name: "Dal Rice", kcal: 420, protein: 12, carbs: 80, fats: 5, icon: "🍛" },
        { id: 3, name: "Roti Sabzi", kcal: 350, protein: 8, carbs: 55, fats: 10, icon: "🫓" },
        { id: 4, name: "Chole Bhature", kcal: 520, protein: 15, carbs: 65, fats: 22, icon: "🥙" },
        { id: 5, name: "Fruit Bowl", kcal: 120, protein: 2, carbs: 28, fats: 0, icon: "🍎" },
        { id: 6, name: "Paneer Wrap", kcal: 390, protein: 18, carbs: 45, fats: 16, icon: "🌯" },
        { id: 7, name: "Idli Sambar", kcal: 150, protein: 5, carbs: 30, fats: 1, icon: "⚪" },
        { id: 8, name: "Dosa", kcal: 220, protein: 4, carbs: 38, fats: 6, icon: "🥞" },
    ];
    res.json(commonItems);
});

// Nutrition
router.post('/nutrition/log', logMeal);
router.get('/nutrition/today', getTodayNutrition);
router.get('/nutrition/search', searchFood);

// Chat (Groq Wellness Bot)
router.post('/chat', chat);

// Activity
router.post('/activity/log', logActivity);
router.get('/activity/weekly', getWeeklyActivity);
router.delete('/activity/:id', deleteActivity);

// Mood
router.post('/mood/checkin', saveMoodCheckIn);
router.get('/mood/weekly', getWeeklyMood);
router.get('/mood/dashboard', getMoodDashboard);

// Journal
router.post('/mood/journal', saveJournalEntry);
router.get('/mood/journals', getJournals);
router.delete('/mood/journal/:id', deleteJournal);

// Wellness Events (Circles)
router.get('/wellness/events', getEvents);
router.post('/wellness/:eventId/join', joinEvent);
router.delete('/wellness/:eventId/leave', leaveEvent);

// Environment Zones
router.get('/environment', getAllZones);

module.exports = router;
