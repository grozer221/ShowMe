import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {message} from "antd";

let connection: HubConnection | null = null;

const subscribers = {
    'RECEIVE_MESSAGE': [] as ReceiveMessageSubscriberType[],
    'RECEIVE_WEB_CAM_FRAME': [] as ReceiveWebCamFrameSubscriberType[],
    'TOGGLE_CLIENT_ONLINE': [] as ToggleClientOnlineSubscriberType[],
}

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl(window.location.protocol + '//' + window.location.host + '/socket/localhost')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            message.success('Connected!')

            connection?.on('ReceiveMessage', (messageText: string) => {
                subscribers['RECEIVE_MESSAGE'].forEach(s => s(messageText))
            });
            connection?.on('ReceiveWebCamFrame', (bytes: any) => {
                subscribers['RECEIVE_WEB_CAM_FRAME'].forEach(s => s(bytes))
            });
            connection?.on('ToggleClientOnline', (clientLogin: string, isOnline: boolean) => {
                subscribers['TOGGLE_CLIENT_ONLINE'].forEach(s => s(clientLogin, isOnline))
            });
        })
        .catch((e: any) => message.error('Connection failed: ', e));
}

export const localhostAPI = {
    start() {
        createConnection();
    },
    subscribe(eventName: EventsNamesType, callback: CallbackType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: CallbackType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },

    sendMessage(messageText: string) {
        connection?.send('SendMessage', messageText);
    },

    toggleWebCam(clientLogin: string, flag: boolean) {
        connection?.send('ToggleWebCam', clientLogin, flag);
    },
    ////
}

type ReceiveMessageSubscriberType = (messageText: string) => void
type ReceiveWebCamFrameSubscriberType = (bytes: any) => void
type ToggleClientOnlineSubscriberType = (clientLogin: string, isOnline: boolean) => void

type EventsNamesType =
    'RECEIVE_MESSAGE'
    | 'RECEIVE_WEB_CAM_FRAME'
    | 'TOGGLE_CLIENT_ONLINE'

type CallbackType =
    ReceiveMessageSubscriberType
    | ReceiveWebCamFrameSubscriberType
    | ToggleClientOnlineSubscriberType
