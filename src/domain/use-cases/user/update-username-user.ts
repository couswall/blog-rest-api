import { UpdateUsernameDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities/user.entity";
import { UserRepository } from "@/domain/repositories/user.repository";

export interface UpdateUsernameUseCase {
    execute(dto: UpdateUsernameDto): Promise<UserEntity>;
};

export class UpdateUsername implements UpdateUsernameUseCase {
    constructor(
        private readonly repository: UserRepository,
    ){};

    execute(dto: UpdateUsernameDto): Promise<UserEntity> {
        return this.repository.updateUsername(dto);
    }
}