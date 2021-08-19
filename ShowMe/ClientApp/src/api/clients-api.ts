import {instance, ResponseType} from "./api";
import {ClientType} from "../redux/localhost-reducer";

export const clientsAPI = {
    getClients() {
        return instance.get<getClientsResponse>('clients')
            .then(res => res.data);
    },
    addClient(login: string, password: string) {
        return instance.put<addClientResponse>('clients', {'login': login, 'password': password})
            .then(res => res.data);
    },
};

type getClientsResponse = ResponseType & { data: ClientType[] };
type addClientResponse = ResponseType & { data: ClientType };
