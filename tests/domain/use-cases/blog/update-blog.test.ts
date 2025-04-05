import { UpdateBlogDto } from "@/domain/dtos";
import { BlogEntity } from "@/domain/entities";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { UpdateBlog } from "@/domain/use-cases";
import { blogObj, updatedBlogReq } from "tests/fixtures";

describe('update-blog use case', () => {
    const updatedBlogDtoObj = {...updatedBlogReq, id: 1};
    const mockBlogEntity = BlogEntity.fromObject(blogObj); 
    const mockBlogRepository: jest.Mocked<BlogRepository> = {
        create: jest.fn(),
        getBlogById: jest.fn(),
        updateById: jest.fn(),
        deleteBlog: jest.fn(),
    };

    test('execute() should call updateById repository method', async () => {  
        const [,, dto] = UpdateBlogDto.create(updatedBlogDtoObj);

        mockBlogRepository.updateById.mockResolvedValue(mockBlogEntity);

        await new UpdateBlog(mockBlogRepository).execute(dto!);

        expect(mockBlogRepository.updateById).toHaveBeenCalled();
        expect(mockBlogRepository.updateById).toHaveBeenCalledWith(updatedBlogDtoObj);
    });

    test('execute() should return a BlogEntity instance', async () => {  
        const [,,dto] = UpdateBlogDto.create(updatedBlogDtoObj);

        mockBlogRepository.updateById.mockResolvedValue(mockBlogEntity);

        const result = await new UpdateBlog(mockBlogRepository).execute(dto!);

        expect(result).toBeInstanceOf(BlogEntity);
    });
});