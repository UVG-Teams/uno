import { combineReducers } from 'redux';

export const types = {
    CREATE_GAME_STARTED: 'CREATE_GAME_STARTED',
    CREATE_GAME_COMPLETED: 'CREATE_GAME_COMPLETED',
    CREATE_GAME_FAILED: 'CREATE_GAME_FAILED',
    JOIN_GAME_STARTED: 'JOIN_GAME_STARTED',
    JOIN_GAME_COMPLETED: 'JOIN_GAME_COMPLETED',
    JOIN_GAME_FAILED: 'JOIN_GAME_FAILED',
    CLOSE_GAME: 'CLOSE_GAME',
};

export const actions = {
    startCreatingGame: data => ({
        type: types.CREATE_GAME_STARTED,
        payload: data
    }),
    completeCreatingGame: data => ({
        type: types.CREATE_GAME_COMPLETED,
        payload: data
    }),
    failCreatingGame: error => ({
        type: types.CREATE_GAME_FAILED,
        payload: { error }
    }),
    closeGame: () => ({
        type: types.CLOSE_GAME
    }),
    // startJoiningGame: () => ({
    //     type: types.JOIN_GAME_STARTED,
    //     payload: null
    // }),
    // completeJoiningGame: () => ({
    //     type: types.JOIN_GAME_COMPLETED,
    //     payload: null
    // }),
    // failJoiningGame: error => ({
    //     type: types.JOIN_GAME_FAILED,
    //     payload: { error }
    // }),
};

const gameInfo = (state = null, action) => {
    switch(action.type) {
        case types.CREATE_GAME_STARTED: {
            return action.payload;
        }
        case types.CREATE_GAME_COMPLETED: {
            return null;
        }
        case types.CREATE_GAME_FAILED: {
            return null;
        }
        case types.CLOSE_GAME: {
            return null;
        }
        // case types.JOIN_GAME_STARTED: {
        //     return null;
        // }
        // case types.JOIN_GAME_COMPLETED: {
        //     return action.payload;
        // }
        // case types.JOIN_GAME_FAILED: {
        //     return null;
        // }
        default: return state;
    }
};


export default combineReducers({
    gameInfo
});

export const getGameInfo = state => state.gameInfo;