import { Router } from "express";
import { BlogController } from "@presentation/blogs/controller";
import { validateJWT } from "@presentation/middlewares/validate-jwt";
import { BlogDatasourceImpl } from "@/infrastructure/datasources/blog.datasource.impl";
import { BlogRepositoryImpl } from "@/infrastructure/repositories/blog.repository.impl";

export class BlogRoutes {

    static get routes(): Router {
        const router = Router();

        const datasource = new BlogDatasourceImpl();
        const blogRepository = new BlogRepositoryImpl(datasource);
        const blogContoller = new BlogController(blogRepository);

        router.get('/', validateJWT, blogContoller.getBlogs);
        router.get('/:id', validateJWT, blogContoller.getBlogById);
        router.post('/:authorId', validateJWT, blogContoller.createBlog);
        router.put('/:id', validateJWT, blogContoller.updateBlog);
        router.put('/deleteBlog/:id', validateJWT, blogContoller.deleteBlog);

        return router;
    }
}