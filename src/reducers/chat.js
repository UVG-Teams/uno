import { combineReducers } from 'redux';

import * as gameState from './game';


export const types = {
    MESSAGE_SENDED: 'MESSAGE_SENDED',
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
};

export const actions = {
    sendMessage: message => ({
        type: types.MESSAGE_SENDED,
        payload: message
    }),
    receiveMessage: message => ({
        type: types.MESSAGE_RECEIVED,
        payload: message
    }),
};

const messages = (state = [], action) => {
    switch(action.type) {
        case types.MESSAGE_SENDED: {
            return [ ...state, action.payload ];
        }
        case types.MESSAGE_RECEIVED: {
            return [ ...state, action.payload ];
        }
        case gameState.types.CLOSE_GAME: {
            return [];
        }
        default: return state;
    }
};


export default combineReducers({
    messages,
});

export const getMessages = state => state.messages;
