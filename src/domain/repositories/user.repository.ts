import { UserEntity } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/domain/dtos';
import { LoginUserDto } from '@src/domain/dtos/user/login-user.dto';

export abstract class UserRepository {
    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
    abstract login(loginUserDto: LoginUserDto):Promise<UserEntity>
    abstract findById(id: number): Promise<UserEntity>;
    abstract deleteById(id: number): Promise<UserEntity>;
}