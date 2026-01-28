import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';

describe('Auth Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'ADMIN',
    };

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: { email: testUser.email },
        });
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('email', testUser.email);
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body).toHaveProperty('token');
    });
});
