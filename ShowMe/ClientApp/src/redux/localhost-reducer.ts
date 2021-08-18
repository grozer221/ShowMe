import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {Dispatch} from "redux";
import {localhostAPI} from "../api/localhost-api";

let initialState = {
    isFetching: false,
    messageTexts: [] as string[],
};

export const localhostReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messageTexts: [...state.messageTexts, action.messageText],
            };

        default:
            return state;
    }
};

export const actions = {
    addMessage: (messageText: string) => ({
        type: 'ADD_MESSAGE',
        messageText: messageText
    } as const),
}

let _receiveMessageInCallHandler: ((messageText: string) => void) | null = null
const receiveMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveMessageInCallHandler === null) {
        _receiveMessageInCallHandler = (messageText) => {
            dispatch(actions.addMessage(messageText))
        }
    }
    return _receiveMessageInCallHandler
}

let _receiveVideoInCallHandler: ((bytes: number[]) => void) | null = null
const receiveVideoHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveVideoInCallHandler === null) {
        _receiveVideoInCallHandler = (bytes) => {

        }
    }
    return _receiveVideoInCallHandler
}

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    localhostAPI.start();
    localhostAPI.subscribe('RECEIVE_MESSAGE', receiveMessageHandlerCreator(dispatch));
    localhostAPI.subscribe('RECEIVE_VIDEO', receiveVideoHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    localhostAPI.unsubscribe('RECEIVE_MESSAGE', receiveMessageHandlerCreator(dispatch));
    localhostAPI.unsubscribe('RECEIVE_VIDEO', receiveVideoHandlerCreator(dispatch));
};

export const sendMessage = (messageText: string): ThunkType => async (dispatch) => {
    localhostAPI.sendMessage(messageText);
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;