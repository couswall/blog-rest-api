import { Request, Response } from "express";
import { prisma } from "@/data/postgres";
import { CategoryDatasourceImpl } from "@/infrastructure/datasources/category.datasource.impl";
import { CategoryRepositoryImpl } from "@/infrastructure/repositories/category.repository.impl";
import { CategoryController } from "@/presentation/categories/controller";
import { CATEGORY_RESPONSE } from "@/infrastructure/constants/category.constants";
import { CATEGORY_ERRORS } from "@/domain/constants/dto/category.constants";

jest.mock('@/data/postgres', () => ({
    prisma: {
        category: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('CategoryController tests', () => {  
    const datasource = new CategoryDatasourceImpl();
    const categoryRepository = new CategoryRepositoryImpl(datasource);
    const categoryController = new CategoryController(categoryRepository);
    let mockRequest: Partial<Request> = {body: {}, params: {}};
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const categoryReqObj = {name: 'New Category Test'};

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('createCategory', () => {  
        test('should return a 201 status when category is created successfully', async () => {  
            mockRequest.body = {...categoryReqObj};

            const newCategoryObj = {name: 'category', id: 1, deletedAt: null};

            (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.category.create as jest.Mock).mockResolvedValue(newCategoryObj);

            await new Promise<void>((resolve) => {
                categoryController.createCategory(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: CATEGORY_RESPONSE.SUCCESS.CREATE,
                data: {id: newCategoryObj.id, name: newCategoryObj.name}
            });
        });
        test('should throw a 400 error if body is empty', async () => {  
            mockRequest.body = {};

            await categoryController.createCategory(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: CATEGORY_ERRORS.REQUIRED}
            });
        });
        test('should throw a 400 error if category name already exists', async () => {  
            mockRequest.body = {...categoryReqObj};
            const mockExistingCategory = {...categoryReqObj, id: 2, deletedAt: null};

            (prisma.category.findFirst as jest.Mock).mockResolvedValue(mockExistingCategory);

            await new Promise<void>((resolve) => {
                categoryController.createCategory(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: CATEGORY_RESPONSE.ERRORS.CATEGORY_EXISTS}
            });
            expect(prisma.category.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllCategories', () => {  
        test('should return a 200 status and an array of categories', async () => {  
            const categoriesArray = [
                {id: 1, name: 'category-1', deletedAt: null, blogs: []},
                {id: 2, name: 'category-2', deletedAt: null, blogs: []},
                {id: 3, name: 'category-3', deletedAt: null, blogs: []},
            ];

            (prisma.category.findMany as jest.Mock).mockResolvedValue(categoriesArray);

            await new Promise<void>((resolve) => {
                categoryController.getAllCategories(mockRequest as Request, mockResponse as Response);
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: categoriesArray.map(category => ({
                    id: category.id,
                    name: category.name,
                }))
            });
        });
    });
});