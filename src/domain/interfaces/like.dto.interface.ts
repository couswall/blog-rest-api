export interface ICreateDeleteLikeDto{
    userId: number;
    blogId: number;
}

export interface ILikesByBlogId{
    id: number;
    user: IUser;
}

export interface IUser{
    id: number;
    username: string;
}

export interface ILikesByUserId{
    id: number;
    blog: ILikesByUserBlog;
}

export interface ILikesByUserBlog{
    id: number;
    title: string;
    author: IUser;
}