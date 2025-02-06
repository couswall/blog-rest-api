import { UserDatasource } from "@/domain/datasources/user.datasource";
import { UserEntity } from "@/domain/entities/user.entity";
import { CreateUserDto, LoginUserDto } from '@/domain/dtos';
import { prisma } from "@/data/postgres";
import { CustomError } from "@/domain/errors/custom.error";
import { ERROR_MESSAGES } from "@src/infrastructure/constants/user.constants";

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
            if(existingUser.username === createUserDto.username) throw new CustomError(ERROR_MESSAGES.USERNAME.ALREADY_EXISTS, 404);
            if(existingUser.email === createUserDto.email) throw new CustomError(ERROR_MESSAGES.EMAIL.ALREADY_EXISTS, 404);
        }
        
        const newUser = await prisma.user.create({data: createUserDto});
        return UserEntity.fromObject(newUser);
    }

    async findById(id: number): Promise<UserEntity> {
        const user = await prisma.user.findUnique({where: {id}});

        if(!user) throw new CustomError(`User with ${id} not found`, 404);

        return UserEntity.fromObject(user);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await prisma.user.findUnique({where: {username: loginUserDto.username}});

        if(!user) throw new CustomError(`Invalid credentials`, 404);

        return UserEntity.fromObject(user);
    }

    async deleteById(id: number): Promise<UserEntity> {
        const user = await this.findById(id);

        if(!user) throw new CustomError(`User with id ${id} not found`, 400);

        const deletedUser = await prisma.user.delete({where: {id}});

        return UserEntity.fromObject(deletedUser);
    }
}