import { CategoryEntity, UserEntity, CommentEntity, LikeEntity, BlogEntity } from "@/domain/entities";

export interface ICreateBlogEntity{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    authorId: number;
    author: UserEntity;
    categories?: CategoryEntity[];
    comments?: CommentEntity[];
    likes?: LikeEntity[];
}

export interface ICreateCategoryEntity{
    id: number;
    name: string;
    blogs?: BlogEntity[];
    deletedAt: Date | null;
}

export interface ICommentEntityFromObject{
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
    blogId: number;
    deletedAt: Date | null;
}

export interface ILikeEntityFromObject{
    id: number;
    userId: number;
    blogId: number;
}