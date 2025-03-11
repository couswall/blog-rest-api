import { CATEGORY_ERRORS } from "@/domain/constants/dto/category.constants";
import { ICreateCategoryDto } from "@/domain/interfaces/category-dto.interface";

export class CreateCategoryDto{
    constructor(
        public readonly name: string,
    ){};

    static validate(props: ICreateCategoryDto): string | undefined{
        const {name} = props;
        let errorMessage: string | undefined;

        if(!name) return CATEGORY_ERRORS.REQUIRED;
        if(typeof name !== 'string') return CATEGORY_ERRORS.STRING;

        const validations = [
            {condition: name.trim().length === 0, message: CATEGORY_ERRORS.BLANK_SPACES},
            {condition: name.length < 3, message: CATEGORY_ERRORS.MIN_LENGTH},
            {condition: name.length > 30, message: CATEGORY_ERRORS.MAX_LENGTH},
        ];

        for(const validation of validations){
            if(validation.condition) {
                errorMessage = validation.message;
                break;
            };
        }

        return errorMessage;
    }

    static create(props: ICreateCategoryDto): [string?, CreateCategoryDto?]{
        const {name} = props;
        const errorMessage = CreateCategoryDto.validate(props);
        
        if(errorMessage) return [errorMessage, undefined];

        return [undefined, new CreateCategoryDto(name.trim())];
    }
}