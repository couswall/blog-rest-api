export const LIKE_RESPONSE = {
    SUCCESS: {
        TOGGLE: 'Like toggled succesfully',
        LIKES_BY_BLOGID: 'Likes by blogId',
        LIKES_BY_USERID: 'Likes by userId'
    },
    ERRORS: {
        LIKES_BY_BLOGID: {
            NUMBER: 'blogId must be a number',
        },
        LIKES_BY_USERID: {
            NUMBER: 'userId must be a number',
        }
    }
}