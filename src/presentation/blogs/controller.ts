import { Request, Response } from "express";
import { CreateBlogDto } from "@/domain/dtos/blogs";
import { BlogRepository } from "@/domain/repositories/blog.repository";
import { CreateBlog } from "@/domain/use-cases/blog";
import { CustomError } from '@/domain/errors/custom.error';
import { title } from "process";
import { BLOG_RESPONSE } from "@/infrastructure/constants/blog.constants";


export class BlogController {

    constructor(
        private readonly blogRepository: BlogRepository,
    ){}

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: {message: error.message}
            });
            return;
        }
        res.status(500).json({error: {message: 'Internal server error'}})
    }

    public getBlogs = (req: Request, res: Response) => {
        res.json({message: 'Get all blogs'});
        return;
    };
    
    public getBlogById = (req: Request, res: Response) => {
        res.json({message: 'Get blog by id'});
        return;
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
                        title: blog.id,
                        author: blog.author,
                        createdAt: blog.createdAt,
                        categories: blog.categories.map(category => ({
                            id: category.id,
                            name: category.name,
                        }))
                    }
                }
            }))
            .catch(error => this.handleError(res, error));
    };

    public updateBlog = (req: Request, res: Response) => {
        res.json({message: 'Update blog'});
        return;
    };

    public deleteBlog = (req: Request, res: Response) => {
        res.json({message: 'Delete blog'});
        return;
    }


}