import { JwtAdapter } from "@/config/jwt.adapter";
import { CustomError } from "@/domain/errors/custom.error";
import { NextFunction, Request, Response } from "express";

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('token');

    if(!token){
        res.status(401).json({
            success: false,
            error: {
                message: 'No token sent'
            }
        });
        return;
    };

    try {
        await JwtAdapter.verifyJWT(token);
        next();
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: { message: error.message }
            });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};