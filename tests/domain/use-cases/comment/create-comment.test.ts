import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";
import { CreateComment } from "@/domain/use-cases";
import { commentDtoObj, commentEntity } from "tests/fixtures";

describe('create-comment use case tests', () => {  
    
    const mockCommentRepository: jest.Mocked<CommentRepository> = {
        create: jest.fn(),
        deleteById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call create CommentRepository method', async () => {  
        const [,dto] = CreateCommentDto.create(commentDtoObj);

        mockCommentRepository.create.mockResolvedValue(commentEntity);

        await new CreateComment(mockCommentRepository).execute(dto!);

        expect(mockCommentRepository.create).toHaveBeenCalled();
        expect(mockCommentRepository.create).toHaveBeenCalledWith(dto);
    });

    test('execute() should return a CommentEntity instance', async () => {  
        const [,dto] = CreateCommentDto.create(commentDtoObj);

        mockCommentRepository.create.mockResolvedValue(commentEntity);

        const result = await new CreateComment(mockCommentRepository).execute(dto!);

        expect(result).toBeInstanceOf(CommentEntity);
    });
});