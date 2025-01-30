import { Router } from "express";
import { BlogRoutes } from "@presentation/blogs/routes";
import { UserRoutes } from "@presentation/users/routes";


export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/users', UserRoutes.routes);
        router.use('/api/blogs', BlogRoutes.routes);

        return router;
    }
}