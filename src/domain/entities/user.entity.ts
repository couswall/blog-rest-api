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
        const {username, password, email, id, usernameUpdatedAt, deletedAt, blogs, comments, likes} = object;

        return new UserEntity(
            id, 
            username, 
            email, 
            password, 
            usernameUpdatedAt,
            deletedAt,
            blogs,
            comments,
            likes,
        );
    }

    public toJSON(){
        return{
            id: this.id,
            username: this.username,
            email: this.email,
            blogs: this.blogs,
        }
    }
}