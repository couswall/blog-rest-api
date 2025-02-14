import { BcryptAdapter } from '@config/bcrypt.adapter';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
    genSaltSync: jest.fn(),
    hashSync: jest.fn(),
    compareSync: jest.fn(),
}))

describe('bycrypt.adapter tests', () => { 
    const password = 'Testing password';
    const mockedSalt = 'mockedSalt';
    const hashedPassword = 'HashedPassword';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('hash() should return a hashed password', () => { 
        (bcrypt.genSaltSync as jest.Mock).mockReturnValue(mockedSalt);
        (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);
        
        const result = BcryptAdapter.hash(password);

        expect(bcrypt.genSaltSync).toHaveBeenCalled();
        expect(bcrypt.hashSync).toHaveBeenCalledWith(password, mockedSalt)
        expect(result).toBe(hashedPassword)
    });

    test('compare() should return true for a matching password', () => { 
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

        const compareResult = BcryptAdapter.compare(password, hashedPassword);

        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
        expect(compareResult).toBeTruthy();
    });

    test('compare() should return false for a non-matching', () => { 
        const wrongHashedPassword = 'This is a wrong hashed password';
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        const compareResult = BcryptAdapter.compare(password, wrongHashedPassword);

        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, wrongHashedPassword);
        expect(compareResult).toBeFalsy();
    });
 })