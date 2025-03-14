import { CATEGORY_ERRORS } from "@/domain/constants/dto/category.constants";
import { CreateCategoryDto } from "@/domain/dtos";
import { ICreateCategoryDto } from "@/domain/interfaces/category-dto.interface";

describe('create-category.dto tests', () => {
    test('should create a CreateCategoryDto instance when a valid object is provided ', () => {  
        const categoryObj = {name: 'Category test'};
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateCategoryDto);
    });
    test('should return an error if category name is undefined', () => {  
        const categoryObj = {name: undefined} as unknown as ICreateCategoryDto;
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.REQUIRED);
        expect(dto).toBeUndefined();
    });
    test('should return an error if category name is not a string', () => {  
        const categoryObj = {name: 1234} as unknown as ICreateCategoryDto;
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.STRING);
        expect(dto).toBeUndefined();
    });
    test('should return an error when category name contains only blank spaces', () => {  
        const categoryObj = {name: '   '};
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.BLANK_SPACES);
        expect(dto).toBeUndefined();
    });
    test('should return an error when category name is an empty string', () => {  
        const categoryObj = {name: ''};
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.REQUIRED);
        expect(dto).toBeUndefined();
    });
    test('should return an error when category name length is less than 3 characters', () => {  
        const categoryObj = {name: 'ab'};
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.MIN_LENGTH);
        expect(dto).toBeUndefined();
    });
    test('should return an error when category name length is more than 30 characters', () => {  
        const categoryObj = {name: 'This is a category name that includes more than thirty characters, hopefully'};
        const [errorMsg, dto] = CreateCategoryDto.create(categoryObj);

        expect(errorMsg).toBe(CATEGORY_ERRORS.MAX_LENGTH);
        expect(dto).toBeUndefined();
    });

});