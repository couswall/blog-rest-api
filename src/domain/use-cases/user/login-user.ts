import { LoginUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities/user.entity";
import { UserRepository } from "@/domain/repositories/user.repository";

export interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<UserEntity>;
}

export class LoginUser implements LoginUserUseCase {
    constructor(
        private readonly repository: UserRepository,
    ){}

    execute(loginUserDto: LoginUserDto): Promise<UserEntity> {        
        return this.repository.login(loginUserDto);
    }
}