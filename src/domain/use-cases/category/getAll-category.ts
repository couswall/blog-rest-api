import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";

export interface GetAllCategoryUseCase {
    execute(): Promise<CategoryEntity[]>;
}

export class GetAllCategory implements GetAllCategoryUseCase{
    constructor(
        private readonly repository: CategoryRepository,
    ){};

    execute(): Promise<CategoryEntity[]> {
        return this.repository.getAll();
    }
}
