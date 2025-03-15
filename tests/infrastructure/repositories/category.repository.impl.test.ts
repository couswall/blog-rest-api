import { CategoryDatasource } from "@/domain/datasources/category.datasource";
import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CategoryRepositoryImpl } from "@/infrastructure/repositories/category.repository.impl";

describe('category.repository.impl tests', () => {  

    const mockCategoryDatasource: jest.Mocked<CategoryDatasource> = {
        create: jest.fn(),
        getAll: jest.fn(),
    };

    const categoryRepository = new CategoryRepositoryImpl(mockCategoryDatasource);
    const categoryObj = {id: 1, name: 'New Category', deletedAt: null, blogs: []};
    const mockCategoryEntity = CategoryEntity.fromObject(categoryObj);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {  

        test('should call create datasource method', async () => {  
            const [,dto] = CreateCategoryDto.create({name: categoryObj.name});
    
            await categoryRepository.create(dto!);
    
            expect(mockCategoryDatasource.create).toHaveBeenCalled();
            expect(mockCategoryDatasource.create).toHaveBeenCalledWith(dto!);
        });

        test('should retrun a CategoryEntity instance', async () => {  
            const [,dto] = CreateCategoryDto.create({name: categoryObj.name});
            
            mockCategoryDatasource.create.mockResolvedValue(mockCategoryEntity);
            const result = await categoryRepository.create(dto!);

            expect(result).toBeInstanceOf(CategoryEntity);
        });

    });

    describe('getAll()', () => {  

        test('should call getAll datasource method', async () => {  
            await categoryRepository.getAll();
            expect(mockCategoryDatasource.getAll).toHaveBeenCalled();
        });

        test('should retrun an array of CategoryEntity instances', async () => {  
            mockCategoryDatasource.getAll.mockResolvedValue([mockCategoryEntity]);
            
            const result = await categoryRepository.getAll();

            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toBeInstanceOf(CategoryEntity);
        });

    });
});