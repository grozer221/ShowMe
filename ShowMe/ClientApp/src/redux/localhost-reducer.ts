import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {Dispatch} from "redux";
import {localhostAPI} from "../api/localhost-api";
import {clientsAPI} from "../api/clients-api";
import {ResponseCodes} from "../api/api";
import {actions as appActions} from "./app-reducer";
import {FormAction} from "redux-form";

let initialState = {
    isFetching: false,

    clients: [] as ClientType[],
    isOpenAddClientForm: false,
    selectedClient: null as null | ClientType,
    isOnWebCam: false,

    messageTexts: [] as string[],
    webCamFrame: '',
};

export const localhostReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_IS_FETCHING':
            return {
                ...state,
                isFetching: action.isFetching,
            };
        case 'SET_CLIENTS':
            return {
                ...state,
                clients: action.clients,
            };
        case 'ADD_CLIENTS':
            return {
                ...state,
                clients: [...state.clients, action.client],
            };
        case 'SET_IS_OPEN_ADD_CLIENT_FORM':
            return {
                ...state,
                isOpenAddClientForm: action.flag,
            };
        case 'SET_SELECTED_CLIENT':
            return {
                ...state,
                selectedClient: action.client,
            };
        case 'SET_IS_ON_WEBCAM':
            return {
                ...state,
                isOnWebCam: action.flag,
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messageTexts: [...state.messageTexts, action.messageText],
            };
        case 'SET_WEB_CAM_FRAME':
            return {
                ...state,
                webCamFrame: action.frame,
            };
        case 'TOGGLE_CLIENT_ONLINE':
            return {
                ...state,
                clients: state.clients.map(client =>
                    client.login === action.clientLogin
                        ? {...client, isOnline: action.isOnline}
                        : client
                )
            };

        default:
            return state;
    }
};

export const actions = {
    setIsFetching: (isFetching: boolean) => ({
        type: 'SET_IS_FETCHING',
        isFetching: isFetching
    } as const),
    setClients: (clients: ClientType[]) => ({
        type: 'SET_CLIENTS',
        clients: clients
    } as const),
    addClient: (client: ClientType) => ({
        type: 'ADD_CLIENTS',
        client: client
    } as const),
    setIsOpenAddClientForm: (flag: boolean) => ({
        type: 'SET_IS_OPEN_ADD_CLIENT_FORM',
        flag: flag
    } as const),
    setSelectedClient: (client: ClientType) => ({
        type: 'SET_SELECTED_CLIENT',
        client: client
    } as const),
    setIsOnWebCam: (flag: boolean) => ({
        type: 'SET_IS_ON_WEBCAM',
        flag: flag
    } as const),
    addMessage: (messageText: string) => ({
        type: 'ADD_MESSAGE',
        messageText: messageText
    } as const),
    setWebCamFrame: (frame: string) => ({
        type: 'SET_WEB_CAM_FRAME',
        frame: frame
    } as const),
    toggleClientOnline: (clientLogin: string, isOnline: boolean) => ({
        type: 'TOGGLE_CLIENT_ONLINE',
        clientLogin: clientLogin,
        isOnline: isOnline,
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

let _receiveWebCamFrameInCallHandler: ((bytes: any) => void) | null = null
const receiveWebCamFrameHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveWebCamFrameInCallHandler === null) {
        _receiveWebCamFrameInCallHandler = (bytes) => {
            if (bytes)
                dispatch(actions.setWebCamFrame("data:image/png;base64," + bytes));
            else
                dispatch(actions.setWebCamFrame(""));
        }
    }
    return _receiveWebCamFrameInCallHandler
}

let _toggleClientOnlineHandler: ((clientLogin: string, isOnline: boolean) => void) | null = null
const toggleClientOnlineHandlerCreator = (dispatch: Dispatch) => {
    if (_toggleClientOnlineHandler === null) {
        _toggleClientOnlineHandler = (clientLogin, isOnline) => {
            dispatch(actions.toggleClientOnline(clientLogin, isOnline));
        }
    }
    return _toggleClientOnlineHandler
}

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    localhostAPI.start();
    localhostAPI.subscribe('RECEIVE_MESSAGE', receiveMessageHandlerCreator(dispatch));
    localhostAPI.subscribe('RECEIVE_WEB_CAM_FRAME', receiveWebCamFrameHandlerCreator(dispatch));
    localhostAPI.subscribe('TOGGLE_CLIENT_ONLINE', toggleClientOnlineHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    localhostAPI.unsubscribe('RECEIVE_MESSAGE', receiveMessageHandlerCreator(dispatch));
    localhostAPI.unsubscribe('RECEIVE_WEB_CAM_FRAME', receiveWebCamFrameHandlerCreator(dispatch));
    localhostAPI.unsubscribe('TOGGLE_CLIENT_ONLINE', toggleClientOnlineHandlerCreator(dispatch));
};

export const getClients = (): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await clientsAPI.getClients();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setClients(data.data));
    dispatch(actions.setIsFetching(false));
};

export const addClient = (login: string, password: string): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await clientsAPI.addClient(login, password)
    if (data.resultCode === ResponseCodes.Success) {
        dispatch(appActions.setFormSuccess(true));
        dispatch(actions.addClient(data.data));
    } else {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }
    dispatch(actions.setIsFetching(false));
};

export const sendMessage = (messageText: string): ThunkType => async (dispatch) => {
    localhostAPI.sendMessage(messageText);
};

export const toggleWebCam = (clientLogin: string, flag: boolean): ThunkType => async (dispatch) => {
    localhostAPI.toggleWebCam(clientLogin, flag);
};

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

export type ClientType = {
    id: number
    login: string,
    password: string
    isOnline: boolean,
    dateLastOnline: Date,
}