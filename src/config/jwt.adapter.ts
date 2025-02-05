import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '@config/envs';
import { CustomError } from '@/domain/errors/custom.error';

interface IJwtPayload {
    id: number;
    username: string;
}

export class JwtAdapter {
    
    static async generateJWT(payload: IJwtPayload): Promise<string>{
        return new Promise((resolve, reject) => {            
            jwt.sign(payload, envs.JWT_SECRET_SEED, {expiresIn: '2h'}, (err, token) => {
                if(err || !token) return reject(new CustomError('Cannot generate token', 500));
                resolve(token);
            });
        })
    };

    static async verifyJWT(token: string): Promise<IJwtPayload>{
        return new Promise((resolve, reject) => {
            jwt.verify(token, envs.JWT_SECRET_SEED, (err, decoded) => {
                if(err) return reject(new CustomError('Invalid or expired token', 401));
                resolve(decoded as IJwtPayload);
            });
        });
    }
};