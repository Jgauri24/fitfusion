const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Log an activity for the authenticated user.
 */
const logActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { activityType, durationMins, caloriesBurned, sets, reps, load } = req.body;

        if (!activityType || !durationMins) {
            return res.status(400).json({ message: 'activityType and durationMins are required.' });
        }

        const log = await prisma.activityLog.create({
            data: {
                userId,
                activityType,
                durationMins: parseInt(durationMins),
                caloriesBurned: parseFloat(caloriesBurned || 0),
                sets: sets ? parseInt(sets) : null,
                reps: reps ? parseInt(reps) : null,
                load: load ? parseFloat(load) : null,
            }
        });

        res.status(201).json({ message: 'Activity logged successfully.', log });
    } catch (error) {
        console.error('logActivity error:', error);
        res.status(500).json({ message: 'Failed to log activity.' });
    }
};

/**
 * Get weekly activity summary (last 7 days) for the authenticated user.
 */
const getWeeklyActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const logs = await prisma.activityLog.findMany({
            where: {
                userId,
                loggedAt: { gte: sevenDaysAgo }
            },
            orderBy: { loggedAt: 'desc' }
        });

        // Calculate daily totals for the chart (Mon-Sun)
        const dailyMinutes = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();

        logs.forEach(log => {
            const logDate = new Date(log.loggedAt);
            const daysAgo = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
            const dayIndex = 6 - daysAgo; // 6 = today, 0 = 6 days ago
            if (dayIndex >= 0 && dayIndex <= 6) {
                dailyMinutes[dayIndex] += log.durationMins;
            }
        });

        // Calculate streak (consecutive days with activity)
        let streak = 0;
        for (let i = 6; i >= 0; i--) {
            if (dailyMinutes[i] > 0) streak++;
            else break;
        }

        // Recent activities for the list
        const recentActivities = logs.slice(0, 5).map(log => ({
            id: log.id,
            type: log.activityType,
            duration: `${log.durationMins} min`,
            intensity: log.caloriesBurned > 300 ? 'High' : log.caloriesBurned > 150 ? 'Moderate' : 'Low',
            date: new Date(log.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sets: log.sets,
            reps: log.reps,
            load: log.load ? `${log.load}kg` : null,
        }));

        res.json({
            dailyMinutes,
            streak,
            consistencyScore: Math.round((streak / 7) * 100),
            recentActivities,
        });
    } catch (error) {
        console.error('getWeeklyActivity error:', error);
        res.status(500).json({ message: 'Failed to fetch activity data.' });
    }
};

/**
 * Delete an activity log for the authenticated user.
 */
const deleteActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const log = await prisma.activityLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        await prisma.activityLog.delete({ where: { id } });
        res.json({ message: 'Activity deleted successfully.' });
    } catch (error) {
        console.error('deleteActivity error:', error);
        res.status(500).json({ message: 'Failed to delete activity.' });
    }
};

module.exports = { logActivity, getWeeklyActivity, deleteActivity };
