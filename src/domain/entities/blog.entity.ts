import { UserEntity, CategoryEntity, CommentEntity, LikeEntity } from "@/domain/entities";
import { ICreateBlogEntity } from "@/domain/interfaces/entities.interface";

export class BlogEntity {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
        public authorId: number,
        public author: UserEntity,
        public categories: CategoryEntity[],
        public comments: CommentEntity[],
        public likes: LikeEntity[],
    ){};

    public static fromObject(object: ICreateBlogEntity): BlogEntity{
        return new BlogEntity(
            object.id,
            object.title,
            object.content,
            object.createdAt,
            object.updatedAt,
            object.deletedAt,
            object.authorId,
            object.author,
            object.categories,
            object.comments,
            object.likes,
        );
    };

    public toJSON(){
        return{
            id: this.id,
            title: this.title,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            authorId: this.authorId,
            author: this.author,
            categories: this.categories,
            comments: this.comments,
            likes: this.likes,
        };
    };
}