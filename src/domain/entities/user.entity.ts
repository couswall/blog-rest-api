import { ICreateUser } from "@src/domain/dtos/interfaces";

export interface ICreateUserEntity extends ICreateUser{
    id: number;
}

export class UserEntity {

    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string,
        public usernameUpdatedAt: Date | null,
    ){};
    
    public static fromObject(object: ICreateUserEntity){
        const {username, password, email, id, usernameUpdatedAt} = object;

        return new UserEntity(id, username, email, password, usernameUpdatedAt);
    }

    public toJSON(){
        return{
            id: this.id,
            username: this.username,
            email: this.email,
        }
    }
}