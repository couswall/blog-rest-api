import { prisma } from "@/data/postgres";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { LikeEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { LikeDatasourceImpl } from "@/infrastructure/datasources/like.datasource.impl";
import { createDeleteLikeDtoObj, likeObjPrisma, likesByBlogIdPrisma, likesByUserIdPrisma, newBlogPrisma, userObjPrisma } from "tests/fixtures";

jest.mock('@/data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
        blog: {
            findFirst: jest.fn(),
        },
        like: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        },
    }
}));

describe('like.datasource.impl test', () => {
    const likeDatasourceImpl = new LikeDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('toggleCreateDelete() method', () => {
        test('should create a like and return a LikeEntity instance', async () => {
            const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.like.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.like.create as jest.Mock).mockResolvedValue(likeObjPrisma);

            const result = await likeDatasourceImpl.toggleCreateDelete(dto!);

            expect(result).toBeInstanceOf(LikeEntity);
            expect(prisma.like.create).toHaveBeenCalled();
            expect(prisma.like.create).toHaveBeenCalledWith({
                data: {blogId: dto!.blogId, userId: dto!.userId}
            });
            expect(prisma.like.delete).not.toHaveBeenCalled();
        });
        test('should delete a like and return a LikeEntity instance', async () => {
            const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.like.findUnique as jest.Mock).mockResolvedValue(likeObjPrisma);
            (prisma.like.delete as jest.Mock).mockResolvedValue(likeObjPrisma);

            const result = await likeDatasourceImpl.toggleCreateDelete(dto!);

            expect(result).toBeInstanceOf(LikeEntity);
            expect(prisma.like.create).not.toHaveBeenCalled();
            expect(prisma.like.delete).toHaveBeenCalled();
            expect(prisma.like.delete).toHaveBeenCalledWith({
                where: { 
                    blogId_userId: { 
                        blogId: dto!.blogId, 
                        userId: dto!.userId 
                    } 
                }
            });
        });
        test('should throw a 400 error if blog with provided blogId does not exist', async () => {
            const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(likeDatasourceImpl.toggleCreateDelete(dto!)).rejects.toThrow(
                new CustomError(`Blog with id ${dto!.blogId} does not exist`)
            );
        });
        test('should throw a 400 error if user with provided userId does not exist', async () => {
            const [,dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(likeDatasourceImpl.toggleCreateDelete(dto!)).rejects.toThrow(
                new CustomError(`User with id ${dto!.userId} does not exist`)
            );
        });
    });
    describe('getLikesByBlogId() method', () => {
        test('should get and return an array of likes', async () => {
            const blogId = 1;

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.like.findMany as jest.Mock).mockResolvedValue(likesByBlogIdPrisma);

            const result = await likeDatasourceImpl.getLikesByBlogId(blogId);

            expect(prisma.blog.findFirst).toHaveBeenCalled();
            expect(prisma.like.findMany).toHaveBeenCalled();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('user');
        });
        test('should throw a 400 error if blog with provided ID does not exist', async () => {
            const blogId = 1;

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(likeDatasourceImpl.getLikesByBlogId(blogId)).rejects.toThrow(
                new CustomError(`Blog with id ${blogId} does not exist`)
            );
        });
    });
    describe('getLikesByUserId() method', () => {
        test('should get and return an array of likes', async () => {
            const userId = 1;

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.like.findMany as jest.Mock).mockResolvedValue(likesByUserIdPrisma);

            const result = await likeDatasourceImpl.getLikesByUserId(userId);

            expect(prisma.user.findFirst).toHaveBeenCalled();
            expect(prisma.like.findMany).toHaveBeenCalled();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('blog');
            expect(result[0].blog).toHaveProperty('id');
            expect(result[0].blog).toHaveProperty('title');
            expect(result[0].blog).toHaveProperty('author');
        });
        test('should throw a 400 error if user with provided ID does not exist', async () => {
            const userId = 1;

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(likeDatasourceImpl.getLikesByUserId(userId)).rejects.toThrow(
                new CustomError(`User with id ${userId} does not exist`)
            );
        });
    });
});