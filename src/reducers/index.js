import { combineReducers } from 'redux';

import game, * as gameSelectors from './game';
import socket, * as socketSelectors from './socket';

export default combineReducers({
    game,
    socket
});

export const getGameInfo = state => gameSelectors.getGameInfo(state.game);
export const getSocket = state => socketSelectors.getSocket(state.socket);
