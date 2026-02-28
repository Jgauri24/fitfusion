/**
 * Auto-Updater: Simulates realistic daily data generation.
 * Runs on an interval (default: every 30 minutes) and creates new
 * nutrition logs, activity logs, mood check-ins, and environment readings
 * for a random subset of students to keep the dashboard alive.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ACTIVITY_TYPES = ['RUNNING', 'GYM', 'SWIMMING', 'CYCLING', 'YOGA', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'WALKING', 'HIKING'];
const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const ENV_ZONES = ['Library', 'Hostel Area', 'Academic Block', 'Sports Complex', 'Cafeteria', 'Main Gate', 'Garden', 'Lab Block'];
const MOOD_NOTES = [
    'Feeling great!', 'Solid workout today', 'Need more sleep',
    'Productive day', 'Feeling stressed', 'Good food today', ''
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(1);

async function autoUpdate() {
    try {
        const now = new Date();
        console.log(`[AutoUpdate] Running at ${now.toLocaleTimeString()}...`);

        // Get a random subset of students (10-20% of users)
        const allStudents = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: { id: true },
        });

        if (allStudents.length === 0) {
            console.log('[AutoUpdate] No students found. Skipping.');
            return;
        }

        const sampleSize = rand(
            Math.floor(allStudents.length * 0.05),
            Math.floor(allStudents.length * 0.15)
        );

        // Shuffle and pick a subset
        const shuffled = allStudents.sort(() => 0.5 - Math.random());
        const selectedStudents = shuffled.slice(0, sampleSize);

        // ── Nutrition Logs ──
        const nutritionLogs = [];
        for (const s of selectedStudents) {
            const meals = rand(1, 3);
            for (let m = 0; m < meals; m++) {
                const logTime = new Date();
                logTime.setMinutes(logTime.getMinutes() - rand(0, 60));
                nutritionLogs.push({
                    userId: s.id,
                    mealType: pick(MEAL_TYPES),
                    foodGrams: rand(100, 500),
                    calories: randFloat(150, 700),
                    loggedAt: logTime,
                });
            }
        }
        if (nutritionLogs.length > 0) {
            await prisma.nutritionLog.createMany({ data: nutritionLogs });
        }

        // ── Activity Logs ──
        const activityLogs = [];
        const activeSubset = selectedStudents.slice(0, Math.floor(selectedStudents.length * 0.6));
        for (const s of activeSubset) {
            const logTime = new Date();
            logTime.setMinutes(logTime.getMinutes() - rand(0, 120));
            activityLogs.push({
                userId: s.id,
                activityType: pick(ACTIVITY_TYPES),
                durationMins: rand(15, 90),
                caloriesBurned: randFloat(50, 500),
                loggedAt: logTime,
            });
        }
        if (activityLogs.length > 0) {
            await prisma.activityLog.createMany({ data: activityLogs });
        }

        // ── Mood Check-ins (Prisma) ──
        const moodDocs = [];
        const moodSubset = selectedStudents.slice(0, Math.floor(selectedStudents.length * 0.3));
        for (const s of moodSubset) {
            moodDocs.push({
                userId: s.id,
                moodScore: rand(0, 4),
                note: pick(MOOD_NOTES),
                createdAt: new Date(),
            });
        }
        if (moodDocs.length > 0) {
            await prisma.moodCheckIn.createMany({ data: moodDocs });
        }

        // ── Environment Zone Readings ──
        const envData = [];
        for (const zone of ENV_ZONES) {
            envData.push({
                zone,
                aqi: rand(30, 200),
                noiseDb: rand(30, 85),
                temperature: randFloat(18, 40),
                humidity: randFloat(30, 90),
            });
        }
        await prisma.environmentZone.createMany({ data: envData });

        console.log(`[AutoUpdate] ✅ Done — ${nutritionLogs.length} meals, ${activityLogs.length} activities, ${moodDocs.length} moods, ${envData.length} env readings`);
    } catch (error) {
        console.error('[AutoUpdate] ❌ Error:', error.message);
    }
}

/**
 * Start the auto-updater. Call this from server.js.
 * @param {number} intervalMinutes — how often to run (default 30 min)
 */
function startAutoUpdater(intervalMinutes = 30) {
    console.log(`\n🔄 Auto-Updater started — will generate new data every ${intervalMinutes} minutes.\n`);

    // Run once immediately on startup
    autoUpdate();

    // Then repeat on interval
    setInterval(autoUpdate, intervalMinutes * 60 * 1000);
}

module.exports = { startAutoUpdater };
