import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt";
import { CategoryController } from "./controller";
import { CategoryDatasourceImpl } from "@/infrastructure/datasources/category.datasource.impl";
import { CategoryRepositoryImpl } from "@/infrastructure/repositories/category.repository.impl";

export class CategoryRoutes {
    
    static get routes(): Router{
        const router = Router();

        const datasource = new CategoryDatasourceImpl();
        const categoryRepository = new CategoryRepositoryImpl(datasource);
        const categoryController = new CategoryController(categoryRepository);

        router.get('/', validateJWT, categoryController.getAllCategories);
        router.post('/', validateJWT, categoryController.createCategory);

        return router;
    }
}