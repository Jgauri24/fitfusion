const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Save a mood check-in for the authenticated user.
 */
const saveMoodCheckIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const { moodScore, note } = req.body;

        if (moodScore === undefined || moodScore === null) {
            return res.status(400).json({ message: 'moodScore is required.' });
        }

        const checkIn = await prisma.moodCheckIn.create({
            data: {
                userId,
                moodScore: parseInt(moodScore),
                note: note || '',
            }
        });

        res.status(201).json({ message: 'Mood saved successfully.', checkIn });
    } catch (error) {
        console.error('saveMoodCheckIn error:', error);
        res.status(500).json({ message: 'Failed to save mood.' });
    }
};

/**
 * Save a journal entry for the authenticated user.
 */
const saveJournalEntry = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, body } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'title is required.' });
        }

        const journal = await prisma.journal.create({
            data: {
                userId,
                title,
                body: body || '',
            }
        });

        res.status(201).json({ message: 'Journal saved successfully.', journal });
    } catch (error) {
        console.error('saveJournalEntry error:', error);
        res.status(500).json({ message: 'Failed to save journal.' });
    }
};

/**
 * Get weekly mood trend (last 7 days) for the authenticated user.
 */
const getWeeklyMood = async (req, res) => {
    try {
        const userId = req.user.id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const checkIns = await prisma.moodCheckIn.findMany({
            where: {
                userId,
                createdAt: { gte: sevenDaysAgo }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Build daily mood averages (Mon-Sun)
        const dailyMoods = [0, 0, 0, 0, 0, 0, 0];
        const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
        const today = new Date();

        checkIns.forEach(c => {
            const daysAgo = Math.floor((today - c.createdAt) / (1000 * 60 * 60 * 24));
            const dayIndex = 6 - daysAgo;
            if (dayIndex >= 0 && dayIndex <= 6) {
                dailyMoods[dayIndex] += c.moodScore;
                dailyCounts[dayIndex]++;
            }
        });

        const moodTrend = dailyMoods.map((total, i) =>
            dailyCounts[i] > 0 ? Math.round(total / dailyCounts[i]) : 2 // default neutral
        );

        res.json({ moodTrend });
    } catch (error) {
        console.error('getWeeklyMood error:', error);
        res.status(500).json({ message: 'Failed to fetch mood data.' });
    }
};

/**
 * Get journal entries for the authenticated user.
 */
const getJournals = async (req, res) => {
    try {
        const userId = req.user.id;

        const journals = await prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const formatted = journals.map(j => ({
            id: j.id,
            title: j.title,
            date: j.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            preview: (j.body || '').substring(0, 60) + ((j.body || '').length > 60 ? '...' : ''),
            full: j.body || '',
        }));

        res.json({ journals: formatted });
    } catch (error) {
        console.error('getJournals error:', error);
        res.status(500).json({ message: 'Failed to fetch journals.' });
    }
};

/**
 * Get the mood dashboard data (today's mood, weekly trend, recent journals).
 */
const getMoodDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get today's mood
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCheckIn = await prisma.moodCheckIn.findFirst({
            where: { userId, createdAt: { gte: today } },
            orderBy: { createdAt: 'desc' }
        });
        const todayMood = todayCheckIn ? todayCheckIn.moodScore : null;

        // 2. Get weekly trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const checkIns = await prisma.moodCheckIn.findMany({
            where: { userId, createdAt: { gte: sevenDaysAgo } },
            orderBy: { createdAt: 'asc' }
        });

        const dailyMoods = [0, 0, 0, 0, 0, 0, 0];
        const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
        const now = new Date();

        checkIns.forEach(c => {
            const daysAgo = Math.floor((now - c.createdAt) / (1000 * 60 * 60 * 24));
            const dayIndex = 6 - daysAgo;
            if (dayIndex >= 0 && dayIndex <= 6) {
                dailyMoods[dayIndex] += c.moodScore;
                dailyCounts[dayIndex]++;
            }
        });

        const weeklyTrend = dailyMoods.map((total, i) =>
            dailyCounts[i] > 0 ? Math.round(total / dailyCounts[i]) : 2
        );

        // 3. Get recent journals
        const journalsRaw = await prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        const journals = journalsRaw.map(j => ({
            id: j.id,
            title: j.title,
            date: j.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            preview: (j.body || '').substring(0, 60) + ((j.body || '').length > 60 ? '...' : ''),
            full: j.body || '',
        }));

        res.json({ todayMood, weeklyTrend, journals });
    } catch (error) {
        console.error('getMoodDashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch mood dashboard.' });
    }
};

/**
 * Delete a journal entry for the authenticated user.
 */
const deleteJournal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const journal = await prisma.journal.findUnique({ where: { id } });
        if (!journal || journal.userId !== userId) {
            return res.status(404).json({ message: 'Journal not found.' });
        }

        await prisma.journal.delete({ where: { id } });
        res.json({ message: 'Journal deleted successfully.' });
    } catch (error) {
        console.error('deleteJournal error:', error);
        res.status(500).json({ message: 'Failed to delete journal.' });
    }
};

module.exports = { saveMoodCheckIn, saveJournalEntry, getWeeklyMood, getJournals, getMoodDashboard, deleteJournal };
