import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import Chat from '../Chat';
import * as selectors from '../../reducers';
import table_0 from '../Resources/table_0.png';
import * as gameState from '../../reducers/game';
import * as chatState from '../../reducers/chat';
import * as socketState from '../../reducers/socket';


const Game = ({ currentUser, gameInfo, socket, connectWS, endgame, receiveChatMessage }) => {

    useEffect(() => {
        // Validate if the websocket connection exists already
        if (!socket || socket.readyState == WebSocket.CLOSED) {
            connectWS();
        };
    }, []);

    if (!gameInfo) {
        return <Redirect to='/' />
    };

    if (socket) {
        socket.onopen = function(event) {

            // Send an initial message
            socket.send(
                JSON.stringify({
                    sent_by: currentUser.username,
                    text: `Hola, soy ${currentUser.username}!`,
                    sent_at: Date.now(),
                })
            );

        };

        // Listen for messages
        socket.onmessage = function(event) {
            const messageData = JSON.parse(event.data);
            // TODO: validar si es mensaje de chat o de jugada de uno
            receiveChatMessage(messageData);
        };

        // Listen for socket closes
        socket.onclose = () => endgame(socket);
        socket.onerror = () => endgame(socket);
    };

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
        currentUser: selectors.getCurrentUserInfo(state),
        gameInfo: selectors.getGameInfo(state),
        socket: selectors.getSocket(state),
    }),
    dispatch => ({
        connectWS() {
            dispatch(socketState.actions.startWSConnection({
                url: 'ws://localhost:8080'
            }));
        },
        endgame(socket) {
            socket.close();
            dispatch(gameState.actions.closeGame());
        },
        receiveChatMessage(messageData) {
            dispatch(chatState.actions.receiveMessage({
                ...messageData,
            }));
        }
    })
)(Game);
