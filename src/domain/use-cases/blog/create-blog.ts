import { CreateBlogDto } from "@/domain/dtos/blogs";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from '../../repositories/blog.repository';

export interface CreateBlogUseCase {
    execute(dto: CreateBlogDto): Promise<BlogEntity>; 
};

export class CreateBlog implements CreateBlogUseCase{
    constructor(
        private readonly repository: BlogRepository,
    ){};

    execute(dto: CreateBlogDto): Promise<BlogEntity> {
        return this.repository.create(dto);
    }
}