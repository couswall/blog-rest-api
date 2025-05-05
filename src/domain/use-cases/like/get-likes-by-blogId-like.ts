import { ILikesByBlogId } from "@/domain/interfaces/like.dto.interface";
import { LikeRepository } from "@/domain/repositories/like.repository";

export interface GetLikesByBlogIdUseCase{
    execute(blogId: number): Promise<ILikesByBlogId[]>;
}

export class GetLikesByBlogId implements GetLikesByBlogIdUseCase{
    constructor(
        private readonly repository: LikeRepository,
    ){};

    execute(blogId: number): Promise<ILikesByBlogId[]> {
        return this.repository.getLikesByBlogId(blogId);
    }
}