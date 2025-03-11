import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";

export interface CreateCategoryUseCase {
    execute(dto: CreateCategoryDto): Promise<CategoryEntity>;
}

export class CreateCategory implements CreateCategoryUseCase{
    constructor(
        private readonly repository: CategoryRepository,
    ){};

    execute(dto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.repository.create(dto);
    }
}