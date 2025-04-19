import { Request, Response } from "express";
import { CreateBlogDto, UpdateBlogDto } from "@/domain/dtos/blogs";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { CreateBlog, DeleteBlog, GetByIdBlog, UpdateBlog } from "@/domain/use-cases/blog";
import { CustomError } from '@/domain/errors/custom.error';
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";
import { ID_ERROR_MSG } from "@/domain/constants/dto/user.constants";

export class BlogController {

    constructor(
        private readonly blogRepository: BlogRepository,
    ){}

    public getBlogs = (req: Request, res: Response) => {
        res.json({message: 'Get all blogs'});
        return;
    };
    
    public getBlogById = (req: Request, res: Response) => {
        const blogId = +req.params.id;
        if (!blogId || isNaN(blogId)) {
            res.status(400).json({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
            return;
        }

        new GetByIdBlog(this.blogRepository)
            .execute(blogId)
            .then(blog => res.status(200).json({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.GET_BLOG_BY_ID,
                data: {
                    blog: {
                        ...blog.toJSON(),
                        author: {id: blog.author.id, username: blog.author.username},
                        categories: blog.categories.map(category => ({
                            id: category.id,
                            name: category.name,
                        }))
                    },
                }
            }))
            .catch(error => CustomError.handleError(res, error));
    };

    public createBlog = (req: Request, res: Response) => {
        const authorId = +req.params.authorId;
        const [errorMessages, message, dto] = CreateBlogDto.create({authorId, ...req.body});
        if (errorMessages || message) {
            res.status(400).json({
                success: false,
                error: {
                    message: message,
                    errors: errorMessages,
                }
            });
            return;
        };
        
        new CreateBlog(this.blogRepository)
            .execute(dto!)
            .then(blog => res.status(201).json({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.CREATE,
                data: {
                    blog: {
                        id: blog.id,
                        title: blog.title,
                        author: blog.author,
                        createdAt: blog.createdAt,
                        categories: blog.categories.map(category => ({
                            id: category.id,
                            name: category.name,
                        }))
                    }
                }
            }))
            .catch(error =>  CustomError.handleError(res, error));
    };

    public updateBlog = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errorMessages, message, dto] = UpdateBlogDto.create({id, ...req.body});

        if (errorMessages || message) {
            res.status(400).json({
                success: false,
                error: {
                    message,
                    errors: errorMessages,
                }
            });
            return;
        }

        new UpdateBlog(this.blogRepository)
            .execute(dto!)
            .then(blog => res.status(200).json({
                success: true,
                message: BLOG_RESPONSE.SUCCESS.UPDATE_BLOG,
                data: {
                    blog: {
                        id: blog.id,
                        title: blog.title,
                        content: blog.content,
                        categories: blog.categories.map(category => ({
                            id: category.id,
                            name: category.name,
                        })),
                        updatedAt: blog.updatedAt,
                    }
                }
            }))
            .catch(error => CustomError.handleError(res, error))
    };

    public deleteBlog = (req: Request, res: Response) => {
        const blogId = +req.params.id;

        if (!blogId || isNaN(blogId)) {
            res.status(400).json({
                success: false,
                error: {message: ID_ERROR_MSG}
            });
            return;
        }

        new DeleteBlog(this.blogRepository)
            .execute(blogId)
            .then(deletedBlog => res.status(200).json({
                success: true,
                message: `Blog with id ${deletedBlog.id} deleted successfully`,
                data: {
                    blog: {id: deletedBlog.id, title: deletedBlog.title}
                }
            }))
            .catch(error => CustomError.handleError(res, error))
    }


}