import { fork, all } from 'redux-saga/effects';

import { watchWebSocketConnection } from './socket';
import { watchLeaveGame } from './game';

function* mainSaga(){
    yield all([
        fork(watchWebSocketConnection),
        fork(watchLeaveGame),
    ])
}

export default mainSaga;
