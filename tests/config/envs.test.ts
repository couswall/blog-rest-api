import {envs} from '@config/envs';

describe('envs.test ', () => { 

    test('should return envs options', () => { 
        expect(envs).toEqual({
            PORT: 3001,
            PUBLIC_PATH: 'public',
            JWT_SECRET_SEED: expect.any(String)
        })
    });

    test('should return an error if any env is not found', async () => { 
        jest.resetModules();
        process.env.PORT = 'abcde';

        try {
            await import('../../src/config/envs');
            expect(true).toBeFalsy();
        } catch (error) {
            expect(`${error}`).toContain('"PORT" should be a valid integer');
        }
    });
})