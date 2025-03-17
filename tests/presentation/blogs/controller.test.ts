import { Request, Response } from "express";
import { BlogDatasourceImpl } from "@/infrastructure/datasources/blog.datasource.impl";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";
import { BlogController } from "@/presentation/blogs/controller";
import { prisma } from "@/data/postgres";
import { existingCategories, newBlogPrisma, newBlogRequest, userObj } from "tests/fixtures";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";
import { CREATE_BLOG } from "@/domain/constants/dto/blog.constants";

jest.mock('@/data/postgres', () => ({
    prisma: {
        blog: {
            create: jest.fn(),
        },
        user: {
            findFirst: jest.fn(),
        },
        category: {
            findMany: jest.fn(),
        },
    },
}));

describe('BlogController tests', () => {  
    const datasource = new BlogDatasourceImpl();
    const blogRepository = new BlogRepositoryImpl(datasource);
    const blogController = new BlogController(blogRepository);
    let mockRequest: Partial<Request> = {body: {}, params: {}};
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('createBlog', () => {  
        test('should return a 201 status when a blog is created successfully', async () => {  
            mockRequest.body = {...newBlogRequest};
            mockRequest.params = {authorId: '1'};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObj);
            (prisma.category.findMany as jest.Mock).mockResolvedValue(existingCategories);
            (prisma.blog.create as jest.Mock).mockResolvedValue(newBlogPrisma);

            await new Promise<void>((resolve) => {
                blogController.createBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.CREATE,
                data: {
                    blog: {
                        id: newBlogPrisma.id,
                        title: newBlogPrisma.title,
                        author: expect.any(Object),
                        createdAt: newBlogPrisma.createdAt,
                        categories: expect.any(Array)
                    }
                }
            });
        });

        test('should throw a 400 error when body request is empty', async () => {  
            mockRequest.body = {};
            mockRequest.params = {authorId: '1'};

            await blogController.createBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Object),
            });
        });

        test('should throw a 400 error if authorId is not a number', async () => {  
            mockRequest.body = {...newBlogRequest};
            mockRequest.params = {authorId: 'abcd'};

            await blogController.createBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER},
            });
        });

        test('should throw a 400 error if authorId is not sent', async () => {  
            mockRequest.body = {...newBlogRequest};

            await blogController.createBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER},
            });
        });

        test('should throw a 404 if author does not exist', async () => {  
            const id = 1;
            mockRequest.body = {...newBlogRequest};
            mockRequest.params = {authorId: String(id)};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                blogController.createBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: `Author with id ${id} does not exist`}
            });
        });

        test('should throw a 400 error if any given category do not exist in existing categories', async () => {  
            mockRequest.body = {...newBlogRequest};
            mockRequest.params = {authorId: '1'};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObj);
            (prisma.category.findMany as jest.Mock).mockResolvedValue([1]);

            await new Promise<void>((resolve) => {
                blogController.createBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: BLOG_RESPONSE.ERRORS.EXISTING_CATEGORIES,}
            });
        });
    });

});