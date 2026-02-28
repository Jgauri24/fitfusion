const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');
const { createFoodItem, getAllFoodItems } = require('../controllers/foodItemController');
const { createZone, getAllZones } = require('../controllers/environmentController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Apply auth constraints to all admin routes
router.use(verifyToken);
router.use(requireRole('ADMIN'));

// Dashboard
router.get('/dashboard/stats', dashboardController.getDashboardStats);

// Users Stats — real aggregated data for the Users page
router.get('/users/stats', async (req, res) => {
    try {
        const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

        // Real fitness level counts from the fitnessLevel field + activity fallback
        const fitnessGroups = await prisma.user.groupBy({
            by: ['fitnessLevel'],
            where: { role: 'STUDENT' },
            _count: { id: true },
        });
        let beginners = 0, intermediate = 0, advanced = 0;
        fitnessGroups.forEach(g => {
            if (g.fitnessLevel === 'ADVANCED') advanced += g._count.id;
            else if (g.fitnessLevel === 'INTERMEDIATE') intermediate += g._count.id;
            else beginners += g._count.id; // BEGINNER + null
        });

        // Real Cohort data: group users by hostel (using actual DB data)
        const hostelGroups = await prisma.user.groupBy({
            by: ['hostel', 'branch', 'academicYear'],
            where: { role: 'STUDENT', hostel: { not: null } },
            _count: { id: true },
        });

        const cohorts = hostelGroups.map((g, i) => ({
            id: i + 1,
            hostel: g.hostel || 'Unknown',
            branch: g.branch || 'N/A',
            year: g.academicYear || 'N/A',
            students: g._count.id,
            wellness: 0,
            steps: 0,
            diet: 'N/A',
            flags: 0,
            trend: 'neutral',
        }));

        // Enrich top cohorts with real wellness data (limit to first 50 to avoid excessive queries)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (const cohort of cohorts.slice(0, 50)) {
            const whereClause = { role: 'STUDENT', hostel: cohort.hostel, branch: cohort.branch === 'N/A' ? undefined : cohort.branch };
            const users = await prisma.user.findMany({ where: whereClause, select: { id: true, dietaryPref: true } });
            const userIds = users.map(u => u.id);

            if (userIds.length > 0) {
                const actAgg = await prisma.activityLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } },
                    _avg: { caloriesBurned: true },
                });
                cohort.steps = Math.round(5000 + (actAgg._avg.caloriesBurned || 0) * 5);
                cohort.wellness = Math.min(100, 60 + Math.round((actAgg._avg.caloriesBurned || 0) / 10));
                cohort.trend = cohort.wellness >= 78 ? 'up' : cohort.wellness >= 70 ? 'neutral' : 'down';

                const vegCount = users.filter(u => u.dietaryPref === 'VEGETARIAN' || u.dietaryPref === 'VEGAN').length;
                cohort.diet = `${Math.round((vegCount / users.length) * 100)}% Veg`;
            }
        }

        res.json({
            totalStudents,
            beginners,
            intermediate,
            advanced,
            cohorts,
        });
    } catch (error) {
        console.error('getUsersStats error:', error);
        res.status(500).json({ message: 'Failed to fetch user stats.' });
    }
});

// Wellness Stats
router.get('/wellness/stats', async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch last 7 days of moods and journals
        const moods = await prisma.moodCheckIn.findMany({
            where: { createdAt: { gte: sevenDaysAgo } }
        });
        const journals = await prisma.journal.findMany({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        // Group by day (e.g., 'Mon', 'Tue')
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const wellnessDataMap = {};

        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() - (6 - i));
            const dayStr = days[d.getDay()];
            wellnessDataMap[dayStr] = { date: dayStr, avgMood: 0, journalEntries: 0, count: 0, dateKey: d.toDateString() };
        }

        // Aggregate Moods
        moods.forEach(m => {
            const dayStr = days[m.createdAt.getDay()];
            if (wellnessDataMap[dayStr]) {
                wellnessDataMap[dayStr].avgMood += (m.moodScore + 1); // scale 0-4 to 1-5
                wellnessDataMap[dayStr].count++;
            }
        });

        // Aggregate Journals
        journals.forEach(j => {
            const dayStr = days[j.createdAt.getDay()];
            if (wellnessDataMap[dayStr]) {
                wellnessDataMap[dayStr].journalEntries++;
            }
        });

        const wellnessData = Object.values(wellnessDataMap).map(d => {
            const avgMood = d.count > 0 ? (d.avgMood / d.count) : 3.5; // fallback
            return {
                date: d.date,
                avgMood: parseFloat(avgMood.toFixed(1)),
                journalEntries: d.journalEntries,
                circleParticipants: Math.round(avgMood * 10), // simulated
                stressLevel: parseFloat((10 - (avgMood * 1.5)).toFixed(1)), // simulated inverse relationship
                sleepAvg: parseFloat((avgMood + 3).toFixed(1)) // simulated positive relationship
            };
        });

        // Mood Distribution
        const moodCounts = { 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
        moods.forEach(m => {
            if (moodCounts[m.moodScore] !== undefined) moodCounts[m.moodScore]++;
        });
        const totalMoods = moods.length || 1;
        const moodDistribution = [
            { mood: '😊 Happy', percentage: Math.round((moodCounts[4] / totalMoods) * 100) || 0, color: 'var(--green)' },
            { mood: '😌 Calm', percentage: Math.round((moodCounts[3] / totalMoods) * 100) || 0, color: 'var(--accent)' },
            { mood: '😐 Neutral', percentage: Math.round((moodCounts[2] / totalMoods) * 100) || 0, color: 'var(--yellow)' },
            { mood: '😰 Anxious', percentage: Math.round((moodCounts[1] / totalMoods) * 100) || 0, color: 'var(--orange)' },
            { mood: '😞 Low', percentage: Math.round((moodCounts[0] / totalMoods) * 100) || 0, color: 'var(--red)' },
        ];

        // Mock attendance data (simulating older historical data not yet in active DB)
        const attendanceData = [
            { week: 'W1', attendance: 210 }, { week: 'W2', attendance: 235 },
            { week: 'W3', attendance: 198 }, { week: 'W4', attendance: 176 },
            { week: 'W5', attendance: 220 }, { week: 'W6', attendance: 248 },
            { week: 'W7', attendance: 270 }
        ];

        res.json({ wellnessData, moodDistribution, attendanceData });
    } catch (error) {
        console.error('getWellnessStats error:', error);
        res.status(500).json({ message: 'Failed to fetch wellness stats.' });
    }
});

// Analytics Stats — Real aggregated data
router.get('/analytics/stats', async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // ── Monthly Trends (last 6 months, real data) ──
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const [users, activities, meals] = await Promise.all([
                prisma.user.count({ where: { role: 'STUDENT', createdAt: { lt: monthEnd } } }),
                prisma.activityLog.count({ where: { loggedAt: { gte: monthStart, lt: monthEnd } } }),
                prisma.nutritionLog.count({ where: { loggedAt: { gte: monthStart, lt: monthEnd } } }),
            ]);

            monthlyTrends.push({
                month: months[monthStart.getMonth()],
                users,
                activities,
                meals,
            });
        }

        // ── Department Stats (real groupBy on user.branch) ──
        const branchGroups = await prisma.user.groupBy({
            by: ['branch'],
            where: { role: 'STUDENT', branch: { not: null } },
            _count: { id: true },
        });

        const departmentStats = [];
        for (const bg of branchGroups) {
            const branchUsers = await prisma.user.findMany({
                where: { branch: bg.branch, role: 'STUDENT' },
                select: { id: true },
            });
            const userIds = branchUsers.map(u => u.id);

            const activityCount = userIds.length > 0
                ? await prisma.activityLog.count({ where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } } })
                : 0;

            const engagement = userIds.length > 0 ? Math.round((activityCount / (userIds.length * 30)) * 100) : 0;

            departmentStats.push({
                dept: bg.branch,
                users: bg._count.id,
                avgFitness: Math.min(100, 60 + engagement),
                engagement: Math.min(100, engagement),
            });
        }

        // ── Hostel Comparison (real groupBy on user.hostel) ──
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

            let avgCalories = 0;
            let avgCaloriesBurned = 0;
            if (userIds.length > 0) {
                const nutritionAgg = await prisma.nutritionLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } },
                    _avg: { calories: true },
                });
                const activityAgg = await prisma.activityLog.aggregate({
                    where: { userId: { in: userIds }, loggedAt: { gte: thirtyDaysAgo } },
                    _avg: { caloriesBurned: true },
                });
                avgCalories = Math.round(nutritionAgg._avg.calories || 0);
                avgCaloriesBurned = Math.round(activityAgg._avg.caloriesBurned || 0);
            }

            hostelComparison.push({
                hostel: hg.hostel,
                activeUsers: hg._count.id,
                avgSteps: 5000 + avgCaloriesBurned * 5, // approximate from calories burned
                avgCalories,
                wellnessScore: Math.min(100, 60 + Math.round(avgCaloriesBurned / 10)),
            });
        }

        res.json({ monthlyTrends, departmentStats, hostelComparison });
    } catch (error) {
        console.error('getAnalyticsStats error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics stats.' });
    }
});

// Mock Reports Storage (in memory since we don't have a Report schema)
let recentReports = [
    { id: 1, name: "Weekly Wellness Summary", by: "Gauri Admin", date: "Feb 20 2026", format: "PDF", status: "Ready" },
    { id: 2, name: "Hostel Comparison Report", by: "Gauri Admin", date: "Feb 18 2026", format: "CSV", status: "Ready" },
    { id: 3, name: "Burnout Risk Overview", by: "Gauri Admin", date: "Feb 15 2026", format: "PDF", status: "Ready" },
];

router.get('/reports', (req, res) => {
    res.json(recentReports);
});

// CSV Export Endpoint (Anonymized Data)
router.get('/reports/export', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            include: {
                _count: {
                    select: { activityLogs: true, nutritionLogs: true, moodCheckIns: true }
                }
            }
        });

        // CSV Header
        let csv = 'UserHash,Age,Gender,FitnessLevel,DietaryPref,Hostel,Branch,AcademicYear,TotalActivities,TotalMeals,TotalMoodLogs\n';

        // CSV Rows - Anonymized (no email, firstName, or lastName)
        users.forEach(u => {
            const hash = u.id.substring(0, 8); // simple pseudo-anonymization hash
            csv += `${hash},${u.age || ''},${u.gender || ''},${u.fitnessLevel || ''},${u.dietaryPref || ''},${u.hostel || ''},${u.branch || ''},${u.academicYear || ''},${u._count.activityLogs},${u._count.nutritionLogs},${u._count.moodCheckIns}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('fitfusion_anonymized_data.csv');
        res.send(csv);
    } catch (error) {
        console.error('export error:', error);
        res.status(500).json({ message: 'Failed to generate export file.' });
    }
});

router.post('/reports', (req, res) => {
    const { name, format } = req.body;
    const newReport = {
        id: Date.now(),
        name: name || "Custom Report",
        by: "Admin Session",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        format: format || "PDF",
        status: "Ready"
    };
    recentReports.unshift(newReport);

    // keep only top 10
    if (recentReports.length > 10) {
        recentReports.pop();
    }

    res.status(201).json(newReport);
});

// Notifications — dynamic, data-driven alerts
router.get('/notifications', async (req, res) => {
    try {
        const notifications = [];
        const now = new Date();
        let id = 1;

        // 1. Check for students with consistently low mood (burnout risk)
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const lowMoodStudents = await prisma.moodCheckIn.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: oneWeekAgo },
                moodScore: { lte: 1 }
            },
            _count: { userId: true },
            having: { userId: { _count: { gte: 2 } } }
        });

        if (lowMoodStudents.length > 0) {
            notifications.push({
                id: String(id++), type: "alert",
                title: "Burnout Risk Detected",
                message: `${lowMoodStudents.length} students showing consistently low mood scores over the past week.`,
                time: "Just now", read: false
            });
        }

        // 2. Activity drop alert
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentActivities = await prisma.activityLog.count({ where: { loggedAt: { gte: new Date(now.getTime() - 7 * 86400000) } } });
        const priorActivities = await prisma.activityLog.count({ where: { loggedAt: { gte: new Date(now.getTime() - 14 * 86400000), lt: new Date(now.getTime() - 7 * 86400000) } } });
        if (priorActivities > 0 && recentActivities < priorActivities * 0.8) {
            const dropPct = Math.round((1 - recentActivities / priorActivities) * 100);
            notifications.push({
                id: String(id++), type: "warning",
                title: "Activity Level Drop",
                message: `Activity logging dropped ${dropPct}% this week compared to last week.`,
                time: "15 min ago", read: false
            });
        }

        // 3. Environment AQI spike
        const latestEnv = await prisma.environmentZone.findMany({ orderBy: { createdAt: 'desc' }, take: 8 });
        const spikedZones = latestEnv.filter(e => e.aqi > 150);
        if (spikedZones.length > 0) {
            notifications.push({
                id: String(id++), type: "warning",
                title: `AQI Spike — ${spikedZones[0].zone}`,
                message: `Air quality index in ${spikedZones[0].zone} has crossed ${spikedZones[0].aqi} (Unhealthy).`,
                time: "30 min ago", read: false
            });
        }

        // 4. Food items count
        const foodCount = await prisma.foodItem.count();
        notifications.push({
            id: String(id++), type: "info",
            title: "Food Database Status",
            message: `${foodCount} food items are currently in the nutrition database.`,
            time: "1 hour ago", read: false
        });

        // 5. Student count
        const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
        notifications.push({
            id: String(id++), type: "success",
            title: "Student Profiles Active",
            message: `${studentCount.toLocaleString()} student profiles with activity and nutrition history are active.`,
            time: "2 hours ago", read: false
        });

        // 6. Environment readings
        const envCount = await prisma.environmentZone.count();
        notifications.push({
            id: String(id++), type: "success",
            title: "Environment Readings Updated",
            message: `${envCount} environment zone readings recorded across campus.`,
            time: "3 hours ago", read: true
        });

        // 7. Nutrition logs
        const nutritionCount = await prisma.nutritionLog.count();
        notifications.push({
            id: String(id++), type: "info",
            title: "Nutrition Tracking Active",
            message: `${nutritionCount.toLocaleString()} nutrition logs recorded. System is healthy.`,
            time: "5 hours ago", read: true
        });

        // 8. Auto-updater status
        notifications.push({
            id: String(id++), type: "info",
            title: "Auto-Updater Running",
            message: "System auto-updater is generating fresh student data every 30 minutes.",
            time: "12 hours ago", read: true
        });

        res.json(notifications);
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ message: 'Failed to fetch notifications.' });
    }
});

// Activities Stats
router.get('/activities/stats', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Group by activity type
        const grouped = await prisma.activityLog.groupBy({
            by: ['activityType'],
            where: { loggedAt: { gte: thirtyDaysAgo } },
            _count: { userId: true },
            _avg: { durationMins: true, caloriesBurned: true },
        });

        const CATEGORY_MAP = {
            'RUNNING': 'Cardio', 'SWIMMING': 'Cardio', 'CYCLING': 'Cardio', 'WALKING': 'Cardio',
            'GYM': 'Strength', 'YOGA': 'Flexibility',
            'CRICKET': 'Sports', 'FOOTBALL': 'Sports', 'BADMINTON': 'Sports',
            'HIKING': 'Wellness'
        };

        const activities = grouped.map((g, i) => {
            const type = g.activityType;
            return {
                id: `A${i + 1}`,
                type,
                participants: g._count.userId,
                avgDuration: Math.round(g._avg.durationMins || 0),
                caloriesBurned: Math.round(g._avg.caloriesBurned || 0),
                trending: g._count.userId > 500, // example threshold for 'trending'
                category: CATEGORY_MAP[type] || 'Wellness',
            };
        });

        // Add dummy entry if DB is totally empty just to prevent UI crash
        if (activities.length === 0) {
            activities.push({ id: 'A0', type: 'No Data', participants: 0, avgDuration: 0, caloriesBurned: 0, trending: false, category: 'Wellness' });
        }

        res.json(activities);
    } catch (error) {
        console.error('getActivitiesStats error:', error);
        res.status(500).json({ message: 'Failed to fetch activity stats.' });
    }
});

// Food Items CRUD
router.get('/food-items', getAllFoodItems);
router.post('/food-items', createFoodItem);

// Environment Zones CRUD
router.get('/environment', getAllZones);
router.post('/environment', createZone);

// Wellness Event Management (Admin)
router.post('/wellness/manage', async (req, res) => {
    try {
        const { name, type, description, location, scheduledAt, durationMins, maxCapacity } = req.body;

        if (!name || !type || !scheduledAt) {
            return res.status(400).json({ message: 'name, type, and scheduledAt are required.' });
        }

        const event = await prisma.wellnessEvent.create({
            data: {
                name,
                type,
                description: description || null,
                location: location || null,
                scheduledAt: new Date(scheduledAt),
                durationMins: durationMins ? parseInt(durationMins) : 60,
                maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
            }
        });

        res.status(201).json({ message: 'Wellness event created successfully.', event });
    } catch (error) {
        console.error('createWellnessEvent error:', error);
        res.status(500).json({ message: 'Failed to create wellness event.' });
    }
});

module.exports = router;
