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