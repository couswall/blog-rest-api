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

        if (!currentPassword || !newPassword || !confirmPassword) {
            if(!currentPassword) errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.REQUIRED});
            if(!newPassword) errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.REQUIRED});
            if(!confirmPassword) errors.push({field: UPDATE_PASSWORD.FIELDS.CONFIRM_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.REQUIRED});
            return errors;
        }

        if(typeof currentPassword !== 'string') errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CURRENT_PASSWORD.STRING});
        if(typeof newPassword !== 'string') errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.STRING});
        if(typeof confirmPassword !== 'string') errors.push({field: UPDATE_PASSWORD.FIELDS.CURRENT_PASSWORD, message: UPDATE_PASSWORD.ERROR_MESSAGES.CONFIRM_PASSWORD.STRING});

        if(errors.length > 0) return errors;

        const passwordChecks = [
            { condition: newPassword.length < 6, message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.MIN_LENGTH },
            { condition: !regExs.password.uppercase.test(newPassword), message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.UPPERCASE },
            { condition: !regExs.password.lowercase.test(newPassword), message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.LOWERCASE },
            { condition: !regExs.password.number.test(newPassword), message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.NUMBER },
            { condition: !regExs.password.specialCharacter.test(newPassword), message: UPDATE_PASSWORD.ERROR_MESSAGES.NEW_PASSWORD.SPECIAL_CHAR }
        ];
        
        passwordChecks.forEach(({condition, message}) => {
            if(condition) errors.push({field: UPDATE_PASSWORD.FIELDS.NEW_PASSWORD, message});
        });

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