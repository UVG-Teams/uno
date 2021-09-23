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
export const getCurrentPlayedCard = state => gameSelectors.getCurrentPlayedCard(state.game);
export const getMyCards = state => gameSelectors.getMyCards(state.game);
export const getPlayers = state => gameSelectors.getPlayers(state.game);
export const getGameDeck = state => gameSelectors.getDeck(state.game);
export const getChangedColor = state => gameSelectors.getChangedColor(state.game);
export const getTurns = state => gameSelectors.getTurns(state.game);
export const getTurnsList = state => gameSelectors.getTurnsList(state.game);
export const getReverse = state => gameSelectors.getReverse(state.game);
