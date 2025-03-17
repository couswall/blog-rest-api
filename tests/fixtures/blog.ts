import { CategoryEntity, UserEntity } from "@/domain/entities";
import { existingCategories } from "tests/fixtures/category";
import { userObjPrisma } from "tests/fixtures/user";

export const newBlogRequest = {
    title: 'New blog',
    content: 'This is a blog content with more than 15 characters long, bla bla bla bla bla',
    categoriesIds: [1,2,3,4],
};

export const newBlogPrisma = {
    id: 1, 
    title: 'Testing new blog',
    content: 'This is the content of a new blog created by prisma',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    authorId: 1,
    categories: existingCategories,
    author: userObjPrisma,
};

export const blogObj = {
    ...newBlogPrisma,
    author: UserEntity.fromObject(userObjPrisma),
    categories: existingCategories.map(category => CategoryEntity.fromObject(category))
};