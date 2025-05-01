import { LikeEntity } from "@/domain/entities";
import { likeEntity } from "tests/fixtures";

describe('LikeEntity tests', () => {  
    test('should create a LikeEntity with valid properties', async () => {
        expect(likeEntity).toBeInstanceOf(LikeEntity);
        expect(likeEntity.id).toBe(1);
        expect(likeEntity.blogId).toBe(1);
        expect(likeEntity.userId).toBe(1);
    });
    test('fromObject() should create a LikeEntity from a valid object', () => {
        const likeObj = {id: 1, userId: 1, blogId: 1};
        const newLikeEntity = LikeEntity.fromObject(likeObj);

        expect(newLikeEntity).toBeInstanceOf(LikeEntity);
    });
    test('toJSON() should return an object from a LikeEntity instance', () => {
        const likeObj = likeEntity.toJSON();

        expect(likeObj).toHaveProperty('id');
        expect(likeObj).toHaveProperty('blogId');
        expect(likeObj).toHaveProperty('userId');
    });
});