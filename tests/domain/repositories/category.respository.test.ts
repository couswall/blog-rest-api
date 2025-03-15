import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";


describe('category.repository test', () => {  

    const categoryObj = {
        id: 1,
        name: 'category-1',
        deletedAt: null,
    };
    const mockCategoryEntity = CategoryEntity.fromObject(categoryObj);

    class MockCategoryRepository implements CategoryRepository{
        async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
            return mockCategoryEntity;
        }
        async getAll(): Promise<CategoryEntity[]> {
            return [mockCategoryEntity];
        }
    };

    const categoryRepository = new MockCategoryRepository();

    test('CategoryRepository class should include all its methods', async () => {  
        expect(categoryRepository).toBeInstanceOf(MockCategoryRepository);
        expect(typeof categoryRepository.create).toBe('function');
        expect(typeof categoryRepository.getAll).toBe('function');
    });

    test('create() should return a CategoryEntity instance', async () => {  
        const [,dto] = CreateCategoryDto.create({...categoryObj});

        const result = await categoryRepository.create(dto!);

        expect(result).toBeInstanceOf(CategoryEntity);
    });

    test('getAll() should return an array of categories', async () => {  
        const result = await categoryRepository.getAll();
        
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
    });
});