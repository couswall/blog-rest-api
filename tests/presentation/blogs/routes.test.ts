import request from 'supertest';
import { JwtAdapter } from '@/config/jwt.adapter';
import { prisma } from '@/data/postgres';
import { testServer } from 'tests/test-server';
import { BLOG_RESPONSE } from '@/infrastructure/constants/blog.constants';
import { JWT_ADAPTER } from '@/config/constants';
import { CustomError } from '@/domain/errors/custom.error';
import { CREATE_BLOG, ERROR_VALIDATION_MSG } from '@/domain/constants/dto/blog.constants';
import { ID_ERROR_MSG } from '@/domain/constants/dto/user.constants';

jest.mock('@/config/jwt.adapter', () => ({
    JwtAdapter: {
        verifyJWT: jest.fn(),
    },
}));

describe('blog routes tests', () => {  

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async() => {
        await prisma.blog.deleteMany();
        await prisma.user.deleteMany();
        await prisma.category.deleteMany();
    });

    const verifyToken = {id: 1, username: 'Test_User'};
    const newBlog = {
        title: 'New blog',
        content: 'This is a blog content with more than 15 characters long, bla bla bla bla bla',
        categoriesIds: [1,2,3,4],
    };
    const mockUser = {
        username: 'test_user',
        email: 'user@google.com',
        password: 'Password1234##',
    };

    const mockCategories = [
        {name: 'SQL'},
        {name: 'Typescript'},
        {name: 'Javascript'}
    ];

    describe('/ Create blog endpoint', () => {  

        test('should return a 201 status code and a new blog', async () => {  
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
            
            const {body} = await request(testServer.app)
                .post(`/api/blogs/${user.id}`)
                .set('token', 'any-token')
                .send({...newBlog, categoriesIds: categories.map(category => category.id)})
                .expect(201)
                
            expect(body).toEqual({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.CREATE,
                data: {
                    blog: {
                        id: expect.any(Number),
                        title: expect.any(String),
                        author: expect.any(Object),
                        createdAt: expect.any(String),
                        categories: expect.any(Array),
                    }
                }
            });
        });

        test('should throw a 404 error if user with provided authorId does not exist', async () => {  
            const id = 1;
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
            
            const {body} = await request(testServer.app)
                .post(`/api/blogs/${id}`)
                .set('token', 'any-token')
                .send(newBlog)
                .expect(404);
            
            expect(body).toEqual({
                success: false,
                error: {message: `Author with id ${id} does not exist`}
            });
        });

        test('should throw a 400 error if authorId is not a number', async () => {  
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .post(`/api/blogs/abcd`)
                .set('token', 'any-token')
                .send(newBlog)
                .expect(400);
            
            expect(body).toEqual({
                success: false,
                error: {message: CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER}
            });
        });

        test('should throw a 400 status error if one of the categoriesIds is not valid', async () => {  
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany({where: {deletedAt: null}});

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
            
            const {body} = await request(testServer.app)
                .post(`/api/blogs/${user.id}`)
                .set('token', 'any-token')
                .send({...newBlog, categoriesIds: [categories[0].id, categories[1].id, 1, 3]})
                .expect(400)
                
            expect(body).toEqual({
                success: false,
                error: {message: BLOG_RESPONSE.ERRORS.EXISTING_CATEGORIES}
            });
        });

        describe('Token validation', () => {  
            test('should throw a 401 error if token is not provided', async () => {  
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .send(newBlog)
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.NO_TOKEN},
                });
            });
            test('should throw a 401 status code if token is invalid or expired', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send(newBlog)
                    .expect(401);
                    
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });

        describe('Title validation', () => {  
            test('should throw a 400 error if Title is not sent', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, title: undefined})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY}
                ]));
            });
            test('should throw a 400 error if Title is not a string', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, title: 12345})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.STRING}
                ]));
            });
            test('should throw a 400 error if Title contains only blank spaces', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, title: '               '})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.BLANK_SPACES}
                ]));
            });
            test('should throw a 400 error if Title length is less than 3 characters', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, title: 'ab'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MIN_LENGTH}
                ]));
            });
            test('should throw a 400 error if Title length is more than 150 characters', async () => {  
                const { body } = await request(testServer.app)
                  .post(`/api/blogs/${15}`)
                  .set("token", "any-token")
                  .send({
                    ...newBlog,
                    title: "This is a text with more than one hundred fifty characters long.".repeat(200),
                  })
                  .expect(400);
            
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MAX_LENGTH}
                ]));
            });
        });

        describe('Content validation', () => {  
            test('should throw a 400 error if Content is not sent', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: undefined})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
                ]));
            });
            test('should throw a 400 error if Content is an empty string', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: ''})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY}
                ]));
            });
            test('should throw a 400 error if Content is not a string', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: 1234})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.STRING}
                ]));
            });
            test('should throw a 400 error if Content length is less than 5 characters', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: 'abc'})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MIN_LENGTH}
                ]));
            });
            test('should throw a 400 error if Content length is more than 500 characters', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: 'This a long text'.repeat(501)})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MAX_LENGTH}
                ]));
            });
            test('should throw a 400 error if Content contains only blank spaces', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, content: '                     '})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.BLANK_SPACES}
                ]));
            });
        });

        describe('Categories Id validation', () => {  
            test('should throw a 400 error if categoriedIds is not sent', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({title: newBlog.title, content: newBlog.content})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.MANDATORY}
                ]));
            });
            test('should throw a 400 error if categoriedIds is not an array', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, categoriesIds: 1234})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.ARRAY}
                ]));
            });
            test('should throw a 400 error if categoriedIds is an empty array', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, categoriesIds: []})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.EMPTY}
                ]));
            });
            test('should throw a 400 error if categoriedIds is an id is not a number', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);
                const {body} = await request(testServer.app)
                    .post(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .send({...newBlog, categoriesIds: ['abc', false, null]})
                    .expect(400);
                
                expect(body.success).toBeFalsy();
                expect(body.error.message).toBe(ERROR_VALIDATION_MSG);
                expect(body.error.errors).toEqual(expect.arrayContaining([
                    {field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.NUMBER}
                ]));
            });
        });
    });

    describe('/:id Get Blog by ID endpoint', () => {  
        test('should return a 200 status code and a blog', async () => {
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany(
                {where: {deletedAt: null},
                select: {id: true}
            });
            
            const existingBlog = await prisma.blog.create({
                data: {
                    title: newBlog.title,
                    content: newBlog.content,
                    authorId: user.id,
                    categories: {
                        connect: categories
                    }
                }
            });

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .get(`/api/blogs/${existingBlog.id}`)
                .set('token', 'any-token')
                .expect(200);
            
            expect(body).toEqual({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.GET_BLOG_BY_ID,
                data: {blog: expect.any(Object)}
            });
        });
        test('should throw a 400 error when blog does not exist', async () => {
            const id = 1;
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .get(`/api/blogs/${id}`)
                .set('token', 'any-token')
                .expect(400);
            
            expect(body.success).toBeFalsy();
            expect(body.error.message).toBe(`Blog with id ${id} does not exist`);
        });

        describe('Token validation', () => {  
            test('should throw a 401 error if token is not provided', async () => {  
                const {body} = await request(testServer.app)
                    .get(`/api/blogs/${15}`)
                    .send(newBlog)
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.NO_TOKEN},
                });
            });
            test('should throw a 401 status code if token is invalid or expired', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .get(`/api/blogs/${15}`)
                    .set('token', 'any-token')
                    .expect(401);
                    
                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.INVALID_TOKEN},
                });
            });
        });
    });

    // TODO: Delete blog tests
    describe('/deleteBlog/:id endpoint', () => {  
        test('should return a 200 status and blog information', async () => {  
            const user = await prisma.user.create({data: mockUser});
            await prisma.category.createMany({data: mockCategories});
            const categories = await prisma.category.findMany(
                {where: {deletedAt: null},
                select: {id: true}
            });
            
            const existingBlog = await prisma.blog.create({
                data: {
                    title: newBlog.title,
                    content: newBlog.content,
                    authorId: user.id,
                    categories: {
                        connect: categories
                    }
                }
            });

            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/blogs/deleteBlog/${existingBlog.id}`)
                .set('token', 'any-token')
                .expect(200);

            expect(body).toEqual({
                success: true,
                message: `Blog with id ${existingBlog.id} deleted successfully`,
                data: {
                    blog: {id: existingBlog.id, title: existingBlog.title}
                }
            })
        });
        test('should throw a 400 error if blog does not exist', async () => {  
            const blogId = 1;
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/blogs/deleteBlog/${blogId}`)
                .set('token', 'any-token')
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: `Blog with id ${blogId} does not exist`}
            });
        });
        test('should throw a 400 error if ID is not sent', async () => {
            const id = undefined;
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/blogs/deleteBlog/${id}`)
                .set('token', 'any-token')
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        test('should throw a 400 error if ID is not a number', async () => {  
            (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue(verifyToken);

            const {body} = await request(testServer.app)
                .put(`/api/blogs/deleteBlog/abc`)
                .set('token', 'any-token')
                .expect(400);

            expect(body).toEqual({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
        });
        describe('Token validation', () => {  
            test('should throw a 401 error if token is not provided', async () => {  
                
                const {body} = await request(testServer.app)
                    .put(`/api/blogs/deleteBlog/${1}`)
                    .expect(401);

                expect(body).toEqual({
                    success: false,
                    error: {message: JWT_ADAPTER.ERRORS.NO_TOKEN},
                });
            });
            test('should throw a 401 status code if token is invalid or expired', async () => {  
                (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(
                    new CustomError(JWT_ADAPTER.ERRORS.INVALID_TOKEN, 401)
                );
                const {body} = await request(testServer.app)
                    .put(`/api/blogs/deleteBlog/${1}`)
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