const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectMongo = require('../config/mongo');
const MoodCheckIn = require('../models/MoodCheckIn');
const Journal = require('../models/Journal');

require('dotenv').config();

const prisma = new PrismaClient();

// ──────────────────────────────────────────────
// CONFIGURATION
// ──────────────────────────────────────────────
const TOTAL_STUDENTS = 1500;
const BATCH_SIZE = 100; // insert students in batches to avoid memory issues

const HOSTELS = ['Govind', 'Sarojini', 'Rajendra', 'Kasturba', 'Cautley', 'Jawahar'];
const YEARS = [1, 2, 3, 4];
const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'CH', 'BT', 'AR', 'MT', 'PE'];
const ACTIVITY_TYPES = ['RUNNING', 'GYM', 'SWIMMING', 'CYCLING', 'YOGA', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'WALKING', 'HIKING'];
const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const MOODS = [0, 1, 2, 3, 4]; // 0=Awful, 1=Bad, 2=Okay, 3=Good, 4=Great
const MOOD_NOTES = [
    'Feeling energetic today!', 'Had a good workout', 'Stressed about exams',
    'Great sleep last night', 'Feeling tired', 'Amazing day overall',
    'Need more rest', 'Productive morning', 'Relaxed evening', 'Ate healthy today',
    'Skipped breakfast, feeling low', 'Gym session was intense', ''
];
const JOURNAL_TITLES = [
    'Morning Thoughts', 'Workout Log', 'Meal Plan Review', 'Weekly Goals',
    'Daily Reflection', 'Fitness Progress', 'Health Check', 'Stress Management',
    'Sleep Quality Notes', 'Study-Life Balance', 'Weekend Plans', 'Gratitude Log'
];
const JOURNAL_BODIES = [
    'Today I focused on improving my cardio endurance. Ran 5km in 28 minutes.',
    'Had a balanced meal with dal, roti, and salad. Feeling satisfied.',
    'Need to improve my sleep schedule. Going to bed earlier tonight.',
    'Completed my gym session. Did 3 sets of squats, bench press, and deadlifts.',
    'Feeling grateful for the support from friends. Positive vibes today.',
    'Studied for 4 hours and took breaks to stretch. Feeling productive.',
    'Tried a new yoga routine. It was challenging but refreshing.',
    'Meal prep Sunday! Prepared meals for the week ahead.',
    'Mental health day. Took a walk in the campus garden.',
    'Set new fitness goals for the month: lose 2kg, run 10km.',
];
const FOOD_ITEMS = [
    { name: 'Aloo Paratha', category: 'Vegetarian', meal: 'Breakfast', portion: '2 pieces', calories: 320, protein: 8, carbs: 45, fats: 14 },
    { name: 'Poha', category: 'Vegetarian', meal: 'Breakfast', portion: '1 plate', calories: 250, protein: 5, carbs: 40, fats: 8 },
    { name: 'Idli Sambar', category: 'Vegetarian', meal: 'Breakfast', portion: '4 idlis', calories: 280, protein: 7, carbs: 50, fats: 5 },
    { name: 'Bread Omelette', category: 'Non-Vegetarian', meal: 'Breakfast', portion: '2 slices', calories: 350, protein: 18, carbs: 30, fats: 16 },
    { name: 'Dal Rice', category: 'Vegetarian', meal: 'Lunch', portion: '1 plate', calories: 420, protein: 14, carbs: 65, fats: 10 },
    { name: 'Rajma Chawal', category: 'Vegetarian', meal: 'Lunch', portion: '1 plate', calories: 480, protein: 16, carbs: 72, fats: 12 },
    { name: 'Chicken Curry Rice', category: 'Non-Vegetarian', meal: 'Lunch', portion: '1 plate', calories: 550, protein: 30, carbs: 60, fats: 18 },
    { name: 'Chole Bhature', category: 'Vegetarian', meal: 'Lunch', portion: '2 bhature', calories: 520, protein: 12, carbs: 68, fats: 22 },
    { name: 'Paneer Butter Masala', category: 'Vegetarian', meal: 'Dinner', portion: '1 bowl + 2 roti', calories: 480, protein: 18, carbs: 45, fats: 24 },
    { name: 'Egg Fried Rice', category: 'Non-Vegetarian', meal: 'Dinner', portion: '1 plate', calories: 400, protein: 15, carbs: 55, fats: 14 },
    { name: 'Roti Sabzi', category: 'Vegetarian', meal: 'Dinner', portion: '3 roti + sabzi', calories: 380, protein: 10, carbs: 55, fats: 12 },
    { name: 'Fish Curry Rice', category: 'Non-Vegetarian', meal: 'Dinner', portion: '1 plate', calories: 450, protein: 28, carbs: 50, fats: 14 },
    { name: 'Samosa', category: 'Vegetarian', meal: 'Snack', portion: '2 pieces', calories: 300, protein: 5, carbs: 35, fats: 16 },
    { name: 'Banana Shake', category: 'Beverage', meal: 'Snack', portion: '300ml', calories: 220, protein: 6, carbs: 40, fats: 4 },
    { name: 'Vada Pav', category: 'Vegetarian', meal: 'Snack', portion: '1 piece', calories: 290, protein: 5, carbs: 38, fats: 14 },
    { name: 'Masala Chai', category: 'Beverage', meal: 'Snack', portion: '200ml', calories: 80, protein: 2, carbs: 12, fats: 3 },
];
const ENV_ZONES = ['Library', 'Hostel Area', 'Academic Block', 'Sports Complex', 'Cafeteria', 'Main Gate', 'Garden', 'Lab Block'];

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(1);

function randomDate(daysBack) {
    const d = new Date();
    d.setDate(d.getDate() - rand(0, daysBack));
    d.setHours(rand(6, 22), rand(0, 59), 0, 0);
    return d;
}

const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Isha', 'Mahi', 'Meera', 'Priya', 'Riya', 'Neha',
    'Rohan', 'Karan', 'Amit', 'Rahul', 'Suresh', 'Vikram', 'Nikhil', 'Yash', 'Harsh', 'Dev',
    'Pooja', 'Sneha', 'Kavya', 'Tanvi', 'Nisha', 'Swati', 'Anjali', 'Simran', 'Divya', 'Kriti',
    'Manish', 'Akash', 'Deepak', 'Gaurav', 'Sachin', 'Mohit', 'Tushar', 'Pankaj', 'Rajesh', 'Sanjay',
    'Shruti', 'Ankita', 'Parul', 'Sonam', 'Jyoti', 'Preeti', 'Megha', 'Bhavna', 'Komal', 'Tanu'
];
const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Joshi', 'Mishra', 'Das', 'Reddy',
    'Nair', 'Pillai', 'Yadav', 'Chauhan', 'Jain', 'Agarwal', 'Mehta', 'Shah', 'Thakur', 'Pandey',
    'Rathore', 'Tiwari', 'Saxena', 'Bhat', 'Malik', 'Kaur', 'Iyer', 'Menon', 'Rao', 'Choudhary'
];

// ──────────────────────────────────────────────
// MAIN SEED FUNCTION
// ──────────────────────────────────────────────
async function main() {
    console.log('🌱 Starting FitFusion comprehensive seed...\n');
    const startTime = Date.now();

    // Connect MongoDB
    await connectMongo();

    // ── Step 0: Clear existing data ──
    console.log('🗑️  Clearing existing data...');
    await prisma.nutritionLog.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.foodItem.deleteMany();
    await prisma.environmentZone.deleteMany();
    await prisma.user.deleteMany();
    await MoodCheckIn.deleteMany({});
    await Journal.deleteMany({});
    console.log('   ✅ Old data cleared.\n');

    // ── Step 1: Create Admin ──
    console.log('👤 Creating admin...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@vita.edu',
            passwordHash: adminPassword,
            firstName: 'Campus',
            lastName: 'Admin',
            role: 'ADMIN',
        }
    });
    console.log(`   ✅ Admin created: ${admin.email}\n`);

    // ── Step 2: Create 1500 Students in batches ──
    console.log(`👥 Creating ${TOTAL_STUDENTS} students...`);
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentIds = [];

    for (let batch = 0; batch < Math.ceil(TOTAL_STUDENTS / BATCH_SIZE); batch++) {
        const batchStart = batch * BATCH_SIZE;
        const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_STUDENTS);
        const batchData = [];

        for (let i = batchStart; i < batchEnd; i++) {
            const year = YEARS[i % 4];
            const branch = pick(BRANCHES);
            const fn = pick(firstNames);
            const ln = pick(lastNames);
            batchData.push({
                email: `student${i + 1}@vita.edu`,
                passwordHash: studentPassword,
                firstName: fn,
                lastName: ln,
                role: 'STUDENT',
            });
        }

        await prisma.user.createMany({ data: batchData });
        process.stdout.write(`   📦 Batch ${batch + 1}/${Math.ceil(TOTAL_STUDENTS / BATCH_SIZE)} (${batchEnd}/${TOTAL_STUDENTS})\r`);
    }

    // Fetch all student IDs
    const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: { id: true }
    });
    allStudents.forEach(s => studentIds.push(s.id));
    console.log(`\n   ✅ ${studentIds.length} students created.\n`);

    // ── Step 3: Generate Nutrition Logs (last 90 days) ──
    console.log('🥗 Generating nutrition logs (last 90 days)...');
    let nutritionLogs = [];
    for (const uid of studentIds) {
        // Each student logs 1-3 meals per day, for a random subset of the last 90 days
        const daysLogged = rand(30, 90);
        for (let d = 0; d < daysLogged; d++) {
            const mealsToday = rand(1, 3);
            for (let m = 0; m < mealsToday; m++) {
                nutritionLogs.push({
                    userId: uid,
                    mealType: pick(MEAL_TYPES),
                    foodGrams: rand(100, 500),
                    calories: randFloat(150, 700),
                    loggedAt: randomDate(90),
                });
            }
            // Flush in batches to avoid memory issues
            if (nutritionLogs.length >= 5000) {
                await prisma.nutritionLog.createMany({ data: nutritionLogs });
                nutritionLogs = [];
            }
        }
    }
    if (nutritionLogs.length > 0) {
        await prisma.nutritionLog.createMany({ data: nutritionLogs });
    }
    const totalNutrition = await prisma.nutritionLog.count();
    console.log(`   ✅ ${totalNutrition.toLocaleString()} nutrition logs created.\n`);

    // ── Step 4: Generate Activity Logs (last 90 days) ──
    console.log('🏃 Generating activity logs (last 90 days)...');
    let activityLogs = [];
    for (const uid of studentIds) {
        const daysActive = rand(15, 60);
        for (let d = 0; d < daysActive; d++) {
            activityLogs.push({
                userId: uid,
                activityType: pick(ACTIVITY_TYPES),
                durationMins: rand(15, 120),
                caloriesBurned: randFloat(50, 600),
                loggedAt: randomDate(90),
            });
            if (activityLogs.length >= 5000) {
                await prisma.activityLog.createMany({ data: activityLogs });
                activityLogs = [];
            }
        }
    }
    if (activityLogs.length > 0) {
        await prisma.activityLog.createMany({ data: activityLogs });
    }
    const totalActivity = await prisma.activityLog.count();
    console.log(`   ✅ ${totalActivity.toLocaleString()} activity logs created.\n`);

    // ── Step 5: Seed Food Items ──
    console.log('🍽️  Seeding food items...');
    await prisma.foodItem.createMany({ data: FOOD_ITEMS });
    console.log(`   ✅ ${FOOD_ITEMS.length} food items created.\n`);

    // ── Step 6: Seed Environment Zones ──
    console.log('🌍 Seeding environment zone readings (last 30 days)...');
    const envData = [];
    for (let d = 0; d < 30; d++) {
        for (const zone of ENV_ZONES) {
            const dt = new Date();
            dt.setDate(dt.getDate() - d);
            dt.setHours(rand(6, 20), 0, 0, 0);
            envData.push({
                zone,
                aqi: rand(30, 200),
                noiseDb: rand(30, 85),
                temperature: randFloat(18, 40),
                humidity: randFloat(30, 90),
                createdAt: dt
            });
        }
    }
    await prisma.environmentZone.createMany({ data: envData });
    console.log(`   ✅ ${envData.length} environment readings created.\n`);

    // ── Step 7: Seed MongoDB – Mood Check-ins ──
    console.log('😊 Generating mood check-ins (MongoDB, last 60 days)...');
    let moodDocs = [];
    for (const uid of studentIds) {
        const daysChecked = rand(10, 40);
        for (let d = 0; d < daysChecked; d++) {
            moodDocs.push({
                userId: uid,
                moodScore: pick(MOODS),
                note: pick(MOOD_NOTES),
                createdAt: randomDate(60),
            });
            if (moodDocs.length >= 5000) {
                await MoodCheckIn.insertMany(moodDocs);
                moodDocs = [];
            }
        }
    }
    if (moodDocs.length > 0) await MoodCheckIn.insertMany(moodDocs);
    const totalMoods = await MoodCheckIn.countDocuments();
    console.log(`   ✅ ${totalMoods.toLocaleString()} mood check-ins created.\n`);

    // ── Step 8: Seed MongoDB – Journals ──
    console.log('📝 Generating journal entries (MongoDB, last 90 days)...');
    let journalDocs = [];
    for (const uid of studentIds) {
        const entries = rand(2, 10);
        for (let j = 0; j < entries; j++) {
            journalDocs.push({
                userId: uid,
                title: pick(JOURNAL_TITLES),
                body: pick(JOURNAL_BODIES),
                createdAt: randomDate(90),
            });
            if (journalDocs.length >= 5000) {
                await Journal.insertMany(journalDocs);
                journalDocs = [];
            }
        }
    }
    if (journalDocs.length > 0) await Journal.insertMany(journalDocs);
    const totalJournals = await Journal.countDocuments();
    console.log(`   ✅ ${totalJournals.toLocaleString()} journal entries created.\n`);

    // ── Done ──
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('═══════════════════════════════════════════');
    console.log(`🎉 Seed complete in ${elapsed}s!`);
    console.log(`   Students:      ${studentIds.length}`);
    console.log(`   Nutrition:     ${totalNutrition.toLocaleString()}`);
    console.log(`   Activities:    ${totalActivity.toLocaleString()}`);
    console.log(`   Food Items:    ${FOOD_ITEMS.length}`);
    console.log(`   Env Readings:  ${envData.length}`);
    console.log(`   Mood Checks:   ${totalMoods.toLocaleString()}`);
    console.log(`   Journals:      ${totalJournals.toLocaleString()}`);
    console.log('═══════════════════════════════════════════');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await mongoose.disconnect();
    });
