import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";

export abstract class CategoryRepository {
    abstract create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity>;
    abstract getAll(): Promise<CategoryEntity[]>;
};