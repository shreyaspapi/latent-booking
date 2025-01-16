import request from 'supertest';
import express from 'express';
import userRouter from '../user';

const app = express();
app.use(express.json());
app.use('/api/v1/user', userRouter);

describe('User Routes', () => {
    it('should start signup process', async () => {
        const res = await request(app)
            .post('/api/v1/user/signup')
            .send({ phoneNumber: '1234567890' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should handle signin request', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({ phoneNumber: '1234567890' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('OTP sent successfully');
    });

    it('should get user profile', async () => {
        const res = await request(app).get('/api/v1/user/profile');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('phoneNumber');
    });
}); 