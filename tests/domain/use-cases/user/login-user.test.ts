import { LoginUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";
import { LoginUser } from "@/domain/use-cases";

describe('login-user use case tests', () => {  
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

    test('execute() should call login repository method', async() => {  
        const [,dto] = LoginUserDto.create({
            username: userEntity.username, 
            password: userEntity.password,
        });

        mockRepository.login.mockResolvedValue(userEntity);
        const loginUser = await new LoginUser(mockRepository).execute(dto!);

        expect(mockRepository.login).toHaveBeenCalled();
        expect(mockRepository.login).toHaveBeenCalledWith({
            username: userEntity.username, 
            password: userEntity.password,
        });
        expect(loginUser).toBeInstanceOf(UserEntity);
    });

})