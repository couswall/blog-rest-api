import { prisma } from "@/data/postgres";
import { LikeDatasource } from "@/domain/datasources/like.datasource";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";


export class LikeDatasourceImpl implements LikeDatasource{
    async toggleCreateDelete(createDeleteLikeDto: CreateDeleteLikeDto): Promise<LikeEntity> {
        const {userId,blogId} = createDeleteLikeDto;

        const existingBlog = await prisma.blog.findFirst({
            where: {id: blogId, deletedAt: null}
        });
        const existingUser = await prisma.user.findFirst({
            where: {id: userId, deletedAt: null}
        });

        if(!existingUser) throw new CustomError(`User with id ${userId} does not exist`);
        if(!existingBlog) throw new CustomError(`Blog with id ${blogId} does not exist`);

        const existingLike = await prisma.like.findUnique({
            where: { blogId_userId: { blogId,userId } }
        });

        if (!existingLike) {
            const newLike = await prisma.like.create({data: {blogId, userId}});
            return LikeEntity.fromObject(newLike);
        }

        const deletedLike = await prisma.like.delete({
            where: { blogId_userId: { blogId,userId } }
        });

        return LikeEntity.fromObject(deletedLike);
    }
}