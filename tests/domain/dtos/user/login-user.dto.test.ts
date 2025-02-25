import { ERROR_MESSAGES, FIELDS } from "@/domain/constants/dto/user.constants";
import { LoginUserDto } from "@/domain/dtos";


describe('login-user.dto test', () => { 
    const userCredentials = {
        username: 'test_user',
        password: '45passWord.'
    };

    test('should create a LoginDto instance when a valid object is provided', () => {  
        const [errors, dto] = LoginUserDto.create(userCredentials);

        expect(errors).toBeUndefined();
        expect(dto).toBeInstanceOf(LoginUserDto);
    });

    test('should return an error if username is not sent', () => {  
        const [errors, dto] = LoginUserDto.create({
            ...userCredentials,
            username: undefined as unknown as string,
        });

        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED}
        ]));
    });

    test('should return an error if password is not sent', () => {  
        const [errors, dto] = LoginUserDto.create({
            ...userCredentials,
            password: undefined as unknown as string,
        });

        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED}
        ]));
    });

    test('should return an error if username is not a string', () => { 
        const [errors, dto] = LoginUserDto.create({
            ...userCredentials,
            username: [] as unknown as string,
        });

        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING}
        ]));
    });
    
    test('should return an error if password is not a string', () => { 
        const [errors, dto] = LoginUserDto.create({
            ...userCredentials,
            password: 41 as unknown as string,
        });
        
        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.STRING}
        ]));
    });

    test('should return an error if username is an empty string', () => {  
        const [errors, dto] = LoginUserDto.create({
            ...userCredentials,
            username: '',
        });

        expect(dto).toBeUndefined();
        expect(errors).toEqual(expect.arrayContaining([
            {field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED}
        ]));
    });

});