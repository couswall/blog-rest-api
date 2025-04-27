import { prisma } from "@/data/postgres";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { CommentDatasourceImpl } from "@/infrastructure/datasources/comment.datasource.impl";
import { commentDtoObj, commentObj, newBlogPrisma, userObjPrisma } from "tests/fixtures";

jest.mock('@/data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
        blog: {
            findFirst: jest.fn(),
        },
        comment: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    },
}));

describe('comment.datasource.impl tests', () => {  
    const commentDatasource = new CommentDatasourceImpl();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create() method', () => {
        test('should create a new comment and return a CommentEntity instance', async () => {  
            const [,dto] = CreateCommentDto.create(commentDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.comment.create as jest.Mock).mockResolvedValue(commentObj);

            const result = await commentDatasource.create(dto!);

            expect(result).toBeInstanceOf(CommentEntity);
            expect(prisma.user.findFirst).toHaveBeenCalledWith(
                {where: {id: dto!.authorId, deletedAt: null}}
            );
            expect(prisma.blog.findFirst).toHaveBeenCalledWith(
                {where: {id: dto!.blogId, deletedAt: null}}
            );
            expect(prisma.comment.create).toHaveBeenCalledWith({data: dto!});
        });
        test('should throw a 400 error when user does not exist', async () => {  
            const [,dto] = CreateCommentDto.create(commentDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(commentDatasource.create(dto!)).rejects.toThrow(
                new CustomError(`User with authorId ${dto!.authorId} does not exist`)
            )
        });
        test('should throw a 400 error when user blog does not exist', async () => {  
            const [,dto] = CreateCommentDto.create(commentDtoObj);

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(commentDatasource.create(dto!)).rejects.toThrow(
                new CustomError(`Blog with blogId ${dto!.blogId} does not exist`)
            )
        });
    });
    
    describe('deleteById()', () => {
        test('should delete a comment and return a CommentEntity instance', async () => {
            (prisma.comment.findFirst as jest.Mock).mockResolvedValue(commentObj);
            (prisma.comment.update as jest.Mock).mockResolvedValue({
                ...commentObj,
                deletedAt: new Date()
            });

            const result = await commentDatasource.deleteById(commentObj.id);

            expect(result).toBeInstanceOf(CommentEntity);
            expect(prisma.comment.findFirst).toHaveBeenCalledWith({
                where: {id: commentObj.id, deletedAt: null}
            });
            expect(prisma.comment.update).toHaveBeenCalledWith({
                where: {id: commentObj.id},
                data: {deletedAt: expect.any(Date)}
            });
        });
        test('should throw a 400 error if comment with provided ID does not exist', async () => {
            (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(commentDatasource.deleteById(commentObj.id)).rejects.toThrow(
                new CustomError(`Comment with id ${commentObj.id} does not exist`)
            );
        });
    });
});