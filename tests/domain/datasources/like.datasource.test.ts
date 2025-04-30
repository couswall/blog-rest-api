import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { createDeleteLikeDtoObj, likeEntity } from "tests/fixtures";

describe('like.datasource tests', () => {  
    class MockLikeDatasource implements LikeDatasource{
        async toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
            return likeEntity;
        }
    };

    const likeDatasource = new MockLikeDatasource();

    test('LikeDatasource abstract class should include all its methods', async () => {
        expect(likeDatasource).toBeInstanceOf(MockLikeDatasource);
        expect(typeof likeDatasource.toggleCreateDelete).toBe('function');
    });

    test('toggleCreateDelete() should return LikeEntity instance', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        const result = await likeDatasource.toggleCreateDelete(dto!);

        expect(result).toBeInstanceOf(LikeEntity);
    });

});