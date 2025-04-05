import { CreateBlogDto, UpdateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('blog.repository test', () => {  

    const blogEntity = BlogEntity.fromObject(blogObj);

    class MockBlogRepository implements BlogRepository{
        async getBlogById(id: number): Promise<BlogEntity> {
            return blogEntity;
        }
        async create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
            return blogEntity;
        }
        async updateById(updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
            return blogEntity;
        }
        async deleteBlog(id: number): Promise<BlogEntity> {
            return blogEntity;
        }
    };

    const blogRepository = new MockBlogRepository();
    
    test('BlogRepository abstract class should include all its methods', () => {  
        expect(blogRepository).toBeInstanceOf(MockBlogRepository);
        expect(typeof blogRepository.create).toBe('function');
        expect(typeof blogRepository.getBlogById).toBe('function');
        expect(typeof blogRepository.updateById).toBe('function');
        expect(typeof blogRepository.deleteBlog).toBe('function');
    });

    test('create() should return an instance of BlogEntity', async () => {  
        const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

        const newBlog = await blogRepository.create(dto!);

        expect(newBlog).toBeInstanceOf(BlogEntity);
    });
    test('getBlogById() should return a BlogEntity instance', async () => {  
        const result = await blogRepository.getBlogById(1);
        expect(result).toBeInstanceOf(BlogEntity);
    });

    test('updateBlogById() should return a BlogEntity instance', async() => { 
        const [,,dto] = UpdateBlogDto.create({...newBlogRequest, id: 1});

        const result = await blogRepository.updateById(dto!);

        expect(result).toBeInstanceOf(BlogEntity);
    });

    test('deleteBlog() should return a BlogEntity instance', async () => {  
        const result = await blogRepository.deleteBlog(1);
        expect(result).toBeInstanceOf(BlogEntity);
    });
});