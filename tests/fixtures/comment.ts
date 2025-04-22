import { CommentEntity } from "@/domain/entities";

export const commentObj = {
    id: 1,
    content: 'Testing comment',
    createdAt: new Date(),
    authorId: 1,
    blogId: 1,
    deletedAt: null,
};

export const commentEntity = CommentEntity.fromObject(commentObj);