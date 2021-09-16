
import React from 'react';

import './styles.css';

import Login from '../Login';
import Game from '../Game'; 
import { Provider } from 'react-redux';
import { configureStore } from '../../store';
import { PersistGate } from 'redux-persist/integration/react';

const { store, persistor } = configureStore()

const App = () => (
    <div className = "App">
        <Provider store={ store }>
            <PersistGate loading={ null } persistor={ persistor }>
                {/* <Login /> */}
                <Game />
            </PersistGate>
        </Provider>
    </div>
);

export default App;