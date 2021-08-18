import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {message} from "antd";

let connection: HubConnection | null = null;

const subscribers = {
    'RECEIVE_MESSAGE': [] as ReceiveMessageSubscriberType[],
    'RECEIVE_VIDEO': [] as ReceiveVideoSubscriberType[],
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

            connection?.on('ReceiveVideo', (bytes: number[]) => {
                subscribers['RECEIVE_VIDEO'].forEach(s => s(bytes))
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
    ////
}

type ReceiveMessageSubscriberType = (messageText: string) => void
type ReceiveVideoSubscriberType = (bytes: number[]) => void

type EventsNamesType =
    'RECEIVE_MESSAGE'
    | 'RECEIVE_VIDEO'

type CallbackType =
    ReceiveMessageSubscriberType
    | ReceiveVideoSubscriberType
