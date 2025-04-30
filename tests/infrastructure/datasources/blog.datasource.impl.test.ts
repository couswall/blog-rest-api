import { prisma } from "@/data/postgres";
import { CreateBlogDto, UpdateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { CustomError } from "@/domain/errors/custom.error";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";
import { BlogDatasourceImpl } from "@/infrastructure/datasources/blog.datasource.impl";
import { existingCategories, newBlogPrisma, newBlogRequest, updatedBlogReq, userObjPrisma } from "tests/fixtures";

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
            findFirst: jest.fn(),
            update: jest.fn(),
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

    describe('getBlogById', () => {  
        test('should get a blog by ID and return a BlogEntity', async () => {  
            const id = 1;
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);

            const result = await blogDatasource.getBlogById(id);

            expect(result).toBeInstanceOf(BlogEntity);
            expect(prisma.blog.findFirst).toHaveBeenCalledWith({
                where: {id, deletedAt: null},
                include: {
                    categories: true, 
                    author: true,
                    comments: {where: {deletedAt: null}},
                    likes: true
                }
            });
        });
        test('should throw an error if the blog does not exist', async () => {  
            const id = 1;
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(blogDatasource.getBlogById(id)).rejects.toThrow(
                new CustomError(`Blog with id ${id} does not exist`)
            );
        });
    });

    
    describe('updateBlog()', () => {
        test('should update a blog and return a BlogEntity', async () => {
            const updatedBlogDto = {...updatedBlogReq, id: 1};
            const [,,dto] = UpdateBlogDto.create(updatedBlogDto);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.category.findMany as jest.Mock).mockResolvedValue(updatedBlogDto.categoriesIds);
            (prisma.blog.update as jest.Mock).mockResolvedValue({
                ...updatedBlogReq,
                ...newBlogPrisma,
            });

            const result = await blogDatasource.updateById(dto!);

            expect(result).toBeInstanceOf(BlogEntity);
            expect(prisma.blog.update).toHaveBeenCalledWith({
                where: {id: dto!.id},
                data: {
                    title: dto!.title,
                    content: dto!.content,
                    categories: {
                        set: dto!.categoriesIds.map(id => ({id})),
                    },
                    updatedAt: expect.any(Date),
                },
                include: {categories: true, author: true},
            });
        });
        test('should throw an 400 error if blog with provided ID does not exist', async () => {
            const updatedBlogDto = {...updatedBlogReq, id: 1};
            const [,,dto] = UpdateBlogDto.create(updatedBlogDto);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(blogDatasource.updateById(dto!)).rejects.toThrow(
                new CustomError(`Blog with id ${dto!.id} does not exist`)
            );
        });
        test('should throw a 400 error when a category id does not exist in existing categories', async () => {
            const updatedBlogDto = {...updatedBlogReq, id: 1, categoriesIds: [100, 101, 200]};
            const [,,dto] = UpdateBlogDto.create(updatedBlogDto);

            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);
            (prisma.category.findMany as jest.Mock).mockResolvedValue(existingCategories);

            await expect(blogDatasource.updateById(dto!)).rejects.toThrow(
                new CustomError(BLOG_RESPONSE.ERRORS.EXISTING_CATEGORIES, 400)
            );
        });
    });

    describe('deleteBlog()', () => {  
        test('should update deleteAt status and return a blogEntity', async () => {  
            const id = 1;
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(newBlogPrisma);

            (prisma.blog.update as jest.Mock).mockResolvedValue({
                ...newBlogPrisma,
                deletedAt: new Date()
            });

            const result = await blogDatasource.deleteBlog(id);

            expect(result).toBeInstanceOf(BlogEntity);
            expect(prisma.blog.update).toHaveBeenCalledWith({
                data: {deletedAt: expect.any(Date)},
                where: {id, deletedAt: null},
            });
        });
        test('should throw an error if blog does not exist', async () => {  
            const id = 1;
            (prisma.blog.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(blogDatasource.deleteBlog(id)).rejects.toThrow(
                new CustomError(`Blog with id ${id} does not exist`)
            );
        });
    });
    
});