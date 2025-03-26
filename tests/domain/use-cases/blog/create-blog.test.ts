import { CreateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { CreateBlog } from "@/domain/use-cases";
import { blogObj, newBlogRequest } from "tests/fixtures";


describe('create-blog use case tests', () => {  

    const mockBlogEntity = BlogEntity.fromObject(blogObj);

    const mockBlogRepository: jest.Mocked<BlogRepository> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
        deleteBlog: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should call create method from BlogRepository', async () => {  
        const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

        mockBlogRepository.create.mockResolvedValue(mockBlogEntity);

        await new CreateBlog(mockBlogRepository).execute(dto!);

        expect(mockBlogRepository.create).toHaveBeenCalled();
        expect(mockBlogRepository.create).toHaveBeenCalledWith(dto);
    });

    test('execute() should return a BlogEntity instance', async () => {  
        const [,,dto] = CreateBlogDto.create({...newBlogRequest, authorId: 1});

        mockBlogRepository.create.mockResolvedValue(mockBlogEntity);

        const result = await new CreateBlog(mockBlogRepository).execute(dto!);

        expect(result).toBeInstanceOf(BlogEntity);
    });

});