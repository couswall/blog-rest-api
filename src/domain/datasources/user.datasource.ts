import { UserEntity } from '@/domain/entities/user.entity';
import { CreateUserDto, LoginUserDto } from '@/domain/dtos';

export abstract class UserDatasource {
    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
    abstract findById(id: number): Promise<UserEntity>;
    abstract login(loginUserDto: LoginUserDto):Promise<UserEntity>;
    abstract deleteById(id: number): Promise<UserEntity>;
}