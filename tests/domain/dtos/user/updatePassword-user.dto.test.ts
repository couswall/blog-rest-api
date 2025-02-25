import { ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { ID_ERROR_MSG, UPDATE_PASSWORD } from "@/domain/constants/dto/user.constants";
import { UpdatePasswordDto } from "@/domain/dtos";


describe('updatePassword-user.dto test', () => { 
    
    const updatePasswordObj = {
        id: 1,
        currentPassword: 'current_Password77$',
        newPassword: 'updaTed5.password',
        confirmPassword: 'updaTed5.password',
    };

    test('should return a UpdatedPasswordDto instance when a valid object is provided', () => {  
        const [errors, message, dto] = UpdatePasswordDto.create(updatePasswordObj);

        expect(errors).toBeUndefined();
        expect(message).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdatePasswordDto);
    });

    describe('Id validation', () => { 

        test('should return an error if id is not sent', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                id: undefined as unknown as number
            });

            expect(errors).toBeUndefined();
            expect(message).toBe(ID_ERROR_MSG);
            expect(dto).toBeUndefined();
        });

        test('should return an error if id is not a number', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                id: 'fsgsgsgs' as unknown as number
            });

            expect(errors).toBeUndefined();
            expect(message).toBe(ID_ERROR_MSG);
            expect(dto).toBeUndefined();
        });

    });

    describe('Current password validation', () => {  
        test('should return an error if current password is not sent', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                currentPassword: undefined as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.REQUIRED}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });

        test('should return an error if current password is not a string', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                currentPassword: [] as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.STRING}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });

    describe('New password validation', () => {  
        test('should return an error if new password is not sent', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: undefined as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.REQUIRED}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password is not a string', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: [] as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.STRING}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password length is less than 6 characters', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: 'Pa$4'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.MIN_LENGTH}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password does not include an uppercase letter', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: 'pa$4wordd'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.UPPERCASE}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password does not include a lowercase letter', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: 'PA$4WORD!!'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.LOWERCASE}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password does not include a number', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: 'PA$$wordddd!!'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.NUMBER}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if new password does not include a special character', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                newPassword: 'PAss123wordddd'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.SPECIAL_CHAR}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });

    describe('Confirm password validation', () => {  
        test('should return an error if confirm password is not sent', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                confirmPassword: undefined as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.REQUIRED}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if confirm password is not a string', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                confirmPassword: [] as unknown as string
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.STRING}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
        test('should return an error if confirm and new password do not match', () => {  
            const [errors, message, dto] = UpdatePasswordDto.create({
                ...updatePasswordObj,
                confirmPassword: 'Another_Password123'
            });

            expect(errors).toEqual(expect.arrayContaining([
                {field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.PASSWORDS_MATCH}
            ]));
            expect(message).toBe(ERROR_VALIDATION_MSG);
            expect(dto).toBeUndefined();
        });
    });

});