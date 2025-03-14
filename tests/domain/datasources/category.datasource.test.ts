import { CategoryDatasource } from "@/domain/datasources/category.datasource";
import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";

describe('category.datasource tests', () => {  

    const categoryObj = {
        id: 1,
        name: 'category-1',
        deletedAt: null,
    };
    const mockCategoryEntity = CategoryEntity.fromObject(categoryObj);

    class MockCategoryDatasource implements CategoryDatasource{
        async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
            return mockCategoryEntity;
        }
        async getAll(): Promise<CategoryEntity[]> {
            return [mockCategoryEntity];
        }
    };

    const mockCategoryDatasource = new MockCategoryDatasource();

    test('the abstract class should include all its methods', async () => {  
        expect(mockCategoryDatasource).toBeInstanceOf(MockCategoryDatasource);
        expect(typeof mockCategoryDatasource.create).toBe('function');
        expect(typeof mockCategoryDatasource.getAll).toBe('function');
    });

    test('create() should return a category entity', async () => {  
        const [,dto] = CreateCategoryDto.create({name: 'new category'});
        
        const result = await mockCategoryDatasource.create(dto!);

        expect(result).toBeInstanceOf(CategoryEntity);
    });

    test('getAll() should return an array of categories', async () => {  
        const result = await mockCategoryDatasource.getAll();
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
    });
});