import request from 'supertest';
import express from 'express';
import eventRouter from '../event';

const app = express();
app.use(express.json());
app.use('/api/v1/events', eventRouter);

describe('Event Routes', () => {
    it('should get all events', async () => {
        const res = await request(app).get('/api/v1/events');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('events');
    });

    it('should get single event', async () => {
        const res = await request(app).get('/api/v1/events/123');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should create new event', async () => {
        const eventData = {
            name: 'Test Event',
            description: 'Test Description',
            date: '2024-03-20'
        };
        const res = await request(app)
            .post('/api/v1/events')
            .send(eventData);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should update event', async () => {
        const eventData = {
            name: 'Updated Event',
            description: 'Updated Description',
            date: '2024-03-21'
        };
        const res = await request(app)
            .put('/api/v1/events/123')
            .send(eventData);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Event');
    });

    it('should delete event', async () => {
        const res = await request(app).delete('/api/v1/events/123');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Event deleted successfully');
    });
}); 