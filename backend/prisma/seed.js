const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Hash passwords
    const studentPassword = await bcrypt.hash('student123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Create a student user
    const student = await prisma.user.upsert({
        where: { email: 'student@vita.edu' },
        update: {},
        create: {
            email: 'student@vita.edu',
            passwordHash: studentPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'STUDENT',
        },
    });

    // Create an admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@vita.edu' },
        update: {},
        create: {
            email: 'admin@vita.edu',
            passwordHash: adminPassword,
            firstName: 'Campus',
            lastName: 'Admin',
            role: 'ADMIN',
        },
    });

    console.log({ student, admin });
    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
