import React from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import Chat from '../Chat';
import * as selectors from '../../reducers';
import { actions } from '../../reducers/game';
import table_0 from '../Resources/table_0.png';


const Game = ({ gameInfo, endgame }) => {

    if (!gameInfo) {
        return <Redirect to="/" />
    };

    // const wss = new WebSocket.Server({ port: 8080 });
    // Create WebSocket connection. https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
    const socket = new WebSocket('ws://localhost:8080');

    // Open the socket
    socket.onopen = function(event) {

        // Send an initial message
        socket.send('Hi! I am Willi and I\'m listening!');

        // Listen for messages
        socket.onmessage = function(event) {
            console.log('Client received a message: %s', event.data);
        };

        // Listen for socket closes
        socket.onclose = function(event) {
            console.log('Client notified socket has closed');
        };

    };

    socket.onerror = () => endgame(socket);

    return (
        <div className='game_page'>
            <Button onClick={() => endgame(socket)} variant='contained' color='primary'>
                Close
            </Button>
            <Chat />
        </div>
    )
};

export default connect(
    state => ({
        gameInfo: selectors.getGameInfo(state),
    }),
    dispatch => ({
        endgame(socket) {
            socket.close();
            dispatch(actions.closeGame());
        }
    })
)(Game);
