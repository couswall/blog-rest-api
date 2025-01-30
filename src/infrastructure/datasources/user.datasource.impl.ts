import { UserDatasource } from "@/domain/datasources/user.datasource";
import { UserEntity } from "@/domain/entities/user.entity";

export class UserDatasourceImpl implements UserDatasource {
    async create(): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }
    async deleteById(id: number): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }
}