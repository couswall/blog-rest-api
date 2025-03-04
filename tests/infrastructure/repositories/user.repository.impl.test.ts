import { CreateUserDto, LoginUserDto, UpdateUsernameDto, UpdatePasswordDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";

describe('user.repository.impl tests', () => {  
    const userEntity = UserEntity.fromObject({
        id: 1,
        username: 'testingUser',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: null,
        deletedAt: null,
    });

    class MockUserRepository implements UserRepository{
        async create(createUserDto: CreateUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async findById(id: number): Promise<UserEntity> {
            return userEntity;
        }
        async updateUsername(updateUserNameDto: UpdateUsernameDto): Promise<UserEntity> {
            return userEntity;
        }
        async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserEntity> {
            return userEntity;
        }
        async deleteById(id: number): Promise<UserEntity> {
            return userEntity;
        }
    };

    const mockUserRepository = new MockUserRepository();

    test('should test the abstract class', () => {  
        expect(mockUserRepository).toBeInstanceOf(MockUserRepository);
        expect(typeof mockUserRepository.create).toBe('function');
        expect(typeof mockUserRepository.findById).toBe('function');
        expect(typeof mockUserRepository.login).toBe('function');
        expect(typeof mockUserRepository.updatePassword).toBe('function');
        expect(typeof mockUserRepository.updateUsername).toBe('function');
        expect(typeof mockUserRepository.deleteById).toBe('function');
    });

    test('findById method should return one user entity', async () => {  
        const user = await mockUserRepository.findById(3);

        expect(user).toBeInstanceOf(UserEntity);
    });
});