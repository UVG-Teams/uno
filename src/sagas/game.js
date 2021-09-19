import { takeEvery, put, select } from 'redux-saga/effects';


import * as selectors from '../reducers';
import * as gameState from '../reducers/game';
import * as socketState from '../reducers/socket';


function* leaveGame(action) {
    console.log("Leaving game...");

    const currentUser = yield select(selectors.getCurrentUserInfo);
    const socket = yield select(selectors.getSocket);
    console.log("AVER", socket, currentUser)

    if (socket || currentUser) {
        socket.send(
            JSON.stringify({
                type: 'leave_game',
                sent_by: currentUser.username,
                sent_at: Date.now(),
            })
        );
    
        socket.close();
    }

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
