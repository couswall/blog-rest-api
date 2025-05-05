import { LikeEntity } from "@/domain/entities";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { ILikesByBlogId } from "@/domain/interfaces/like.dto.interface";

export abstract class LikeDatasource {
    abstract toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity>;
    abstract getLikesByBlogId(blogId: number): Promise<ILikesByBlogId[]>;
}