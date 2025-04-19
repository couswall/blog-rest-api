import { ERRORS } from "@/domain/constants/dto/comment.constants";
import { ICommentBase } from "@/domain/interfaces/comment.dto.interfaces";

export class CreateCommentDto {
    constructor(
        public readonly authorId: number,
        public readonly blogId: number,
        public readonly content: string,
    ){};

    static create(props: ICommentBase): [string?, CreateCommentDto?]{
        const {blogId, content, authorId} = props;

        if(!authorId) return [ERRORS.AUTHOR_ID.REQUIRED];
        if(typeof authorId !== 'number') return [ERRORS.AUTHOR_ID.NUMBER];

        if(!blogId) return [ERRORS.BLOG_ID.REQUIRED];
        if(typeof blogId !== 'number') return [ERRORS.BLOG_ID.NUMBER];
        
        if(!content) return [ERRORS.COMMENT.MANDATORY];
        if(typeof content !== 'string') return [ERRORS.COMMENT.STRING];
        const commentValidations: {validation: boolean, errorMessage: string}[] = [
            {validation: content.trim().length === 0, errorMessage: ERRORS.COMMENT.BLANK_SPACES},
            {validation: content.length < 2, errorMessage: ERRORS.COMMENT.MIN_LENGHT},
            {validation: content.length > 40, errorMessage: ERRORS.COMMENT.MAX_LENGHT},
        ];

        for (const validation of commentValidations) {
            if (validation.validation) return [validation.errorMessage];
        }
        
        return [undefined, new CreateCommentDto(authorId, blogId, content.trim())];
    }
}