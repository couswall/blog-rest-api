import { Request, Response } from "express";
import { prisma } from "@/data/postgres";
import { LikeDatasourceImpl } from "@/infrastructure/datasources/like.datasource.impl";
import { LikeRepositoryImpl } from "@/infrastructure/repositories/like.repository.impl";
import { LikeController } from "@/presentation/likes/controller";
import { createDeleteLikeDtoObj, likeObjPrisma, likesByBlogIdPrisma, likesByUserIdPrisma, newBlogPrisma, userObjPrisma } from "tests/fixtures";
import { LIKE_RESPONSE } from "@/infrastructure/constants/like.constants";
import { DTO_ERRORS } from "@/domain/constants/dto/like.constants";

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

describe('LikeController test', () => {
    const datasource = new LikeDatasourceImpl();
    const likeReposiotory = new LikeRepositoryImpl(datasource);
    const likeController = new LikeController(likeReposiotory);
    let mockRequest: Partial<Request> = {body: {}};
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    
    describe('toggleCreateDelete()', () => {
        test('should return a 200 status when a like is toggled successfully', async () => {
            mockRequest.body = {...createDeleteLikeDtoObj};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.like.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.like.create as jest.Mock).mockResolvedValue(likeObjPrisma);

            await new Promise<void>((resolve) => {
                likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: LIKE_RESPONSE.SUCCESS.TOGGLE,
                data: likeObjPrisma
            });
        });
        test('should throw a 400 error status if body request is empty', async () => {
            mockRequest.body = {};
            await likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
        describe('User validation', () => {
            test('should throw a 400 error status if userId is not sent', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj, userId: undefined};
                await likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: DTO_ERRORS.CREATE_DELETE.USER_ID.REQUIRED}
                });
            });
            test('should throw a 400 error status if userId is not a number', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj, userId: 'abcd'};
                await likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: DTO_ERRORS.CREATE_DELETE.USER_ID.NUMBER}
                });
            });
            test('should throw a 400 error status if user with provided id does not exist', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj};

                (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
                (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
                    
                await new Promise<void>((resolve) => {
                    likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `User with id ${createDeleteLikeDtoObj.userId} does not exist`}
                });
            });
        });
        describe('Blog validation', () => {
            test('should throw a 400 error status if blogId is not sent', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj, blogId: undefined};
                await likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: DTO_ERRORS.CREATE_DELETE.BLOG_ID.REQUIRED}
                });
            });
            test('should throw a 400 error status if blogId is not a number', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj, blogId: 'abcde'};
                await likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: DTO_ERRORS.CREATE_DELETE.BLOG_ID.NUMBER}
                });
            });
            test('should throw a 400 error status if blog with provided id does not exist', async () => {
                mockRequest.body = {...createDeleteLikeDtoObj};

                (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);
                (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
                    
                await new Promise<void>((resolve) => {
                    likeController.toggleCreateDelete(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `Blog with id ${createDeleteLikeDtoObj.blogId} does not exist`}
                });
            });
        });
    });
    describe('getLikesByBlogId()', () => {
        test('should return a 200 status and an array of likes', async () => {
            const blogId = 1;
            mockRequest.params = {blogId: String(blogId)};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.like.findMany as jest.Mock).mockResolvedValue(likesByBlogIdPrisma);

            await new Promise<void>((resolve) => {
                likeController.getLikesByBlogId(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_BLOGID} ${blogId}`,
                data: expect.any(Array),
            });
        });
        describe('Blog validation', () => {
            test('should throw a 400 error status if blogId is not sent', async () => {
                mockRequest.params = {};
                await likeController.getLikesByBlogId(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: LIKE_RESPONSE.ERRORS.LIKES_BY_BLOGID.NUMBER}
                });
            });
            test('should throw a 400 error status if blogId is not a number', async () => {
                mockRequest.params = {blogId: 'abcde'};
                await likeController.getLikesByBlogId(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: LIKE_RESPONSE.ERRORS.LIKES_BY_BLOGID.NUMBER}
                });
            });
            test('should throw a 400 error status if blog with provided ID does not exist', async () => {
                const blogId = 1;
                mockRequest.params = {blogId: String(blogId)};

                (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

                await new Promise<void>((resolve) => {
                    likeController.getLikesByBlogId(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });

                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `Blog with id ${blogId} does not exist`}
                });
            });
        });
    });
    describe('getLikesByUserId()', () => {
        test('should return a 200 status and an array of likes', async () => {
            const userId = 1;
            mockRequest.params = {userId: String(userId)};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.like.findMany as jest.Mock).mockResolvedValue(likesByUserIdPrisma);

            await new Promise<void>((resolve) => {
                likeController.getLikesByUserId(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_USERID} ${userId}`,
                data: expect.any(Array),
            });
        });
        describe('User validation', () => {
            test('should throw a 400 error status if userId is not sent', async () => {
                mockRequest.params = {};
                await likeController.getLikesByUserId(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: LIKE_RESPONSE.ERRORS.LIKES_BY_USERID.NUMBER}
                });
            });
            test('should throw a 400 error status if userId is not a number', async () => {
                mockRequest.params = {userId: 'abcde'};
                await likeController.getLikesByUserId(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: LIKE_RESPONSE.ERRORS.LIKES_BY_USERID.NUMBER}
                });
            });
            test('should throw a 400 error status if user with provided ID does not exist', async () => {
                const userId = 1;
                mockRequest.params = {userId: String(userId)};

                (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

                await new Promise<void>((resolve) => {
                    likeController.getLikesByUserId(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });

                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `User with id ${userId} does not exist`}
                });
            });
        });
    });
});