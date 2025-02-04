import { ICreateUser } from "../dtos/interfaces";

export interface ICreateUserEntity extends ICreateUser{
    id: number;
}

export class UserEntity {

    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string,
    ){};
    
    public static fromObject(object: ICreateUserEntity){
        const {username, password, email, id} = object;

        return new UserEntity(id, username, email, password);
    }

    public toJSON(){
        return{
            id: this.id,
            username: this.username,
            emai: this.email,
        }
    }
}