import { Router } from "express";
import { UserController } from "@presentation/users/controller";
import { UserDatasourceImpl } from "@/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";

export class UserRoutes {

    static get routes(): Router{
        const router = Router();
        const datasource = new UserDatasourceImpl();
        const userRepository = new UserRepositoryImpl(datasource);
        const userController = new UserController(userRepository);

        router.post('/signup', userController.createUser);
        router.delete('/deleteUser/:id', userController.deleteUser);

        return router;
    }
}