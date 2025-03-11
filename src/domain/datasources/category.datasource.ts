import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";

export abstract class CategoryDatasource{
    abstract create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity>;
    abstract getAll(): Promise<CategoryEntity[]>;
}