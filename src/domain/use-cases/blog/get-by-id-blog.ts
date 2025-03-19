import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";


export interface GetByIdBlogUseCase {
    execute(id: number): Promise<BlogEntity>;
}

export class GetByIdBlog implements GetByIdBlogUseCase{
    constructor(
        private readonly repository: BlogRepository,
    ){};

    execute(id: number): Promise<BlogEntity> {
        return this.repository.getBlogById(id);
    }
}