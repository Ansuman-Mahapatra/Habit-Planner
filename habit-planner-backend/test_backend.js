
const assert = require('node:assert');
const { test } = require('node:test');

const BASE_URL = 'http://localhost:5000/api';

test('Backend Health Check', async (t) => {
    await t.test('GET / should return API status', async () => {
        const response = await fetch('http://localhost:5000/');
        const text = await response.text();
        assert.strictEqual(response.status, 200);
        assert.strictEqual(text, 'API is running...');
    });
});

test('Auth Flow', async (t) => {
    const randomEmail = `testuser_${Date.now()}@example.com`;
    const password = 'password123';
    let token;

    await t.test('POST /api/auth/register should create a user', async () => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: randomEmail,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.status !== 201) {
             console.error('Register failed:', data);
        }
        assert.strictEqual(response.status, 201, 'Registration failed');
        assert.ok(data.token, 'Token not returned on registration');
        token = data.token;
    });

    await t.test('POST /api/auth/login should login user', async () => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: randomEmail,
                password: password
            })
        });

        const data = await response.json();
        assert.strictEqual(response.status, 200, 'Login failed');
        assert.ok(data.token, 'Token not returned on login');
        token = data.token; // Update token just in case
    });

    await t.test('GET /api/auth/me should return user details', async () => {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();
        assert.strictEqual(response.status, 200, 'Get Me failed');
        assert.strictEqual(data.email, randomEmail);
    });
    
    // Note: No delete user endpoint, so user remains in DB.
});
