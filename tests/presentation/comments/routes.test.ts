import request from "supertest";
import { prisma } from "@/data/postgres";
import { JwtAdapter } from "@/config/jwt.adapter";
import { testServer } from "tests/test-server";
import { mockCategories, mockUser, verifyToken, newBlogRequest, commentDtoObj, commentObj } from "tests/fixtures";
import { COMMENT_RESPONSE } from "@/infrastructure/constants/comment.constants";
import { JWT_ADAPTER } from "@/config/constants";
import { CustomError } from "@/domain/errors/custom.error";
import { ERRORS } from "@/domain/constants/dto/comment.constants";

jest.mock('@/config/jwt.adapter', () => ({
    JwtAdapter: {
        verifyJWT: jest.fn(),
    }
}));

describe('comments routes test', () => {  
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
    });
    
    describe('/ Create Comment endpoint', () => {  
        test('should return a 201 status and a new comment', async () => {  
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

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const commentRequest = {
                authorId: user.id,
                blogId: blog.id,
                content: commentDtoObj.content,
            };

            const {body} = await request(testServer.app)
                .post('/api/comments/')
                .set('token', 'any-token')
                .send(commentRequest)
                .expect(201)
            
            expect(body.success).toBeTruthy();
            expect(body.message).toBe(COMMENT_RESPONSE.SUCCESS.CREATE);
            expect(body.data).toEqual({
                id: expect.any(Number),
                authorId: blog.authorId,
                blogId: blog.id,
                content: commentDtoObj.content,
                createdAt: expect.any(String)
            });
        });
        test('should throw a 400 error status if user with provided authorId does not exist', async () => {  
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post('/api/comments/')
                .set('token', 'any-token')
                .send(commentDtoObj)
                .expect(400)
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`User with authorId ${commentDtoObj.authorId} does not exist`);
        });
        test('should throw a 400 error status if blog with provided blogId does not exist', async () => {  
            const user = await prisma.user.create({data: mockUser});

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post('/api/comments/')
                .set('token', 'any-token')
                .send({...commentDtoObj, authorId: user.id})
                .expect(400)
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`Blog with blogId ${commentDtoObj.blogId} does not exist`);
        });
        describe('Token validation', () => {  
            test('should throw a 401 error status if token is not sent', async () => {  
                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .send(commentDtoObj)
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
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send(commentDtoObj)
                    .expect(401);
                
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
        describe('authorId validation', () => {  
            test('should throw a 400 error if authorId is not sent', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, authorId: undefined})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.AUTHOR_ID.REQUIRED);
            });
            test('should throw a 400 error if authorId is not a number', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
 
                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, authorId: 'abcde'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.AUTHOR_ID.NUMBER);
            });
        });
        describe('blogId validation', () => {  
            test('should throw a 400 error if blogId is not sent', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, blogId: undefined})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.BLOG_ID.REQUIRED);
            });
            test('should throw a 400 error if blogId is not a number', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, blogId: 'abcde'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.BLOG_ID.NUMBER);
            });
        });
        describe('content validation', () => {  
            test('should throw a 400 error if content is not sent', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, content: undefined})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.COMMENT.MANDATORY);
            });
            test('should throw a 400 error if content is an empty string', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, content: ''})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.COMMENT.MANDATORY);
            });
            test('should throw a 400 error if content only contains blank spaces', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, content: ' '.repeat(10)})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.COMMENT.BLANK_SPACES);
            });
            test('should throw a 400 error if content length is less than 2 characters long', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, content: 'a'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.COMMENT.MIN_LENGHT);
            });
            test('should throw a 400 error if content length is more than 40 characters long', async () => {
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

                const {body} = await request(testServer.app)
                    .post('/api/comments/')
                    .set('token', 'any-token')
                    .send({...commentDtoObj, content: 'This is a content with more than 40 characters'.repeat(41)})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERRORS.COMMENT.MAX_LENGHT);
            });
        });
    });

    describe('/:commentId Delete Comment endpoint tests', () => {  
        test('should return a 200 status and deleted comment data', async () => {
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
            const newComment = await prisma.comment.create({data: {
                authorId: user.id,
                blogId: blog.id,
                content: commentDtoObj.content
            }});

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/comments/deleteComment/${newComment.id}`)
                .set('token', 'any-token')
                .expect(200);
            
            expect(body).toEqual({
                success: true,
                message: COMMENT_RESPONSE.SUCCESS.DELETE,
                data: {
                    id: newComment.id,
                    deletedAt: expect.any(String),
                    content: newComment.content,
                }
            })
        });
        test('should thorw a 400 error status if commentId is not a number', async () => {
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/comments/deleteComment/abcd`)
                .set('token', 'any-token')
                .expect(400);
            
            expect(body).toEqual({
                success: false,
                error: {message: COMMENT_RESPONSE.ERRORS.DELETE}
            });
        });
        test('should throw a 400 error status if comment with provided commentId does not exist', async () => {
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/comments/deleteComment/${commentObj.id}`)
                .set('token', 'any-token')
                .expect(400);
            
            expect(body).toEqual({
                success: false,
                error: {message: `Comment with id ${commentObj.id} does not exist`}
            });
        });

        describe('Token validation', () => {
            test('should throw a 401 error status if token is not sent', async () => {  
                const {body} = await request(testServer.app)
                    .put(`/api/comments/deleteComment/${commentObj.id}`)
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
                    .put(`/api/comments/deleteComment/${commentObj.id}`)
                    .set('token', 'any-token')
                    .expect(401);
                
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
    });
});