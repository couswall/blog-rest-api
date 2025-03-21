import { Response } from "express";

export class CustomError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 400,
    ){
        super(message);
    }

    static handleError(res: Response, error: unknown){
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: {message: error.message}
            });
            return;
        }
        res.status(500).json({error: {message: 'Internal server error'}})
    }
}