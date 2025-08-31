/* eslint-disable @typescript-eslint/no-unused-vars */

export interface IUser {
    id?: string;
    name: string;
    surname: string;
    telephone: string;
    email: string;
    password?: string
    role?: string
    avatar?: string
}
export interface INewUser {
    id?:string
    name: string;
    surname: string;
    telephone: string;
    email: string;
}

export interface IClient {
    id:string
    name: string;
    surname: string;
    telephone: string;
    email: string;
    password?: string
    role?: string
    avatar?: string
}


