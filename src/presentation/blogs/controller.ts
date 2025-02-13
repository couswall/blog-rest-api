import { CreateBlogDto } from "@/domain/dtos/blogs";
import { Request, Response } from "express";


export class BlogController {

    constructor(){}

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
        
        res.json({message: 'Create blog'});
        return;
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