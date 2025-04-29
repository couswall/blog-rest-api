import { Request, Response } from "express";
import { CreateDeleteLikeDto } from "@/domain/dtos/like";
import { CreateDeleteLike } from "@/domain/use-cases/like";
import { LikeRepository } from "@/domain/repositories/like.repository";
import { CustomError } from "@/domain/errors/custom.error";


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
                message: 'Like toggled succesfully',
                data: like.toJSON()
            }))
            .catch(error => CustomError.handleError(res, error))
    }
}