import { combineReducers } from 'redux';

import game, * as gameSelectors from './game';
import chat, * as chatSelectors from './chat';
import socket, * as socketSelectors from './socket';

export default combineReducers({
    game,
    chat,
    socket
});

export const getGameInfo = state => gameSelectors.getGameInfo(state.game);
export const getCurrentUserInfo = state => gameSelectors.getCurrentUserInfo(state.game);
export const getSocket = state => socketSelectors.getSocket(state.socket);
export const getMessages = state => chatSelectors.getMessages(state.chat);
