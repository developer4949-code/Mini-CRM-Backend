
const BASE_URL = 'http://localhost:3000';

async function test() {
    console.log('--- STARTING COMPREHENSIVE SMOKE TEST ---');

    // Helper for requests
    const req = async (path: string, method: string, body?: any, token?: string) => {
        console.log(`[${method}] ${path}...`);
        const res = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error(`FAILED: ${res.status} ${res.statusText} - ${errText}`);
            return null;
        }

        const data = await res.json();
        console.log(`SUCCESS: ${res.status}`);
        return data;
    };

    // 1. Register Admin
    await req('/auth/register', 'POST', {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN',
    });

    // 2. Login Admin
    const adminLogin = await req('/auth/login', 'POST', {
        email: 'admin@example.com',
        password: 'password123',
    });
    const adminToken = adminLogin.data.accessToken;

    // 3. Register Employee
    await req('/auth/register', 'POST', {
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'password123',
        role: 'EMPLOYEE',
    });

    // 4. Login Employee
    const empLogin = await req('/auth/login', 'POST', {
        email: 'employee@example.com',
        password: 'password123',
    });
    const empToken = empLogin.data.accessToken;
    const empId = empLogin.data.user.id;

    // 5. Admin - Get All Users
    await req('/users', 'GET', null, adminToken);

    // 6. Admin - Create Customer
    const customer = await req('/customers', 'POST', {
        name: 'Demo Customer',
        email: 'customer@demo.com',
        phone: '1234567890',
        company: 'Demo Corp',
    }, adminToken);
    const customerId = customer.data.id;

    // 7. Admin - Create Task for Employee
    const task = await req('/tasks', 'POST', {
        title: 'Complete Onboarding',
        description: 'Finish all HR paperwork',
        assignedTo: empId,
        customerId: customerId,
    }, adminToken);
    const taskId = task.data.id;

    // 8. Employee - Get Assigned Tasks
    await req('/tasks', 'GET', null, empToken);

    // 9. Employee - Update Task Status
    await req(`/tasks/${taskId}/status`, 'PATCH', {
        status: 'IN_PROGRESS',
    }, empToken);

    // 10. Role Check - Employee trying to create customer (Should fail 403)
    console.log('[EXPECTED FAILURE] Employee creating customer...');
    const failRes = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({ name: 'Fail' })
    });
    console.log(`Status: ${failRes.status} (Expected 403)`);

    console.log('--- SMOKE TEST COMPLETE ---');
}

test().catch(err => {
    console.error('CRITICAL TEST ERROR:', err);
    process.exit(1);
});
