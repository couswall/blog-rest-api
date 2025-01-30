import { UserEntity } from '@/domain/entities/user.entity';

export abstract class UserDatasource {
    abstract create(): Promise<UserEntity>;
    abstract deleteById(id: number): Promise<UserEntity>;
}