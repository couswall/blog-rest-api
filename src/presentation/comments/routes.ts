import { Router } from "express";
import { validateJWT } from "@presentation/middlewares/validate-jwt";
import { CommentController } from "@presentation/comments/controller";
import { CommentDatasourceImpl } from "@/infrastructure/datasources/comment.datasource.impl";
import { CommentRepositoryImpl } from "@/infrastructure/repositories/comment.repository.impl";

export class CommentRoutes {

    static get routes(): Router{
        const router = Router();
        const datasource = new CommentDatasourceImpl();
        const commentRepository = new CommentRepositoryImpl(datasource);
        const commentController = new CommentController(commentRepository);
        
        router.post('/', validateJWT, commentController.createComment);

        return router;
    }

}