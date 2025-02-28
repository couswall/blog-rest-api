import { UserRepository } from "@/domain/repositories/user.repository";
import { DeleteUser } from "@/domain/use-cases";

describe('delte-user use case tests', () => {  

    const mockRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        findById: jest.fn(),
        updateUsername: jest.fn(),
        updatePassword: jest.fn(),
        deleteById: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() method should call deleteById with id', async() => {  
        await new DeleteUser(mockRepository).execute(15);

        expect(mockRepository.deleteById).toHaveBeenCalled();
        expect(mockRepository.deleteById).toHaveBeenCalledWith(15);
    });

});