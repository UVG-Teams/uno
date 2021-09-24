import { takeEvery, put, select } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';


import * as selectors from '../reducers';
import * as gameState from '../reducers/game';
import * as socketState from '../reducers/socket';


function* leaveGame(action) {
    console.log("Leaving game...");

    const currentUser = yield select(selectors.getCurrentUserInfo);
    const gameInfo = yield select(selectors.getGameInfo);
    const socket = yield select(selectors.getSocket);
    const deck = yield select(selectors.getGameDeck);

    if (socket && currentUser) {

        // If deck means that the user was already in
        if (deck.length > 0) {

            const message = {
                type: 'leave_game',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                sent_at: Date.now(),
            };

            const headers = btoa(JSON.stringify({ roomCode: gameInfo.roomCode }));
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(message), gameInfo.password).toString();

            socket.send(JSON.stringify({
                headers: headers,
                body: ciphertext
            }));

        };

        socket.close();
    };

    yield put(socketState.actions.destroyWSConnection());
    yield put(gameState.actions.completeClosingGame());

};

// ·
export function* watchLeaveGame() {
    yield takeEvery(
        gameState.types.CLOSE_GAME_STARTED,
        leaveGame,
    )
};
