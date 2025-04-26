import { CommentEntity } from "@src/domain/entities";
import { CreateCommentDto } from '@/domain/dtos';

export abstract class CommentRepository {
    abstract create(createCommentDto: CreateCommentDto): Promise<CommentEntity>;
    abstract deleteById(commentId: number): Promise<CommentEntity>;
}