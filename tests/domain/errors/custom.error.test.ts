import { CustomError } from "@/domain/errors/custom.error";

describe('custom.error.ts tests', () => {  

    test('should create a CustomError instance with given message and statusCode', () => {  
        const error = new CustomError('Testing error message', 401);

        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe('Testing error message');
        expect(error.statusCode).toBe(401);
    });

    test('CustomError should inherit instance of Error', () => { 
        const error = new CustomError('Testing error message', 401);

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('Error');
    });

    test('should set default status code to 400 if it is not provided', () => {  
        const error = new CustomError('Testing error message');

        expect(error.statusCode).toBe(400);
    });

    test('should correctly set statusCode', () => {  
        const statusCode = 403;
        const error = new CustomError('Testing error message', statusCode);

        expect(error.statusCode).toBe(statusCode);
    });

    test('should correctly set error message', () => {  
        const errorMessage = 'Unauthorized';
        const error = new CustomError(errorMessage, 401);

        expect(error.message).toBe(errorMessage);
    });
});
