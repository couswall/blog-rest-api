import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";

interface DeleteBlogUseCase {
    execute(id: number): Promise<BlogEntity>;
};

export class DeleteBlog implements DeleteBlogUseCase{
    constructor(
        private readonly repository: BlogRepository,
    ){};

    execute(id: number): Promise<BlogEntity> {
        return this.repository.deleteBlog(id);
    }
}