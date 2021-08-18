import {FormAction} from 'redux-form';
import {ProfileType, ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {actions as appActions} from './app-reducer';

let initialState = {
    currentUser: {} as ProfileType,
    isAuth: false,
    isFetching: false,
};

const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_IS_FETCHING':
            return {
                ...state,
                isFetching: action.isFetching,
            };

        default:
            return state;
    }
};

export const actions = {
    setAuthUserData: (user: ProfileType, isAuth: boolean) => ({
        type: 'SET_USER_DATA',
        payload: {currentUser: user, isAuth: isAuth}
    } as const),
    setIsFetching: (isFetching: boolean) => ({
        type: 'SET_IS_FETCHING',
        isFetching: isFetching
    } as const),
}

export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const login = (login: string, password: string): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await authAPI.login(login, password);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
    else if (data.resultCode === ResponseCodes.Error) {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }
    dispatch(actions.setIsFetching(false));
};

export const register = (login: string, password: string, confirmPassword: string): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await authAPI.register(login, password, confirmPassword);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
    else if (data.resultCode === ResponseCodes.Error) {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }
    dispatch(actions.setIsFetching(false));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData({} as ProfileType, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;