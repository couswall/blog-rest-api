import request from 'supertest';
import { prisma } from "@/data/postgres";
import { JwtAdapter } from "@/config/jwt.adapter";
import { testServer } from "tests/test-server";
import { JWT_ADAPTER } from '@/config/constants';
import { CustomError } from '@/domain/errors/custom.error';
import { CATEGORY_RESPONSE } from '@/infrastructure/constants/category.constants';
import { CATEGORY_ERRORS } from '@/domain/constants/dto/category.constants';

jest.mock("@/config/jwt.adapter", () => ({
    JwtAdapter: {
        verifyJWT: jest.fn(),
    }
}));

describe('categories routes test', () => {  
    beforeAll(async () => {
        await testServer.start();
    });
    afterAll(() => {
        testServer.close();
    });
    beforeEach(async() => {
        await prisma.category.deleteMany();
        jest.clearAllMocks();
    });

    const verifyTokenUser = {id: 1, username: 'testing_user'};

    describe('/ Get all categories endpoint', () => {  
        test('should return all categories and a 200 status code', async () => {  
            await prisma.category.createMany({
                data: [
                    {name: 'Javascript'},
                    {name: 'SQL'},
                    {name: 'Vue js'},
                ],
            });
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);

            const {body} = await request(testServer.app)
                .get('/api/categories/')
                .set('token', 'mock-token')
                .expect(200);

            expect(body).toEqual({
                success: true,
                data: expect.any(Array)
            });
        });
        describe('Token validation', () => {  
            test('should throw a 401 if token is not sent', async () => {  
                const {body} = await request(testServer.app)
                    .get('/api/categories/')
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: 'No token sent'}
                });
            });
            test('should throw a 401 status code if token is invalid or has expired', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .get('/api/categories/')
                    .set('token', 'abc')
                    .expect(401);
                
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
    });
    describe('/ Create category endpoint', () => { 
        test('should return a 201 status code and a new category', async () => {  
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
            
            const {body} = await request(testServer.app)
                .post('/api/categories/')
                .set('token', 'any-token')
                .send({name: 'Javascript'})
                .expect(201);

            expect(body).toEqual({
                success: true,
                message: CATEGORY_RESPONSE.SUCCESS.CREATE,
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                }
            });
        });
        test('should throw a 400 status code if category name already exists', async () => {  
            const existingCategory = {name: 'Typescript'};
            await prisma.category.create({data: existingCategory});

            const {body} = await request(testServer.app)
                .post('/api/categories/')
                .set('token', 'any-token')
                .send(existingCategory)
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: CATEGORY_RESPONSE.ERRORS.CATEGORY_EXISTS}
            })
        });
        describe('Token validation', () => {  
            test('should throw a 401 if token is not sent', async () => {  
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .send({name: 'Javascript'})
                    .expect(401);
                
                expect(body).toEqual({
                    success: false,
                    error: {message: 'No token sent'}
                });
            });
            test('should throw a 401 status code if token is invalid or has expired', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: 'Javascript'})
                    .expect(401);
                
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
        describe('Category name validation', () => {  
            test('should throw a 400 error if body request is empty', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.REQUIRED}
                });
            });
            test('should throw a 400 error if category name is not a string', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: 12345})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.STRING}
                });
            });
            test('should throw a 400 error if category name contains only blank spaces', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: '          '})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.BLANK_SPACES}
                });
            });
            test('should throw a 400 error if category name length is less than 3 characters', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: 'fa'})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.MIN_LENGTH}
                });
            });
            test('should throw a 400 error if category name length is more than 30 characters', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id viverra metus, ac bibendum magna. Sed sollicitudin leo nec leo fringilla aliquet. Nulla semper porttitor tincidunt. Class aptent taciti sociosqu. 12'})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.MAX_LENGTH}
                });
            });
            test('should throw a 400 error if category name is an empty string', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyTokenUser);
                
                const {body} = await request(testServer.app)
                    .post('/api/categories/')
                    .set('token', 'any-token')
                    .send({name: ''})
                    .expect(400);
    
                expect(body).toEqual({
                    success: false,
                    error: {message: CATEGORY_ERRORS.REQUIRED}
                });
            });
        });
        
    });
});