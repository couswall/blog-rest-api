import { envs } from '@/config/envs';
import { Server } from '@presentation/server';

jest.mock('@presentation/server');

describe('app.ts tests', () => { 

    test('should call an instance of Server', async () => { 

        await import('@src/app');
        
        expect(Server).toHaveBeenCalled();
        expect(Server).toHaveBeenCalledWith({
            port: envs.PORT,
            publicPath: envs.PUBLIC_PATH,
            routes: expect.any(Function),
        });
        expect(Server.prototype.start).toHaveBeenCalled();
    });

});