import { Request, Response } from "express";


export class UserController {
    constructor(){};

    public createUser = (req: Request, res: Response) => {
        res.json({message: 'create user'});
        return;
    };

    public deleteUser = (req: Request, res: Response) => {
        res.json({message: 'delete user'});
        return;
    }
}