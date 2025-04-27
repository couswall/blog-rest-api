import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";
import { commentEntity } from "tests/fixtures";

describe('delete-by-id-comment use case test', () => {  
    const mockCommentRepository: jest.Mocked<CommentRepository> = {
        create: jest.fn(),
        deleteById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call deleteById repository method and return a CommentEntity instance', async () => {  
        const id = 1;
        mockCommentRepository.deleteById.mockResolvedValue(commentEntity);

       await mockCommentRepository.deleteById(id);

        expect(mockCommentRepository.deleteById).toHaveBeenCalled();
        expect(mockCommentRepository.deleteById).toHaveBeenCalledWith(id);
    });

    test('execute() should return a CommentEntity instance', async () => {  
        const id = 1;
        mockCommentRepository.deleteById.mockResolvedValue(commentEntity);

        const result = await mockCommentRepository.deleteById(id);

        expect(result).toBeInstanceOf(CommentEntity);
    });
});