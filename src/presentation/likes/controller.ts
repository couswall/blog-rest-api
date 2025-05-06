import { Request, Response } from "express";
import { CreateDeleteLikeDto } from "@/domain/dtos/like";
import { CreateDeleteLike, GetLikesByBlogId, GetLikesByUserId } from "@/domain/use-cases/like";
import { LikeRepository } from "@/domain/repositories/like.repository";
import { CustomError } from "@/domain/errors/custom.error";
import { LIKE_RESPONSE } from "@/infrastructure/constants/like.constants";

export class LikeController {
    constructor(
        private readonly likeRepository: LikeRepository,
    ){};

    public toggleCreateDelete = (req: Request, res: Response) => {
        const [errorMsg, dto] = CreateDeleteLikeDto.create(req.body);

        if(errorMsg){
            res.status(400).json({
                success: false,
                error: {message: errorMsg}
            });
            return;
        }

        new CreateDeleteLike(this.likeRepository)
            .execute(dto!)
            .then(like => res.status(200).json({
                success: true,
                message: LIKE_RESPONSE.SUCCESS.TOGGLE,
                data: like.toJSON()
            }))
            .catch(error => CustomError.handleError(res, error))
    }

    public getLikesByBlogId = (req: Request, res: Response) => {
        const blogId = +req.params.blogId;
        if(!blogId || isNaN(blogId)){
            res.status(400).json({
                success: false,
                error: {
                    message: LIKE_RESPONSE.ERRORS.LIKES_BY_BLOGID.NUMBER
                }
            });
            return;
        }

        new GetLikesByBlogId(this.likeRepository)
            .execute(blogId)
            .then(likes => res.status(200).json({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_BLOGID} ${blogId}`,
                data: likes.map(like => ({
                    id: like.id,
                    userId: like.user.id,
                    username: like.user.username,
                }))
            }))
            .catch(error => CustomError.handleError(res, error));

    }

    public getLikesByUserId = (req: Request, res: Response) => {
        const userId = +req.params.userId;
        if(!userId || isNaN(userId)){
            res.status(400).json({
                success: false,
                error: {
                    message: LIKE_RESPONSE.ERRORS.LIKES_BY_USERID.NUMBER
                }
            });
            return;
        }
        
        new GetLikesByUserId(this.likeRepository)
            .execute(userId)
            .then(likes => res.status(200).json({
                success: true,
                message: `${LIKE_RESPONSE.SUCCESS.LIKES_BY_USERID} ${userId}`,
                data: likes.map(like => ({
                    ...like,
                    blog: {
                        id: like.blog.id,
                        title: like.blog.title,
                        authorId: like.blog.author.id,
                        authorName: like.blog.author.username,
                    }
                })),
            }))
            .catch(error => CustomError.handleError(res, error));
    };
}