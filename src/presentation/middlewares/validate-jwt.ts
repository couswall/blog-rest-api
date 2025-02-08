import { JwtAdapter } from "@/config/jwt.adapter";
import { NextFunction, Request, Response } from "express";

export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
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

    JwtAdapter.verifyJWT(token)
        .then(payload => {
            console.log(payload);
            next();
        })
        .catch(() => res.status(401).json({
            success: false,
            error: {message: 'Invalid token'}
        }));
};