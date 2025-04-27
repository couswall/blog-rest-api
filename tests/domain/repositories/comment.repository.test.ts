import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";
import { commentEntity, commentObj } from "tests/fixtures";

describe('comment.repository.ts tests', () => {  
    class MockCommentRepository implements CommentRepository{
        async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
            return commentEntity;
        }
        async deleteById(commentId: number): Promise<CommentEntity> {
            return commentEntity;
        }
    };

    const mockCommentReposiotory = new MockCommentRepository();

    test('CommentRepository class should include all its methods', () => {  
        expect(mockCommentReposiotory).toBeInstanceOf(MockCommentRepository);
        expect(typeof mockCommentReposiotory.create).toBe('function');
        expect(typeof mockCommentReposiotory.deleteById).toBe('function');
    });

    test('create() should return an instance of CommentEntity', async() => {  
        const [,dto] = CreateCommentDto.create({
            authorId: commentObj.authorId,
            blogId: commentObj.blogId,
            content: commentObj.content
        });
        
        const result = await mockCommentReposiotory.create(dto!);
        
        expect(result).toBeInstanceOf(CommentEntity);
    });

    test('delete() should return a CommentEntity instance', async () => {  
        const result = await mockCommentReposiotory.deleteById(1);

        expect(result).toBeInstanceOf(CommentEntity);
    });
});