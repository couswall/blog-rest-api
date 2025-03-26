import { BlogDatasource } from "@/domain/datasources/blog.datasource";
import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('blog.datasource tests', () => {  
    
    const mockBlogEntity = BlogEntity.fromObject(blogObj);

    class MockBlogDatasource implements BlogDatasource {
        async getBlogById(id: number): Promise<BlogEntity> {
            return mockBlogEntity;
        }
        async create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
            return mockBlogEntity;
        }
        async deleteBlog(id: number): Promise<BlogEntity> {
            return mockBlogEntity;
        }
    };

    const mockBlogDatasource = new MockBlogDatasource();

    test('Blogdatasource abstract class should include all its methods', () => {  
        expect(mockBlogDatasource).toBeInstanceOf(MockBlogDatasource);
        expect(typeof mockBlogDatasource.create).toBe('function');
        expect(typeof mockBlogDatasource.getBlogById).toBe('function');
    });

    test('create() should return a BlogEntity instance', async () => {  
        const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

        const result = await mockBlogDatasource.create(dto!);

        expect(result).toBeInstanceOf(BlogEntity);
    });

    test('getBlogById() should return a BlogEntity instance', async () => {  
        const result = await mockBlogDatasource.getBlogById(1);
        expect(result).toBeInstanceOf(BlogEntity);
    });

    test('deleteBlog() should return a BlogEntity instance', async () => {  
        const result = await mockBlogDatasource.deleteBlog(1);
        expect(result).toBeInstanceOf(BlogEntity);
    });
});