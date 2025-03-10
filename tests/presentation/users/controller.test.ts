import { Request, Response } from "express";
import { BcryptAdapter } from "@/config/bcrypt.adapter";
import { JwtAdapter } from "@/config/jwt.adapter";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";
import { CreateUser } from "@/domain/use-cases/user/create-user";
import { UserDatasourceImpl } from "@/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/presentation/users/controller";
import { ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { prisma } from "@/data/postgres";
import { CustomError } from "@/domain/errors/custom.error";
import { COOLDOWN_DAYS, ERROR_MESSAGES } from "@/infrastructure/constants/user.constants";
import { LoginUser, UpdateUsername } from "@/domain/use-cases";
import { LoginUserDto } from "@/domain/dtos";

jest.mock("@/config/jwt.adapter");
jest.mock("@/config/bcrypt.adapter");
jest.mock('@/data/postgres', () => ({
    prisma: {
        user: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

describe('UserController tests', () => { 
    const datasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(datasource);
    const userController = new UserController(userRepository);
    let mockRequest: Partial<Request> = { body: {}, params: {}, headers: {} };
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const userObj = {
        id: 1,
        username: 'testingUser',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: null,
        deletedAt: null,
    };

    const mockUserEntity = UserEntity.fromObject(userObj);
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('createUser', () => {  
        test('should return 201 and JWT when user is created successfully', async () => {  
            mockRequest.body = {
                username: userObj.username,
                email: userObj.email,
                password: userObj.password,
            };

            (prisma.user.create as jest.Mock).mockReturnValue(mockUserEntity);
            jest.spyOn(JwtAdapter, 'generateJWT').mockResolvedValue('any-token');
    
            await new Promise<void>((resolve) => {
                userController.createUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });
           
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'User created succesfully',
                data: {
                    user: expect.any(Object),
                    token: 'any-token',
                }
            }));
        });
    
        test('should throw a 400 error if the body is empty', async () => {  
            mockRequest.body = {};
    
            await userController.createUser(mockRequest as Request, mockResponse as Response);
    
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: expect.any(Object)
            }));
        });

        test('should throw a 400 error if username is not sent', async () => {  
            mockRequest.body = {email: userObj.email, password: userObj.password};

            await userController.createUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: {
                    message: ERROR_VALIDATION_MSG,
                    errors: expect.any(Array),
                }
            }));
        });

        test('should throw a 404 error if username already exists', async () => {  
            mockRequest.body = {
                username: userObj.username,
                email: userObj.email,
                password: userObj.password,
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObj);
    
            await new Promise<void>((resolve) => {
                userController.createUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.USERNAME.ALREADY_EXISTS},
            });
        });
        
        test('should throw a 404 error if email already exists', async () => {  
            mockRequest.body = {
                username: userObj.username,
                email: userObj.email,
                password: userObj.password,
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValue({
                ...userObj,
                username: 'another_username'
            });
    
            await new Promise<void>((resolve) => {
                userController.createUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.EMAIL.ALREADY_EXISTS}
            });
        });
    });

    describe('loginUser', () => {  
        test('should return 200 and a JWT when the user logs in successfully', async () => {  
            mockRequest.body = {
                username: userObj.username,
                password: userObj.password,
            };

            (prisma.user.findUnique as jest.Mock).mockReturnValue(userObj);
            jest.spyOn(BcryptAdapter, 'compare').mockReturnValue(true);
            jest.spyOn(JwtAdapter, 'generateJWT').mockResolvedValue('any-token');
    
            await new Promise<void>((resolve) => {
                userController.loginUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Login successful',
                data: {user: expect.any(Object), token: 'any-token'},
            }));
        });
        test('should throw a 400 error if request body is empty', async () => {  
            mockRequest.body = {};

            await userController.loginUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: expect.any(Object)
            }));
        });
        test('should throw a 404 error if user does not exist', async () => {  
           mockRequest.body = {
            username: userObj.username,
            password: userObj.password,
           }; 

           (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

           await new Promise<void>((resolve) => {
                userController.loginUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
           });

           expect(mockResponse.status).toHaveBeenCalledWith(404);
           expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
               success: false,
                error: {message: 'Invalid credentials'}
            }));
        });
        test('should throw a 400 error if credentials are invalid', async () => {  
            mockRequest.body = {
                username: userObj.username,
                password: 'WrongPassword45!!!',
            };
            
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(userObj);
            jest.spyOn(LoginUser.prototype, 'execute').mockResolvedValue(mockUserEntity);
            jest.spyOn(BcryptAdapter, 'compare').mockReturnValue(false);

            await new Promise<void>((resolve) => {
                userController.loginUser(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: {
                    message: 'Invalid credentials'
                }
            }));
        });
    });

    describe('updateUsername', () => {  
        test('should return 200 status when username is updated successfully', async () => {  
            mockRequest.params = {id: '1'};
            mockRequest.body = {username: 'updated_username'};

            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUserEntity);
            jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(mockUserEntity);

            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
            (prisma.user.update as jest.Mock).mockResolvedValue({
                ...userObj, 
                username: 'updated_username',
                usernameUpdatedAt: new Date()
            });

            await new Promise<void>((resolve) => {
                userController.updateUsername(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Username successfully updated',
                data: {user: expect.any(Object)}
            }));
        });
        test('should return 200 status when updated username is the same as current username', async () => {  
            mockRequest.params = {id: '1'};
            mockRequest.body = {username: userObj.username};

            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUserEntity);
            
            await new Promise<void>((resolve) => {
                userController.updateUsername(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(prisma.user.update).not.toHaveBeenCalled();
        });
        test('should throw a 400 error if request body is empty', async () => {  
            mockRequest.params = {id: '1'};
            mockRequest.body = {};

            await userController.updateUsername(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: expect.any(Object)
            }));
        });
        test('should throw a 400 error if ID is not a number', async () => {  
            mockRequest.params = {id: 'abcd'};
            mockRequest.body = {username: 'updated_username'};

            await userController.updateUsername(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: expect.any(Object)
            }));
        });
        test('should throw a 404 error if user does not exist', async () => {  
            const id = 500;
            mockRequest.params = {id: String(id)};
            mockRequest.body = {username: 'updated_username'};

            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
            
            await new Promise<void>((resolve) => {
                userController.updateUsername(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                error: {message: `User with id ${id} not found`}
            }));
        });
        test('should throw a 403 error if usernameUpdateAt is less than cooldown days', async () => {  
            mockRequest.params = {id: '2'};
            mockRequest.body = {username: 'updated_username'};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue({
                ...userObj,
                usernameUpdatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
            });

            await new Promise<void>((resolve) => {
                userController.updateUsername(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: `You can only change your username once every ${COOLDOWN_DAYS} days`}
            });
            expect(prisma.user.update).not.toHaveBeenCalled();
        });
        test('should throw a 400 error if username already exists', async () => {  
            const updatedUsername = 'updated_username';
            mockRequest.params = {id: '2'};
            mockRequest.body = {username: updatedUsername};
            const mockExistedUser = {
                ...userObj,
                username: updatedUsername,
                id: 9,
                email: 'anotherEmail@google.com'
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUserEntity);
            (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockExistedUser);

            await new Promise<void>((resolve) => {
                userController.updateUsername(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: `Username ${updatedUsername} already exists`}
            });
            expect(prisma.user.update).not.toHaveBeenCalled();
        });
    });
});