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

export const commentDtoObj = {
    authorId: 1,
    blogId: 1,
    content: 'DTO comment test',
};