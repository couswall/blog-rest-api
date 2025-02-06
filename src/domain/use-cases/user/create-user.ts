import { CreateUserDto } from "@/domain/dtos";
import { UserEntity } from '@src/domain/entities/user.entity';
import { UserRepository } from "@/domain/repositories/user.repository";
import { BcryptAdapter } from "@/config/bcrypt.adapter";

export interface CreateUserUseCase {
    execute(dto: CreateUserDto): Promise<UserEntity>;
};

export class CreateUser implements CreateUserUseCase{
    constructor(
        private readonly repository: UserRepository,
    ){}

    execute(dto: CreateUserDto): Promise<UserEntity> {
        const newDto = new CreateUserDto(
            dto.username, 
            dto.email, 
            BcryptAdapter.hash(dto.password)
        );
        return this.repository.create(newDto);
    }
}