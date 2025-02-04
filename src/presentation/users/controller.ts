import { Request, Response } from "express";
import { CreateUserDto } from "@/domain/dtos";
import { CustomError } from "@/domain/errors/custom.error";
import { UserRepository } from "@/domain/repositories/user.repository";
import { CreateUser, DeleteUser } from "@/domain/use-cases/user";

export class UserController {
    constructor(
        private readonly userRepository: UserRepository
    ){};

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                success: false,
                error: {
                    message: error.message
                }
            });
            return;
        };
        
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }

    public createUser = (req: Request, res: Response) => {
        const [errorMessages, dto] = CreateUserDto.create(req.body);
        if (errorMessages) {
            res.status(400).json({
                status: false,
                error: {
                    message: 'Validation errors in request',
                    errors: errorMessages,
                }
            });
            return;
        };

        new CreateUser(this.userRepository)
            .execute(dto!)
            .then(user => res.status(201).json({
                success: true,
                message: 'User created succesfully',
                data: {user: user.toJSON()},
            }))
            .catch(error => this.handleError(res, error));
    };

    public deleteUser = (req: Request, res: Response) => {
        const id = +req.params.id;
        
        if(isNaN(id)){
            res.status(400).json({error: 'ID argument is not a number'});
            return;
        };

        new DeleteUser(this.userRepository)
            .execute(id)
            .then(user => res.status(200).json(user))
            .catch(error => this.handleError(res, error))
    }
}