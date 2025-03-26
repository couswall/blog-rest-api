import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { GetByIdBlog } from "@/domain/use-cases";
import { blogObj } from "tests/fixtures";


describe('get-by-id-blog tests', () => {
    const mockBlogEntity = BlogEntity.fromObject(blogObj);
    
    const mockBlogRepository: jest.Mocked<BlogRepository> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
        deleteBlog: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call getBlogById method from BlogRepository', async () => {  
        mockBlogRepository.getBlogById.mockResolvedValue(mockBlogEntity);

        await new GetByIdBlog(mockBlogRepository).execute(1);

        expect(mockBlogRepository.getBlogById).toHaveBeenCalled();
        expect(mockBlogRepository.getBlogById).toHaveBeenCalledWith(1);
    });
    test('execute() should return a BlogEntity instance', async () => {  
        mockBlogRepository.getBlogById.mockResolvedValue(mockBlogEntity);

        const result = await new GetByIdBlog(mockBlogRepository).execute(1);

        expect(result).toBeInstanceOf(BlogEntity);
    });

});