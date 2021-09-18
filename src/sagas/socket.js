import { takeEvery, put } from 'redux-saga/effects';


import { types, actions } from '../reducers/socket';


function* webSocketConnection(action) {
    try {

        console.log("Connecting to server...");

        // Create WebSocket connection. https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
        const socket = new WebSocket(action.payload.url);

        yield put(actions.completeWSConnection(socket));

    } catch (error) {
        yield put(actions.failWSConnection('Unexpected error! ', error));
    }
};

// ·
export function* watchWebSocketConnection() {
    yield takeEvery(
        types.WS_CONNECTION_STARTED,
        webSocketConnection,
    )
};
