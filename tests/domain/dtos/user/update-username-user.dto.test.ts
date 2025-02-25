import { ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { ERROR_MESSAGES, FIELDS, ID_ERROR_MSG } from "@/domain/constants/dto/user.constants";
import { UpdateUsernameDto } from "@/domain/dtos";


describe('update-username-user.dto tests', () => {  

    const updateUsernameObj = {id: 1, username: 'user_test'}

    test('should create a UpdateUsernameDto instance when a valid object is provided', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create(updateUsernameObj);

        expect(errors).toBeUndefined();
        expect(message).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateUsernameDto);
    });

    test('should return an error if id is not a number', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            id: 'dsdsds' as unknown as number,
        });

        expect(errors).toBeUndefined();
        expect(message).toBe(ID_ERROR_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if id is not sent', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            id: undefined as unknown as number,
        });

        expect(errors).toBeUndefined();
        expect(message).toBe(ID_ERROR_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username is not sent', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: undefined as unknown as string,
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username is not a string', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: [] as unknown as string,
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username contains only blank spaces', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: '           ',
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.BLANK_SPACES}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username length is more than 30 characters', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: 'sdafafafafgagagaaaaaaaaaaaaaaaaaaagaagaggagagagaggssssssssssssssssssag',
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username contains spaces', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: 'test user',
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });

    test('should return an error if username format is invalid', () => {  
        const [errors, message, dto] = UpdateUsernameDto.create({
            ...updateUsernameObj,
            username: '1test_user#',
        });

        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT}
        ]));
        expect(message).toBe(ERROR_VALIDATION_MSG);
        expect(dto).toBeUndefined();
    });




});