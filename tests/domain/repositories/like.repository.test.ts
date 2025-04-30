import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { LikeRepository } from "@/domain/repositories/like.repository";
import { createDeleteLikeDtoObj, likeEntity } from "tests/fixtures";

describe('like.repository.test', () => {
    class MockLikeRepository implements LikeRepository{
        async toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
            return likeEntity;
        }
    }
    const likeRepository = new MockLikeRepository();

    test('LikeRepository abstract class should include all its methods', () => {
        expect(likeRepository).toBeInstanceOf(MockLikeRepository);
        expect(typeof likeRepository.toggleCreateDelete).toBe('function');
    });

    test('toggleCreateDelete() should return LikeEntity instance', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        const result = await likeRepository.toggleCreateDelete(dto!);

        expect(result).toBeInstanceOf(LikeEntity);
    });
});