export interface IBasedBlogDto{
    title: string;
    content: string;
    categoriesIds: number[];
}

export interface ICreateBlogDto extends IBasedBlogDto{
    authorId: number;
}

export interface IUpdateBlogDto extends IBasedBlogDto{
    id: number;
}