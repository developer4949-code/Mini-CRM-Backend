import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';

describe('Customer Endpoints', () => {
    let token: string;
    const testCustomer = {
        name: 'John Doe',
        email: `john${Date.now()}@example.com`,
        phone: `123456${Date.now()}`,
        company: 'ACME Corp',
    };

    beforeAll(async () => {
        // Create an admin user and get token
        const adminEmail = `admin${Date.now()}@example.com`;
        await request(app)
            .post('/auth/register')
            .send({
                name: 'Admin User',
                email: adminEmail,
                password: 'password123',
                role: 'ADMIN',
            });

        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: adminEmail,
                password: 'password123',
            });

        token = loginRes.body.token;
    });

    afterAll(async () => {
        await prisma.customer.deleteMany({
            where: { email: testCustomer.email },
        });
        await prisma.user.deleteMany({
            where: { email: { contains: 'admin' } },
        });
    });

    it('should create a new customer', async () => {
        const res = await request(app)
            .post('/customers')
            .set('Authorization', `Bearer ${token}`)
            .send(testCustomer);

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('email', testCustomer.email);
    });

    it('should get customers with search', async () => {
        const res = await request(app)
            .get('/customers?search=John')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0].name).toContain('John');
    });

    it('should return empty list for non-matching search', async () => {
        const res = await request(app)
            .get('/customers?search=NonExistentName')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(0);
    });
});
