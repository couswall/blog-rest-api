import request from 'supertest';
import { JwtAdapter } from "@/config/jwt.adapter";
import { prisma } from "@/data/postgres";
import { testServer } from "tests/test-server";
import { CustomError } from '@/domain/errors/custom.error';
import { createDeleteLikeDtoObj, mockCategories, mockUser, newBlogRequest, verifyToken } from "tests/fixtures";
import { LIKE_RESPONSE } from '@/infrastructure/constants/like.constants';
import { JWT_ADAPTER } from '@/config/constants';
import { DTO_ERRORS } from '@/domain/constants/dto/like.constants';

jest.mock('@/config/jwt.adapter', () => ({
    JwtAdapter: {
        verifyJWT: jest.fn(),
    }
}));

describe('likes routes test', () => {
    beforeAll(async() => {
        await testServer.start();
    });
    afterAll(() => {
        testServer.close();
    });
    beforeEach(async() => {
        await prisma.user.deleteMany();
        await prisma.blog.deleteMany();
        await prisma.category.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.like.deleteMany();
    });

    describe('/toggleLike Create/Delete like', () => {
        test('should return a 200 status and create a like if any like exist', async () => {
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});
            const blog = await prisma.blog.create({
                data: {
                    title: newBlogRequest.title,
                    content: newBlogRequest.content,
                    authorId: user.id,
                    categories: {
                        connect: categories.map(category => ({id: category.id}))
                    }
                },
            });

            const likeRequest = {blogId: blog.id, userId: user.id};

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post('/api/likes/toggleLike')
                .set('token', 'any-token')
                .send(likeRequest)
                .expect(200)

            expect(body).toEqual({
                success: true,
                message: LIKE_RESPONSE.SUCCESS.TOGGLE,
                data: expect.any(Object)
            });
        });
        test('should return a 200 status and delete existing like', async () => {
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});
            const blog = await prisma.blog.create({
                data: {
                    title: newBlogRequest.title,
                    content: newBlogRequest.content,
                    authorId: user.id,
                    categories: {
                        connect: categories.map(category => ({id: category.id}))
                    }
                },
            });
            await prisma.like.create({
                data: {blogId: blog.id, userId: user.id}
            });

            const likeRequest = {blogId: blog.id, userId: user.id};

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post('/api/likes/toggleLike')
                .set('token', 'any-token')
                .send(likeRequest)
                .expect(200)
                
                expect(body).toEqual({
                    success: true,
                message: LIKE_RESPONSE.SUCCESS.TOGGLE,
                data: {
                    id: expect.any(Number),
                    userId: expect.any(Number),
                    blogId: expect.any(Number),
                }
            });
        });
        test('should thorw a 400 error status if user with provided id does not exist', async () => {
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post('/api/likes/toggleLike')
                .set('token', 'any-token')
                .send(createDeleteLikeDtoObj)
                .expect(400)
                
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`User with id ${createDeleteLikeDtoObj.userId} does not exist`);
        });
        test("should thorw a 400 error status if blog with provided id does not exist", async () => {
            const user = await prisma.user.create({data: mockUser});
    
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
        
            const { body } = await request(testServer.app)
                .post("/api/likes/toggleLike")
                .set("token", "any-token")
                .send({...createDeleteLikeDtoObj, userId: user.id})
                .expect(400);
        
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`Blog with id ${createDeleteLikeDtoObj.blogId} does not exist`);
        });
        describe('Token validation', () => {
            test('should throw a 401 error status if token is not sent', async () => {
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .send(createDeleteLikeDtoObj)
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.NO_TOKEN},
                });
            });
            test('should throw a 401 error status if token is invalid', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .set('token', 'any-token')
                    .send(createDeleteLikeDtoObj)
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
        describe('userId validation', () => {
            test('should throw a 400 error status if userId is not sent', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
    
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .set('token', 'any-token')
                    .send({blogId: 1})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(DTO_ERRORS.CREATE_DELETE.USER_ID.REQUIRED);
            });
            test('should throw a 400 error status if userId is not a number', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
    
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .set('token', 'any-token')
                    .send({blogId: 1, userId: 'abcd'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(DTO_ERRORS.CREATE_DELETE.USER_ID.NUMBER);
            });
        });
        describe('blogId validation', () => {
            test('should throw a 400 error status if blogId is not sent', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
    
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .set('token', 'any-token')
                    .send({userId: 1})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(DTO_ERRORS.CREATE_DELETE.BLOG_ID.REQUIRED);
            });
            test('should throw a 400 error status if blogId is not a number', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
    
                const {body} = await request(testServer.app)
                    .post('/api/likes/toggleLike')
                    .set('token', 'any-token')
                    .send({blogId: 'abc', userId: 1})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(DTO_ERRORS.CREATE_DELETE.BLOG_ID.NUMBER);
            });
        });
    });
        
    describe('/getLikesByBlogId - Get likes by blog Id endpoint', () => {
        test('should return a 200 status and an array of likes', async () => {
            const userOne = await prisma.user.create({data: mockUser});
            const userTwo = await prisma.user.create({
                data: {
                    ...mockUser, 
                    email: 'test_user1@goolge.com',
                    username: 'user_2',
                },
            });
            const userThree = await prisma.user.create({
                data: {
                    ...mockUser, 
                    email: 'test_user3@goolge.com',
                    username: 'user_3',
                },
            });
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});
            const blog = await prisma.blog.create({
                data: {
                    title: newBlogRequest.title,
                    content: newBlogRequest.content,
                    authorId: userOne.id,
                    categories: {
                        connect: categories.map(category => ({id: category.id}))
                    }
                },
            });

            await prisma.like.createMany({data: [
                {blogId: blog.id, userId: userTwo.id},
                {blogId: blog.id, userId: userThree.id},
            ]});

            const {body} = await request(testServer.app)
                .get(`/api/likes/getLikesByBlogId/${blog.id}`)
                .expect(200)

            expect(body).toEqual({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_BLOGID} ${blog.id}`,
                data: expect.any(Array),
            });
        });
        test('should throw a 400 error status if blog with provided ID does not exist', async () => {
            const blogId = 1;

            const {body} = await request(testServer.app)
                .get(`/api/likes/getLikesByBlogId/${blogId}`)
                .expect(400)

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`Blog with id ${blogId} does not exist`);
        });
        describe('blogId validation', () => {
            test('should throw a 400 error status if blogId is not a number', async () => {    
                const {body} = await request(testServer.app)
                    .get(`/api/likes/getLikesByBlogId/abcd`)
                    .expect(400)
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(LIKE_RESPONSE.ERRORS.LIKES_BY_BLOGID.NUMBER);
            });
        });
    });

    describe('/getLikesByUserId - Get likes by userId endpoint', () => {
        test('should return a 200 status and an array of likes', async () => {
            const userOne = await prisma.user.create({data: mockUser});
            const userTwo = await prisma.user.create({
                data: {
                    ...mockUser, 
                    email: 'test_user1@goolge.com',
                    username: 'user_2',
                },
            });
            const userThree = await prisma.user.create({
                data: {
                    ...mockUser, 
                    email: 'test_user3@goolge.com',
                    username: 'user_3',
                },
            });
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});
            const blogOne = await prisma.blog.create({
                data: {
                    title: newBlogRequest.title,
                    content: newBlogRequest.content,
                    authorId: userOne.id,
                    categories: {
                        connect: categories.map(category => ({id: category.id}))
                    }
                },
            });
            const blogTwo = await prisma.blog.create({
                data: {
                    title: 'Testing blog 2',
                    content: 'Content of testing blog two 22',
                    authorId: userTwo.id,
                    categories: {
                        connect: categories.map(category => ({id: category.id}))
                    }
                },
            });

            await prisma.like.createMany({data: [
                {blogId: blogOne.id, userId: userThree.id},
                {blogId: blogTwo.id, userId: userThree.id},
            ]});

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .get(`/api/likes/getLikesByUserId/${userThree.id}`)
                .set('token', 'any-token')
                .expect(200);

            expect(body).toEqual({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_USERID} ${userThree.id}`,
                data: expect.any(Array),
            });
        });
        test('should throw a 400 error status if user with provided ID does not exist', async () => {
            const userId = 1;

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .get(`/api/likes/getLikesByUserId/${userId}`)
                .set('token', 'any-token')
                .expect(400);

            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`User with id ${userId} does not exist`);
        });
        describe('Token validation', () => {
            test('should throw a 401 error status if token is not sent', async () => {
                const {body} = await request(testServer.app)
                    .get('/api/likes/getLikesByUserId/1')
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.NO_TOKEN},
                });
            });
            test('should throw a 401 error status if token is invalid', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .get('/api/likes/getLikesByUserId/1')
                    .set('token', 'any-token')
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
        describe('blogId validation', () => {
            test('should throw a 400 error status if blogId is not a number', async () => {    
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .get(`/api/likes/getLikesByUserId/abcd`)
                    .set('token', 'any-token')
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(LIKE_RESPONSE.ERRORS.LIKES_BY_USERID.NUMBER);
            });
        });
    });
});