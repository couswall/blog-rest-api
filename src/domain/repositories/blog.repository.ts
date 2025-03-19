import { CreateBlogDto } from "@src/domain/dtos/blogs";
import { BlogEntity } from "@/domain/entities";

export abstract class BlogRepository {
    abstract create(createBlogDto: CreateBlogDto): Promise<BlogEntity>;
    abstract getBlogById(id: number): Promise<BlogEntity>;
};