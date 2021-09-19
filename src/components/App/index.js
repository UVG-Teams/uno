
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles.css';
import Login from '../Login';
import Game from '../Game'; 

import { configureStore } from '../../store';


const { store, persistor } = configureStore();

const checkUserIsAuthenticated = screenComponent => {

    // TODO: extract this from state
    const isAuthenticated = true;

    if (isAuthenticated) {
        return screenComponent;
    };

    return Login;
};

const routes = [
    {
        path: '/',
        exact: true,
        component: Login,
    },
    {
        path: '/game',
        exact: true,
        component: checkUserIsAuthenticated(Game),
    },
];

const App = () => (
    <div className = "App">
        <Provider store={ store }>
            <PersistGate loading={ null } persistor={ persistor }>
                <BrowserRouter>
                    <Switch>
                        {
                            routes.map(route => (
                                <Route
                                    key={ route.path }
                                    path={ route.path }
                                    exact={ route.exact }
                                    component={ route.component }
                                />
                            ))
                        }
                    </Switch>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </div>
);

export default App;
