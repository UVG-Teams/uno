import React from 'react';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';

import './styles.css';
import * as selectors from '../../reducers';
import { actions } from '../../reducers/game';
import { actions as chatActions } from '../../reducers/chat';


const UnoButton = ({ onClick }) => {
    return (
        <div className='uno-button-container' onClick={ onClick }>
            <h1>UNO</h1>
        </div>
    );
};

export default connect(
    state => ({
        socket: selectors.getSocket(state),
        player: selectors.getCurrentUserInfo(state),
        gameInfo: selectors.getGameInfo(state),
        myCards: selectors.getMyCards(state),
        deck: selectors.getGameDeck(state),
        players: selectors.getPlayers(state),
    }),
    dispatch => ({
        onClick: (socket, player, gameInfo, myCards, deck, players) => {
            const tmessage = {
                type: 'uno_button_clicked',
                sent_by: player.username,
                roomCode: gameInfo.roomCode,
                sent_at: Date.now(),
            };

            const headers = btoa(JSON.stringify({ roomCode: gameInfo.roomCode }));
            const ciphertextClick = CryptoJS.AES.encrypt(JSON.stringify(tmessage), gameInfo.password).toString();

            socket.send(
                JSON.stringify({
                    headers,
                    body: ciphertextClick,
                })
            );

            dispatch(actions.pressUno({
                type: 'uno_button_clicked',
                sent_by: player.username,
                sent_at: Date.now(),
            }));

            const message = {
                type: 'text',
                sent_by: player.username,
                roomCode: gameInfo.roomCode,
                text: 'UNO!',
                sent_at: Date.now(),
            };

            const cipherTextMessage = CryptoJS.AES.encrypt(JSON.stringify(message), gameInfo.password).toString();

            socket.send(JSON.stringify({
                headers,
                body: cipherTextMessage,
            }));

            dispatch(chatActions.sendMessage(message));

            const someoneElseHasUno = players.reduce((accumulator, currentPlayer) => accumulator || currentPlayer.cards===1, false);

            if (myCards.length !== 1 && !player.saidUno && !someoneElseHasUno) {
                // Takes two cards from the deck
                const headers = btoa(JSON.stringify({ roomCode: gameInfo.roomCode }));

                for (let i = 0; i<2; i++) {

                    const randomCard = deck.pop();

                    const gameMoveMessage = {
                        type: 'game_move',
                        roomCode: gameInfo.roomCode,
                        sent_by: player.username,
                        moved_card: randomCard,
                        sent_at: Date.now(),
                        moved_to: player.username,
                    };

                    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(gameMoveMessage), gameInfo.password).toString();

                    socket.send(
                        JSON.stringify({
                            headers,
                            body: ciphertext,
                        })
                    );

                    dispatch(actions.moveCard({
                        moved_by: player.username,
                        moved_card: randomCard,
                        moved_to: player.username,
                        moved_by_me: true
                    }));

                };

                const messageMistake = {
                    type: 'text',
                    roomCode: gameInfo.roomCode,
                    sent_by: player.username,
                    text: 'Sorry, I messed up! Already took my extra cards...',
                    sent_at: Date.now(),
                };

                const mistakeCipherText = CryptoJS.AES.encrypt(JSON.stringify(messageMistake), gameInfo.password).toString();

                socket.send(JSON.stringify({
                    headers,
                    body: mistakeCipherText,
                }));

                dispatch(chatActions.sendMessage(messageMistake));

            } else {
                // GANASTE
            }
        }
    }),
    (stateProps, dispatchProps) => ({
        onClick: () => {
            dispatchProps.onClick(stateProps.socket, stateProps.player, stateProps.gameInfo, stateProps.myCards, stateProps.deck, stateProps.players );
        },
    }),
)(UnoButton);
