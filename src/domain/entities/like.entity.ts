import { BlogEntity, UserEntity } from "@/domain/entities";

export class LikeEntity {
    constructor(
        public id: number,
        public userId: number,
        public blogId: number,
        public blog: BlogEntity,
        public user: UserEntity,
    ){};
}