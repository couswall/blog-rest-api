import { UserDatasource } from "@/domain/datasources/user.datasource";
import { UserEntity } from "@/domain/entities/user.entity";
import { CreateUserDto, LoginUserDto, UpdatePasswordDto, UpdateUsernameDto } from '@/domain/dtos';
import { prisma } from "@/data/postgres";
import { CustomError } from "@/domain/errors/custom.error";
import { COOLDOWN_DAYS, ERROR_MESSAGES } from "@src/infrastructure/constants/user.constants";
import { BcryptAdapter } from "@/config/bcrypt.adapter";

export class UserDatasourceImpl implements UserDatasource {
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: createUserDto.username},
                    {email: createUserDto.email},
                ]
            }
        });

        if(existingUser){
            if (existingUser.deletedAt) {
                const restoredUser = await prisma.user.update({
                    where: {id: existingUser.id},
                    data: {
                        deletedAt: null,
                        usernameUpdatedAt: null,
                        username: createUserDto.username,
                        email: createUserDto.email,
                        password: createUserDto.password
                    }
                });
                return UserEntity.fromObject(restoredUser);
            }
            if(existingUser.username === createUserDto.username) throw new CustomError(ERROR_MESSAGES.USERNAME.ALREADY_EXISTS, 404);
            if(existingUser.email === createUserDto.email) throw new CustomError(ERROR_MESSAGES.EMAIL.ALREADY_EXISTS, 404);
        }
        
        const newUser = await prisma.user.create({data: createUserDto});
        return UserEntity.fromObject(newUser);
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await prisma.user.findFirst({
            where: {id, deletedAt: null}
        });

        if(!user) throw new CustomError(`User with ${id} not found`, 404);

        return UserEntity.fromObject(user);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await prisma.user.findUnique({
            where: {username: loginUserDto.username, deletedAt: null}
        });

        if(!user) throw new CustomError(`Invalid credentials`, 404);

        return UserEntity.fromObject(user);
    }

    async updateUsername(updateUsernameDto: UpdateUsernameDto): Promise<UserEntity> {
        const currentUser = await this.findById(updateUsernameDto.id);

        if(!currentUser) throw new CustomError(`User with id ${updateUsernameDto.id} not found`, 400);
        if(currentUser.username === updateUsernameDto.username) return UserEntity.fromObject(currentUser);
        
        const currentDate = new Date().getTime();
        
        if (currentUser.usernameUpdatedAt) {
            const lastUpdatedAt = currentUser.usernameUpdatedAt.getTime();
            const daysSinceLastChange = Math.floor((currentDate - lastUpdatedAt) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastChange < COOLDOWN_DAYS) {
                throw new CustomError(`You can only change your username once every ${COOLDOWN_DAYS} days`, 403);
            }
        }

        const isUsernameTaken = await prisma.user.findFirst({
            where: {
                username: updateUsernameDto.username,
                id: { not: updateUsernameDto.id }
            }
        });

        if(isUsernameTaken) throw new CustomError(`Username ${updateUsernameDto.username} already exists`);

        const updatedUsername = await prisma.user.update({
            where: {id: updateUsernameDto.id},
            data: {
                username: updateUsernameDto.username,
                usernameUpdatedAt: new Date(),
            }
        });

        return UserEntity.fromObject(updatedUsername);
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserEntity> {
        const user = await this.findById(updatePasswordDto.id);

        const isValidPassword = BcryptAdapter.compare(updatePasswordDto.currentPassword, user.password);
        if(!isValidPassword) throw new CustomError('Invalid current password', 400);

        const isCurrentPassword = BcryptAdapter.compare(updatePasswordDto.newPassword, user.password);
        if(isCurrentPassword) throw new CustomError('Please choose a different password from your current one', 400);

        const updatedPasswordUser = await prisma.user.update({
            where: {id: updatePasswordDto.id},
            data: {password: BcryptAdapter.hash(updatePasswordDto.newPassword)}
        });

        return UserEntity.fromObject(updatedPasswordUser);
    }
    
    async deleteById(id: number): Promise<UserEntity> {
        const user = await this.findById(id);

        if(!user) throw new CustomError(`User with id ${id} not found`, 400);

        const deletedUser = await prisma.user.update({
            where: {id},
            data: {deletedAt: new Date()}
        });

        return UserEntity.fromObject(deletedUser);
    }
}