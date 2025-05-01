import { DTO_ERRORS } from "@/domain/constants/dto/like.constants";
import { CreateDeleteLikeDto } from "@/domain/dtos";
import { ICreateDeleteLikeDto } from "@/domain/interfaces/like.dto.interface";
import { createDeleteLikeDtoObj } from "tests/fixtures";

describe('create-delete-like.dto tests', () => {
    test('should create a CreateDeleteLikeDto instance when a valid object is provided ', () => {
        const [errorMsg, dto] = CreateDeleteLikeDto.create(createDeleteLikeDtoObj);

        expect(errorMsg).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateDeleteLikeDto);
    });
    test('should throw an error when blogId is not provided', () => {
        const dtoObj = {...createDeleteLikeDtoObj, blogId: undefined} as unknown as ICreateDeleteLikeDto;
        const [errorMsg, dto] = CreateDeleteLikeDto.create(dtoObj);

        expect(errorMsg).toBe(DTO_ERRORS.CREATE_DELETE.BLOG_ID.REQUIRED);
        expect(dto).toBeUndefined();
    });
    test('should throw an error when blogId is not a number', () => {
        const dtoObj = {...createDeleteLikeDtoObj, blogId: 'abcd'} as unknown as ICreateDeleteLikeDto;
        const [errorMsg, dto] = CreateDeleteLikeDto.create(dtoObj);

        expect(errorMsg).toBe(DTO_ERRORS.CREATE_DELETE.BLOG_ID.NUMBER);
        expect(dto).toBeUndefined();
    });
    test('should throw an error when userId is not provided', () => {
        const dtoObj = {...createDeleteLikeDtoObj, userId: undefined} as unknown as ICreateDeleteLikeDto;
        const [errorMsg, dto] = CreateDeleteLikeDto.create(dtoObj);

        expect(errorMsg).toBe(DTO_ERRORS.CREATE_DELETE.USER_ID.REQUIRED);
        expect(dto).toBeUndefined();
    });
    test('should throw an error when userId is not a number', () => {
        const dtoObj = {...createDeleteLikeDtoObj, userId: 'abcd'} as unknown as ICreateDeleteLikeDto;
        const [errorMsg, dto] = CreateDeleteLikeDto.create(dtoObj);

        expect(errorMsg).toBe(DTO_ERRORS.CREATE_DELETE.USER_ID.NUMBER);
        expect(dto).toBeUndefined();
    });
});