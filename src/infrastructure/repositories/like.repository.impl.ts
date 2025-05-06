import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { ILikesByBlogId, ILikesByUserId } from "@/domain/interfaces/like.dto.interface";
import { LikeRepository } from "@/domain/repositories/like.repository";

export class LikeRepositoryImpl implements LikeRepository{
    constructor(
        private readonly datasource: LikeDatasource,
    ){};

    toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
        return this.datasource.toggleCreateDelete(createDeleteLikeDto);
    }

    getLikesByBlogId(blogId: number): Promise<ILikesByBlogId[]> {
        return this.datasource.getLikesByBlogId(blogId);
    }

    getLikesByUserId(userId: number): Promise<ILikesByUserId[]> {
        return this.datasource.getLikesByUserId(userId);
    }
}