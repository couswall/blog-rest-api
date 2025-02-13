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

        if (!username || !email || !password) {
            if(!username) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
            if(!email) errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.REQUIRED});
            if (!password) errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.REQUIRED});
            return errors;
        }

        if(typeof username !== 'string') errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING});
        if(typeof email !== 'string') errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.STRING});
        if(typeof password !== 'string') errors.push({field: FIELDS.PASSWORD, message: ERROR_MESSAGES.PASSWORD.STRING});

        if(errors.length > 0) return errors;

        if (username.trim().length === 0) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.BLANK_SPACES});
        if(username.length > 15) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH});
        if(regExs.username.noSpaces.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES});
        if(!regExs.username.validFormat.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT})

        if (email.trim().length === 0) errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.REQUIRED});
        if(!regExs.email.validFormat.test(email)) errors.push({field: FIELDS.EMAIL, message: ERROR_MESSAGES.EMAIL.INVALID_FORMAT});
        
        const passwordChecks = [
            { condition: password.length < 6, message: ERROR_MESSAGES.PASSWORD.MIN_LENGTH },
            { condition: !regExs.password.uppercase.test(password), message: ERROR_MESSAGES.PASSWORD.UPPERCASE },
            { condition: !regExs.password.lowercase.test(password), message: ERROR_MESSAGES.PASSWORD.LOWERCASE },
            { condition: !regExs.password.number.test(password), message: ERROR_MESSAGES.PASSWORD.NUMBER },
            { condition: !regExs.password.specialCharacter.test(password), message: ERROR_MESSAGES.PASSWORD.SPECIAL_CHAR }
        ];

        passwordChecks.forEach(({condition, message}) => {
            if(condition) errors.push({field: FIELDS.PASSWORD, message});
        });

        return errors;
    }

    static create(props: ICreateUser): [IErrorMsg[]?, CreateUserDto?]{
        const errors = CreateUserDto.validate(props);
        const {username, email, password} = props;

        if(errors.length > 0) return [errors, undefined];

        return [undefined, new CreateUserDto(username, email.toLowerCase(), password)];
    }
}