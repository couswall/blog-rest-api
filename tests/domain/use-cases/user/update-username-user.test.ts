import { UpdateUsernameDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";
import { UpdateUsername } from "@/domain/use-cases";

describe('update-username-user test', () => {  
    const userEntity = UserEntity.fromObject({
        id: 1,
        username: 'new_username',
        email: 'test@google.com',
        password: 'Testing14!!Password',
        usernameUpdatedAt: new Date(),
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

    test('execute() should call updateUsername repository method', async () => {  
        const [errors, errorMessage, dto] = UpdateUsernameDto.create({id: userEntity.id, username: userEntity.username});

        mockRepository.updateUsername.mockResolvedValue(userEntity);
        new UpdateUsername(mockRepository).execute(dto!);

        expect(mockRepository.updateUsername).toHaveBeenCalled();
        expect(errors).toBeUndefined();
        expect(errorMessage).toBeUndefined();
    });
});