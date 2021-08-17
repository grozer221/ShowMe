import { AppStateType } from './redux-store';

export const s_getCurrentUserId = (state: AppStateType) => {
    return state.auth.currentUser.id;
}

export const s_getCurrentUser = (state: AppStateType) => {
    return state.auth.currentUser;
}

export const s_getIsAuth = (state: AppStateType) => {
    return state.auth.isAuth;
}

export const s_getIsFetching = (state: AppStateType) => {
    return state.auth.isFetching;
}