import request from 'supertest';
import express from 'express';
import v1Router from '../routes/v1';
import { client } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use("/api/v1", v1Router);

describe('User Routes', () => {
    let authToken;

    test('POST /signup should create new user', async () => {
        const res = await request(app)
            .post('/api/v1/user/signup')
            .send({ phoneNumber: '+1234567890' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    test('POST /signin should send OTP', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({ phoneNumber: '+1234567890' });
        expect(res.status).toBe(200);
    });
});

describe('Event Routes', () => {
    let eventId;
    let authToken;

    beforeAll(async () => {
        // Setup: Create a user and get auth token
        const signupRes = await request(app)
            .post('/api/v1/user/signup')
            .send({ phoneNumber: '+1234567890' });
        
        const signinRes = await request(app)
            .post('/api/v1/user/signin/verify')
            .send({ 
                phoneNumber: '+1234567890',
                totp: '123456' // This will work in non-production
            });
        authToken = signinRes.body.token;
    });

    test('POST /event should create new event', async () => {
        const res = await request(app)
            .post('/api/v1/event')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Event',
                description: 'Test Description',
                date: new Date().toISOString()
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Event');
        eventId = res.body.id;
    });

    test('GET /event should list all events', async () => {
        const res = await request(app)
            .get('/api/v1/event');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /event/:id should return specific event', async () => {
        const res = await request(app)
            .get(`/api/v1/event/${eventId}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Test Event');
    });

    test('PUT /event/:id should update event', async () => {
        const res = await request(app)
            .put(`/api/v1/event/${eventId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Updated Event',
                description: 'Updated Description',
                date: new Date().toISOString()
            });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Updated Event');
    });

    test('DELETE /event/:id should delete event', async () => {
        const res = await request(app)
            .delete(`/api/v1/event/${eventId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);

        // Verify event is deleted
        const getRes = await request(app)
            .get(`/api/v1/event/${eventId}`);
        expect(getRes.status).toBe(404);
    });
}); 