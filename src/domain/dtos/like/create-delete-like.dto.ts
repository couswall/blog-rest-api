import { DTO_ERRORS } from "@/domain/constants/dto/like.constants";
import { ICreateDeleteLikeDto } from "@/domain/interfaces/like.dto.interface";

export class CreateDeleteLikeDto {
    constructor(
        public readonly userId: number,
        public readonly blogId: number,
    ){};

    static create(props: ICreateDeleteLikeDto): [string?, CreateDeleteLikeDto?]{
        const {userId, blogId} = props;

        if (!userId) return [DTO_ERRORS.CREATE_DELETE.USER_ID.REQUIRED, undefined];
        if (isNaN(userId)) return [DTO_ERRORS.CREATE_DELETE.USER_ID.NUMBER, undefined];

        if(!blogId) return [DTO_ERRORS.CREATE_DELETE.BLOG_ID.REQUIRED, undefined];
        if(isNaN(blogId)) return [DTO_ERRORS.CREATE_DELETE.BLOG_ID.NUMBER, undefined];

        return [undefined, new CreateDeleteLikeDto(userId, blogId)];
    }
}