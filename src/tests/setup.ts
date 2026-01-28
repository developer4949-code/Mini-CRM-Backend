import prisma from '../config/prisma';

beforeAll(async () => {
    // Any global setup if needed
});

afterAll(async () => {
    await prisma.$disconnect();
});
