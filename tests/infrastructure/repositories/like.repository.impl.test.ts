import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { LikeRepositoryImpl } from "@/infrastructure/repositories/like.repository.impl";
import { createDeleteLikeDtoObj, likeEntity, likesByBlogIdPrisma, likesByUserIdPrisma } from "tests/fixtures";

describe('like.repository.impl.ts tests', () => {
    const mockLikeDatasource: jest.Mocked<LikeDatasource> = {
        toggleCreateDelete: jest.fn(),
        getLikesByBlogId: jest.fn(),
        getLikesByUserId: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const likeRepositoryImpl = new LikeRepositoryImpl(mockLikeDatasource);

    describe('toggleCreateDelete() method', () => {
        test('should call toggleCreateDelete datasource method and return a LikeEntity instance', async () => {
            const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

            mockLikeDatasource.toggleCreateDelete.mockResolvedValue(likeEntity);

            const result = await likeRepositoryImpl.toggleCreateDelete(dto!);

            expect(mockLikeDatasource.toggleCreateDelete).toHaveBeenCalled();
            expect(mockLikeDatasource.toggleCreateDelete).toHaveBeenCalledWith(dto!);
            expect(result).toBeInstanceOf(LikeEntity);
        });
    });
    describe('getLikesByBlogId() method', () => {
        test('should call getLikesByBlogId datasource method and return an ILikeByBlogId array', async () => {
            const blogId = 1;

            mockLikeDatasource.getLikesByBlogId.mockResolvedValue(likesByBlogIdPrisma);

            const result = await likeRepositoryImpl.getLikesByBlogId(blogId);

            expect(mockLikeDatasource.getLikesByBlogId).toHaveBeenCalled();
            expect(mockLikeDatasource.getLikesByBlogId).toHaveBeenCalledWith(blogId);
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('user');
        });
    });
    describe('getLikesByUserId() method', () => {
        test('should call getLikesByUserId datasource method and return an ILikeByBlogId array', async () => {
            const blogId = 1;

            mockLikeDatasource.getLikesByUserId.mockResolvedValue(likesByUserIdPrisma);

            const result = await likeRepositoryImpl.getLikesByUserId(blogId);

            expect(mockLikeDatasource.getLikesByUserId).toHaveBeenCalled();
            expect(mockLikeDatasource.getLikesByUserId).toHaveBeenCalledWith(blogId);
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('blog');
            expect(result[0].blog).toHaveProperty('id');
            expect(result[0].blog).toHaveProperty('title');
            expect(result[0].blog).toHaveProperty('author');
        });
    });
    
});