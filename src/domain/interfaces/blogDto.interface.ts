export interface ICreateBlogDto{
    authorId: number;
    title: string;
    content: string;
    categoriesIds: number[];
}