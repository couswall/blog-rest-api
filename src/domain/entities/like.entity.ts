import { ILikeEntityFromObject } from "@/domain/interfaces/entities.interface";

export class LikeEntity {
    constructor(
        public id: number,
        public userId: number,
        public blogId: number,
    ){};

    public static fromObject(likeObject: ILikeEntityFromObject): LikeEntity{
        return new LikeEntity(
            likeObject.id,
            likeObject.userId,
            likeObject.blogId,
        );
    };

    public toJSON(){
        return{
            id: this.id,
            blogId: this.blogId,
            userId: this.userId
        };
    }
}