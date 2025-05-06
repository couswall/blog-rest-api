import { LikeEntity } from "@/domain/entities";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { ILikesByBlogId, ILikesByUserId } from "@/domain/interfaces/like.dto.interface";

export abstract class LikeRepository {
    abstract toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity>;
    abstract getLikesByBlogId(blogId: number): Promise<ILikesByBlogId[]>;
    abstract getLikesByUserId(userId: number): Promise<ILikesByUserId[]>;
}