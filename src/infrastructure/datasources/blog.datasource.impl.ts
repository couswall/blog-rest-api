import { prisma } from "@/data/postgres";
import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos/blogs";
import { BlogEntity, CategoryEntity, UserEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";


export class BlogDatasourceImpl implements BlogDatasource {
    async create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
        const author = await prisma.user.findFirst({
            where: {id: createBlogDto.authorId, deletedAt: null}
        });

        if (!author) throw new CustomError(`Author with id ${createBlogDto.authorId} does not exist`, 404);

        const existingCategories = await prisma.category.findMany({
            where: {id: {in: createBlogDto.categoriesIds}}
        });
        
        if (existingCategories.length !== createBlogDto.categoriesIds.length) {
            throw new CustomError(BLOG_RESPONSE.ERRORS.EXISTING_CATEGORIES, 400);
        }

        const newBlog = await prisma.blog.create({
            data: {
                title: createBlogDto.title,
                content: createBlogDto.content,
                authorId: createBlogDto.authorId,
                categories: {
                    connect: createBlogDto.categoriesIds.map(id => ({id}))
                }
            },
            include: {categories: true, author: true}
        });

        return BlogEntity.fromObject({
            ...newBlog, 
            author: UserEntity.fromObject(newBlog.author),
            categories: newBlog.categories.map(category => CategoryEntity.fromObject(category))
        });
    }
}