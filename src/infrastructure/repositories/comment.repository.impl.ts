import { CommentDatasource } from "@/domain/datasources/comment.datasource";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CommentRepository } from "@/domain/repositories/comment.repository";


export class CommentRepositoryImpl implements CommentRepository{
    constructor(
        private readonly datasource: CommentDatasource,
    ){};

    create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
        return this.datasource.create(createCommentDto);
    }
}