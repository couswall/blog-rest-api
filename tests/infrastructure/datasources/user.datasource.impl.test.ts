import { prisma } from "@/data/postgres/index";
import { CreateUserDto, LoginUserDto, UpdateUsernameDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { COOLDOWN_DAYS, ERROR_MESSAGES } from "@/infrastructure/constants/user.constants";
import { UserDatasourceImpl } from "@/infrastructure/datasources/user.datasource.impl";

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

describe('user.datasource.impl tests', () => {  
    const userDatasourceImpl = new UserDatasourceImpl();
    const userObj = {
        id: 1,
        username: 'testingUser',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: null,
        deletedAt: null,
    };
    
    const mockUserEntity = UserEntity.fromObject(userObj);
    const mockCreateDto = {
        username: userObj.username,
        email: userObj.email,
        password: userObj.password,
        usernameUpdatedAt: userObj.usernameUpdatedAt,
        deletedAt: userObj.deletedAt,
    };

    const updatedUsername = 'updated_username';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create user function', () => { 
        test('create method should create a new user', async () => {  
            const [,dto] = CreateUserDto.create(mockCreateDto);
    
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUserEntity);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    
            const result = await userDatasourceImpl.create(dto!);
            
            expect(prisma.user.create).toHaveBeenCalledWith({data: dto});
            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(result).toEqual(mockUserEntity);
        });
    
        test('create user method should return a restored user when user was deleted before', async () => {  
            const [,dto] = CreateUserDto.create(mockCreateDto);
    
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({...mockCreateDto, id: 1, deletedAt: new Date()});
            (prisma.user.update as jest.Mock).mockResolvedValue(mockUserEntity)
    
            const result = await userDatasourceImpl.create(dto!);
    
            expect(prisma.user.create).not.toHaveBeenCalled();
            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {username: dto!.username},
                        {email: dto!.email},
                    ]
                }
            });
            expect(prisma.user.update).toHaveBeenCalled();
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {
                    deletedAt: null,
                    usernameUpdatedAt: null,
                    username: dto!.username,
                    email: dto!.email,
                    password: dto!.password
                }
            });
            expect(result).toEqual(mockUserEntity);
        });
    
        test('create user method should throw an error if username already exists', async () => {  
            const [,dto] = CreateUserDto.create(mockCreateDto);
    
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({...mockCreateDto, id: 1});
    
            await expect(userDatasourceImpl.create(dto!)).rejects.toThrow(new CustomError(ERROR_MESSAGES.USERNAME.ALREADY_EXISTS, 404))
        });
    
        test('create user method should throw an error if email already exists', async () => {  
            const [,dto] = CreateUserDto.create({...mockCreateDto, username: 'test_user'});
    
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({...mockCreateDto, id: 1});
    
            await expect(userDatasourceImpl.create(dto!)).rejects.toThrow(new CustomError(ERROR_MESSAGES.EMAIL.ALREADY_EXISTS, 404))
        });
    });
    describe('findById function', () => {  
        test('findById should return an existed user', async () => {  
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObj);

            const result = await userDatasourceImpl.findById(userObj.id);

            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: {id: userObj.id, deletedAt: null}
            });
            expect(result).toEqual(mockUserEntity);
        });
        test('findById should throw an error if user does not exist', async () => {  
            const id = 2;

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userDatasourceImpl.findById(id)).rejects.toThrow(new CustomError(`User with id ${id} not found`, 404));
        });
    });
    describe('login function', () => {  
        test('should return an user entity if username exists', async () => {  
            const [,dto] = LoginUserDto.create({username: userObj.username, password: userObj.password});

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(userObj);

            const result = await userDatasourceImpl.login(dto!);

            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: {username: dto!.username, deletedAt: null},
            });
            expect(result).toEqual(mockUserEntity);
        });
        test('should throw an error if username does not exist', async () => {  
            const [,dto] = LoginUserDto.create({username: userObj.username, password: userObj.password});

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userDatasourceImpl.login(dto!)).rejects.toThrow(new CustomError(`Invalid credentials`, 404));
        });
    });
    describe('updateUsername function', () => {  
        test('should update username successfully', async() => {  
            const mockUpdatedUsernameEntity = UserEntity.fromObject({...userObj, username: updatedUsername});
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: updatedUsername});
            
            jest.spyOn(userDatasourceImpl, 'findById').mockResolvedValue(mockUserEntity);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.user.update as jest.Mock).mockResolvedValue({...userObj, username: updatedUsername});

            const result = await userDatasourceImpl.updateUsername(dto!);

            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    username: dto!.username,
                    id: { not: dto!.id }
                }
            });
            expect(prisma.user.update).toHaveBeenCalled();
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: {id: dto!.id},
                data: {
                    username: dto!.username,
                    usernameUpdatedAt: expect.any(Date),
                }
            });
            expect(result).toEqual(mockUpdatedUsernameEntity);
        });
        test('should throw an error if user does not exist', async () => {  
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: 'updatedUsername'});

            jest.spyOn(userDatasourceImpl, 'findById').mockRejectedValue(new CustomError(`User with id ${dto!.id} not found`, 404));

            await expect(userDatasourceImpl.updateUsername(dto!)).rejects.toThrow(
                new CustomError(`User with id ${dto!.id} not found`, 404)
            );
        });
        test('should not call update prsima method if updated username is the current username', async () => {  
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: userObj.username});

            jest.spyOn(userDatasourceImpl, 'findById').mockResolvedValue(mockUserEntity);
            
            const result = await userDatasourceImpl.updateUsername(dto!);
            
            expect(prisma.user.update).not.toHaveBeenCalled();
            expect(result).toEqual(mockUserEntity);
        });
        test('should update username successfully if usernameUpdatedAt is a valid date', async () => {  
            const mockUpdatedUsernameEntity = UserEntity.fromObject({
                ...userObj, 
                username: updatedUsername, 
                usernameUpdatedAt: new Date()
            });
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: updatedUsername});
            const priorDate = new Date(new Date().setDate(new Date().getDate() - 30));
            const userEntity = UserEntity.fromObject({...userObj, usernameUpdatedAt: priorDate});

            jest.spyOn(userDatasourceImpl, 'findById').mockResolvedValue(userEntity);
            
            (prisma.user.findFirst as jest.Mock).mockReturnValue(null);
            (prisma.user.update as jest.Mock).mockReturnValue(mockUpdatedUsernameEntity);

            const result = await userDatasourceImpl.updateUsername(dto!);

            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    username: dto!.username,
                    id: { not: dto!.id }
                }
            });
            expect(prisma.user.update).toHaveBeenCalled();
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: {id: dto!.id},
                data: {
                    username: dto!.username,
                    usernameUpdatedAt: expect.any(Date),
                }
            });
            expect(result).toEqual(mockUpdatedUsernameEntity);
        });
        test('should throw an error if usernameUpdateAt is less than cooldown days', async () => {  
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: updatedUsername});
            const priorDate = new Date(new Date().setDate(new Date().getDate() - 10));
            const userEntity = UserEntity.fromObject({...userObj, usernameUpdatedAt: priorDate});

            jest.spyOn(userDatasourceImpl, 'findById').mockResolvedValue(userEntity);
            
            await expect(userDatasourceImpl.updateUsername(dto!)).rejects.toThrow(
                new CustomError(`You can only change your username once every ${COOLDOWN_DAYS} days`, 403)
            );
        });
        test('should throw an error if updated username already exists', async () => {  
            const [,,dto] = UpdateUsernameDto.create({id: userObj.id, username: updatedUsername});
            const userSameUsername = UserEntity.fromObject({
                ...userObj, 
                id: 15, 
                username: updatedUsername
            });

            jest.spyOn(userDatasourceImpl, 'findById').mockResolvedValue(mockUserEntity);

            (prisma.user.findFirst as jest.Mock).mockReturnValue(userSameUsername);

            await expect(userDatasourceImpl.updateUsername(dto!)).rejects.toThrow(
                new CustomError(`Username ${dto!.username} already exists`)
            );
        });
    });
});