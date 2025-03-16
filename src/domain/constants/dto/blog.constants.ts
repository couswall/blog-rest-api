export const ERROR_VALIDATION_MSG = 'Validation errors in request';

export const CREATE_BLOG = {
    FIELDS: {
        TITLE: 'title',
        CONTENT: 'content',
        CATEGORIES: 'categoriesIds'
    },
    ERRORS: {
        TITLE: {
            MANDATORY: 'Title is mandatory',
            STRING: 'Title must be a string',
            BLANK_SPACES: 'Title cannot be only blank spaces',
            MIN_LENGTH: 'Title must be at least 5 characters long',
            MAX_LENGTH: 'Title must be at most 20 characters long',
        },
        CONTENT: {
            MANDATORY: 'Content is mandatory',
            STRING: 'Content must be a string',
            MIN_LENGTH: 'Content must be at least 15 characters long',
            MAX_LENGTH: 'Content must be at most 500 characters long',
            BLANK_SPACES: 'Content cannot be only blank spaces',
        },
        AUTOR_ID:{
            NUMBER: 'authorId must be a number'
        },
        CATEGORIES: {
            MANDATORY: 'Category is mandatory',
            ARRAY: 'Categories must be an array',
            NUMBER: 'Categories Ids array must be number type',
            EMPTY: 'Categories Ids must contain at least one category',
        }
    }
}