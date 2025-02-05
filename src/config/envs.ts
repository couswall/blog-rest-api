import 'dotenv/config';
import { get } from "env-var";

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
    JWT_SECRET_SEED: get('JWT_SECRET_SEED').required().asString(),
};