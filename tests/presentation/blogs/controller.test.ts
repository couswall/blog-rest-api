import { Request, Response } from "express";
import { BlogDatasourceImpl } from "@/infrastructure/datasources/blog.datasource.impl";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";
import { BlogController } from "@/presentation/blogs/controller";
import { prisma } from "@/data/postgres";
import { existingCategories, newBlogPrisma, newBlogRequest, updatedBlogReq, userObj } from "tests/fixtures";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";
import { CREATE_BLOG } from "@/domain/constants/dto/blog.constants";
import { ID_ERROR_MSG } from "@/domain/constants/dto/user.constants";

jest.mock('@/data/postgres', () => ({
    prisma: {
        blog: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
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

    describe('getBlogById', () => {  
        test('should return a 200 status and a blog', async () => {
            const id = 1;
            mockRequest.params = {id: String(id)};
            
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);

            await new Promise<void>((resolve) => {
                blogController.getBlogById(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.GET_BLOG_BY_ID,
                data: {blog: expect.any(Object)}
            });
        });
        test('should throw a 400 error if ID is not provided', async () => {  
            mockRequest.params = {};
            
            await blogController.getBlogById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        test('should throw a 400 error if ID is not a number', async () => {  
            mockRequest.params = {id: 'abc'};

            await blogController.getBlogById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
    });

    describe('updateBlog', () => {  
        test('should return a 200 status and updating blog data', async () => {  
            mockRequest.params = {id: '1'};
            mockRequest.body = {...updatedBlogReq};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.category.findMany as jest.Mock).mockResolvedValue(updatedBlogReq.categoriesIds);
            (prisma.blog.update as jest.Mock).mockResolvedValue({
                ...newBlogPrisma,
                ...updatedBlogReq,
            });

            await new Promise<void>((resolve) => {
                blogController.updateBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.UPDATE_BLOG,
                data: {
                    blog: {
                        id: 1,
                        title: updatedBlogReq.title,
                        content: updatedBlogReq.content,
                        categories: expect.any(Array),
                        updatedAt: expect.any(Date),
                    }
                }
            });
        });
        test('should throw a 400 error status if blog does not exist', async () => {  
            mockRequest.params = {id: String(newBlogPrisma.id)};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                blogController.updateBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: `Blog with id ${newBlogPrisma.id} does not exist`},
            });
        });
        test('should throw a 400 error status if ID is not provided', async () => {  
            mockRequest.params = {};

            await blogController.updateBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        test('should throw a 400 error status if ID is not a number', async () => {  
            mockRequest.params = {id: 'abc'};

            await blogController.updateBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
    });

    describe('deleteBlog', () => {  
        test('should return a 200 status and deleting blog information', async () => {  
            mockRequest.params = {id: '1'};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.blog.update as jest.Mock).mockResolvedValue({
                ...newBlogPrisma,
                deletedAt: new Date()
            });

            await new Promise<void>((resolve) => {
                blogController.deleteBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: `Blog with id ${newBlogPrisma.id} deleted successfully`,
                data: {
                    blog: {id: newBlogPrisma.id, title: newBlogPrisma.title}
                }
            });
        });
        test('should throw a 400 error status if ID is not provided', async () => {  
            mockRequest.params = {};

            await blogController.deleteBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        test('should throw a 400 error status if ID is not a number', async () => {  
            mockRequest.params = {id: 'abc'};

            await blogController.deleteBlog(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        test('should throw a 400 error status if blog does not exist', async () => {  
            mockRequest.params = {id: String(newBlogPrisma.id)};

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                blogController.deleteBlog(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: `Blog with id ${newBlogPrisma.id} does not exist`},
            });
        });
    });

});