import { combineReducers } from 'redux';

const COLORS = ['blue', 'green', 'red', 'yellow'];
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const types = {
    CREATE_GAME_STARTED: 'CREATE_GAME_STARTED',
    CREATE_GAME_COMPLETED: 'CREATE_GAME_COMPLETED',
    CREATE_GAME_FAILED: 'CREATE_GAME_FAILED',
    CLOSE_GAME_STARTED: 'CLOSE_GAME_STARTED',
    CLOSE_GAME_COMPLETED: 'CLOSE_GAME_COMPLETED',
    CURRENT_USER_INFO_SETTED: 'CURRENT_USER_INFO_SETTED',
    CARD_MOVED: 'CARD_MOVED',
    NEW_USER_RECEIVED: 'NEW_USER_RECEIVED',
    PLAYER_REMOVED: 'PLAYER_REMOVED',
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
    startClosingGame: () => ({
        type: types.CLOSE_GAME_STARTED,
    }),
    completeClosingGame: () => ({
        type: types.CLOSE_GAME_COMPLETED,
    }),
    setCurrentUserInfo: userInfo => ({
        type: types.CURRENT_USER_INFO_SETTED,
        payload: userInfo
    }),
    moveCard: movement => ({
        type: types.CARD_MOVED,
        payload: movement
    }),
    receiveNewUser: data => ({
        type: types.NEW_USER_RECEIVED,
        payload: data
    }),
    removePlayer: username => ({
        type: types.PLAYER_REMOVED,
        payload: username
    })
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
        case types.CLOSE_GAME_COMPLETED: {
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
        case types.CLOSE_GAME_COMPLETED: {
            return null;
        };
        default: return state;
    };
};

const players = (state = [], action) => {
    switch(action.type) {
        case types.NEW_USER_RECEIVED: {
            return [
                ...state,
                {
                    username: action.payload.username,
                    cards: 0,
                }
            ];
        };
        case types.CLOSE_GAME_COMPLETED: {
            return [];
        };
        case types.PLAYER_REMOVED: {
            const newState = [];

            state.map(player => {
                if (player.username != action.payload) {
                    newState.push(player);
                };
            });

            return newState;
        };
        case types.CARD_MOVED: {
            if (!action.payload.moved_by_me) {
                const newState = [];

                state.map(player => {
                    let tempPlayer = { ...player };

                    if (player.username == action.payload.moved_by) {
                        if (action.payload.moved_to == 'currentPlayedCard') {
                            // Puts card
                            tempPlayer.cards = player.cards - 1;
                        } else {
                            // Takes card
                            tempPlayer.cards = player.cards + 1;
                        }
                    };

                    newState.push(tempPlayer);
                });

                return newState;
            }
            return state;
        };
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
            if (action.payload.moved_by_me && action.payload.moved_to == 'currentPlayedCard') {
                const newState = [];

                state.map(card => {
                    if (card.id != action.payload.moved_card.id) {
                        newState.push(card);
                    };
                });

                return newState;
            };

            if (action.payload.moved_by_me && action.payload.moved_to != 'currentPlayedCard') {
                const newState = [ ...state ];
                newState.push(action.payload.moved_card);
                return newState;
            };

            return state;
        };
        // case types.CLOSE_GAME_COMPLETED: {
        //     return [];
        // };
        default: return state;
    };
};

const currentPlayedCard = (state = null, action) => {
    switch(action.type) {
        case types.CARD_MOVED: {
            if (action.payload.moved_to == 'currentPlayedCard') {
                return action.payload.moved_card;
            };
            return state;
        };
        case types.CLOSE_GAME_COMPLETED: {
            return null;
        };
        default: return state;
    };
};

const deck = (state = [], action) => {
    switch(action.type) {
        case types.CLOSE_GAME_COMPLETED: {
            return [];
        };
        case types.CREATE_GAME_STARTED: {
            const cards_numbers = COLORS.map(
                color => NUMBERS.map(
                    number => number !== 0 ? [
                        ...Array(2).fill({
                        id: `${color}_${number}`,
                        content: `${color}_${number}`,
                        })
                    ] : [
                        {
                            id: `${color}_${number}`,
                            content: `${color}_${number}`,
                        },
                    ]
                )
            );
            const action_cards = COLORS.map(
                color => [
                    ...Array(2).fill(
                        {
                            id: `${color}_draw`,
                            content: `${color}_draw`,
                        },
                    ),
                    ...Array(2).fill(
                        {
                            id: `${color}_reverse`,
                            content: `${color}_reverse`,
                        },
                    ),
                    ...Array(2).fill(
                        {
                            id: `${color}_skip`,
                            content: `${color}_skip`,
                        },
                    ),
                ]
            )

            const wild_cards = COLORS.map(
                color => [
                    {
                        id: `wild_color`,
                        content: `wild_color`,
                    },
                    {
                        id: `wild_draw`,
                        content: `wild_draw`,
                    }
                ]
            )
            const returnedValue = [...cards_numbers, ...action_cards ,...wild_cards].map(value => value.flat()).flat().sort(() => Math.random() - 0.5);
            console.log(returnedValue);
            return returnedValue;
        };
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
export const getDeck = state => state.deck;