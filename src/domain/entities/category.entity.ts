import { BlogEntity } from "@/domain/entities/blog.entity";

export class CategoryEntity {
    constructor(
        public id: number,
        public name: string,
        public blogs: BlogEntity[],
        public deletedAt: Date | null,
    ){}
}