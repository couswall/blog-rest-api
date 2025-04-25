import { prisma } from "@/data/postgres";
import { Request, Response } from "express";
import { CommentDatasourceImpl } from "@/infrastructure/datasources/comment.datasource.impl";
import { CommentRepositoryImpl } from "@/infrastructure/repositories/comment.repository.impl";
import { CommentController } from "@/presentation/comments/controller";
import { commentDtoObj, commentObj, newBlogPrisma, userObjPrisma } from "tests/fixtures";
import { COMMENT_RESPONSE } from "@/infrastructure/constants/comment.constants";
import { ERRORS } from "@/domain/constants/dto/comment.constants";

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
        },
    },
}));

describe('CommentController tests', () => {  
    const datasource = new CommentDatasourceImpl();
    const commentRepository = new CommentRepositoryImpl(datasource);
    const commentController = new CommentController(commentRepository);
    let mockRequest: Partial<Request> = {body: {}};
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('createComment()', () => {  
        test('should return a 201 status when a comment is created succesfully', async () => {  
            mockRequest.body = {...commentDtoObj};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.comment.create as jest.Mock).mockResolvedValue(commentObj);

            await new Promise<void>((resolve) => {
                commentController.createComment(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: COMMENT_RESPONSE.SUCCESS.CREATE,
                data: {
                    id: commentObj.id,
                    authorId: commentObj.authorId,
                    blogId: commentObj.blogId,
                    content: commentObj.content,
                    createdAt: commentObj.createdAt,
                }
            });
        });
        test('should throw a 400 error if request body is empty', async () => {  
            mockRequest.body = {};

            await commentController.createComment(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Object)
            });
        });
        describe('Author validation', () => {  
            test('should throw a 400 error if authorId is not sent', async () => {  
                mockRequest.body = {...commentDtoObj, authorId: undefined};
    
                await commentController.createComment(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: ERRORS.AUTHOR_ID.REQUIRED}
                });
            });
            test('should throw a 400 error if authorId is not a number', async () => {  
                mockRequest.body = {...commentDtoObj, authorId: 'abcd'};
    
                await commentController.createComment(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: ERRORS.AUTHOR_ID.NUMBER}
                });
            });
            test('should throw a 400 status if author does not exist', async () => {  
                mockRequest.body = {...commentDtoObj};
    
                (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    
                await new Promise<void>((resolve) => {
                    commentController.createComment(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `User with authorId ${commentDtoObj.authorId} does not exist`}
                });
            });
        });
        describe('Blog validation', () => {  
            test('should throw a 400 error if blogId is not sent', async () => {  
                mockRequest.body = {...commentDtoObj, blogId: undefined};
    
                await commentController.createComment(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: ERRORS.BLOG_ID.REQUIRED}
                });
            });
            test('should throw a 400 error if blogId is not a number', async () => {  
                mockRequest.body = {...commentDtoObj, blogId: 'abcd'};
    
                await commentController.createComment(mockRequest as Request, mockResponse as Response);
    
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: ERRORS.BLOG_ID.NUMBER}
                });
            });
            test('should throw a 400 error if blog does not exist', async () => {  
                mockRequest.body = {...commentDtoObj};
    
                (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
                (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);
                (prisma.comment.create as jest.Mock).mockResolvedValue(commentObj);

                await new Promise<void>((resolve) => {
                    commentController.createComment(mockRequest as Request, mockResponse as Response);
                    setImmediate(resolve);
                });

                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: {message: `Blog with blogId ${commentDtoObj.blogId} does not exist`}
                });
            });
        });
        
    });
});