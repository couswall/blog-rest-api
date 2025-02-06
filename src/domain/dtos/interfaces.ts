export interface ICreateUser {
    username: string;
    email: string;
    password: string;
};

export interface IErrorMsg {
    field: string;
    message: string;
}

export interface ILoginUser {
    username: string;
    password: string;
}