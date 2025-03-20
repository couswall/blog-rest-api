import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('blog.repository.impl tests', () => {  
    
    const mockBlogDatasource: jest.Mocked<BlogDatasource> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
    };
    const mockBlogEntity = BlogEntity.fromObject(blogObj);
    
    const blogRepository = new BlogRepositoryImpl(mockBlogDatasource);
    
    describe('create()', () => {  
        test('should call create method from BlogDatasource', async () => {  
            const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

            mockBlogDatasource.create.mockResolvedValue(mockBlogEntity);

            await blogRepository.create(dto!);

            expect(mockBlogDatasource.create).toHaveBeenCalled();
            expect(mockBlogDatasource.create).toHaveBeenCalledWith(dto!);
        });
        test('should return a BlogEntity instance', async () => {  
            const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

            mockBlogDatasource.create.mockResolvedValue(mockBlogEntity);

            const result = await blogRepository.create(dto!);

            expect(result).toBeInstanceOf(BlogEntity);
        });
    });

    describe('getBlogById()', () => {  
        test('should call getBlogById method from Blogdatasource', async () => {  
            mockBlogDatasource.getBlogById.mockResolvedValue(mockBlogEntity);

            await blogRepository.getBlogById(1);

            expect(mockBlogDatasource.getBlogById).toHaveBeenCalled();
            expect(mockBlogDatasource.getBlogById).toHaveBeenCalledWith(1);
        });
        test('should return a BlogEntity instance', async () => {  
            mockBlogDatasource.getBlogById.mockResolvedValue(mockBlogEntity);

            const result = await blogRepository.getBlogById(1);

            expect(result).toBeInstanceOf(BlogEntity);
        });
    });
});