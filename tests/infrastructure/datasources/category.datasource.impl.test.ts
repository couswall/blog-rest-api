import { prisma } from "@/data/postgres";
import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { CATEGORY_RESPONSE } from "@/infrastructure/constants/category.constants";
import { CategoryDatasourceImpl } from "@/infrastructure/datasources/category.datasource.impl";

jest.mock('@/data/postgres', () => ({
    prisma: {
        category: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        }
    }
}));
describe('category.datasource.impl tests', () => {  

    const categoryDatasource = new CategoryDatasourceImpl();
    const categoryObj = {id: 1, name: 'New Category', deletedAt: null, blogs: []};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {  
        test('should create a category and return a CategoryEntity instance', async() => {  
            const [, dto] = CreateCategoryDto.create({name: categoryObj.name});

            (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.category.create as jest.Mock).mockResolvedValue(categoryObj);

            const result = await categoryDatasource.create(dto!);

            expect(prisma.category.findFirst).toHaveBeenCalledWith({
                where: {name: dto!.name, deletedAt: null}
            });
            expect(prisma.category.create).toHaveBeenCalledWith({
                data: dto!
            });
            expect(result).toBeInstanceOf(CategoryEntity);
        });

        test('should throw an error if category name already exists', async () => {  
            const [, dto] = CreateCategoryDto.create({name: categoryObj.name});
    
            (prisma.category.findFirst as jest.Mock).mockResolvedValue(categoryObj);
    
            await expect(categoryDatasource.create(dto!)).rejects.toThrow(
                new CustomError(CATEGORY_RESPONSE.ERRORS.CATEGORY_EXISTS)
            );
        });
    });

    describe('getAll()', () => {  
        test('should return a CategoryEntity array', async() => {  
            (prisma.category.findMany as jest.Mock).mockResolvedValue([categoryObj]);

            const result = await categoryDatasource.getAll();

            expect(prisma.category.findMany).toHaveBeenCalledWith({
                include: {
                    blogs: {
                        include: {author: true, categories: true}
                    }
                }
            });
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toBeInstanceOf(CategoryEntity);
        });
    });
});