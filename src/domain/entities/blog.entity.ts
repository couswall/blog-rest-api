import { UserEntity, CategoryEntity, CommentEntity, LikeEntity } from "@/domain/entities";

export class BlogEntity {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
        public authorId: number,
        public author: UserEntity,
        public categories: CategoryEntity[],
        public comments: CommentEntity[],
        public likes: LikeEntity[],
    ){};
}