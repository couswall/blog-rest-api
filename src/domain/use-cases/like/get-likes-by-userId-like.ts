import { LikeRepository } from "@/domain/repositories/like.repository";
import { ILikesByUserId } from "@/domain/interfaces/like.dto.interface";

export interface GetLikesByUserIdUseCase{
    execute(userId: number): Promise<ILikesByUserId[]>;
}

export class GetLikesByUserId implements GetLikesByUserIdUseCase{
    constructor(
        private readonly repository: LikeRepository,
    ){};

    execute(userId: number): Promise<ILikesByUserId[]> {
        return this.repository.getLikesByUserId(userId);
    }
}