import { IUpdateBlogDto, IBasedBlogDto } from "@/domain/interfaces/blogDto.interface";
import { IErrorMsg } from "@/domain/dtos/interfaces";
import { validateBlogProperties } from "@/domain/dtos/blogs/helpers";
import { ID_ERROR_MSG } from "@/domain/constants/dto/user.constants";
import { ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";


export class UpdateBlogDto {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly content: string,
        public readonly categoriesIds: number[],
    ){};

    static validate(props: IBasedBlogDto): IErrorMsg[] {
        return validateBlogProperties(props);
    };

    static create(props: IUpdateBlogDto): [IErrorMsg[]?, string?, UpdateBlogDto?]{
        const {id, title, content,categoriesIds} = props;

        if(!id || isNaN(id)) return [undefined, ID_ERROR_MSG, undefined];

        const errors: IErrorMsg[] = UpdateBlogDto.validate(props);
        
        if(errors.length > 0) return [errors, ERROR_VALIDATION_MSG, undefined];

        return [undefined, undefined, new UpdateBlogDto(id, title, content, categoriesIds)]
    }
}