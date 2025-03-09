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
import { ERROR_MESSAGES } from "@/infrastructure/constants/user.constants";
import { LoginUser } from "@/domain/use-cases";
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
class MockUserRepository extends UserRepository {
    create = jest.fn();
    login = jest.fn();
    findById = jest.fn();
    updateUsername = jest.fn();
    updatePassword = jest.fn();
    deleteById = jest.fn();
}

describe('UserController tests', () => { 
    const mockUserRepository = new MockUserRepository();
    const userController = new UserController(mockUserRepository);
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
    });

    describe('createUser', () => {  
        test('should return 201 and JWT when user is created successfully', async () => {  
            mockRequest.body = {
                username: userObj.username,
                email: userObj.email,
                password: userObj.password,
            };

            jest.spyOn(CreateUser.prototype, "execute").mockResolvedValue(mockUserEntity);
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
            jest.spyOn(CreateUser.prototype, "execute").mockRejectedValue(new CustomError(ERROR_MESSAGES.USERNAME.ALREADY_EXISTS, 404));
    
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

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObj);
            jest.spyOn(CreateUser.prototype, "execute").mockRejectedValue(new CustomError(ERROR_MESSAGES.EMAIL.ALREADY_EXISTS, 404));
    
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

            jest.spyOn(LoginUser.prototype, "execute").mockResolvedValue(mockUserEntity);
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
           jest.spyOn(LoginUser.prototype, 'execute').mockRejectedValue(new CustomError(`Invalid credentials`, 404));

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
});