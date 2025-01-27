import { Router } from "express";
import { BlogController } from "@presentation/blogs/controller";

export class BlogRoutes {

    static get routes(): Router {
        const router = Router();

        const blogContoller = new BlogController();

        router.get('/', blogContoller.getBlogs);
        router.get('/:id', blogContoller.getBlogById);
        router.post('/', blogContoller.createBlog);
        router.put('/:id', blogContoller.updateBlog);
        router.delete('/:id', blogContoller.deleteBlog);

        return router;
    }
}