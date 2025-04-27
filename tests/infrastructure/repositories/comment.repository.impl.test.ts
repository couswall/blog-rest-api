import { CommentDatasource } from "@/domain/datasources/comment.datasource";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CommentRepositoryImpl } from "@/infrastructure/repositories/comment.repository.impl";
import { commentDtoObj, commentEntity } from "tests/fixtures";

describe('comment.repository.impl tests', () => {  

    const mockCommentDatasource: jest.Mocked<CommentDatasource> = {
        create: jest.fn(),
        deleteById: jest.fn(),
    };

    const commentRepository = new CommentRepositoryImpl(mockCommentDatasource);

    describe('create()', () => {  
        test('should call create datasource method and return a CommentEntity instance', async () => {  
            const [,dto] = CreateCommentDto.create(commentDtoObj);

            mockCommentDatasource.create.mockResolvedValue(commentEntity);
            const result = await commentRepository.create(dto!);

            expect(mockCommentDatasource.create).toHaveBeenCalled();
            expect(mockCommentDatasource.create).toHaveBeenCalledWith(dto!);
            expect(result).toBeInstanceOf(CommentEntity);
        });
    });
    describe('deleteById()', () => {
        test('should call deleteById datasource method and return a CommentEntity instance', async () => {  
            const id = 1;
            mockCommentDatasource.deleteById.mockResolvedValue(commentEntity);
            const result = await commentRepository.deleteById(id);

            expect(mockCommentDatasource.deleteById).toHaveBeenCalled();
            expect(mockCommentDatasource.deleteById).toHaveBeenCalledWith(id);
            expect(result).toBeInstanceOf(CommentEntity);
        });
    });
});