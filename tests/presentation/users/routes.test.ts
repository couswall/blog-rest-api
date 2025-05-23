import request from 'supertest';
import { prisma } from '@/data/postgres';
import { ERROR_VALIDATION_MSG } from '@/domain/constants/dto/blog.constants';
import { testServer } from 'tests/test-server';
import { ERROR_MESSAGES, FIELDS, ID_ERROR_MSG, UPDATE_PASSWORD } from '@/domain/constants/dto/user.constants';
import { BcryptAdapter } from '@/config/bcrypt.adapter';
import { JwtAdapter } from '@/config/jwt.adapter';
import { COOLDOWN_DAYS } from '@/infrastructure/constants/user.constants';

export const testUser = {username: 'TestingUser', email: 'test@google.com'};
export const testUserCredentials = {...testUser, password: 'Testing89#!'};
const requestBodyPassword = {
    currentPassword: testUserCredentials.password,
    newPassword: '45$NewUpdatedPass',
    confirmPassword: '45$NewUpdatedPass',
};

describe('users routes testing', () => { 
    beforeAll(async() => {await testServer.start();});
    afterAll(() => {testServer.close();});
    beforeEach(async() => {await prisma.user.deleteMany();});

    describe('/signup Endpoint', () => { 
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
            
            test('/signup endpoint should return a 400 error if username contains more than 30 characters', async () => { 
                const {body} = await request(testServer.app)
                    .post('/api/users/signup')
                    .send({...testUserCredentials, username: 'Usernamewithmorethan15charactesALongUSernamedfddffddfd'})
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
    describe('/updateUsername/:id Endpoint', () => { 
        test('should update username and return user data', async () => { 
            const user = await prisma.user.create({data: testUserCredentials});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
            const updatedUsername = 'updated_user';

            const {body} = await request(testServer.app)
                .put(`/api/users/updateUsername/${user.id}`)
                .set('token', `${userToken}`)
                .send({username: updatedUsername})
                .expect(200)

            expect(body).toEqual({
                success: true,
                message: 'Username successfully updated',
                data: {
                    user: {
                        id: user.id,
                        username: updatedUsername,
                        email: testUserCredentials.email
                    }
                }
            })
        });
        test('should expect a 200 status code if updated username is the current username', async () => { 
            const user = await prisma.user.create({data: testUserCredentials});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updateUsername/${user.id}`)
                .set('token', `${userToken}`)
                .send({username: testUserCredentials.username})
                .expect(200)

            expect(body.success).toBeTruthy()
        });
        test('should throw a 404 error if user does not exist', async () => { 
            const id = 2;
            const user = await prisma.user.create({data: testUserCredentials});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
            const updatedUsername = 'updated_user';

            const {body} = await request(testServer.app)
                .put(`/api/users/updateUsername/${id}`)
                .set('token', `${userToken}`)
                .send({username: updatedUsername})
                .expect(404)
            
            expect(body).toEqual({
                success: false,
                error: {message: `User with id ${id} not found`}
            });
        });
        test('should throw a 400 error if username already exists with other id', async () => { 
            await prisma.user.create({data: testUserCredentials});
            const user2 = await prisma.user.create({
                data: {username: 'testing_user', email: 'testing@gmail.com', password: testUserCredentials.password}
            });
            const userToken = await JwtAdapter.generateJWT({id: user2.id, username: user2.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updateUsername/${user2.id}`)
                .set('token', `${userToken}`)
                .send({username: testUserCredentials.username})
                .expect(400)
            
            expect(body).toEqual({
                success: false,
                error: {message: `Username ${testUserCredentials.username} already exists`}
            });
        });
        test('should throw a 403 error if username change during cooldown period', async () => { 
            const user = await prisma.user.create({data: testUserCredentials});
            await prisma.user.update({
                where: {id: user.id},
                data: {usernameUpdatedAt: new Date()}
            });
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updateUsername/${user.id}`)
                .set('token', `${userToken}`)
                .send({username: 'updatedUsername'})
                .expect(403)

            expect(body.success).toBeFalsy();
            expect(body.error).toEqual({message: `You can only change your username once every ${COOLDOWN_DAYS} days`});
        });
        describe('Token validation', () => {  
            test('should throw a 401 error if token is not sent', async () => { 
                const updatedUsername = 'updated_user';
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/20`)
                    .send({username: updatedUsername})
                    .expect(401)
                
                expect(body).toEqual({
                    success: false,
                    error: {message: expect.any(String)}
                });
            });
            test('should throw a 401 error if token is invalid', async () => { 
                const updatedUsername = 'updated_user';
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/20`)
                    .set('token', 'abc')
                    .send({username: updatedUsername})
                    .expect(401)
                
                expect(body).toEqual({
                    success: false,
                    error: {message: expect.any(String)}
                });
            });
            test('should throw a 401 error if token has expired', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username}, -1);
                const updatedUsername = 'updated_user';
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: updatedUsername})
                    .expect(401)
                
                expect(body).toEqual({
                    success: false,
                    error: {message: expect.any(String)}
                });
            });
        });
        describe('Username validation', () => { 
            test('should throw a 400 error if username is not a string', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: 12332})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING }
                    ])
                );
            });
            test('should throw a 400 error if username length is more than 30 characters', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: 'sddadascdcjojoejewijorijoejeoewjorererwrowjoewow432423'})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH }
                    ])
                );
            });
            test('should throw a 400 error if username contains only blank spaces', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: '       '})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.BLANK_SPACES }
                    ])
                );
            });
            test('should throw a 400 error if username contains any space', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: 'user name'})
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG)
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        { field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES }
                    ])
                );
            });
            test('should throw a 400 error if username format is invalid', async () => { 
                const user = await prisma.user.create({data: testUserCredentials});
                const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});
                
                const {body} = await request(testServer.app)
                    .put(`/api/users/updateUsername/${user.id}`)
                    .set('token', `${userToken}`)
                    .send({username: 'username!{}'})
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
    });
    describe('/updatePassword/:id Endpoint', () => { 
        test('should update password and return user data', async () => { 
            const user = await prisma.user.create({data: {
                ...testUserCredentials,
                password: BcryptAdapter.hash(testUserCredentials.password)
            }});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updatePassword/${user.id}`)
                .set('token', `${userToken}`)
                .send(requestBodyPassword)
                .expect(200)

            expect(body).toEqual({
                success: true,
                message: 'Password successfully updated',
                data: {
                    user: {
                        id: user.id,
                        username: testUserCredentials.username,
                        email: testUserCredentials.email
                    }
                }
            })
        });
        test('should throw a 404 if user is not found', async () => { 
            const id = 1;
            const user = await prisma.user.create({data: {
                ...testUserCredentials,
                password: BcryptAdapter.hash(testUserCredentials.password)
            }});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updatePassword/${id}`)
                .set('token', `${userToken}`)
                .send(requestBodyPassword)
                .expect(404)

            expect(body).toEqual({
                success: false,
                error: {message: `User with id ${id} not found`}
            })
        });
        test('should throw a 400 if id is not a number', async () => { 
            const id = 'abcd';
            const userToken = await JwtAdapter.generateJWT({id: 15, username: testUserCredentials.username});
            
            const {body} = await request(testServer.app)
                .put(`/api/users/updatePassword/${id}`)
                .set('token', `${userToken}`)
                .send(requestBodyPassword)
                .expect(400)

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(ID_ERROR_MSG)
        });
        test('should throw a 400 if new password is the current password', async () => { 
            const user = await prisma.user.create({data: {
                ...testUserCredentials,
                password: BcryptAdapter.hash(testUserCredentials.password)
            }});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/updatePassword/${user.id}`)
                .set('token', `${userToken}`)
                .send({
                    currentPassword: testUserCredentials.password,
                    newPassword: testUserCredentials.password,
                    confirmPassword: testUserCredentials.password,
                })
                .expect(400)
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe('Please choose a different password from your current one');
        });
        describe('Token validation', () => {  
            test('should throw a 401 error if token is not sent', async () => {             
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/20`)
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('No token sent');
            });
            test('should throw a 401 error if token is invalid', async () => {             
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/20`)
                    .set('token', 'abcdfsfsfsfsgjdsjskjgsjgsk')
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Invalid or expired token');
            });
            test('should throw a 401 error if token has expired', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUserCredentials.username}, -1);
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Invalid or expired token');
            });
        });
        describe('Current password validation', () => {
            test('should throw a 400 error if currentPassword is not sent', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        newPassword: testUserCredentials.password,
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.REQUIRED}
                    ])
                );
             })
            test('should throw a 400 error if currentPassword is not a string', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: [],
                        newPassword: testUserCredentials.password,
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.STRING}
                    ])
                );
            });
        });
        describe('New password validation', () => { 
            test('should throw a 400 error if newPassword is not sent', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.REQUIRED}
                    ])
                );
             })
            test('should throw a 400 error if newPassword is not a string', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: ['nah'],
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.STRING}
                    ])
                );
            });
            test('should throw a 400 error if newPassword length is less than 6 charcters', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: 'nah',
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.MIN_LENGTH}
                    ])
                );
            });
            test('should throw a 400 error if newPassword does not contain an uppercase letter', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: 'newpasswordupdate&56',
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.UPPERCASE}
                    ])
                );
            });
            test('should throw a 400 error if newPassword does not contain a lowercase letter', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: 'NEWPASSWORDUPDATE&12',
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.LOWERCASE}
                    ])
                );
            });
            test('should throw a 400 error if newPassword does not contain a number', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: 'NewPassword&',
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.NUMBER}
                    ])
                );
            });
            test('should throw a 400 error if newPassword does not contain a special character', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: 'NewPassword534',
                        confirmPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.SPECIAL_CHAR}
                    ])
                );
            });
        });
        describe('Confirm Password validation', () => {  
            test('should throw a 400 error if confirmPassword is not sent', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: testUserCredentials.password,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.REQUIRED}
                    ])
                );
            });
            test('should throw a 400 error if confirmPassword is not a string', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: testUserCredentials.password,
                        confirmPassword: 133431,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.STRING}
                    ])
                );
            });
            test('should throw a 400 error if confirmPassword and newPassword do not match', async () => {  
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUser.username});
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/updatePassword/${id}`)
                    .set('token', `${userToken}`)
                    .send({
                        currentPassword: testUserCredentials.password,
                        newPassword: testUserCredentials.password,
                        confirmPassword: requestBodyPassword.confirmPassword,
                    })
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(
                    expect.arrayContaining([
                        {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.PASSWORDS_MATCH}
                    ])
                );
            });
        });

    });
    describe('/deleteUser/:id Endpoint', () => {  
        test('should delete an user and return user data', async () => {  
            const user = await prisma.user.create({data: testUserCredentials});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/deleteUser/${user.id}`)
                .set('token', userToken)
                .expect(200)

            expect(body.success).toBeTruthy();
            expect(body.message).toBe('User has been successfully deleted.');
            expect(body.data.user).toEqual({id: user.id, username: user.username, email: user.email});
        });
        test('should throw a 404 error if user is not found', async () => {  
            const id = 1;
            const user = await prisma.user.create({data: testUserCredentials});
            const userToken = await JwtAdapter.generateJWT({id: user.id, username: user.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/deleteUser/${id}`)
                .set('token', userToken)
                .expect(404)
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`User with id ${id} not found`);
        });
        test('should throw a 400 error if ID is not a number', async () => {  
            const id = 'abcde';
            const userToken = await JwtAdapter.generateJWT({id: 1, username: testUser.username});

            const {body} = await request(testServer.app)
                .put(`/api/users/deleteUser/${id}`)
                .set('token', userToken)
                .expect(400)
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe('ID argument is not a number');
        });
        describe('Token validation', () => {  
            test('should throw a 401 error if token is not sent', async () => {             
                const {body} = await request(testServer.app)
                    .put(`/api/users/deleteUser/20`)
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('No token sent');
            });
            test('should throw a 401 error if token is invalid', async () => {             
                const {body} = await request(testServer.app)
                    .put(`/api/users/deleteUser/20`)
                    .set('token', 'abcdfsfsfsfsgjdsjskjgsjgsk')
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Invalid or expired token');
            });
            test('should throw a 401 error if token has expired', async () => { 
                const id = 15;
                const userToken = await JwtAdapter.generateJWT({id, username: testUserCredentials.username}, -1);
    
                const {body} = await request(testServer.app)
                    .put(`/api/users/deleteUser/${id}`)
                    .set('token', `${userToken}`)
                    .expect(401)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe('Invalid or expired token');
            });
        });
    });
});