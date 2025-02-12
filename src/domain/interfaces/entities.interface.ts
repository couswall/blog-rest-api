import { CategoryEntity, UserEntity, CommentEntity, LikeEntity } from "@/domain/entities";

export interface ICreateBlogEntity{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    authorId: number;
    author: UserEntity;
    categories: CategoryEntity[];
    comments: CommentEntity[];
    likes: LikeEntity[];
}