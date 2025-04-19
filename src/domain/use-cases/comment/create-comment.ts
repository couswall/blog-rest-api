import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";

export interface CreateCommentUseCase{
    execute(dto: CreateCommentDto): Promise<CommentEntity>;
}

export class CreateComment implements CreateCommentUseCase{
    constructor(
        private readonly repository: CommentRepository,
    ){};

    execute(dto: CreateCommentDto): Promise<CommentEntity> {
        return this.repository.create(dto);
    }
}