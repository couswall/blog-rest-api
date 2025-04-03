import { UpdateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";

export interface UpdateBlogUseCase {
    execute(updateBlogDto: UpdateBlogDto): Promise<BlogEntity>;
}

export class UpdateBlog implements UpdateBlogUseCase{
    constructor(
        private readonly repository: BlogRepository,
    ){};

    execute(updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
        return this.repository.updateById(updateBlogDto);
    }
}