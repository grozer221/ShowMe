import {instance, ProfileType} from "./api";
import {ResponseType} from './api'

export const authAPI = {
    isAuth() {
        return instance.get<Response>('account/isauth')
            .then(res => res.data);
    },
    login(login: string, password: string) {
        return instance.post<Response>('account/login', {'login': login, 'password': password})
            .then(res => res.data);
    },
    register(login: string, password: string, confirmPassword: string) {
        return instance.post<Response>('account/register', {'login': login, 'password': password, 'confirmPassword': confirmPassword})
            .then(res => res.data);
    },
    logout() {
        return instance.delete<ResponseType>('account/logout')
            .then(res => res.data);
    }
};

type Response = ResponseType & {data: ProfileType}
