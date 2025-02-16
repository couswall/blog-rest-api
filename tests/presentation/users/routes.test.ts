import request from 'supertest';
import { prisma } from '@/data/postgres';
import { ERROR_VALIDATION_MSG } from '@/domain/constants/dto/blog.constants';
import { testServer } from 'tests/test-server';
import { ERROR_MESSAGES } from '@/domain/constants/dto/user.constants';

const testUser = {username: 'TestingUser', email: 'test@google.com'};
const testUserCredentials = {...testUser, password: 'Testing89#!'};

describe('users routes testing', () => { 

    beforeAll(async() => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });
    
    beforeEach(async() => {
        await prisma.user.deleteMany();
    });
    
    describe('/signup endpoint', () => { 
        test('/signup endpoint should return a new user', async () => { 
            const {body} = await request(testServer.app)
                .post('/api/users/signup')
                .send(testUserCredentials)
                .expect(201)
            
            expect(body).toEqual({
                success: true,
                message: expect.any(String),
                data: {
                    user: {
                        id: expect.any(Number),
                        ...testUser,
                    },
                    token: expect.any(String)
                }
            });
        });
    
        test('/signup endpoint should return a 400 error if any property is sent', async () => { 
            const {body} = await request(testServer.app)
                .post('/api/users/signup')
                .send({})
                .expect(400)
            
            expect(body).toEqual({
                success: false,
                error: {
                    message: ERROR_VALIDATION_MSG,
                    errors: expect.any(Array)
                },
            });
        });
    
        test('/signup endpoint should return a 404 error if username already exists', async () => { 
            await prisma.user.create({data: testUserCredentials});
            
            const {body} = await request(testServer.app)
                .post('/api/users/signup')
                .send(testUserCredentials)
                .expect(404)
    
            expect(body).toEqual({
                success: false,
                error: {
                    message: 'Username already exists.'
                }
            });
        });
    
        test('/signup endpoint should return a 404 error if email already exists', async () => { 
            await prisma.user.create({data: {
                username: 'test_user', 
                email: testUserCredentials.email, 
                password: testUserCredentials.password}
            });
            
            const {body} = await request(testServer.app)
                .post('/api/users/signup')
                .send(testUserCredentials)
                .expect(404)
    
            expect(body).toEqual({
                success: false,
                error: {
                    message: 'Email already exists.',
                }
            });
        });

        describe('Username Validation', () => { 
            
            test('/signup endpoint should return a 400 error if username is not a string', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: true})
                    .expect(400)
        
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: 'username', message: ERROR_MESSAGES.USERNAME.STRING }
                    ])
                );
            });

            test('/signup endpoint should return a 400 error if username contains only spaces', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: '    '})
                    .expect(400)
        
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: 'username', message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT }
                    ])
                );
            });
            
            test('/signup endpoint should return a 400 error if username contains more than 15 characters', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: 'Usernamewithmorethan15charactesALongUSername'})
                    .expect(400)
        
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: 'username', message: ERROR_MESSAGES.USERNAME.MAX_LENGTH }
                    ])
                );
            });

            test('/signup endpoint should return a 400 error if username contains spaces inside', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: 'username with space'})
                    .expect(400)
        
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: 'username', message: ERROR_MESSAGES.USERNAME.SPACES }
                    ])
                );
            });
        
            test('/signup endpoint should return a 400 error if username format is invalid', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: 'username>>>@/8,¨*'})
                    .expect(400)
        
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: 'username', message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT }
                    ])
                );
            });
            
        });

    })




    

    


});