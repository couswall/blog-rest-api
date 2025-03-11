import { prisma } from "@/data/postgres";
import { CategoryDatasource } from "@/domain/datasources/category.datasource";
import { CreateCategoryDto } from "@/domain/dtos";
import { BlogEntity, CategoryEntity, UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { CATEGORY_RESPONSE } from "@/infrastructure/constants/category.constants";

export class CategoryDatasourceImpl implements CategoryDatasource{
    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
        const categoryExists = await prisma.category.findFirst({
            where: {name: createCategoryDto.name, deletedAt: null}
        });

        if(categoryExists) throw new CustomError(CATEGORY_RESPONSE.ERRORS.CATEGORY_EXISTS);

        const newCategory = await prisma.category.create({
            data: createCategoryDto
        });

        return CategoryEntity.fromObject({...newCategory, blogs: []});
    }
    async getAll(): Promise<CategoryEntity[]> {
        const allCategories = await prisma.category.findMany({
            include: {
                blogs: {
                    include: {
                        author: true,
                    }
                }
            }
        });

        return allCategories.map((category) =>
          CategoryEntity.fromObject({
            ...category,
            blogs: category.blogs.map((blog) =>
              BlogEntity.fromObject({
                ...blog,
                author: UserEntity.fromObject(blog.author),
              })
            ),
          })
        );
    }

}