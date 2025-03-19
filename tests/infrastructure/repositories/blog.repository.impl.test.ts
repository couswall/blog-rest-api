import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('blog.repository.impl tests', () => {  
    
    const mockBlogDatasource: jest.Mocked<BlogDatasource> = {
        create: jest.fn(),
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
});