import { CommentEntity } from "@src/domain/entities";
import { CreateCommentDto } from '@/domain/dtos';

export abstract class CommentDatasource {
    abstract create(createCommentDto: CreateCommentDto): Promise<CommentEntity>;
}