import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { LikeRepositoryImpl } from "@/infrastructure/repositories/like.repository.impl";
import { createDeleteLikeDtoObj, likeEntity } from "tests/fixtures";

describe('like.repository.impl.ts tests', () => {
    const mockLikeDatasource: jest.Mocked<LikeDatasource> = {
        toggleCreateDelete: jest.fn(),
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
});