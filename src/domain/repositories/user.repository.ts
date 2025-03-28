import { UserEntity } from '@/domain/entities/user.entity';
import { CreateUserDto, UpdateUsernameDto, LoginUserDto, UpdatePasswordDto } from '@/domain/dtos';

export abstract class UserRepository {
    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
    abstract login(loginUserDto: LoginUserDto):Promise<UserEntity>
    abstract findById(id: number): Promise<UserEntity>;
    abstract updateUsername(updateUserNameDto: UpdateUsernameDto): Promise<UserEntity>;
    abstract updatePassword(updatePasswordDto: UpdatePasswordDto):Promise<UserEntity>;
    abstract deleteById(id: number): Promise<UserEntity>;
}