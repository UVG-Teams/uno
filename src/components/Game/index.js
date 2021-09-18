import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import Chat from '../Chat';
import * as selectors from '../../reducers';
import * as gameState from '../../reducers/game';
import * as socketState from '../../reducers/socket';
import table_0 from '../Resources/table_0.png';


const Game = ({ gameInfo, socket, connectWS, endgame }) => {

    useEffect(() => connectWS(), [])

    if (!gameInfo) {
        return <Redirect to="/" />
    };

    if (socket) {
        socket.onopen = function(event) {

            // Send an initial message
            socket.send(
                JSON.stringify({
                    message: 'Hi! I am Willi and I\'m listening!'
                })
            );

        };

        // Listen for messages
        socket.onmessage = function(event) {
            const messageData = JSON.parse(event.data);
            console.log('Client received a message: ', messageData.message);
        };

        // Listen for socket closes
        socket.onclose = () => endgame(socket);
        socket.onerror = () => endgame(socket);
    }

    return (
        <div className='game_page'>
            <Button onClick={() => endgame(socket)} variant='contained' color='primary'>
                Close
            </Button>
            <Chat />
        </div>
    );
};

export default connect(
    state => ({
        gameInfo: selectors.getGameInfo(state),
        socket: selectors.getSocket(state),
    }),
    dispatch => ({
        connectWS() {
            dispatch(socketState.actions.startWSConnection({
                url: 'ws://localhost:8080'
            }))
        },
        endgame(socket) {
            socket.close();
            dispatch(gameState.actions.closeGame());
        },
    })
)(Game);
