import { prisma } from "@/data/postgres";
import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";
import { BlogDatasourceImpl } from "@/infrastructure/datasources/blog.datasource.impl";
import { existingCategories, newBlogPrisma, newBlogRequest, userObjPrisma } from "tests/fixtures";


jest.mock('@/data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
        category: {
            findMany: jest.fn(),
        },
        blog: {
            create: jest.fn(),
        }
    }
}));

describe('blog.datasource.impl test', () => {  

    const blogDatasource = new BlogDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {  
        test('should create a blog and return a BlogEntity instance', async () => {  
            const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.category.findMany as jest.Mock).mockResolvedValue(existingCategories);
            (prisma.blog.create as jest.Mock).mockResolvedValue(newBlogPrisma);

            const result = await blogDatasource.create(dto!);

            expect(result).toBeInstanceOf(BlogEntity);
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: {id: dto!.authorId, deletedAt: null}
            });
            expect(prisma.category.findMany).toHaveBeenCalledWith({
                where: {id: {in: dto!.categoriesIds}}
            });
            expect(prisma.blog.create).toHaveBeenCalledWith({
                data: {
                    title: dto!.title,
                    content: dto!.content,
                    authorId: dto!.authorId,
                    categories: {
                        connect: dto!.categoriesIds.map(id => ({id}))
                    }
                },
                include: {categories: true, author: true}
            });
        });
        test('should throw a 404 error when user does not exist', async () => {  
            const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(blogDatasource.create(dto!)).rejects.toThrow(
                new CustomError(`Author with id ${dto!.authorId} does not exist`, 404)
            );
        });
        test('should throw a 400 error when a category id does not exist in existing categories', async () => {  
            const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userObjPrisma);
            (prisma.category.findMany as jest.Mock).mockResolvedValue([1,2]);

            await expect(blogDatasource.create(dto!)).rejects.toThrow(
                new CustomError(BLOG_RESPONSE.ERRORS.EXISTING_CATEGORIES, 400)
            );
        });
    });
    
});