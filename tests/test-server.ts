import { AppRoutes } from "@presentation/routes";
import { envs } from "@config/envs";
import { Server } from "@presentation/server";

export const testServer = new Server({
    port: envs.PORT,
    publicPath: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
});