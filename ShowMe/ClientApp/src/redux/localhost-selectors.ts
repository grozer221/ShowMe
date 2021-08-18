import { AppStateType } from './redux-store';

export const s_getMessageTexts = (state: AppStateType) => {
  return state.localhost.messageTexts;
}
