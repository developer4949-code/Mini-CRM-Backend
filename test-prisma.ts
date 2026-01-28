import prisma from './src/config/prisma';

async function main() {
    try {
        console.log('Testing Prisma connection...');
        const user = await prisma.user.findUnique({
            where: { email: 'nonexistent@example.com' },
        });
        console.log('Query result:', user);
        process.exit(0);
    } catch (error) {
        console.error('Prisma test failed:', error);
        process.exit(1);
    }
}

main();
