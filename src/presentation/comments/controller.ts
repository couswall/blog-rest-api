import { Request, Response } from "express";

export class CommentController {

    public createComment = (req: Request, res: Response) => {
        res.status(200).json({message: 'Create comment'});
        return;
    }   
}