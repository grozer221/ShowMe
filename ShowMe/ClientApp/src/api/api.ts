import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    baseURL: window.location.protocol + '//' + window.location.host + '/api/',
});

export enum ResponseCodes {
    Success = 0,
    Error = 1
}

export type ProfileType = {
    id: number
    login: string
    password: string
}

export type ResponseType = {
    resultCode: ResponseCodes,
    messages: string[],
}







