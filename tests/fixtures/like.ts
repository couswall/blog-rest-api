import { LikeEntity } from "@/domain/entities";

export const likeEntity = new LikeEntity(1, 1, 1);

export const createDeleteLikeDtoObj = {
    userId: 1,
    blogId: 2,
};

export const likesPrismaArray = [
    {id: 1, userId: 1, blogId: 1},
    {id: 2, userId: 2, blogId: 2},
    {id: 3, userId: 3, blogId: 1},
]