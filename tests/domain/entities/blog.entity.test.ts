import { BlogEntity, CategoryEntity, UserEntity } from "@/domain/entities";
import { blogObj } from "tests/fixtures";

describe('blog.entity test', () => {  
    const blogObjToEntity = {
        ...blogObj,
        comments: [],
        likes: [],
    };

    const blogEntity = new BlogEntity(
        blogObjToEntity.id,
        blogObjToEntity.title,
        blogObjToEntity.content,
        blogObjToEntity.createdAt,
        blogObjToEntity.updatedAt,
        blogObjToEntity.deletedAt,
        blogObjToEntity.authorId,
        blogObjToEntity.author,
        blogObjToEntity.categories,
        blogObjToEntity.comments,
        blogObjToEntity.likes,
    );

    test('should create a BlogEntity instance with valid properties', () => {  
        expect(blogEntity).toBeInstanceOf(BlogEntity);
        expect(blogEntity.id).toBe(blogObjToEntity.id);
        expect(blogEntity.title).toBe(blogObjToEntity.title);
        expect(blogEntity.content).toBe(blogObjToEntity.content);
        expect(blogEntity.createdAt).toBe(blogObjToEntity.createdAt);
        expect(blogEntity.updatedAt).toBe(blogObjToEntity.updatedAt);
        expect(blogEntity.authorId).toBe(blogObjToEntity.authorId);
        expect(blogEntity.author).toBeInstanceOf(UserEntity);
        expect(blogEntity.categories[0]).toBeInstanceOf(CategoryEntity);
        expect(blogEntity.comments).toBe(blogObjToEntity.comments);
        expect(blogEntity.likes).toBe(blogObjToEntity.likes);
    });

    test('fromObject() should create a BlogEntity instance from a valid object', () => {  
        const newBlog = BlogEntity.fromObject(blogObjToEntity);

        expect(newBlog).toBeInstanceOf(BlogEntity);
        expect(newBlog.id).toBe(blogObjToEntity.id);
        expect(newBlog.title).toBe(blogObjToEntity.title);
        expect(newBlog.content).toBe(blogObjToEntity.content);
        expect(newBlog.createdAt).toBe(blogObjToEntity.createdAt);
        expect(newBlog.updatedAt).toBe(blogObjToEntity.updatedAt);
        expect(newBlog.authorId).toBe(blogObjToEntity.authorId);
        expect(newBlog.author).toBeInstanceOf(UserEntity);
        expect(newBlog.categories[0]).toBeInstanceOf(CategoryEntity);
        expect(newBlog.comments).toBe(blogObjToEntity.comments);
        expect(newBlog.likes).toBe(blogObjToEntity.likes);
    });

    test('fromObject() should set categories, comments and likes as empty arrays if they are not provided', () => {  
        const {categories, comments, likes, ...rest} = blogObjToEntity;

        const newBlog = BlogEntity.fromObject({...rest});

        expect(newBlog).toBeInstanceOf(BlogEntity);
        expect(Array.isArray(newBlog.categories)).toBeTruthy();
        expect(newBlog.categories.length).toBe(0);
        expect(Array.isArray(newBlog.comments)).toBeTruthy();
        expect(newBlog.comments.length).toBe(0);
        expect(Array.isArray(newBlog.likes)).toBeTruthy();
        expect(newBlog.likes.length).toBe(0);
    });

    test('toJSON() should return an object with blog properties', () => {  
        const newBlogObj = blogEntity.toJSON();

        expect(newBlogObj.id).toBe(blogEntity.id);
        expect(newBlogObj.title).toBe(blogEntity.title);
        expect(newBlogObj.content).toBe(blogEntity.content);
        expect(newBlogObj.createdAt).toBe(blogEntity.createdAt);
        expect(newBlogObj.updatedAt).toBe(blogEntity.updatedAt);
        expect(newBlogObj.authorId).toBe(blogEntity.authorId);
        expect(newBlogObj.author).toBeInstanceOf(Object);
        expect(newBlogObj.author).toHaveProperty('username');
        expect(Array.isArray(newBlogObj.categories)).toBeTruthy();
        expect(Array.isArray(newBlogObj.comments)).toBeTruthy();
        expect(Array.isArray(newBlogObj.likes)).toBeTruthy();
    });
});