import { BlogEntity, UserEntity } from "@/domain/entities";

export class CommentEntity {
    constructor(
        public id: number,
        public content: string,
        public createdAt: Date,
        public authorId: number,
        public blogId: number,
        public user: UserEntity,
        public blog: BlogEntity,
        public deletedAt: Date | null,
    ){};
}