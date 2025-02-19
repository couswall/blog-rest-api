import { AppRoutes } from '@/presentation/routes';
import request from 'supertest';
import { testServer } from "tests/test-server";

describe('presentation routes', () => { 
    beforeAll(async() => {
        await testServer.start();
    });
    afterAll(() => {
        testServer.close();
    });

    test('should return 404 if no handler is defined for GET /api/users', async () => { 
        const response = await request(testServer.app).get('/api/users');
        expect(response.statusCode).toBe(404);
    });
    test('should include /api/blogs', async () => { 
        const response = await request(testServer.app).get('/api/blogs');
        expect(response.statusCode).not.toBe(404);
    });
});