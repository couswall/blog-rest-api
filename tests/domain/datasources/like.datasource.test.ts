import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { ILikesByBlogId, ILikesByUserId } from "@/domain/interfaces/like.dto.interface";
import { createDeleteLikeDtoObj, likeEntity, likesByBlogIdPrisma, likesByUserIdPrisma } from "tests/fixtures";

describe('like.datasource tests', () => {  
    class MockLikeDatasource implements LikeDatasource{
        async toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
            return likeEntity;
        }
        async getLikesByBlogId(blogId: number): Promise<ILikesByBlogId[]> {
            return likesByBlogIdPrisma;
        }
        async getLikesByUserId(userId: number): Promise<ILikesByUserId[]> {
            return likesByUserIdPrisma;
        }
    };

    const likeDatasource = new MockLikeDatasource();

    test('LikeDatasource abstract class should include all its methods', async () => {
        expect(likeDatasource).toBeInstanceOf(MockLikeDatasource);
        expect(typeof likeDatasource.toggleCreateDelete).toBe('function');
        expect(typeof likeDatasource.getLikesByBlogId).toBe('function');
        expect(typeof likeDatasource.getLikesByUserId).toBe('function');
    });

    test('toggleCreateDelete() should return LikeEntity instance', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        const result = await likeDatasource.toggleCreateDelete(dto!);

        expect(result).toBeInstanceOf(LikeEntity);
    });

    test('getLikesByBlogI() should return an ILikesByBlogId array', async() => {
        const result = await likeDatasource.getLikesByBlogId(1);
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('user');
    });

    test('getLikesByUserId() should return an ILikesByUserId array', async() => {
        const result = await likeDatasource.getLikesByUserId(1);
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('blog');
        expect(result[0].blog).toHaveProperty('id');
        expect(result[0].blog).toHaveProperty('title');
        expect(result[0].blog).toHaveProperty('author');
    });

});