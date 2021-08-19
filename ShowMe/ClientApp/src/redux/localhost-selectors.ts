import { AppStateType } from './redux-store';

export const s_getIsFetching = (state: AppStateType) => {
  return state.localhost.isFetching;
}

export const s_getClients = (state: AppStateType) => {
  return state.localhost.clients;
}

export const s_getIsOpenAddClientForm = (state: AppStateType) => {
  return state.localhost.isOpenAddClientForm;
}

export const s_getSelectedClient = (state: AppStateType) => {
  return state.localhost.selectedClient;
}

export const s_getIsOnWebCam = (state: AppStateType) => {
  return state.localhost.isOnWebCam;
}

export const s_getMessageTexts = (state: AppStateType) => {
  return state.localhost.messageTexts;
}

export const s_getWebCamFrame = (state: AppStateType) => {
  return state.localhost.webCamFrame;
}
