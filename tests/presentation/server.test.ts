import request from 'supertest';
import { envs } from "@/config/envs";
import { AppRoutes } from "@/presentation/routes";
import { Server } from "@/presentation/server";
import { JwtAdapter } from '@/config/jwt.adapter';
import { CustomError } from '@/domain/errors/custom.error';

describe('Server tests', () => { 
    const options = {
        port: envs.PORT,
        publicPath: envs.PUBLIC_PATH,
        routes: AppRoutes.routes
    };
    const server = new Server(options);
    
    beforeAll(async() => {
        await server.start();    
    });

    afterAll(() => {
        server.close();
        jest.restoreAllMocks();
    });

    test('should create a Server instance', () => { 
        expect(server).toBeInstanceOf(Server);
        expect(typeof server.start).toBe('function');
        expect(typeof server.close).toBe('function');
    });

    test('should respond to a protected route with a mocked valid token', async () => { 
        jest.spyOn(JwtAdapter, "verifyJWT").mockResolvedValue({
            id: 1,
            username: "testUser",
          });
        
        const response = await request(server.app)
            .get('/api/blogs')
            .set('token', 'mocked_token')

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    test('should return 401 for missing token', async () => { 
        const response = await request(server.app)
            .get('/api/blogs')

        expect(response.status).toBe(401);
        expect(response.body.error.message).toBe('No token sent');
    });

    test('should return 401 for an invalid token token', async () => { 
        jest.spyOn(JwtAdapter, 'verifyJWT').mockRejectedValue(new CustomError('Invalid or expired token', 401))
        
        const response = await request(server.app)
            .get('/api/blogs')
            .set('token', 'mocked_token')

        expect(response.status).toBe(401);
        expect(response.body.error.message).toBe('Invalid or expired token');
    });

    test('should shut down the server properly', () => { 
        expect(() => server.close()).not.toThrow();
    });

});