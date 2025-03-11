import { CategoryDatasource } from "@/domain/datasources/category.datasource";
import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryEntity } from "@/domain/entities";
import { CategoryRepository } from "@/domain/repositories/category.repository";

export class CategoryRepositoryImpl implements CategoryRepository{
    constructor(
        private readonly datasource: CategoryDatasource,
    ){};

    create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.datasource.create(createCategoryDto);
    }

    getAll(): Promise<CategoryEntity[]> {
        return this.datasource.getAll();
    }
}