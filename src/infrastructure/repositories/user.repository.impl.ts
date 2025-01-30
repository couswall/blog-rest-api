import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserDatasource } from '@/domain/datasources/user.datasource';

export class UserRepositoryImpl implements UserRepository{
    
    constructor(
        private readonly datasource: UserDatasource,
    ){}

    create(): Promise<UserEntity> {
        return this.datasource.create();
    }
    deleteById(id: number): Promise<UserEntity> {
        return this.datasource.deleteById(id);
    }

}