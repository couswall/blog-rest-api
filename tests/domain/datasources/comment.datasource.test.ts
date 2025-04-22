import { CommentDatasource } from "@/domain/datasources/comment.datasource";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { commentEntity, commentObj } from "tests/fixtures";

describe('comment.datasource.test ts', () => {  
    class MockCommentDatasource implements CommentDatasource{
        async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
            return commentEntity;
        }
    };

    const mockCommentDatasource = new MockCommentDatasource();

    test('CommentDatasource abstract class should include all its methods', () => {  
        expect(mockCommentDatasource).toBeInstanceOf(MockCommentDatasource);
        expect(typeof mockCommentDatasource.create).toBe('function');
    });

    test('create() should return an instance of CommentEntity', async () => {  
        const [,dto] = CreateCommentDto.create({
            authorId: commentObj.authorId,
            blogId: commentObj.blogId,
            content: commentObj.content
        });

        const result = await mockCommentDatasource.create(dto!);

        expect(result).toBeInstanceOf(CommentEntity);
    });
});