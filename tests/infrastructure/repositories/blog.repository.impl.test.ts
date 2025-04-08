import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto, UpdateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";
import { blogObj, newBlogRequest, updatedBlogReq } from "tests/fixtures";


describe('blog.repository.impl tests', () => {  
    
    const mockBlogDatasource: jest.Mocked<BlogDatasource> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
        updateById: jest.fn(),
        deleteBlog: jest.fn(),
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

    describe('updateBlog()', () => {  
        test('should call updateBlog method from Blogdatasource', async () => {  
            const [,,dto] = UpdateBlogDto.create({...updatedBlogReq, id: 1});
            
            mockBlogDatasource.updateById.mockResolvedValue(mockBlogEntity);
            
            await mockBlogDatasource.updateById(dto!);

            expect(mockBlogDatasource.updateById).toHaveBeenCalled();
            expect(mockBlogDatasource.updateById).toHaveBeenCalledWith(dto!);
        });
        test('should return a BlogEntity instance', async () => {  
            const [,,dto] = UpdateBlogDto.create({...updatedBlogReq, id: 1});
            
            mockBlogDatasource.updateById.mockResolvedValue(mockBlogEntity);
            
            const result = await mockBlogDatasource.updateById(dto!);

            expect(result).toBeInstanceOf(BlogEntity);
        });
    });

    describe('deleteBlog()', () => {  
        test('should call deleteBlog method from BlogDatasource', async () => {  
            mockBlogDatasource.deleteBlog.mockResolvedValue(mockBlogEntity);

            await blogRepository.deleteBlog(1);

            expect(mockBlogDatasource.deleteBlog).toHaveBeenCalled();
            expect(mockBlogDatasource.deleteBlog).toHaveBeenCalledWith(1);
        });
        test('should return a BlogEntity instance', async () => {  
            mockBlogDatasource.deleteBlog.mockResolvedValue(mockBlogEntity);

            const result = await blogRepository.deleteBlog(1);

            expect(result).toBeInstanceOf(BlogEntity);
        });
    });
});