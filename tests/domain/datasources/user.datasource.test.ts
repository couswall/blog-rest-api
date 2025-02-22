import { UserDatasource } from "@/domain/datasources/user.datasource";
import { CreateUserDto, LoginUserDto, UpdateUsernameDto, UpdatePasswordDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";

describe('user.datasource test', () => { 
    
    const userEntity = UserEntity.fromObject({
        id: 1,
        username: 'testingUser',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: null,
        deletedAt: null,
    });

    class MockUserDatasource implements UserDatasource{
        async create(createUserDto: CreateUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async findById(id: number): Promise<UserEntity> {
            return userEntity;
        }
        async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
            return userEntity;
        }
        async updateUsername(updateUsernameDto: UpdateUsernameDto): Promise<UserEntity> {
            return userEntity;
        }
        async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserEntity> {
            return userEntity;
        }
        async deleteById(id: number): Promise<UserEntity> {
            return userEntity;
        }
    };

    const mockUserDatasource = new MockUserDatasource();
    
    test('should tests the abstract class', () => { 

        expect(mockUserDatasource).toBeInstanceOf(MockUserDatasource);
        expect(typeof mockUserDatasource.create).toBe('function');
        expect(typeof mockUserDatasource.findById).toBe('function');
        expect(typeof mockUserDatasource.login).toBe('function');
        expect(typeof mockUserDatasource.updatePassword).toBe('function');
        expect(typeof mockUserDatasource.updateUsername).toBe('function');
        expect(typeof mockUserDatasource.deleteById).toBe('function');
    });

    test('findbyId method should return one user', async () => { 
        const user = await mockUserDatasource.findById(2);

        expect(user).toBeInstanceOf(UserEntity);
    });
});