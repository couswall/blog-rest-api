import { BcryptAdapter } from "@/config/bcrypt.adapter";
import { UpdatePasswordDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities/user.entity";
import { UserRepository } from "@/domain/repositories/user.repository";

export interface UpdatePasswordUseCase{
    execute(dto: UpdatePasswordDto): Promise<UserEntity>;
};

export class UpdatePassword implements UpdatePasswordUseCase {
    constructor(
        private readonly repository: UserRepository,
    ){};

    execute(dto: UpdatePasswordDto): Promise<UserEntity> {
        return this.repository.updatePassword(dto);
    }
    
}