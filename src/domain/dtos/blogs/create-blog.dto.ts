import { ICreateBlogDto } from "@/domain/interfaces/blogDto.interface";
import { IErrorMsg } from "@/domain/dtos/interfaces";
import { CREATE_BLOG, ERROR_VALIDATION_MSG } from "@/domain/constants/dto/blog.constants";

export class CreateBlogDto{
    constructor(
        public readonly authorId: number,
        public readonly title: string,
        public readonly content: string,
        public readonly categoriesIds: number[],
    ){};

    static validate(props: ICreateBlogDto): IErrorMsg[] {
        const {title, content, categoriesIds} = props;
        let errors: IErrorMsg [] = [];

        if(!title || !content || !categoriesIds){
            if(!title) errors.push({field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MANDATORY});
            if(!content) errors.push({field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MANDATORY});
            if(!categoriesIds) errors.push({field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.MANDATORY});
            return errors;
        };
        
        if(typeof title !== 'string') errors.push({field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.STRING});
        if(typeof content !== 'string') errors.push({field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.STRING});
        if(!Array.isArray(categoriesIds)) errors.push({field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.ARRAY});

        if(errors.length > 0) return errors;

        if(title.trim().length === 0) errors.push({field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.BLANK_SPACES});
        if(title.length < 5) errors.push({field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MIN_LENGTH});
        if(title.length > 150) errors.push({field: CREATE_BLOG.FIELDS.TITLE, message: CREATE_BLOG.ERRORS.TITLE.MAX_LENGTH});
    
        if(content.trim().length === 0) errors.push({field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.BLANK_SPACES});
        if(content.length < 15) errors.push({field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MIN_LENGTH});
        if(content.length > 500) errors.push({field: CREATE_BLOG.FIELDS.CONTENT, message: CREATE_BLOG.ERRORS.CONTENT.MAX_LENGTH});

        if(categoriesIds.length > 0 && categoriesIds.some(category => typeof category !== 'number'))
            errors.push({field: CREATE_BLOG.FIELDS.CATEGORIES, message: CREATE_BLOG.ERRORS.CATEGORIES.NUMBER});
        
        return errors;
    };

    static create(props: ICreateBlogDto): [IErrorMsg[]?, string?, CreateBlogDto?] {
        const {authorId, title, content,categoriesIds} = props;

        if(!authorId || isNaN(authorId)) return [undefined, CREATE_BLOG.ERRORS.AUTOR_ID.NUMBER, undefined];

        const errors: IErrorMsg[] = CreateBlogDto.validate(props);

        if(errors.length > 0) return [errors, ERROR_VALIDATION_MSG, undefined];

        return [undefined, undefined, new CreateBlogDto(authorId, title.trim(), content.trim(), categoriesIds)];
        
    }
}