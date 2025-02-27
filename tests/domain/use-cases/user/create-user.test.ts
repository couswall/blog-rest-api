import { BcryptAdapter } from "@/config/bcrypt.adapter";
import { CreateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";
import { CreateUser } from "@/domain/use-cases";

describe('create-user.ts tests', () => {  
    const userEntity = UserEntity.fromObject({
        id: 1,
        username: 'testingUser',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: null,
        deletedAt: null,
    });
    const mockRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        findById: jest.fn(),
        updateUsername: jest.fn(),
        updatePassword: jest.fn(),
        deleteById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call create() repository method', async() => {  
        const [,dto] = CreateUserDto.create({
            username: userEntity.username,
            email: userEntity.email,
            password: userEntity.password,
            usernameUpdatedAt: userEntity.usernameUpdatedAt,
            deletedAt: userEntity.deletedAt,
        });
        const mockHashedPassword = 'ThisIsAHashedPassword!!411111&&';

        jest.spyOn(BcryptAdapter, 'hash').mockReturnValue(mockHashedPassword);
        mockRepository.create.mockResolvedValue(userEntity);

        const newUser = await new CreateUser(mockRepository).execute(dto!);

        expect(mockRepository.create).toHaveBeenCalled();
        expect(mockRepository.create).toHaveBeenCalledWith({...dto, password: mockHashedPassword});
        expect(newUser).toEqual(userEntity);
        expect(newUser).toBeInstanceOf(UserEntity);
    });
});