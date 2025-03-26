import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { DeleteBlog } from "@/domain/use-cases";
import { blogObj } from "tests/fixtures";


describe('delete-blog use case unit test', () => {  
    const mockBlogEntity = BlogEntity.fromObject(blogObj);

    const mockBlogRepository: jest.Mocked<BlogRepository> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
        deleteBlog: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call deleteBlog method from BlogRepository', async () => {  
        mockBlogRepository.deleteBlog.mockResolvedValue(mockBlogEntity);

        await new DeleteBlog(mockBlogRepository).execute(1);

        expect(mockBlogRepository.deleteBlog).toHaveBeenCalled();
        expect(mockBlogRepository.deleteBlog).toHaveBeenCalledWith(1);
    });

    test('execute() should return a BlogEntity instance', async () => {  
        mockBlogRepository.deleteBlog.mockResolvedValue(mockBlogEntity);

        const result = await new DeleteBlog(mockBlogRepository).execute(1);

        expect(result).toBeInstanceOf(BlogEntity);
    });
});