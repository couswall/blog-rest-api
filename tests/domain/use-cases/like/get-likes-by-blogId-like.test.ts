import { LikeRepository } from "@/domain/repositories/like.repository";
import { GetLikesByBlogId } from "@/domain/use-cases/like";
import { likesByBlogIdPrisma } from "tests/fixtures";

describe('get-likes-by-blogId-like use case test', () => {
    const mockLikeRepository: jest.Mocked<LikeRepository> = {
        toggleCreateDelete: jest.fn(),
        getLikesByBlogId: jest.fn(),
        getLikesByUserId: jest.fn(),
    };
    beforeEach(() => {jest.clearAllMocks()});

    test('execute() should call getLikesByBlogId repository method', async () => {
        const blogId = 1;

        mockLikeRepository.getLikesByBlogId.mockResolvedValue(likesByBlogIdPrisma);

        await new GetLikesByBlogId(mockLikeRepository).execute(blogId);

        expect(mockLikeRepository.getLikesByBlogId).toHaveBeenCalled();
        expect(mockLikeRepository.getLikesByBlogId).toHaveBeenCalledWith(blogId);
    });
    test('execute() should return an ILikesByBlogId array', async () => {
        const blogId = 1;

        mockLikeRepository.getLikesByBlogId.mockResolvedValue(likesByBlogIdPrisma);

        const result = await new GetLikesByBlogId(mockLikeRepository).execute(blogId);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('user');
    });
});