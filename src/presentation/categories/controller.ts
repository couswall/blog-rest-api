import { Request, Response } from "express";
import { CreateCategoryDto } from "@/domain/dtos";
import { CategoryRepository } from "@/domain/repositories/category.repository";
import { CreateCategory } from "@/domain/use-cases/category";
import { CustomError } from "@/domain/errors/custom.error";

export class CategoryController {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ){};

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: {message: error.message}
            });
            return;
        };
        res.status(500).json({error: {message: 'Internal server error'}});
    };

    public createCategory = (req: Request, res: Response) => {
        const [errorMessage, dto] = CreateCategoryDto.create({...req.body});

        if (errorMessage) {
            res.status(400).json({
                success: false,
                error: {message: errorMessage}
            });
            return;
        }

        new CreateCategory(this.categoryRepository)
            .execute(dto!)
            .then(category => res.status(200).json({
                success: true,
                message: 'Category created successfully',
                data: {
                    id: category.id,
                    name: category.name,
                }
            }))
            .catch(error => this.handleError(res, error))
    };

    public getAllCategories = (req: Request, res: Response) => {
        res.json({message: 'get all categories'});
        return;
    };
}