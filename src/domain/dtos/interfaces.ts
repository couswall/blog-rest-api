import { BlogEntity, CommentEntity, LikeEntity } from "@/domain/entities";

export interface ICreateUser {
    username: string;
    email: string;
    password: string;
    usernameUpdatedAt: Date | null;
    deletedAt: Date | null;
    blogs?: BlogEntity[];
    comments?: CommentEntity[];
    likes?: LikeEntity[];
};

export interface IErrorMsg {
    field: string;
    message: string;
}

export interface ILoginUser {
    username: string;
    password: string;
}

export interface IUpdateUsername{
    id: number;
    username: string;
}

export interface IUpdatePassword{
    id: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}