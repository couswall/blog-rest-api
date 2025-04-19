import { prisma } from "@/data/postgres";
import { CommentDatasource } from "@/domain/datasources/comment.datasource";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";

export class CommentDatasourceImpl implements CommentDatasource{
    async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
        const {authorId, blogId} = createCommentDto;
        const existingUser = await prisma.user.findFirst(
            {where: {id: authorId, deletedAt: null}}
        );
        
        if(!existingUser) throw new CustomError(`User with authorId ${authorId} does not exist`);

        const existingBlog = await prisma.blog.findFirst(
            {where: {id: blogId, deletedAt: null}}
        );

        if(!existingBlog) throw new CustomError(`Blog with blogId ${blogId} does not exist`);

        const newComment = await prisma.comment.create(
            {data: createCommentDto}
        );

        return CommentEntity.fromObject(newComment);
    }
}