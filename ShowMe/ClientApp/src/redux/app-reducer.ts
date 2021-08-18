import {getAuthUserData} from './auth-reducer';
import {InferActionsTypes} from "./redux-store";

let initialState = {
    initialised: false,
    formError: '',
    formSuccess: null as null | boolean,
};

const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'INITIALISED_SUCCESS':
            return {
                ...state,
                initialised: true,
            };
        case 'SET_FORM_ERROR':
            return {
                ...state,
                formError: action.error
            };
        case 'SET_FORM_SUCCESS':
            return {
                ...state,
                formSuccess: action.success
            };
        default:
            return state;
    }
};

export const actions = {
    initialisedSuccess: () => ({type: 'INITIALISED_SUCCESS'} as const),
    setFormError: (error: string) => ({
        type: 'SET_FORM_ERROR',
        error: error
    } as const),
    setFormSuccess: (success: boolean | null) => ({
        type: 'SET_FORM_SUCCESS',
        success: success
    } as const),
}

export const initialiseApp = () => (dispatch: any) => {
    let promise = dispatch(getAuthUserData());
    Promise.all([promise])
        .then(() => {
            dispatch(actions.initialisedSuccess());
        });
};

export default appReducer;

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>