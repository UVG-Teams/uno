import { combineReducers } from 'redux';

import game, * as gameSelectors from './game';

export default combineReducers({
    game,
});

export const getGame = state => gameSelectors.getGame(state.game);
