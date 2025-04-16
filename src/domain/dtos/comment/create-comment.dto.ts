import { ERROR_BLOG_ID_NUMBER, ERRORS } from "@/domain/constants/dto/comment.constants";
import { ICommentBase } from "@/domain/interfaces/comment.dto.interfaces";

export class CreateCommentDto {
    constructor(
        public readonly blogId: number,
        public readonly comment: string,
    ){};

    static create(props: ICommentBase): [string?, CreateCommentDto?]{
        const {blogId, comment} = props;

        if(!blogId || isNaN(blogId)) return [ERROR_BLOG_ID_NUMBER];
        if(!comment) return [ERRORS.COMMENT.MANDATORY];
        if(typeof comment !== 'string') return [ERRORS.COMMENT.STRING];

        const commentValidations: {validation: boolean, errorMessage: string}[] = [
            {validation: comment.trim().length === 0, errorMessage: ERRORS.COMMENT.BLANK_SPACES},
            {validation: comment.length < 2, errorMessage: ERRORS.COMMENT.MIN_LENGHT},
            {validation: comment.length > 40, errorMessage: ERRORS.COMMENT.MAX_LENGHT},
        ];

        for (const validation of commentValidations) {
            if (validation.validation) return [validation.errorMessage];
        }
        
        return [undefined, new CreateCommentDto(blogId, comment.trim())];
    }
}