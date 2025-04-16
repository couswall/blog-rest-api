import { Request, Response } from "express";
import { CreateCommentDto } from "@/domain/dtos";

export class CommentController {

    public createComment = (req: Request, res: Response) => {
        const blogId = +req.params.blogId;
        const [errorMessage, dto] = CreateCommentDto.create({blogId, ...req.body});
        if (errorMessage) {
            res.status(400).json({
                success: false,
                error: {
                    message: errorMessage,
                }
            });
            return;
        }
        res.status(200).json({dto});
        return;
    }   
}