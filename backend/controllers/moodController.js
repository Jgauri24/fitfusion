const MoodCheckIn = require('../models/MoodCheckIn');
const Journal = require('../models/Journal');

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

        const checkIn = await MoodCheckIn.create({
            userId,
            moodScore: parseInt(moodScore),
            note: note || '',
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

        const journal = await Journal.create({
            userId,
            title,
            body: body || '',
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

        const checkIns = await MoodCheckIn.find({
            userId,
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: 1 });

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

        const journals = await Journal.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        const formatted = journals.map(j => ({
            id: j._id,
            title: j.title,
            date: j.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            preview: j.body.substring(0, 60) + (j.body.length > 60 ? '...' : ''),
            full: j.body,
        }));

        res.json({ journals: formatted });
    } catch (error) {
        console.error('getJournals error:', error);
        res.status(500).json({ message: 'Failed to fetch journals.' });
    }
};

module.exports = { saveMoodCheckIn, saveJournalEntry, getWeeklyMood, getJournals };
