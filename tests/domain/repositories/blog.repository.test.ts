import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('blog.repository test', () => {  

    const blogEntity = BlogEntity.fromObject(blogObj);

    class MockBlogRepository implements BlogRepository{
        async create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
            return blogEntity;
        }
    };

    const blogRepository = new MockBlogRepository();
    
    test('BlogRepository abstract class should include all its methods', () => {  
        expect(blogRepository).toBeInstanceOf(MockBlogRepository);
        expect(typeof blogRepository.create).toBe('function');
    });

    test('create() should return an instance of BlogEntity', async () => {  
        const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

        const newBlog = await blogRepository.create(dto!);

        expect(newBlog).toBeInstanceOf(BlogEntity);
    });
});