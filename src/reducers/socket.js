import { combineReducers } from 'redux';

export const types = {
    WS_CONNECTION_STARTED: 'WS_CONNECTION_STARTED',
    WS_CONNECTION_COMPLETED: 'WS_CONNECTION_COMPLETED',
    WS_CONNECTION_FAILED: 'WS_CONNECTION_FAILED',
    WS_CONNECTION_DESTROYED: 'WS_CONNECTION_DESTROYED',
};

export const actions = {
    startWSConnection: data => ({
        type: types.WS_CONNECTION_STARTED,
        payload: data
    }),
    completeWSConnection: socket => ({
        type: types.WS_CONNECTION_COMPLETED,
        payload: socket
    }),
    failWSConnection: error => ({
        type: types.WS_CONNECTION_FAILED,
        payload: { error }
    }),
    destroyWSConnection: () => ({
        type: types.WS_CONNECTION_DESTROYED
    })
};

const socket = (state = null, action) => {
    switch(action.type) {
        case types.WS_CONNECTION_STARTED: {
            return null;
        };
        case types.WS_CONNECTION_COMPLETED: {
            return action.payload;
        };
        case types.WS_CONNECTION_FAILED: {
            return null;
        };
        case types.WS_CONNECTION_DESTROYED: {
            return null;
        };
        default: return state;
    };
};


export default combineReducers({
    socket
});

export const getSocket = state => state.socket;
