import { CREATE_BLOG, ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { ID_ERROR_MSG } from "@/domain/constants/dto/user.constants";
import { UpdateBlogDto } from "@/domain/dtos";
import { IUpdateBlogDto } from "@/domain/interfaces/blogDto.interface";
import { updatedBlogReq } from "tests/fixtures";

describe('update-blog.dto tests', () => {  

    const updatedBlogDtoObj = {...updatedBlogReq, id: 1};

    test('should create an UpdatedBlogDto instance when a valid object is provided', () => {  
        const [errorMessages, message, dto] = UpdateBlogDto.create(updatedBlogDtoObj);

        expect(errorMessages).toBeUndefined();
        expect(message).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateBlogDto);
    });

    describe('ID validation', () => {  
        test('should return an error if id is not provided', () => {
            const blogObj = {...updatedBlogReq} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toBeUndefined();
            expect(message).toBe(ID_ERROR_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if id is not a number', () => {
            const blogObj = {...updatedBlogDtoObj, id: 'abcd'} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toBeUndefined();
            expect(message).toBe(ID_ERROR_MSG);
            expect(dto).toBeUndefined();
        });
    });
    
    describe('Title validation', () => {  
        test('should return an error if title is not sent', () => {  
            const blogObj = {...updatedBlogDtoObj, title: undefined} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title is not a string', () => {  
            const blogObj = {...updatedBlogDtoObj, title: 12345} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.STRING}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title length is less than 5 characters', () => {  
            const blogObj = {...updatedBlogDtoObj, title: 'ab'};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MIN_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title contains only blank spaces', () => {  
            const blogObj = {...updatedBlogDtoObj, title: '               '};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.BLANK_SPACES}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title length is more than 150 characters', () => {  
            const blogObj = {...updatedBlogDtoObj, title: 'Title content'.repeat(151)};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MAX_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title is an empty string', () => {  
            const blogObj = {...updatedBlogDtoObj, title: ''};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });
    describe('content blog validation', () => {  
        test('should return an error if content is not sent', () => {  
            const blogObj = {...updatedBlogDtoObj, content: undefined} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content is not a string', () => {  
            const blogObj = {...updatedBlogDtoObj, content: 12345} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.STRING}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content is an empty string', () => {  
            const blogObj = {...updatedBlogDtoObj, content: ''} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content contains only blank spaces', () => {  
            const blogObj = {...updatedBlogDtoObj, content: '                                 '};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.BLANK_SPACES}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content length is less than 5 characters', () => {  
            const blogObj = {...updatedBlogDtoObj, content: 'abcd'};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MIN_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content length is more than 500 characters', () => {  
            const blogObj = {...updatedBlogDtoObj, content: 'Blog content'.repeat(500)};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);

            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MAX_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });
    describe('categoriesIds validation', () => {  
        test('should return an error if categoriesIds is undefined', () => {  
            const blogObj = {...updatedBlogDtoObj, categoriesIds: undefined} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds is not an array', () => {  
            const blogObj = {...updatedBlogDtoObj, categoriesIds: 'hello'} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.ARRAY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds is an empty array', () => {  
            const blogObj = {...updatedBlogDtoObj, categoriesIds: []};
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.EMPTY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds does not include numbers', () => {  
            const blogObj = {...updatedBlogDtoObj, categoriesIds: ['hello', [], false]} as unknown as IUpdateBlogDto;
            const [errorMessages, message, dto] = UpdateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.NUMBER}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });
});