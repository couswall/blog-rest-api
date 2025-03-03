import { UpdatePasswordDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories/user.repository";
import { UpdatePassword } from "@/domain/use-cases";

describe('update-password-user tests', () => {  
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

        test('execute() should call updatePassword repository method', async () => {  
            const newPasswordObj ={
                id: userEntity.id,
                currentPassword: userEntity.password,
                newPassword: 'NewPassword35//',
                confirmPassword: 'NewPassword35//',
            };
            const [errors, errorMessage, dto] = UpdatePasswordDto.create(newPasswordObj);

            mockRepository.updatePassword.mockResolvedValue(userEntity);
            await new UpdatePassword(mockRepository).execute(dto!);

            expect(mockRepository.updatePassword).toHaveBeenCalled();
            expect(errors).toBeUndefined();
            expect(errorMessage).toBeUndefined();
        });

});