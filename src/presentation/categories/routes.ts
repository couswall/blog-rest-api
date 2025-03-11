import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt";
import { CategoryController } from "./controller";

export class CategoryRoutes {
    
    static get routes(): Router{
        const router = Router();
        const categoryController = new CategoryController();

        router.get('/', validateJWT, categoryController.getAllCategories);
        router.post('/', validateJWT, categoryController.createCategory);

        return router;
    }
}