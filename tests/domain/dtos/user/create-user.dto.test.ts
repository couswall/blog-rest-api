import { ERROR_MESSAGES, FIELDS } from "@/domain/constants/dto/user.constants";
import { CreateUserDto } from "@/domain/dtos";
import { ICreateUser } from "@/domain/dtos/interfaces";

describe('create-user.dto tests', () => { 
    const userObj = {
        username: 'Testing44',
        email: 'testing@google.com',
        password: 'passwordTest31/',
        usernameUpdatedAt: null,
        deletedAt: null,
    };

    test('should create a CreateUserDto instance when valid object is provided', () => {  
        const [errors, dto] = CreateUserDto.create(userObj);

        expect(errors).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateUserDto);
    });

    test('should return errors if username, email and password are missing', () => {  
        const [errors, dto] = CreateUserDto.create({
            ...userObj,
            username: '',
            email: '',
            password: '',
        });

        expect(errors?.length).toBeGreaterThanOrEqual(1);
        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED},
            {field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.REQUIRED},
            {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED},
        ]));
    });

    test('should return errors if username, email, or password are not string', () => {  
        const [errors, dto] = CreateUserDto.create({
            ...userObj,
            username: 43432 as unknown as string,
            email: [] as unknown as string,
            password: 4111124332 as unknown as string,
        });

        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING},
            {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.STRING},
            {field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.STRING},
        ]));
    });

    describe('Username validation', () => { 
        test('should return an error if username is an empty string', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, username: ''});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED}]);
        });
        test('should return an error if username length is more than 30 characters', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, username: 'sdsdalsdjalsdkdladkadladdsaskdaldlsdjeldddcnclwceca'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH}]);
        });
        test('should return an error if username has blank spaces', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, username: 'Test Username'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual(expect.arrayContaining([
                {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES}
            ]));
        });
        test('should return an error if username format is invalid', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, username: 'test_user##'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT}]);
        });
    });

    describe('Email validation', () => {  
        test('should return an error if email is an empty string', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, email: ''});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.REQUIRED}]);
        });
        test('should return an error if email format is invalid', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, email: '@emailTesst.com'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.INVALID_FORMAT}]);
        });
    });

    describe('Password validation', () => {  
        test('should return an error if password is an empty string', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: ''});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED}]);
        });
        test('should return an error if password length is less than 6 characters', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: 'P1s$'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.MIN_LENGTH}]);
        });
        test('should return an error if password does not contain an uppercase letter', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: 'password1$'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.UPPERCASE}]);
        });
        test('should return an error if password does not contain an lowercase letter', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: 'PASSWORD9$'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.LOWERCASE}]);
        });
        test('should return an error if password does not contain a number', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: 'passWord$'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.NUMBER}]);
        });
        test('should return an error if password does not contain a special character', () => {  
            const [errors, dto] = CreateUserDto.create({...userObj, password: 'passWord99'});

            expect(dto).toBeUndefined();
            expect(errors).toEqual([{field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.SPECIAL_CHAR}]);
        });
    });
});