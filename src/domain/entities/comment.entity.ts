import { ICommentEntityFromObject } from "@/domain/interfaces/entities.interface";

export class CommentEntity {
    constructor(
        public id: number,
        public content: string,
        public createdAt: Date,
        public authorId: number,
        public blogId: number,
        public deletedAt: Date | null,
    ){};

    public static fromObject(commentObject: ICommentEntityFromObject): CommentEntity{
        return new CommentEntity(
            commentObject.id,
            commentObject.content,
            commentObject.createdAt,
            commentObject.authorId,
            commentObject.blogId,
            commentObject.deletedAt,
        );
    };
}