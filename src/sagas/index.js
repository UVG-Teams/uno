import { fork, all } from 'redux-saga/effects';

import { watchWebSocketConnection } from './socket';

function* mainSaga(){
    yield all([
        fork(watchWebSocketConnection),
    ])
}

export default mainSaga;
