import { Router } from "express";
import { BlogRoutes } from "./blogs/routes";


export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/blogs', BlogRoutes.routes);

        return router;
    }
}