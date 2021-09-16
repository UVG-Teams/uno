import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import Chat from '../Chat';
import * as selectors from '../../reducers';
import table_0 from '../Resources/table_0.png';


const Game = ({ game }) => {

    if (!game) {
        return <Redirect to="/" />
    }

    console.log("Game: ", game);

    // const wss = new WebSocket.Server({ port: 8080 });
    // Create WebSocket connection. https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
    const socket = new WebSocket('ws://localhost:8080');

    // Open the socket
    socket.onopen = function(event) {

        // Send an initial message
        socket.send('I am the client and I\'m listening!');

        // Listen for messages
        socket.onmessage = function(event) {
            console.log('Client received a message: ', event.data);
        };

        // Listen for socket closes
        socket.onclose = function(event) {
            console.log('Client notified socket has closed: ');
        };

    };

    return (
        <div className='game_page'>
            <Button onClick={ () => socket.close() } variant='contained' color='primary'>Close</Button>
            <Chat />
        </div>
    )
};

export default connect(
    state => ({
        game: selectors.getGame(state),
    }),
)(Game);
