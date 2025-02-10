import { IErrorMsg, IUpdatePassword } from "@src/domain/dtos/interfaces";
import { ERROR_MESSAGES, FIELDS, ID_ERROR, regExs } from "@/domain/constants/dto/user.constants";

export class UpdateUsernameDto {
    constructor(
        public readonly id: number,
        public readonly username: string,
    ){}
    
    static validate(props: IUpdatePassword): IErrorMsg[]{
        const {id, username} = props;
        let errors: IErrorMsg[] = [];

        if(!id || isNaN(id)) {
            errors.push({field: ID_ERROR.FIELD, message: ID_ERROR.MESSAGE});
            return errors;
        };
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

    static create(props: IUpdatePassword): [IErrorMsg[]?, UpdateUsernameDto?]{
        const {id, username} = props;
        const errors: IErrorMsg[] = UpdateUsernameDto.validate(props);

        if(errors.length > 0) return [errors, undefined];
        return [undefined, new UpdateUsernameDto(id, username)];
    }
}