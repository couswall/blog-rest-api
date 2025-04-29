import { Router } from "express";
import { BlogRoutes } from "@presentation/blogs/routes";
import { UserRoutes } from "@presentation/users/routes";
import { CategoryRoutes } from "@presentation/categories/routes";
import { CommentRoutes } from "@presentation/comments/routes";
import { LikeRoutes } from "@presentation/likes/routes";

export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/users', UserRoutes.routes);
        router.use('/api/blogs', BlogRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);
        router.use('/api/comments', CommentRoutes.routes);
        router.use('/api/likes/', LikeRoutes.routes);

        return router;
    }
}