import { ICreateUser } from "@src/domain/dtos/interfaces";
import { BlogEntity, CommentEntity, LikeEntity } from "@/domain/entities";

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
        public deletedAt: Date | null,
        public blogs: BlogEntity[],
        public comments: CommentEntity[],
        public likes: LikeEntity[],
    ){};
    
    public static fromObject(object: ICreateUserEntity){
        return new UserEntity(
            object.id, 
            object.username, 
            object.email, 
            object.password, 
            object.usernameUpdatedAt,
            object.deletedAt,
            object.blogs ?? [],
            object.comments ?? [],
            object.likes ?? [],
        );
    }

    public toJSON(){
        return{
            id: this.id,
            username: this.username,
            email: this.email,
        }
    }
}