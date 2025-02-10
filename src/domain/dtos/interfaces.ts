export interface ICreateUser {
    username: string;
    email: string;
    password: string;
    usernameUpdatedAt: Date | null;
};

export interface IErrorMsg {
    field: string;
    message: string;
}

export interface ILoginUser {
    username: string;
    password: string;
}

export interface IUpdatePassword{
    id: number;
    username: string;
}

export interface IUpdatePassword{
    id: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}