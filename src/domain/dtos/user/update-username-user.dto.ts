import { IErrorMsg, IUpdatePassword } from "@src/domain/dtos/interfaces";
import { ERROR_MESSAGES, FIELDS, ID_ERROR_MSG, regExs } from "@/domain/constants/dto/user.constants";

export class UpdateUsernameDto {
    constructor(
        public readonly id: number,
        public readonly username: string,
    ){}
    
    static validate(props: IUpdatePassword): IErrorMsg[]{
        const {username} = props;
        let errors: IErrorMsg[] = [];

        if (!username){
            errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
            return errors;
        };
        if(username.trim().length === 0) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.REQUIRED});
        if(username.length > 15) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.MAX_LENGTH});
        if(regExs.username.noSpaces.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.SPACES});
        if(!regExs.username.validFormat.test(username)) errors.push({field: FIELDS.USERNAME, message: ERROR_MESSAGES.USERNAME.INVALID_FORMAT})

        return errors;
    };

    static create(props: IUpdatePassword): [IErrorMsg[]?, string?, UpdateUsernameDto?]{
        const {id, username} = props;

        if(!id || isNaN(id)) return [undefined, ID_ERROR_MSG, undefined];
        
        const errors: IErrorMsg[] = UpdateUsernameDto.validate(props);
        if(errors.length > 0) return [errors, 'Validation errors in request', undefined];
        
        return [undefined, undefined, new UpdateUsernameDto(id, username)];
    }
}