import { CommentEntity } from "@/domain/entities";
import { commentObj } from "tests/fixtures";

describe('comment.entity tests', () => {  
    
    const commentEntity = new CommentEntity(
        commentObj.id,
        commentObj.content,
        commentObj.createdAt,
        commentObj.authorId,
        commentObj.blogId,
        commentObj.deletedAt,
    );

    test('should create a CommentEntity instance with valid properties', () => {  
        expect(commentEntity).toBeInstanceOf(CommentEntity);
        expect(commentEntity.id).toBe(commentObj.id);
        expect(commentEntity.content).toBe(commentObj.content);
        expect(commentEntity.createdAt).toBe(commentObj.createdAt);
        expect(commentEntity.authorId).toBe(commentObj.authorId);
        expect(commentEntity.blogId).toBe(commentObj.blogId);
        expect(commentEntity.deletedAt).toBe(commentObj.deletedAt);
    });

    test('fromObject() should create a CommentEntity instance from a valid object', () => {  
        const commentEntityFromObj = CommentEntity.fromObject(commentObj);

        expect(commentEntityFromObj).toBeInstanceOf(CommentEntity);
        expect(commentEntityFromObj.id).toBe(commentObj.id);
        expect(commentEntityFromObj.content).toBe(commentObj.content);
        expect(commentEntityFromObj.createdAt).toBe(commentObj.createdAt);
        expect(commentEntityFromObj.authorId).toBe(commentObj.authorId);
        expect(commentEntityFromObj.blogId).toBe(commentObj.blogId);
        expect(commentEntityFromObj.deletedAt).toBe(commentObj.deletedAt);
    });

});