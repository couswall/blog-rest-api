import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";

export interface DeleteCommentByIdUseCase{
    execute(commentId: number): Promise<CommentEntity>;
}

export class DeleteCommentById implements DeleteCommentByIdUseCase{
    constructor(
        private readonly repository: CommentRepository,
    ){};
    
    execute(commentId: number): Promise<CommentEntity> {
        return this.repository.deleteById(commentId);
    }
}