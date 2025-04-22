import { ERRORS } from "@/domain/constants/dto/comment.constants";
import { CreateCommentDto } from "@/domain/dtos";
import { ICommentBase } from "@/domain/interfaces/comment.dto.interfaces";
import { commentDtoObj } from "tests/fixtures";

describe('CreateCommentDto tests', () => {  
    test('should create a CreateCommentDto instance when a valid object is provided', () => {  
        const [error, dto] = CreateCommentDto.create(commentDtoObj);

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateCommentDto);
    });
    
    describe('authorId validation', () => {  
        test('should throw an error if authorId was not sent', () => {  
            const commentObj = {...commentDtoObj, authorId: undefined} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.AUTHOR_ID.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if authorId is not a number', () => {  
            const commentObj = {...commentDtoObj, authorId: 'abcdefghi'} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.AUTHOR_ID.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('blogId validation', () => {  
        test('should throw an error if blogId was not sent', () => {  
            const commentObj = {...commentDtoObj, blogId: undefined} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.BLOG_ID.REQUIRED);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if blogId is not a number', () => {  
            const commentObj = {...commentDtoObj, blogId: 'abcdefghi'} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.BLOG_ID.NUMBER);
            expect(dto).toBeUndefined();
        });
    });
    describe('content validation', () => {  
        test('should throw an error if content was not sent', () => {  
            const commentObj = {...commentDtoObj, content: undefined} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.COMMENT.MANDATORY);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if content is an empty string', () => {  
            const commentObj = {...commentDtoObj, content: ''} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.COMMENT.MANDATORY);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if content has only blank spaces', () => {  
            const commentObj = {...commentDtoObj, content: ' '.repeat(10)} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.COMMENT.BLANK_SPACES);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if content length is less than 2 characters long', () => {  
            const commentObj = {...commentDtoObj, content: 'a'} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.COMMENT.MIN_LENGHT);
            expect(dto).toBeUndefined();
        });
        test('should throw an error if content length is more than 40 characters long', () => {  
            const commentObj = {...commentDtoObj, content: 'Another comment content'.repeat(50)} as unknown as ICommentBase;
            const [error, dto] = CreateCommentDto.create(commentObj);

            expect(error).toBe(ERRORS.COMMENT.MAX_LENGHT);
            expect(dto).toBeUndefined();
        });
    });
});