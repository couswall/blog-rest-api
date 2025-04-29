import { LikeEntity } from "@/domain/entities";
import { CreateDeleteLikeDto } from "@/domain/dtos";

export abstract class LikeRepository {
    abstract toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity>;
}