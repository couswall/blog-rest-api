import { CREATE_BLOG, ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { CreateBlogDto } from "@/domain/dtos";
import { ICreateBlogDto } from "@/domain/interfaces/blogDto.interface";
import { newBlogRequest } from "tests/fixtures";


describe('create-blog.ts tests', () => {

    const newBlogDtoObj = {...newBlogRequest, authorId: 1};

    test('should create a CreateBlogDto instance when a valid object is provided', () => {  
        const [errorMessages, message, dto] = CreateBlogDto.create(newBlogDtoObj);

        expect(errorMessages).toBeUndefined();
        expect(message).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateBlogDto);
    });

    describe('ID validation', () => {  
        test('should return an error if authorId is not provided', () => {  
            const blogObj = {...newBlogRequest} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toBeUndefined();
            expect(message).toBe(CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER);
            expect(dto).toBeUndefined();
        });
        test('should return an error if authorId is not a string', () => {  
            const blogObj = {...newBlogDtoObj, authorId: 'abcd'} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toBeUndefined();
            expect(message).toBe(CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER);
            expect(dto).toBeUndefined();
        });
    });

    describe('title validation', () => {  
        test('should return an error if title is not sent', () => {  
            const blogObj = {...newBlogDtoObj, title: undefined} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title is not a string', () => {  
            const blogObj = {...newBlogDtoObj, title: 12345} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.STRING}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title length is less than 5 characters', () => {  
            const blogObj = {...newBlogDtoObj, title: 'ab'};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MIN_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title contains only blank spaces', () => {  
            const blogObj = {...newBlogDtoObj, title: '               '};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.BLANK_SPACES}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title length is more than 150 characters', () => {  
            const blogObj = {...newBlogDtoObj, title: 'Title content'.repeat(151)};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MAX_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if title is an empty string', () => {  
            const blogObj = {...newBlogDtoObj, title: ''};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });

    describe('content blog validation', () => {  
        test('should return an error if content is not sent', () => {  
            const blogObj = {...newBlogDtoObj, content: undefined} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content is not a string', () => {  
            const blogObj = {...newBlogDtoObj, content: 12345} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.STRING}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content is an empty string', () => {  
            const blogObj = {...newBlogDtoObj, content: ''} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content contains only blank spaces', () => {  
            const blogObj = {...newBlogDtoObj, content: '                                 '};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.BLANK_SPACES}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content length is less than 5 characters', () => {  
            const blogObj = {...newBlogDtoObj, content: 'abcd'};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MIN_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if content length is more than 500 characters', () => {  
            const blogObj = {...newBlogDtoObj, content: 'Blog content'.repeat(500)};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MAX_LENGTH}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });

    describe('categoriesIds validation', () => {  
        test('should return an error if categoriesIds is undefined', () => {  
            const blogObj = {...newBlogDtoObj, categoriesIds: undefined} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.MANDATORY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds is not an array', () => {  
            const blogObj = {...newBlogDtoObj, categoriesIds: 'hello'} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.ARRAY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds is an empty array', () => {  
            const blogObj = {...newBlogDtoObj, categoriesIds: []};
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.EMPTY}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if categoriesIds does not include numbers', () => {  
            const blogObj = {...newBlogDtoObj, categoriesIds: ['hello', [], false]} as unknown as ICreateBlogDto;
            const [errorMessages, message, dto] = CreateBlogDto.create(blogObj);
    
            expect(errorMessages).toEqual([
                {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.NUMBER}
            ]);
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });
});