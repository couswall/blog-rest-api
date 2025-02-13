export const regExs = {
    username: {
        noSpaces: /\s/,
        validFormat: /^[a-zA-Z0-9_]+$/,
    },
    email: {
        validFormat: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        specialCharacter: /[^A-Za-z0-9]/,
    }
};

export const ERROR_MESSAGES = {
    USERNAME: {
        REQUIRED: 'Username is required.',
        MAX_LENGTH: 'Username must be at most 15 characters long.',
        SPACES: 'Username cannot contain spaces.',
        INVALID_FORMAT: 'Username can only contain letters, numbers, and underscores.',
        STRING: 'Username must be a string',
        BLANK_SPACES: 'Username cannot contain only blank spaces'
    },
    EMAIL: {
        REQUIRED: 'Email is required.',
        INVALID_FORMAT: 'Invalid email format.',
        STRING: 'Email must be a string',
    },
    PASSWORD: {
        REQUIRED: 'Password is required.',
        MIN_LENGTH: 'Password must be at least 6 characters long.',
        UPPERCASE: 'Password must contain at least one uppercase letter.',
        LOWERCASE: 'Password must contain at least one lowercase letter.',
        NUMBER: 'Password must contain at least one number.',
        SPECIAL_CHAR: 'Password must contain at least one special character.',
        STRING: 'Password must be a string',
    }
};

export const FIELDS = {
    USERNAME: 'username',
    EMAIL: 'email',
    PASSWORD: 'password',
};

export const UPDATE_PASSWORD = {
    FIELDS: {
        CURRENT_PASSWORD: 'currentPassword',
        NEW_PASSWORD: 'newPassword',
        CONFIRM_PASSWORD: 'confirmPassword',
    },
    ERROR_MESSAGES: {
        CURRENT_PASSWORD: {
            REQUIRED: 'Current password is required',
        },
        NEW_PASSWORD: {
            REQUIRED: 'New password is required',
            MIN_LENGTH: 'New password must be at least 6 characters long.',
            UPPERCASE: 'New password must contain at least one uppercase letter.',
            LOWERCASE: 'New password must contain at least one lowercase letter.',
            NUMBER: 'New password must contain at least one number.',
            SPECIAL_CHAR: 'New password must contain at least one special character.',
        },
        CONFIRM_PASSWORD: {
            REQUIRED: 'Confirm password is required',
        },
        PASSWORDS_MATCH: 'Passwords do not match',
    }
};

export const ID_ERROR_MSG = 'ID must be a number';