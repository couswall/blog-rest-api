import { Request, Response } from "express";
import { CreateCategoryDto } from "@/domain/dtos";

export class CategoryController {

    public createCategory = (req: Request, res: Response) => {
        const [errorMessage, dto] = CreateCategoryDto.create({...req.body});

        if (errorMessage) {
            res.status(400).json({
                success: false,
                error: {message: errorMessage}
            });
            return;
        }

        res.json({message: 'create a new category'});
        return;
    };

    public getAllCategories = (req: Request, res: Response) => {
        res.json({message: 'get all categories'});
        return;
    };
}