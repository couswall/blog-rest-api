import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { ILikesByBlogId, ILikesByUserId } from "@/domain/interfaces/like.dto.interface";
import { LikeRepository } from "@/domain/repositories/like.repository";
import { createDeleteLikeDtoObj, likeEntity, likesByBlogIdPrisma, likesByUserIdPrisma } from "tests/fixtures";

describe('like.repository.test', () => {
    class MockLikeRepository implements LikeRepository{
        async toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
            return likeEntity;
        }
        async getLikesByBlogId(blogId: number): Promise<ILikesByBlogId[]> {
            return likesByBlogIdPrisma;
        }
        async getLikesByUserId(userId: number): Promise<ILikesByUserId[]> {
            return likesByUserIdPrisma;
        }
    }
    const likeRepository = new MockLikeRepository();

    test('LikeRepository abstract class should include all its methods', () => {
        expect(likeRepository).toBeInstanceOf(MockLikeRepository);
        expect(typeof likeRepository.toggleCreateDelete).toBe('function');
        expect(typeof likeRepository.getLikesByBlogId).toBe('function');
        expect(typeof likeRepository.getLikesByUserId).toBe('function');
    });

    test('toggleCreateDelete() should return LikeEntity instance', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        const result = await likeRepository.toggleCreateDelete(dto!);

        expect(result).toBeInstanceOf(LikeEntity);
    });

    test('getLikesByBlogI() should return an ILikesByBlogId array', async() => {
        const result = await likeRepository.getLikesByBlogId(1);
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('user');
    });

    test('getLikesByUserId() should return an ILikesByUserId array', async() => {
        const result = await  likeRepository.getLikesByUserId(1);
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('blog');
        expect(result[0].blog).toHaveProperty('id');
        expect(result[0].blog).toHaveProperty('title');
        expect(result[0].blog).toHaveProperty('author');
    });
});