import { Request, Response } from "express";
import { CreateUserDto, LoginUserDto, UpdatePasswordDto, UpdateUsernameDto } from "@/domain/dtos";
import { CustomError } from "@/domain/errors/custom.error";
import { UserRepository } from "@/domain/repositories/user.repository";
import { CreateUser, DeleteUser, LoginUser, UpdatePassword, UpdateUsername } from "@/domain/use-cases/user";
import { JwtAdapter } from "@/config/jwt.adapter";
import { BcryptAdapter } from "@/config/bcrypt.adapter";

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
                success: false,
                error: {
                    message: 'Validation errors in request',
                    errors: errorMessages,
                }
            });
            return;
        };

        new CreateUser(this.userRepository)
            .execute(dto!)
            .then(user => {
                JwtAdapter.generateJWT({id: user.id, username: user.username})
                    .then(token => res.status(201).json({
                        success: true,
                        message: 'User created succesfully',
                        data: {
                            user: user.toJSON(),
                            token,
                        },
                    }))
                    .catch(error => this.handleError(res, error))
            })
            .catch(error => this.handleError(res, error));
    };

    public loginUser = (req: Request, res: Response) => {
        const [errorMessages, dto] = LoginUserDto.create(req.body);
        if (errorMessages) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Validation errors in request',
                    errors: errorMessages,
                }
            });
            return;
        };

        new LoginUser(this.userRepository)
            .execute(dto!)
            .then(user => {
                const isValidPassword = BcryptAdapter.compare(dto!.password, user.password);
                if (!isValidPassword) {
                    res.status(400).json({
                        success: false,
                        error: {
                            message: 'Invalid credentials'
                        }
                    });
                    return;
                };
                JwtAdapter.generateJWT({id: user.id, username: user.username})
                    .then(token => res.status(200).json({
                        success: true,
                        message: 'Login succesfully',
                        data: {
                            user: user.toJSON(),
                            token,
                        },
                    }))
                    .catch(error => this.handleError(res, error))
            })
            .catch(error => this.handleError(res, error));
    }

    public updateUsername = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errorMessages, dto] = UpdateUsernameDto.create({id, ...req.body});
        if (errorMessages) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Validation errors in request',
                    errors: errorMessages,
                } 
            })
            return;
        };

        new UpdateUsername(this.userRepository)
            .execute(dto!)
            .then(user => res.status(200).json({
                success: true,
                message: 'Username successfully updated',
                data: {
                    user: user.toJSON()
                },
            }))
            .catch(error => this.handleError(res, error))
    };

    public updatePassword = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [errorMessages, message, dto] = UpdatePasswordDto.create({id, ...req.body});
        
        if(errorMessages || message){
            res.status(400).json({
                success: false,
                error: {
                    message: message,
                    errors: errorMessages,
                },
            });
            return;
        };

        new UpdatePassword(this.userRepository)
            .execute(dto!)
            .then(user => res.status(200).json({
                success: true,
                message: 'Password successfully updated',
                data: {
                    user: user.toJSON(),
                }
            }))
            .catch(error => this.handleError(res, error))
    }

    public deleteUser = (req: Request, res: Response) => {
        const id = +req.params.id;
        
        if(isNaN(id)){
            res.status(400).json({
                success: false,
                error: {
                    message: 'ID argument is not a number'
                }
            });
            return;
        };

        new DeleteUser(this.userRepository)
            .execute(id)
            .then(user => res.status(200).json({
                success: true,
                message: 'User has been successfully deleted.',
                data: {
                    user: user.toJSON()
                }
            }))
            .catch(error => this.handleError(res, error))
    }
}