import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { LikeRepository } from "@/domain/repositories/like.repository";
import { CreateDeleteLike } from "@/domain/use-cases/like";
import { createDeleteLikeDtoObj, likeEntity } from "tests/fixtures";

describe('create-delete-like use-case tests', () => {
    const mockLikeRepository: jest.Mocked<LikeRepository> = {
        toggleCreateDelete: jest.fn(),
        getLikesByBlogId: jest.fn(),
        getLikesByUserId: jest.fn(),
    };
    beforeEach(() => {jest.clearAllMocks()});

    test('execute() should call toggleCreateDelete repository method', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        mockLikeRepository.toggleCreateDelete.mockResolvedValue(likeEntity);

        await new CreateDeleteLike(mockLikeRepository).execute(dto!);
        
        expect(mockLikeRepository.toggleCreateDelete).toHaveBeenCalled();
        expect(mockLikeRepository.toggleCreateDelete).toHaveBeenCalledWith(dto);
    });
    test('execute() should return a LikeEntity instance', async () => {
        const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        mockLikeRepository.toggleCreateDelete.mockResolvedValue(likeEntity);

        const result = await new CreateDeleteLike(mockLikeRepository).execute(dto!);
        
        expect(result).toBeInstanceOf(LikeEntity);
    });
});