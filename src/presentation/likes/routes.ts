import { Router } from "express";
import { validateJWT } from "@presentation/middlewares/validate-jwt";
import { LikeController } from "@presentation/likes/controller";
import { LikeDatasourceImpl } from "@/infrastructure/datasources/like.datasource.impl";
import { LikeRepositoryImpl } from "@/infrastructure/repositories/like.repository.impl";


export class LikeRoutes {

    static get routes(): Router{
        const router = Router();
        const datasource = new LikeDatasourceImpl();
        const likeRepository = new LikeRepositoryImpl(datasource);
        const likeController = new LikeController(likeRepository);

        router.post('/toggleLike', validateJWT, likeController.toggleCreateDelete);
        router.get('/getLikesByBlogId/:blogId', likeController.getLikesByBlogId);

        return router;
    }
}