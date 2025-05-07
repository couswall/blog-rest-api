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

export const likeObjPrisma = {
    ...createDeleteLikeDtoObj,
    id: 1,
};

export const likesByBlogIdPrisma = [
    {
        id: 1,
        user: {id: 1, username: 'test_1'},
    },
    {
        id: 2,
        user: {id: 2, username: 'test_2'},
    },
    {
        id: 3,
        user: {id: 3, username: 'test_3'},
    },
];

export const likesByUserIdPrisma = [
    {
        id: 1,
        blog: {
            id: 1,
            title: 'Blog testing 1',
            author: {id: 1, username: 'test_1'},
        }
    },
    {
        id: 8,
        blog: {
            id: 8,
            title: 'Blog testing 8',
            author: {id: 8, username: 'test_8'},
        },
    },
];