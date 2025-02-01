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
    },
    EMAIL: {
        REQUIRED: 'Email is required.',
        INVALID_FORMAT: 'Invalid email format.',
    },
    PASSWORD: {
        REQUIRED: 'Password is required.',
        MIN_LENGTH: 'Password must be at least 6 characters long.',
        UPPERCASE: 'Password must contain at least one uppercase letter.',
        LOWERCASE: 'Password must contain at least one lowercase letter.',
        NUMBER: 'Password must contain at least one number.',
        SPECIAL_CHAR: 'Password must contain at least one special character.',
    }
};

export const FIELDS = {
    USERNAME: 'username',
    EMAIL: 'email',
    PASSWORD: 'password',
};
