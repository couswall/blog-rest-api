import { ERROR_MESSAGES, FIELDS, regExs } from "@/domain/constants/dto/user.constants";
import { ICreateUser, IErrorMsg } from "@/domain/dtos/interfaces";

export class CreateUserDto {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
    ){}

    static validate(props: ICreateUser): IErrorMsg[] {
        const {username, email, password} = props;
        let errors: IErrorMsg[] = [];

        if (!username || username.trim().length === 0) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
        if(username.length > 15) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH});
        if(regExs.username.noSpaces.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES});
        if(!regExs.username.validFormat.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT})

        if (!email || email.trim().length === 0) errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.REQUIRED});
        if(!regExs.email.validFormat.test(email)) errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.INVALID_FORMAT});
        
        if (!password) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED});
        if(password.length < 6) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.MIN_LENGTH});
        if(!regExs.password.uppercase.test(password)) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.UPPERCASE});
        if(!regExs.password.lowercase.test(password)) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.LOWERCASE});
        if(!regExs.password.number.test(password)) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.NUMBER});
        if(!regExs.password.specialCharacter.test(password)) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.SPECIAL_CHAR});

        return errors;
    }

    static create(props: ICreateUser): [IErrorMsg[]?, CreateUserDto?]{
        const errors = CreateUserDto.validate(props);
        const {username, email, password} = props;

        if(errors.length > 0) return [errors, undefined];

        return [undefined, new CreateUserDto(username, email.toLowerCase(), password)];
    }
}