import {ID_ERROR_MSG, regExs, UPDATE_PASSWORD} from "@/domain/constants/dto/user.constants";
import { IErrorMsg, IUpdatePassword } from "@/domain/dtos/interfaces";

export class UpdatePasswordDto {
    constructor(
        public readonly id: number,
        public readonly currentPassword: string,
        public readonly newPassword: string,
        public readonly confirmPassword: string,
    ){};

    static validate(props: IUpdatePassword): IErrorMsg[]{
        const {currentPassword,newPassword,confirmPassword} = props;
        let errors: IErrorMsg[] = [];

        if (!currentPassword) {
            errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.REQUIRED});
            return errors;
        }
        if(currentPassword.trim().length === 0) errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.REQUIRED});

        if (!newPassword) {
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.REQUIRED});
            return errors;
        };

        if(newPassword.length < 6) 
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.MIN_LENGTH});
        if(!regExs.password.uppercase.test(newPassword))
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.UPPERCASE});
        if(!regExs.password.lowercase.test(newPassword))
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.LOWERCASE});
        if(!regExs.password.number.test(newPassword))
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.NUMBER});
        if(!regExs.password.specialCharacter.test(newPassword))
            errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.SPECIAL_CHAR});

        if(!confirmPassword){
            errors.push({field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.REQUIRED});
            return errors;
        };

        if(newPassword !== confirmPassword)
            errors.push({field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.PASSWORDS_MATCH});

        return errors;
    };

    static create(props: IUpdatePassword): [IErrorMsg[]?, string?, UpdatePasswordDto?]{
        const {id, currentPassword, newPassword, confirmPassword} = props

        if(!id || isNaN(id)) return [undefined, ID_ERROR_MSG, undefined];
        
        const errors = UpdatePasswordDto.validate(props);
        if(errors.length > 0) return [errors, 'Validation errors in request', undefined];

        return[undefined, undefined, new UpdatePasswordDto(id, currentPassword, newPassword, confirmPassword)]
    }


}