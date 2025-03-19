import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos/blogs";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";


export class BlogRepositoryImpl implements BlogRepository{
    constructor(
        private readonly datasource: BlogDatasource,
    ){};

    create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
        return this.datasource.create(createBlogDto);
    }

    getBlogById(id: number): Promise<BlogEntity> {
        return this.datasource.getBlogById(id);
    }
}