import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { LikeRepository } from "@/domain/repositories/like.repository";

export interface ICreateDeleteLikeUseCase{
    execute(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity>;
}

export class CreateDeleteLike implements ICreateDeleteLikeUseCase{
    constructor(
        private readonly repository: LikeRepository,
    ){};

    execute(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
        return this.repository.toggleCreateDelete(createDeleteLikeDto);    
    }
}