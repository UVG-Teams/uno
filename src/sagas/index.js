import { fork, all } from 'redux-saga/effects';

import { watchCreateWebSocketServer } from './game';

function* mainSaga(){
    yield all([
        fork(watchCreateWebSocketServer),
    ])
}

export default mainSaga;
