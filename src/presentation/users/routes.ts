import { Router } from "express";
import { UserController } from "@presentation/users/controller";

export class UserRoutes {

    static get routes(): Router{
        const router = Router();
        const userController = new UserController();

        router.post('/signup', userController.createUser);
        router.delete('/deleteUser/:id', userController.deleteUser);

        return router;
    }
}