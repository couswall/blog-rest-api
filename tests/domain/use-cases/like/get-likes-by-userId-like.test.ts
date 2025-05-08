import { LikeRepository } from "@/domain/repositories/like.repository";
import { GetLikesByUserId } from "@/domain/use-cases/like";
import { likesByUserIdPrisma } from "tests/fixtures";

describe('get-likes-by-userId-like use-case tests', () => {
    const mockLikeRepository: jest.Mocked<LikeRepository> = {
        toggleCreateDelete: jest.fn(),
        getLikesByBlogId: jest.fn(),
        getLikesByUserId: jest.fn(),
    };
    beforeEach(() => {jest.clearAllMocks()});

    test('execute() should call getLikesByUserId repository method', async () => {
            const userId = 1;
    
        mockLikeRepository.getLikesByUserId.mockResolvedValue(likesByUserIdPrisma);

        await new GetLikesByUserId(mockLikeRepository).execute(userId);

        expect(mockLikeRepository.getLikesByUserId).toHaveBeenCalled();
        expect(mockLikeRepository.getLikesByUserId).toHaveBeenCalledWith(userId);
    });

    test('execute() should return an ILikesByUserId array', async() => {
        const result = await mockLikeRepository.getLikesByUserId(1);
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('blog');
        expect(result[0].blog).toHaveProperty('id');
        expect(result[0].blog).toHaveProperty('title');
        expect(result[0].blog).toHaveProperty('author');
    });
});