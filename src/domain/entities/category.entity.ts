import { BlogEntity } from "@/domain/entities/blog.entity";
import { ICreateCategoryEntity } from "@src/domain/interfaces/entities.interface";

export class CategoryEntity {
    constructor(
        public id: number,
        public name: string,
        public blogs: BlogEntity[],
        public deletedAt: Date | null,
    ){};

    public static fromObject(object: ICreateCategoryEntity): CategoryEntity{
        const {id, name, blogs, deletedAt} = object;
        return new CategoryEntity(id, name, blogs, deletedAt);
    }
}