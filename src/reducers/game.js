import { combineReducers } from 'redux';

export const types = {
    CREATE_GAME_STARTED: 'CREATE_GAME_STARTED',
    CREATE_GAME_COMPLETED: 'CREATE_GAME_COMPLETED',
    CREATE_GAME_FAILED: 'CREATE_GAME_FAILED',
    CLOSE_GAME: 'CLOSE_GAME',
    CURRENT_USER_INFO_SETTED: 'CURRENT_USER_INFO_SETTED',
    CARD_MOVED: 'CARD_MOVED',
    // JOIN_GAME_STARTED: 'JOIN_GAME_STARTED',
    // JOIN_GAME_COMPLETED: 'JOIN_GAME_COMPLETED',
    // JOIN_GAME_FAILED: 'JOIN_GAME_FAILED',
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
    setCurrentUserInfo: userInfo => ({
        type: types.CURRENT_USER_INFO_SETTED,
        payload: userInfo
    }),
    moveCard: movement => ({
        type: types.CARD_MOVED,
        payload: movement
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
        };
        case types.CREATE_GAME_COMPLETED: {
            return null;
        };
        case types.CREATE_GAME_FAILED: {
            return null;
        };
        case types.CLOSE_GAME: {
            return null;
        };
        // case types.JOIN_GAME_STARTED: {
        //     return null;
        // };
        // case types.JOIN_GAME_COMPLETED: {
        //     return action.payload;
        // };
        // case types.JOIN_GAME_FAILED: {
        //     return null;
        // };
        default: return state;
    };
};

const currentUserInfo = (state = null, action) => {
    switch(action.type) {
        case types.CURRENT_USER_INFO_SETTED: {
            return action.payload;
        };
        case types.CLOSE_GAME: {
            return null;
        };
        default: return state;
    };
};

const players = (state = [{
    username: "Luca",
    cards: 0,
},{
    username: "Marco",
    cards: 6,
},{
    username: "Andy",
    cards: 21,
},{
    username: "Block",
    cards: 8,
}], action) => {
    switch(action.type) {
        default: return state;
    };
};

const myCards = (state = [{
    id: 'blue_1',
    content: 'blue_1'
}, {
    id: 'blue_2',
    content: 'blue_2'
}, {
    id: 'green_3',
    content: 'green_3'
}], action) => {
    switch(action.type) {
        case types.CARD_MOVED: {
            if (action.payload.moved_by_me) {
                const new_state = [];

                state.map(card => {
                    if (card.id != action.payload.moved_card.id) {
                        new_state.push(card);
                    };
                });

                return new_state;
            }
            return state;
        }
        default: return state;
    };
};

const currentPlayedCard = (state = null, action) => {
    switch(action.type) {
        case types.CARD_MOVED: {
            if (action.payload.moved_to == 'currentPlayedCard') {
                return action.payload.moved_card;
            }
            return state;
        }
        default: return state;
    };
};

const deck = (state = [], action) => {
    switch(action.type) {
        default: return state;
    };
};

export default combineReducers({
    gameInfo,
    currentUserInfo,
    players,
    myCards,
    currentPlayedCard,
    deck,
});

export const getGameInfo = state => state.gameInfo;
export const getCurrentUserInfo = state => state.currentUserInfo;
export const getCurrentPlayedCard = state => state.currentPlayedCard;
export const getMyCards = state => state.myCards;
export const getPlayers = state => state.players;
