import { prisma } from "@/data/postgres";
import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos/blogs";
import { BlogEntity, CategoryEntity, CommentEntity, UserEntity } from "@/domain/entities";
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
    };

    async getBlogById(id: number): Promise<BlogEntity> {
        const existingBlog = await prisma.blog.findFirst({
            where: {id, deletedAt: null},
            include: {
                categories: true, 
                author: true,
                comments: true,
                likes: true
            }
        });

        if(!existingBlog) throw new CustomError(`Blog with id ${id} does not exist`);
        
        return BlogEntity.fromObject({
            ...existingBlog,
            author: UserEntity.fromObject(existingBlog.author),
            categories: existingBlog.categories.map(category => CategoryEntity.fromObject(category)),
        })
    };

    async deleteBlog(id: number): Promise<BlogEntity> {
        const deletedBlog = await this.getBlogById(id);

        await prisma.blog.update({
            data: {deletedAt: new Date()},
            where: {id, deletedAt: null},
        });

        return deletedBlog;
    }
}