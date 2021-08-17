import { AppStateType } from './redux-store';

export const s_getInitialised = (state: AppStateType) => {
    return state.app.initialised;
}

export const s_getFormError = (state: AppStateType) => {
    return state.app.formError;
}

export const s_getFormSuccess = (state: AppStateType) => {
    return state.app.formSuccess;
}