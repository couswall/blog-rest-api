import { IErrorMsg, IUpdateUsername } from "@src/domain/dtos/interfaces";
import { ERROR_MESSAGES, FIELDS, ID_ERROR_MSG, regExs } from "@/domain/constants/dto/user.constants";
import { ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";

export class UpdateUsernameDto {
    constructor(
        public readonly id: number,
        public readonly username: string,
    ){}
    
    static validate(props: IUpdateUsername): IErrorMsg[]{
        const {username} = props;
        let errors: IErrorMsg[] = [];

        if (!username){
            errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
            return errors;
        };

        if(typeof username !== 'string') errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.STRING});
        if(errors.length > 0) return errors;

        if(username.trim().length === 0) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.BLANK_SPACES});
        if(username.length > 30) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH});
        if(regExs.username.noSpaces.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES});
        if(!regExs.username.validFormat.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT})

        return errors;
    };

    static create(props: IUpdateUsername): [IErrorMsg[]?, string?, UpdateUsernameDto?]{
        const {id, username} = props;

        if(!id || isNaN(id)) return [undefined, ID_ERROR_MSG, undefined];
        
        const errors: IErrorMsg[] = UpdateUsernameDto.validate(props);
        if(errors.length > 0) return [errors, ERROR_VALIDATION_MSG, undefined];
        
        return [undefined, undefined, new UpdateUsernameDto(id, username)];
    }
}