import { NextFunction, Request, Response } from "express";
import { JWT_ADAPTER } from "@/config/constants";
import { JwtAdapter } from "@/config/jwt.adapter";
import { CustomError } from "@/domain/errors/custom.error";

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('token');

    if(!token){
        res.status(401).json({
            success: false,
            error: {
                message: JWT_ADAPTER.ERRORS.NO_TOKEN,
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