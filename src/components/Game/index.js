import CryptoJS from 'crypto-js';
import React , { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';

import Modal from 'react-modal';

import deck_1 from '../Resources/deck_1.png';
import deck_2 from '../Resources/deck_2.png';
import deck_3 from '../Resources/deck_3.png';
import deck_4 from '../Resources/deck_4.png';
import deck_5 from '../Resources/deck_5.png';
import deck_6 from '../Resources/deck_6.png';
import deck_7 from '../Resources/deck_7.png';
import deck_7plus from '../Resources/deck_7+.png';
import winnerGIF from '../Resources/winner.gif';

import './styles.css';
import Chat from '../Chat';
import UnoButton from '../UnoButton';

import * as selectors from '../../reducers';
import game, * as gameState from '../../reducers/game';
import * as chatState from '../../reducers/chat';
import socket, * as socketState from '../../reducers/socket';
import { counter } from '@fortawesome/fontawesome-svg-core';


// Moves a card from my deck to the game deck (from one list to another list)
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = [];
    const [moved_card] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, moved_card);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return { result, moved_card };
};


const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    // background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : 'lightgrey',
    paddingTop: 80,
    display: 'flex',
});


const Game = ({
    currentUser,
    gameInfo,
    socket,
    connectWS,
    endgame,
    myCards,
    currentPlayedCard,
    players,
    moveMyCard,
    receiveChatMessage,
    receiveCardMovement,
    receiveNewUser,
    removePlayer,
    takeCard,
    changeColor,
    deck,
    sendNewUserCurrentGameState,
    setInitialDeck,
    setInitialPlayedCard,
    setOnlinePlayers,
    setGameInfo,
    setRandomInitialCard,
    changedColor,
    receiveChangeColor,
    turns,
    setTurns,
    changeTurn,
    receiveChangeTurn,
    takeXCards,
    reverseTurns,
    receiveReverse,
    turnsList,
    reverse,
    socket_send,
}) => {
    useEffect(() => {
        // Validate if the websocket connection exists already
        if (!socket || socket.readyState == WebSocket.CLOSED) {
            connectWS();
        };
    }, []);

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: '40%',
          width: '25%',
        },
    };

    const customStyles2 = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    };

    if (!gameInfo) {
        return <Redirect to='/' />
    };

    if (socket) {
        socket.onopen = function(event) {
            if (currentUser.username == gameInfo.roomOwner) {
                setRandomInitialCard();
            } else {
                // Send an initial message for joining room
                socket_send(gameInfo, socket, {
                    type: 'join_game',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                    text: `Hola, soy ${currentUser.username}!`,
                    sent_at: Date.now(),
                    password: gameInfo.password,
                });
            };
        };

        // Listen for messages
        socket.onmessage = function(event) {
            const messageData = JSON.parse(event.data);

            if (!messageData.headers || !messageData.body) {
                // console.log("Unexpected message: ", messageData);
                return;
            };

            const headers = JSON.parse(atob(messageData.headers));

            if (headers.roomCode == gameInfo.roomCode) {

                const bytes = CryptoJS.AES.decrypt(messageData.body, gameInfo.password);
                const body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                switch(body.type) {
                    case 'text': {
                        receiveChatMessage(body);
                        break;
                    };
                    case 'game_move': {
                        receiveCardMovement(body);
                        break;
                    };
                    case 'uno_button_clicked': {
                        const { sent_by } = messageData;
                        const { username } = currentUser;
                        if (sent_by === username) {
                            if (myCards.length === 1) {
                                // GANASTE
                                // endgame();
                            }
                        } else {
                            if (myCards.length === 1 && !currentUser.saidUNO) {
                                takeCard();
                                takeCard();
                            }
                        }
                    }
                    case 'join_game': {
                        if (body.password == gameInfo.password) {
                            if (!players.map(player => player.username).includes(body.sent_by)) {

                                receiveNewUser(body);
                                receiveChatMessage(body);

                                if (currentUser.username == gameInfo.roomOwner) {
                                    sendNewUserCurrentGameState(body);
                                };

                            } else {
                                if (currentUser.username == gameInfo.roomOwner) {
                                    socket_send(gameInfo, socket, {
                                        type: 'error_alert',
                                        roomCode: gameInfo.roomCode,
                                        sent_to: body.sent_by,
                                        sent_by: currentUser.username,
                                        text: `Ya hay un user con ese nombre`,
                                        sent_at: Date.now(),
                                    });
                                };
                            };
                        } else {
                            if (currentUser.username == gameInfo.roomOwner) {
                                socket_send(gameInfo, socket, {
                                        type: 'error_alert',
                                        roomCode: gameInfo.roomCode,
                                        sent_to: body.sent_by,
                                        sent_by: currentUser.username,
                                        text: `Password incorrecta`,
                                        sent_at: Date.now(),
                                });
                            };
                        };

                        break;
                    };
                    case 'leave_game': {
                        receiveChatMessage({
                            type: 'text',
                            sent_by: body.sent_by,
                            text: 'Adios',
                            sent_at: body.sent_at,
                        });
                        removePlayer(body);
                        break;
                    };
                    case 'welcome': {
                        if (body.sent_to == currentUser.username) {
                            receiveChatMessage({
                                type: 'text',
                                sent_by: body.sent_by,
                                text: body.text,
                                sent_at: body.sent_at,
                            });
                            setInitialDeck(body);
                            setInitialPlayedCard(body);
                            setOnlinePlayers(body);
                            setGameInfo(body);
                            setTurns(body);
                        };
                        break;
                    };
                    case 'change_color': {
                        receiveChangeColor(body);
                        break;
                    };
                    case 'change_turn': {
                        receiveChangeTurn(messageData);
                        break;
                    };
                    case 'take_x_cards': {
                        if(messageData.take == currentUser.username) {
                            for (let i = 0; i< messageData.number; i++){
                                takeCard();
                            }
                        }
                        break;
                    };
                    case 'reverse_turn': {
                        receiveReverse(messageData);
                        break
                    };
                    case 'error_alert': {
                        if (body.sent_to == currentUser.username && deck.length <= 0) {
                            receiveChatMessage({
                                type: 'text',
                                sent_by: body.sent_by,
                                text: body.text,
                                sent_at: body.sent_at,
                            });
                            alert(body.text);
                        };
                        break;
                    };
                    default: console.log(body);
                };
            };
        };

        // Listen for socket closes
        socket.onclose = () => endgame();
        socket.onerror = () => endgame();
    };

    // Handle with multiple lists matching ids of the droppable container to the names in state.
    const id2List = {
        myDeck: 'myDeck',
        playedDeck: 'playedDeck'
    };

    const getList = id => id2List[id] == 'myDeck' ? myCards : currentPlayedCard;

    const onDragEnd = result => {
        const current_card_color = currentPlayedCard[0].content.split("_")[0];
        const current_card_number = currentPlayedCard[0].content.split("_")[1];
        const { source, destination } = result;

        // Dropped outside the list, then return card to origin
        if (!destination) {
            return;
        };

        // Can't move out the card on the game deck
        if (source.droppableId == 'playedDeck') {
            return;
        };

        // Can't reorder cards
        if (source.droppableId === destination.droppableId) {
            return;
        } else {
            const { result, moved_card } = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            const moved_card_color = moved_card.content.split("_")[0];
            const moved_card_number = moved_card.content.split("_")[1];

            if (current_card_color !== 'wild') {
                if ((current_card_color !== moved_card_color) & (current_card_number !== moved_card_number) & (moved_card_color !== 'wild')) {
                    return;
                };
            } else if (current_card_color == 'wild') {
                if (moved_card_color !== 'wild' & moved_card_color !== changedColor.color) {
                    return;
                };
            };

            if (current_card_color == 'wild') {
                changeColor(null);
            };

            socket_send(gameInfo, socket, {
                type: 'game_move',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                moved_card: moved_card,
                sent_at: Date.now(),
                moved_to: 'currentPlayedCard',
            });

            moveMyCard(currentUser.username, moved_card, 'currentPlayedCard');
            
            if( moved_card_number == 'skip') {
                changeTurn(gameInfo, currentUser, socket, 2, reverse)
            }else if(moved_card_number == 'draw' & moved_card_color !== 'wild') {
                takeXCards(gameInfo, currentUser, socket, players, turns, 2)
                changeTurn(gameInfo, currentUser, socket, 2, reverse)
            }else if(moved_card_number == 'draw' & moved_card_color == 'wild') {
                takeXCards(gameInfo, currentUser, socket, players, turns, 4)
                changeTurn(gameInfo, currentUser, socket, 2, reverse)
            }else if(moved_card_number == 'reverse' & moved_card_color !=='wild') {
                reverseTurns(gameInfo, currentUser, socket);
                changeTurn(gameInfo, currentUser, socket, 1, !reverse)
            }
            else {
                changeTurn(gameInfo, currentUser, socket, 1, reverse)
            }

            if (moved_card_color == 'wild') {
                openModal();
            };

        };
    };
    return (
        <div className='game_page'>
            <div className='room_name_background'>
                <h1>
                    {gameInfo.roomCode}
                </h1>
            </div>
            <div style={{position: 'absolute'}}>
                <Button onClick={() => endgame()} variant='contained' color='primary'>
                    Close
                </Button>
            </div>
            <div className='turns'>
                <h2 style={{paddingRight:5}}>Turno de:  </h2>
                <h2>{`${turnsList[turns%turnsList.length]!==undefined ? turnsList[turns%turnsList.length].username : ''}`}</h2>
            </div>
            <div className='dnd'>
                {
                    players.filter(player => player.username != currentUser.username)
                    .map((player, index) => {

                        let deck_amount;

                        if (player.cards <= 0) {
                            deck_amount = '1';
                        } else if (player.cards > 7) {
                            deck_amount = '7+';
                        } else {
                            deck_amount = player.cards;
                        };

                        return (
                            <div key={ player.username } className={`rival_deck_${ index + 1 }`}>
                                <img src={`/images/deck_${deck_amount}.png`} className='rival_cards' />
                                <h2>{ player.username }</h2>
                            </div>
                        );
                    })
                }
                <DragDropContext onDragEnd={ onDragEnd }>
                    <div className='droppables' style={{ pointerEvents: `${turnsList[turns%turnsList.length]!==undefined ? (turnsList[turns%turnsList.length].username !== currentUser.username ? 'none': '' ) : ''}`}}>
                        <div className='deck_droppable'>
                            <Droppable droppableId='myDeck' direction='horizontal'>
                                {(provided, snapshot) => (
                                    <div
                                        ref={ provided.innerRef }
                                        style={ getListStyle(snapshot.isDraggingOver) }>
                                        {
                                            myCards.map((item, index) => (
                                                <Draggable
                                                    key={ item.id }
                                                    draggableId={ item.id }
                                                    index={ index }>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.draggableProps }
                                                            { ...provided.dragHandleProps }
                                                            style={ getItemStyle(snapshot.isDragging, provided.draggableProps.style) }>
                                                            <img src={ `/images/${item.content}.png` } className='game_cards' />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        { provided.placeholder }
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className='table_deck_droppable'>
                            {
                                deck.length > 0 ? (
                                    <Button onClick={() => {
                                        takeCard();
                                        changeTurn(gameInfo, currentUser, socket, 1, reverse);
                                    }}>
                                        <img src={ deck_1 } className='take_card'/>
                                    </Button>
                                ) : (<></>)
                            }
                            <Droppable droppableId='playedDeck'>
                                {(provided, snapshot) => (
                                    <div
                                        ref={ provided.innerRef }
                                        style={ getListStyle(snapshot.isDraggingOver) }>
                                        {
                                            currentPlayedCard.map((item, index) => (
                                                <Draggable
                                                    key={ item.id }
                                                    draggableId={ item.id }
                                                    index={ index }>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.draggableProps }
                                                            { ...provided.dragHandleProps }
                                                            style={ getItemStyle(snapshot.isDragging, provided.draggableProps.style) }>
                                                            <img src={ `/images/${item.content}.png` } className='main_game_card' />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        { provided.placeholder }
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
                <Chat/>
                <UnoButton />
            </div>
            {/* Modal for change cards color */}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles}
                >
                    <h2>Elige color</h2>
                    <div className='container_change_color_buttons'>
                        <div style={{height: '50%', display: 'flex', justifyContent: 'center'}}>
                            <button
                                className='btnChangeColorR'
                                onClick={() => {
                                    changeColor('red', 'rojo');
                                    closeModal();
                                }}
                            ></button>
                            <button
                                className='btnChangeColorB'
                                onClick={() => {
                                    changeColor('blue', 'azul');
                                    closeModal();
                                }}
                            ></button>
                        </div>
                        <div style={{height: '50%', display: 'flex', justifyContent: 'center'}}>
                            <button
                                className='btnChangeColorY'
                                onClick={() => {
                                    changeColor('yellow', 'amarillo');
                                    closeModal();
                                }}
                            ></button>
                            <button
                                className='btnChangeColorG'
                                onClick={() => {
                                    changeColor('green', 'verde');
                                    closeModal();
                                }}
                            ></button>
                        </div>
                    </div>
                </Modal>
            </div>
            {/* Modal when there is a winner */}
            <div>
                <Modal
                    isOpen= {false}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles2}
                >
                    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                        <h1 style={{position: 'absolute'}}>"User" Won!</h1>
                        <img src={ winnerGIF } className='winnerIMG'/>
                        <Button
                            onClick={ () => endgame() }
                            variant='contained'
                            color='primary'
                            style={{position: 'absolute', marginTop: '65%'}}
                        >
                            Home
                        </Button>
                    </div>
                    
                </Modal>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        currentUser: selectors.getCurrentUserInfo(state),
        gameInfo: selectors.getGameInfo(state),
        socket: selectors.getSocket(state),
        currentPlayedCard: selectors.getCurrentPlayedCard(state) ? [selectors.getCurrentPlayedCard(state)] : [],
        myCards: selectors.getMyCards(state),
        players: selectors.getPlayers(state),
        deck: selectors.getGameDeck(state),
        changedColor: selectors.getChangedColor(state),
        turns: selectors.getTurns(state),
        turnsList: selectors.getTurnsList(state),
        reverse: selectors.getReverse(state),
    }),
    dispatch => ({
        connectWS() {
            dispatch(socketState.actions.startWSConnection({
                url: 'ws://localhost:8080',
                // url: 'ws://18.135.12.10:8080',
            }));
        },
        socket_send(gameInfo, socket, messageData) {
            const headers = btoa(JSON.stringify({ roomCode: gameInfo.roomCode }));
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(messageData), gameInfo.password).toString();

            socket.send(JSON.stringify({
                headers: headers,
                body: ciphertext
            }));
        },
        endgame() {
            dispatch(gameState.actions.startClosingGame());
        },
        receiveChatMessage(messageData) {
            dispatch(chatState.actions.receiveMessage({
                ...messageData,
            }));
        },
        moveMyCard(moved_by, moved_card, moved_to) {
            dispatch(gameState.actions.moveCard({
                moved_by: moved_by,
                moved_card: moved_card,
                moved_to: moved_to,
                moved_by_me: true
            }));
        },
        receiveCardMovement(messageData) {
            dispatch(gameState.actions.moveCard({
                moved_by: messageData.sent_by,
                moved_card: messageData.moved_card,
                moved_to: messageData.moved_to,
            }));
        },
        receiveNewUser(messageData) {
            dispatch(gameState.actions.receiveNewUser({
                username: messageData.sent_by,
            }));
        },
        removePlayer(messageData) {
            dispatch(gameState.actions.removePlayer(messageData.sent_by));
        },
        takeCard(gameInfo, currentUser, deck, socket, socket_send) {
            const randomCard = deck.pop();

            socket_send(gameInfo, socket, {
                type: 'game_move',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                moved_card: randomCard,
                sent_at: Date.now(),
                moved_to: currentUser.username,
            });

            dispatch(gameState.actions.moveCard({
                moved_by: currentUser.username,
                moved_card: randomCard,
                moved_to: currentUser.username,
                moved_by_me: true
            }));
        },
        sendNewUserCurrentGameState(currentUser, socket, socket_send, gameInfo, currentPlayedCard, players, deck, new_username, turns, turnsList) {

            if (players.map(player => player.username).includes(new_username)) {
            } else {
                players.push({
                    username: new_username,
                    cards: 0
                });
            };

            socket_send(gameInfo, socket, {
                type: 'welcome',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                game_info: gameInfo,
                current_played_card: currentPlayedCard,
                players: players,
                deck: deck,
                turns: turns,
                turnsList: turnsList,
                sent_to: new_username,
                text: `Bienvenido ${new_username}`,
                sent_at: Date.now(),
            });
        },
        setInitialDeck(messageData) {
            dispatch(gameState.actions.setInitialDeck(messageData.deck));
        },
        setInitialPlayedCard(messageData) {
            dispatch(gameState.actions.setInitialPlayedCard(messageData.current_played_card[0]));
        },
        setOnlinePlayers(messageData) {
            dispatch(gameState.actions.setOnlinePlayers(messageData.players));
        },
        setGameInfo(messageData) {
            dispatch(gameState.actions.setGameInfo(messageData.game_info));
        },
        setTurns(messageData) {
            dispatch(gameState.actions.setTurns(messageData.turns));
        },
        setRandomInitialCard(currentUser, deck, socket) {
            const randomCard = deck.pop();

            dispatch(gameState.actions.moveInitialCard({
                moved_by: currentUser.username,
                moved_card: randomCard,
            }));
        },
        changeColor(gameInfo, currentUser, socket, socket_send, color, colorEsp=null) {
            socket_send(gameInfo, socket, {
                type: 'change_color',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                color: color,
            });

            if(color !== null){
                socket_send(gameInfo, socket, {
                    type: 'text',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                    text: 'Cambie el color a ' + colorEsp,
                    sent_at: Date.now(),
                });
            };

            dispatch(gameState.actions.changeNewColor({
                color: color,
            }));

        },
        receiveChangeColor(messageData) {
            dispatch(gameState.actions.changeNewColor({
                color: messageData.color,
            }))
        },
        changeTurn(gameInfo, currentUser, socket, turns, reverse) {
            if(reverse){
                turns = turns * (-1);
            }
            socket.send(
                JSON.stringify({
                    type: 'change_turn',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                    turns: turns,
                })
            )
            dispatch(gameState.actions.changeTurn(turns))
        },
        receiveChangeTurn(messageData) {
            dispatch(gameState.actions.changeTurn(messageData.turns))
        },
        takeXCards(gameInfo, currentUser, socket, players, turns, cardsNumber) {
            socket.send(
                JSON.stringify({
                    type: 'take_x_cards',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                    take: players[(turns+1)%players.length].username,
                    number: cardsNumber,
                })
            )
        },
        reverseTurns(gameInfo, currentUser, socket) {
            socket.send(
                JSON.stringify({
                    type: 'reverse_turn',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                })
            )
            dispatch(gameState.actions.playReverse());
        },
        receiveReverse(messageData){
            dispatch(gameState.actions.playReverse());
        },
    }),
    (stateProps, dispatchProps, ownProps) => ({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        takeCard() {
            dispatchProps.takeCard(stateProps.gameInfo, stateProps.currentUser, stateProps.deck, stateProps.socket, dispatchProps.socket_send);
        },
        sendNewUserCurrentGameState(messageData) {
            dispatchProps.sendNewUserCurrentGameState(
                stateProps.currentUser,
                stateProps.socket,
                dispatchProps.socket_send,
                stateProps.gameInfo,
                stateProps.currentPlayedCard,
                stateProps.players,
                stateProps.deck,
                messageData.sent_by,
                stateProps.turns,
                stateProps.turnsList,
            );
        },
        setRandomInitialCard() {
            dispatchProps.setRandomInitialCard(stateProps.currentUser, stateProps.deck, stateProps.socket);
        },
        changeColor(color, colorEsp=null) {
            dispatchProps.changeColor(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send, color, colorEsp)
        }
    })
)(Game);
