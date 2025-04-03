import { CreateBlogDto, UpdateBlogDto } from "@src/domain/dtos/blogs";
import { BlogEntity } from "@/domain/entities";

export abstract class BlogRepository {
    abstract create(createBlogDto: CreateBlogDto): Promise<BlogEntity>;
    abstract getBlogById(id: number): Promise<BlogEntity>;
    abstract updateById(updateBlogDto: UpdateBlogDto): Promise<BlogEntity>;
    abstract deleteBlog(id: number): Promise<BlogEntity>;
};