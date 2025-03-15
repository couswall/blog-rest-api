import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";
import { GetAllCategory } from "@/domain/use-cases/category";

describe('getAll-category test', () => {  
    const mockCategoryEntity = CategoryEntity.fromObject({
            id: 1,
            name: 'New category test',
            deletedAt: null,
        });
    
    const mockRepository: jest.Mocked<CategoryRepository> = {
        create: jest.fn(),
        getAll: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call getAll method from CategoryRepository', async () => {  
        mockRepository.getAll.mockResolvedValue([mockCategoryEntity]);

        await new GetAllCategory(mockRepository).execute();

        expect(mockRepository.getAll).toHaveBeenCalled();
    });
    test('execute() should return a CategoryEntity array', async () => {  
        mockRepository.getAll.mockResolvedValue([mockCategoryEntity]);

        const result = await new GetAllCategory(mockRepository).execute();

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(CategoryEntity);
    });
});