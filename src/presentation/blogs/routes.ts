import { Router } from "express";
import { BlogController } from "@presentation/blogs/controller";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class BlogRoutes {

    static get routes(): Router {
        const router = Router();

        const blogContoller = new BlogController();

        router.get('/', validateJWT, blogContoller.getBlogs);
        router.get('/:id', validateJWT, blogContoller.getBlogById);
        router.post('/', validateJWT, blogContoller.createBlog);
        router.put('/:id', validateJWT, blogContoller.updateBlog);
        router.put('/deleteBlog/:id', validateJWT, blogContoller.deleteBlog);

        return router;
    }
}