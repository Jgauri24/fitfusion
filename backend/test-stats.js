require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Testing Stats...");
        
        const totalUsers = await prisma.user.count({ where: { role: 'STUDENT' } });
        console.log("totalUsers:", totalUsers);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeMeals = await prisma.mealLog.findMany({
            where: { createdAt: { gte: today } },
            select: { userId: true }
        });
        console.log("activeMeals length:", activeMeals.length);
        
        const activeActivities = await prisma.activityLog.findMany({
            where: { createdAt: { gte: today } },
            select: { userId: true }
        });
        console.log("activeActivities length:", activeActivities.length);
        
        const todaysMeals = await prisma.mealLog.findMany({
            where: { createdAt: { gte: today } }
        });
        console.log("todaysMeals length:", todaysMeals.length);
        
        const totalActivities = await prisma.activityLog.count();
        console.log("totalActivities:", totalActivities);
        
        console.log("All prisma queries successful!");
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
test();
