import { Router } from "express";
import { UserController } from "@presentation/users/controller";
import { UserDatasourceImpl } from "@/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";
import { validateJWT } from "@presentation/middlewares/validate-jwt";

export class UserRoutes {

    static get routes(): Router{
        const router = Router();
        const datasource = new UserDatasourceImpl();
        const userRepository = new UserRepositoryImpl(datasource);
        const userController = new UserController(userRepository);

        router.post('/signup', userController.createUser);
        router.post('/login', userController.loginUser);
        router.put('/updateUsername/:id', validateJWT, userController.updateUsername);
        router.put('/updatePassword/:id', validateJWT, userController.updatePassword);
        router.put('/deleteUser/:id', validateJWT, userController.deleteUser);

        return router;
    }
}