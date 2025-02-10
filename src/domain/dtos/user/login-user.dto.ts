import { IErrorMsg, ILoginUser } from "@src/domain/dtos/interfaces";
import { ERROR_MESSAGES, FIELDS } from "@/domain/constants/dto/user.constants";

export class LoginUserDto {
    constructor(
        public readonly username: string,
        public readonly password: string,
    ){};

    static validate(props: ILoginUser): IErrorMsg[]{
        const {username, password} = props;
        let errors: IErrorMsg[] = []; 
        
        if(!username || username.trim().length === 0) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
        if(!password || password.trim().length === 0) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED});
        
        return errors;
    }
    static create(props: ILoginUser): [IErrorMsg[]?, LoginUserDto?]{
        const errors: IErrorMsg[] = LoginUserDto.validate(props);
        const {username, password} = props;

        if(errors.length > 0 ) return [errors, undefined];

        return [undefined, new LoginUserDto(username, password)];
    }
}