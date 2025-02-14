import jwt from 'jsonwebtoken';
import {JwtAdapter} from '@config/jwt.adapter';
import { CustomError } from '@/domain/errors/custom.error';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('jwt.adapter tests', () => { 
    const payload = {id: 1,username: 'Test user'};
    const mockToken = 'mocked_jwt_token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateJWT() should return a token', async () => { 
        (jwt.sign as jest.Mock).mockImplementation(
            (payload, secret, options, callback) => callback(null, mockToken)
        );

        const token = await JwtAdapter.generateJWT(payload);

        expect(jwt.sign).toHaveBeenCalled();
        expect(token).toBe(mockToken);
    });

    test('generateJWT() should return an error if token generation fails', async () => { 
        (jwt.sign as jest.Mock).mockImplementation(
            (payload, secret, options, callback) => callback(new Error('Token error'), null)
        );

        await expect(JwtAdapter.generateJWT(payload))
            .rejects.toThrow(new CustomError('Cannot generate token', 500))
    });

    test('verifyJWT() should return decoded payload', async () => { 
        (jwt.verify as jest.Mock).mockImplementation(
            (token, secret, callback) => callback(null, payload)
        );
        
        const decoded = await JwtAdapter.verifyJWT(mockToken);

        expect(jwt.verify).toHaveBeenCalled();
        expect(decoded).toEqual(payload);
    });

    test('verifyJWT() should throw an error if token is invalid', async () => { 
        (jwt.verify as jest.Mock).mockImplementation(
            (token, secret, callback) => callback(new Error('Invalid token'), null)
        );

        await expect(JwtAdapter.verifyJWT(mockToken))
            .rejects.toThrow(new CustomError('Invalid or expired token', 401));
        
        expect(jwt.verify).toHaveBeenCalled();
    });
});