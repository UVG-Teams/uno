import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';

import mainSaga from './sagas';
import reducer from './reducers';

export const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();

    const persistConfig = {
        key: 'rootx',
        storage,
        whitelist: [],
    };
    
    const persistedReducer = persistReducer(
        persistConfig,
        reducer,
    );

    const store = createStore(
        persistedReducer,
        composeWithDevTools(
            applyMiddleware(sagaMiddleware),
        )
    );
        
    const persistor = persistStore(store);
    sagaMiddleware.run(mainSaga);

    return { store, persistor };
}
