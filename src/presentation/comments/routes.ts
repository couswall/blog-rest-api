import { Router } from "express";
import { validateJWT } from "@presentation/middlewares/validate-jwt";
import { CommentController } from "@presentation/comments/controller";

export class CommentRoutes {

    static get routes(): Router{
        const router = Router();
        const commentController = new CommentController();

        router.post('/:blogId', validateJWT, commentController.createComment);

        return router;
    }

}