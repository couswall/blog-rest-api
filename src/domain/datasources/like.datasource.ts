import { LikeEntity } from "@/domain/entities";
import { CreateDeleteLikeDto } from "@/domain/dtos";

export abstract class LikeDatasource {
    abstract toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity>;
}