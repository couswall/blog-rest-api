import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserDatasource } from '@/domain/datasources/user.datasource';
import { CreateUserDto } from '@/domain/dtos';

export class UserRepositoryImpl implements UserRepository{
    
    constructor(
        private readonly datasource: UserDatasource,
    ){}

    create(createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.datasource.create(createUserDto);
    }

    findById(id: number): Promise<UserEntity> {
        return this.datasource.findById(id);
    }

    deleteById(id: number): Promise<UserEntity> {
        return this.datasource.deleteById(id);
    }

}