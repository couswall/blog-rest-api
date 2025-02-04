import bcrypt, { compareSync } from 'bcryptjs';

export class BcryptAdapter {

    static hash(password: string): string {
        const salt: string = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    };

    static compare(password: string, hash: string){
        return compareSync(password, hash);
    }
}