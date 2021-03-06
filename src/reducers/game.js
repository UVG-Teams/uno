import { combineReducers } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import { shuffle } from 'lodash/shuffle'

const COLORS = ['blue', 'green', 'red', 'yellow'];
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const _ = require("lodash"); 
export const types = {
    CREATE_GAME_STARTED: 'CREATE_GAME_STARTED',
    JOIN_GAME_STARTED: 'JOIN_GAME_STARTED',
    PLAY_GAME_STARTED: 'PLAY_GAME_STARTED',
    CLOSE_GAME_STARTED: 'CLOSE_GAME_STARTED',
    CLOSE_GAME_COMPLETED: 'CLOSE_GAME_COMPLETED',
    CURRENT_USER_INFO_SETTED: 'CURRENT_USER_INFO_SETTED',
    CARD_MOVED: 'CARD_MOVED',
    INITIAL_CARD_MOVED: 'INITIAL_CARD_MOVED',
    NEW_USER_RECEIVED: 'NEW_USER_RECEIVED',
    PLAYER_REMOVED: 'PLAYER_REMOVED',
    INITIAL_DECK_RECEIVED: 'INITIAL_DECK_RECEIVED',
    INITIAL_PLAYED_CARD_RECEIVED: 'INITIAL_PLAYED_CARD_RECEIVED',
    ONLINE_PLAYERS_RECEIVED: 'ONLINE_PLAYERS_RECEIVED',
    GAME_INFO_RECEIVED: 'GAME_INFO_RECEIVED',
    NEW_COLOR_CHANGED: 'NEW_COLOR_CHANGED',
    NEW_COLOR_PLAYED: 'NEW_COLOR_PLAYED',
    TURN_CHANGED: 'TURN_CHANGED',
    TURNS_RECEIVED: 'TURNS_RECEIVED',
    REVERSE_PLAYED: 'REVERSE_PLAYED',
    UNO_BUTTON_PRESSED: 'UNO_BUTTON_PRESSED',
    DECK_RESETED: 'DECK_RESETED',
    GAME_STARTED: 'GAME_STARTED',
    GAME_ENDED: 'GAME_ENDED',
    GAME_WON: 'GAME_WON',
    RECEIVE_GAME_WINNER: 'RECEIVE_GAME_WINNER',
};

export const actions = {
    startCreatingGame: data => ({
        type: types.CREATE_GAME_STARTED,
        payload: data
    }),
    startJoiningGame: joinData => ({
        type: types.JOIN_GAME_STARTED,
        payload: joinData
    }),
    startPlayingGame: () => ({
        type: types.PLAY_GAME_STARTED,
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
    moveInitialCard: movement => ({
        type: types.INITIAL_CARD_MOVED,
        payload: movement
    }),
    receiveNewUser: data => ({
        type: types.NEW_USER_RECEIVED,
        payload: data
    }),
    removePlayer: username => ({
        type: types.PLAYER_REMOVED,
        payload: username
    }),
    setInitialDeck: deck => ({
        type: types.INITIAL_DECK_RECEIVED,
        payload: deck
    }),
    setInitialPlayedCard: playedCard => ({
        type: types.INITIAL_PLAYED_CARD_RECEIVED,
        payload: playedCard
    }),
    setOnlinePlayers: players => ({
        type: types.ONLINE_PLAYERS_RECEIVED,
        payload: players
    }),
    setGameInfo: gameInfo => ({
        type: types.GAME_INFO_RECEIVED,
        payload: gameInfo
    }),
    changeNewColor: color => ({
        type: types.NEW_COLOR_CHANGED,
        payload: color,
    }),
    changeTurn: turns => ({
        type: types.TURN_CHANGED,
        payload: turns,
    }),
    setTurns: turn  => ({
        type: types.TURNS_RECEIVED,
        payload: turn
    }),
    playReverse: ()  => ({
        type: types.REVERSE_PLAYED,
    }),
    pressUno: payload => ({
        type: types.UNO_BUTTON_PRESSED,
        payload,
    }),
    resetDeck: deck => ({
        type: types.DECK_RESETED,
        payload: deck,
    }),
    winGame: (payload) => ({
        type: types.GAME_WON,
        payload,
    }),
    receiveWinner: payload => ({
        type: types.RECEIVE_GAME_WINNER,
        payload,
    }),
};

export const GAME_STATES = {
    ROOM_CREATED: 'ROOM_CREATED',
    PLAYING: 'PLAYING',
    ENDED: 'ENDED',
    WON: 'WON',
}

const gameInfo = (state = null, action) => {
    switch(action.type) {
        case types.GAME_INFO_RECEIVED: {
            return action.payload;
        }
        case types.CREATE_GAME_STARTED: {
            return {
                ...action.payload,
                gameState: GAME_STATES.ROOM_CREATED,
            };
        }
        case types.JOIN_GAME_STARTED: {
            return action.payload;
        }
        case types.CLOSE_GAME_COMPLETED: {
            return null;
        }
        case types.GAME_STARTED: {
            return {
                ...state,
                gameState: GAME_STATES.PLAYING,
            }
        }
        case types.GAME_ENDED: {
            return {
                ...state,
                gameState: GAME_STATES.ENDED,
            }
        }
        case types.GAME_WON: {
            return {
                ...state,
                gameState: GAME_STATES.WON,
                gameWinner: action.payload,
            }
        }
        case types.RECEIVE_GAME_WINNER: {
            return {
                ...state,
                winner: action.payload,
            }
        }
        case types.PLAY_GAME_STARTED: {
            return {
                ...state,
                started: true,
            }
        }
        default: return state;
    };
};

const currentUserInfo = (state = {saidUNO: false}, action) => {
    switch(action.type) {
        case types.CURRENT_USER_INFO_SETTED: {
            return {
                ...state,
                ...action.payload
            };
        };
        case types.UNO_BUTTON_PRESSED: {
            return {
                ...state,
                saidUNO: true,
            }
        };
        case types.CARD_MOVED: {
            const { payload } = action;
            const newSaidUNO = payload.moved_to === state.username ? false : state.saidUNO;
            return {
                ...state,
                saidUNO: newSaidUNO,
            }
        };
        case types.CLOSE_GAME_COMPLETED: {
            return null;
        };
        default: return state;
    };
};

const players = (state = [], action) => {
    switch(action.type) {
        case types.ONLINE_PLAYERS_RECEIVED: {
            return action.payload;
        };
        case types.CREATE_GAME_STARTED: {
            return [{
                username: action.payload.roomOwner,
                cards: 0,
            }]
        };
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

const myCards = (state = [], action) => {
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
        case types.CLOSE_GAME_COMPLETED: {
            return [];
        };
        default: return state;
    };
};

const currentPlayedCard = (state = null, action) => {
    switch(action.type) {
        case types.INITIAL_CARD_MOVED: {
            return action.payload.moved_card;
        };
        case types.INITIAL_PLAYED_CARD_RECEIVED: {
            return action.payload;
        };
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
        case types.INITIAL_DECK_RECEIVED: {
            return action.payload;
        };
        case types.CLOSE_GAME_COMPLETED: {
            return [];
        };
        case types.DECK_RESETED: {
            state = _.shuffle(action.payload)
            return state;
        }
        case types.INITIAL_CARD_MOVED: {
            const newState = [];

            state.map(card => {
                if (card.id != action.payload.moved_card.id) {
                    newState.push(card);
                };
            });

            return newState;
        };
        case types.CARD_MOVED: {
            if (action.payload.moved_to != 'currentPlayedCard') {
                const newState = [];

                state.map(card => {
                    if (card.id != action.payload.moved_card.id) {
                        newState.push(card);
                    };
                });

                return newState;
            };

            return state;
        };
        case types.CREATE_GAME_STARTED: {
            const cards_numbers = COLORS.map(
                color => NUMBERS.map(
                    number => number !== 0 ? [
                        ...Array(2).fill({ content: `${color}_${number}` })
                    ] : [
                        { content: `${color}_${number}` },
                    ]
                )
            );

            const action_cards = COLORS.map(
                color => [
                    ...Array(2).fill({ content: `${color}_draw` }),
                    ...Array(2).fill({ content: `${color}_reverse` }),
                    ...Array(2).fill({ content: `${color}_skip` }),
                ]
            );

            const wild_cards = COLORS.map(
                color => [
                    { content: `wild_color` },
                    { content: `wild_draw` }
                ]
            );

            const returnedValue = [...cards_numbers, ...action_cards, ...wild_cards].map(value => value.flat()).flat().sort(() => Math.random() - 0.5);
            let deck = _.shuffle(_.shuffle(returnedValue))
            let cont = true
            while(cont){
                const initialCard = deck.pop()
                if(initialCard.content.split("_")[0]=='wild'){
                    console.log('salio wild')
                    deck.push(initialCard)
                    deck = _.shuffle(deck)
                }else{
                    cont = false
                }
            }
            return deck.map(card => {
                return {
                    ...card,
                    id: uuidv4()
                };
            });
        };
        default: return state;
    };
};

const playedCards = (state = [], action) => {
    switch(action.type) {
        case types.CLOSE_GAME_COMPLETED: {
            return [];
        };
        case types.DECK_RESETED: {
            return [action.payload.pop()]
        };
        case types.INITIAL_CARD_MOVED: {

            return [...state, action.payload.moved_card];
        };
        case types.CARD_MOVED: {
            if (action.payload.moved_to == 'currentPlayedCard') {

                return [...state, action.payload.moved_card];
            };

            return state;
        };
        default: return state;
    };
};

const changedColor = (state = null, action) => {
    switch(action.type) {
        case types.NEW_COLOR_CHANGED: {
            return action.payload
        };
        default: return state;
    }
}

const turns = (state = 0, action) => {
    switch(action.type) {
        case types.CREATE_GAME_STARTED: {
            return 0
        }
        case types.TURN_CHANGED: {
            return state = state + action.payload;
        }
        case types.TURNS_RECEIVED: {
            return action.payload;
        }
        default: return state;
    }
}

const turnsList = (state = [], action) => {
    switch(action.type) {
        case types.ONLINE_PLAYERS_RECEIVED: {
            return action.payload;
        };
        case types.CREATE_GAME_STARTED: {
            return [{
                username: action.payload.roomOwner,
                cards: 0,
            }]
        };
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
        // case types.REVERSE_PLAYED: {
        //     return state.reverse();
        // };
        default: return state;
    };
}

const reverse = (state = false, action) => {
    switch(action.type) {
        case types.REVERSE_PLAYED: {
            return !state;
        };
        default: return state;
    }
}

export default combineReducers({
    gameInfo,
    currentUserInfo,
    players,
    myCards,
    currentPlayedCard,
    deck,
    changedColor,
    turns,
    turnsList,
    reverse,
    playedCards,
});

export const getGameInfo = state => state.gameInfo;
export const getCurrentUserInfo = state => state.currentUserInfo;
export const getCurrentPlayedCard = state => state.currentPlayedCard;
export const getMyCards = state => state.myCards;
export const getPlayers = state => state.players;
export const getDeck = state => state.deck;
export const getChangedColor = state => state.changedColor;
export const getGameState = state => state.gameInfo.gameState;
export const getTurns = state => state.turns;
export const getTurnsList = state => state.turnsList;
export const getReverse = state => state.reverse;
export const getPlayedCards = state => state.playedCards;
