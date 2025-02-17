import request from 'supertest';
import { prisma } from '@/data/postgres';
import { ERROR_VALIDATION_MSG } from '@/domain/constants/dto/blog.constants';
import { testServer } from 'tests/test-server';
import { ERROR_MESSAGES, FIELDS } from '@/domain/constants/dto/user.constants';
import { BcryptAdapter } from '@/config/bcrypt.adapter';

const testUser = {username: 'TestingUser', email: 'test@google.com'};
const testUserCredentials = {...testUser, password: 'Testing89#!'};

describe('users routes testing', () => { 
    beforeAll(async() => {await testServer.start();});
    afterAll(() => {testServer.close();});
    beforeEach(async() => {await prisma.user.deleteMany();});
    
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
                        { field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT }
                    ])
                );
            });
            
        });

        describe('Email validation', () => { 
            test('should return a 400 error if email is not a string', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, email: true})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.STRING }
                    ])
                );
            });

            test('should return a 400 error if email format is invalid', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, email: 'ads@1313'})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.INVALID_FORMAT }
                    ])
                );
            });
        });

        describe('Password validation', () => { 
            test('should return a 400 error if password is not a string', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: []})
                    .expect(400)
                
                expect(body).toEqual({
                    success: false,
                    error: {message: ERROR_VALIDATION_MSG, errors: expect.any(Array)}
                })
            });
            test('should return a 400 error if password length is less than 6 characters', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: 'ab'})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.MIN_LENGTH}
                    ])
                );
            });
            test('should return a 400 error if password does not contain an uppercase letter', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: 'testing#123!'})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.UPPERCASE}
                    ])
                );
            });
            test('should return a 400 error if password does not contain a lowercase letter', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: 'TESTING#123!'})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.LOWERCASE}
                    ])
                );
            });
            test('should return a 400 error if password does not contain a number', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: 'Testing#!'})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.NUMBER}
                    ])
                );
            });
            test('should return a 400 error if password does not contain a special character', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, password: 'Testing12345'})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.SPECIAL_CHAR}
                    ])
                );
            });
        });

    });
    describe('/login Endpoint', () => { 
        test('should login and return user data and token', async () => { 
            await prisma.user.create({data: {
                ...testUserCredentials,
                password: BcryptAdapter.hash(testUserCredentials.password)
            }});
            const {body} = await request(testServer.app)
                .post('/api/users/login')
                .send({username: testUserCredentials.username, password: testUserCredentials.password})
                .expect(200)

            expect(body).toEqual({
                success: true,
                message: 'Login successful',
                data: {
                    user: {id: expect.any(Number), ...testUser},
                    token: expect.any(String)
                }
            })
        });
        test('should return a 404 error if user does not exist', async () => { 
            await prisma.user.create({data: {
                ...testUserCredentials,
                password: BcryptAdapter.hash(testUserCredentials.password)
            }});
            const {body} = await request(testServer.app)
                .post('/api/users/login')
                .send({username: 'sdadfafaf', password: testUserCredentials.password})
                .expect(404)

            expect(body).toEqual({
                success: false,
                error: {message: 'Invalid credentials'}
            })
        });
        test('should return a 400 error if an empty object is sent', async () => { 
            const {body} = await request(testServer.app)
                .post('/api/users/login')
                .send({})
                .expect(400)

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe('Validation errors in request');
            expect(body.error.errors).toEqual([
                {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED},
                {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED}
            ]);
        });
        describe('Username validation', () => { 
            test('should return a 400 error if username type is not a string', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/login')
                    .send({username: [], password: testUserCredentials.password})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Validation errors in request');
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING},
                    ])
                );
            });
            test('should return a 400 error if username is not sent', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/login')
                    .send({password: testUserCredentials.password})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Validation errors in request');
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED},
                    ])
                );
            });
            test('should return a 400 error if username contains only blank spaces', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/login')
                    .send({username: '            ', password: testUserCredentials.password})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Validation errors in request');
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.BLANK_SPACES},
                    ])
                );
            });
        });
        describe('Password validation', () => { 
            test('should return a 400 error if password type is not a string', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/login')
                    .send({username: testUserCredentials.username, password: []})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Validation errors in request');
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.STRING},
                    ])
                );
            });
            test('should return a 400 error if password is not sent', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/login')
                    .send({username: testUserCredentials.username})
                    .expect(400)

                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Validation errors in request');
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED},
                    ])
                );
            });
        });

    });
    // describe('/updateUsername/:id Endpoint', () => {  })
    // describe('/updatePassword/:id', () => {  })
    // describe('/deleteUser/:id', () => {  })
});