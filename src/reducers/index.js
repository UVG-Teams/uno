import { combineReducers } from 'redux';

import game, * as gameSelectors from './game';

export default combineReducers({
    game,
});

export const getGameInfo = state => gameSelectors.getGameInfo(state.game);
