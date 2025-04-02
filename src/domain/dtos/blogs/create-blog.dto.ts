import { ICreateBlogDto, IBasedBlogDto } from "@/domain/interfaces/blogDto.interface";
import { IErrorMsg } from "@/domain/dtos/interfaces";
import { CREATE_BLOG, ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";
import { validateBlogProperties } from "@/domain/dtos/blogs/helpers";

export class CreateBlogDto{
    constructor(
        public readonly authorId: number,
        public readonly title: string,
        public readonly content: string,
        public readonly categoriesIds: number[],
    ){};

    static validate(props: IBasedBlogDto): IErrorMsg[] {
        return validateBlogProperties(props);
    };

    static create(props: ICreateBlogDto): [IErrorMsg[]?, string?, CreateBlogDto?] {
        const {authorId, title, content,categoriesIds} = props;

        if(!authorId || isNaN(authorId)) return [undefined, CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER, undefined];

        const errors: IErrorMsg[] = CreateBlogDto.validate(props);

        if(errors.length > 0) return [errors, ERROR_VALIDATION_MSG, undefined];

        return [undefined, undefined, new CreateBlogDto(authorId, title.trim(), content.trim(), categoriesIds)];
        
    }
}