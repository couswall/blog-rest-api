import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";
import { CreateCategory } from "@/domain/use-cases/category";

describe('create-category test', () => {  

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

    test('execute() should call create method from CategoryRepository', async () => {  
        const [errorMsg, dto] = CreateCategoryDto.create({name: mockCategoryEntity.name});

        mockRepository.create.mockResolvedValue(mockCategoryEntity);

        await new CreateCategory(mockRepository).execute(dto!);

        expect(mockRepository.create).toHaveBeenCalled();
        expect(errorMsg).toBeUndefined();
    });

    test('execute() should return a CategoryEntity instance', async () => {  
        const [errorMsg, dto] = CreateCategoryDto.create({name: mockCategoryEntity.name});

        mockRepository.create.mockResolvedValue(mockCategoryEntity);

        const result = await new CreateCategory(mockRepository).execute(dto!);

        expect(result).toBeInstanceOf(CategoryEntity);
    });
});