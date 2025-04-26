import { Request, Response } from "express";
import { CreateCommentDto } from "@/domain/dtos";
import { CommentRepository } from "@/domain/repositories/comment.repository";
import { CreateComment, DeleteCommentById } from "@/domain/use-cases";
import { CustomError } from "@/domain/errors/custom.error";
import { COMMENT_RESPONSE } from "@/infrastructure/constants/comment.constants";

export class CommentController {
    constructor(
        private readonly commentRepository: CommentRepository,
    ){};

    public createComment = (req: Request, res: Response) => {
        const [errorMessage, dto] = CreateCommentDto.create(req.body);
        if (errorMessage) {
            res.status(400).json({
                success: false,
                error: {
                    message: errorMessage,
                }
            });
            return;
        }

        new CreateComment(this.commentRepository)
            .execute(dto!)
            .then(comment => res.status(201).json({
                success: true,
                message: COMMENT_RESPONSE.SUCCESS.CREATE,
                data: {
                    id: comment.id,
                    authorId: comment.authorId,
                    blogId: comment.blogId,
                    content: comment.content,
                    createdAt: comment.createdAt,
                }
            }))
            .catch(error => CustomError.handleError(res, error))
    };

    public deleteComment = (req: Request, res: Response) => {
        const commentId = +req.params.commentId;

        if (!commentId || isNaN(commentId)) {
            res.status(400).json({
                success: false,
                error: {
                    message: COMMENT_RESPONSE.ERRORS.DELETE,
                }
            });
            return;
        }

        new DeleteCommentById(this.commentRepository)
            .execute(commentId)
            .then(comment => res.status(200).json({
                success: true,
                message: COMMENT_RESPONSE.SUCCESS.DELETE,
                data: {
                    id: comment.id,
                    deletedAt: comment.deletedAt,
                    content: comment.content,
                }
            }))
            .catch(error => CustomError.handleError(res, error));
    }
}