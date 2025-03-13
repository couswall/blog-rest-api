import { CreateBlogDto } from "@src/domain/dtos/blogs";
import { BlogEntity } from "@/domain/entities";

export abstract class BlogDatasource {
    abstract create(createBlogDto: CreateBlogDto): Promise<BlogEntity>;
}