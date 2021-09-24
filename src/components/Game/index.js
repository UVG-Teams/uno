import CryptoJS from 'crypto-js';
import React , { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Markdown from 'markdown-to-jsx';

import deck_1 from '../Resources/deck_1.png';
import deck_2 from '../Resources/deck_2.png';
import deck_3 from '../Resources/deck_3.png';
import deck_4 from '../Resources/deck_4.png';
import deck_5 from '../Resources/deck_5.png';
import deck_6 from '../Resources/deck_6.png';
import deck_7 from '../Resources/deck_7.png';
import deck_7plus from '../Resources/deck_7+.png';
import winnerGIF from '../Resources/winner.gif';
import startGame from '../Resources/start_game.png';



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
    startgame,
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
    winGame,
    receiveGameStarted,
}) => {
    useEffect(() => {
        // Validate if the websocket connection exists already
        if (!socket || socket.readyState == WebSocket.CLOSED) {
            connectWS();
        };
    }, []);

    const [post, setPost] = useState('');
    useEffect(() => {
        import('../../helpme.md')
            .then(res => {
                fetch(res.default)
                    .then(res => res.text())
                    .then(res => setPost(res))
            })
            .catch(err => console.log(err));
    });

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsOpenHM, setIsOpenHM] = React.useState(false);
    const [hasWon, setHasWon] = React.useState(false);
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

    const customStylesHM = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: '50%',
          width: '50%',
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
                        receiveCardMovement({
                            ...body,
                            moved_by_me: body.moved_to === currentUser.username ? true : false,
                        });
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
                        break;
                    }
                    case 'game_won': {
                        setHasWon(true);
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
                        receiveChangeTurn(body);
                        break;
                    };
                    case 'take_x_cards': {
                        if(body.take == currentUser.username) {
                            for (let i = 0; i< body.number; i++){
                                takeCard();
                            }
                        }
                        break;
                    };
                    case 'reverse_turn': {
                        receiveReverse(body);
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
                    case 'game_started': {
                        receiveChatMessage({
                            type: 'text',
                            sent_by: body.sent_by,
                            text: body.text,
                            sent_at: body.sent_at,
                        });
                        receiveGameStarted()
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

            console.log(myCards);
            if (myCards.length === 1) {
                setHasWon(true);
                winGame(currentUser.username);
                
                socket_send(gameInfo, socket, {
                    type: 'game_won',
                    roomCode: gameInfo.roomCode,
                    sent_by: currentUser.username,
                    moved_card: moved_card,
                    sent_at: Date.now(),
                    moved_to: 'currentPlayedCard',
                });
            }
            moveMyCard(currentUser.username, moved_card, 'currentPlayedCard');

            if( moved_card_number == 'skip') {
                changeTurn(2, reverse)
            }else if(moved_card_number == 'draw' & moved_card_color !== 'wild') {
                takeXCards(players, turns, 2)
                changeTurn(2, reverse)
            }else if(moved_card_number == 'draw' & moved_card_color == 'wild') {
                takeXCards(players, turns, 4)
                changeTurn(2, reverse)
            }else if(moved_card_number == 'reverse' & moved_card_color !=='wild') {
                reverseTurns();
                changeTurn(1, !reverse)
            }
            else {
                changeTurn(1, reverse)
            }

            if (moved_card_color == 'wild') {
                openModal();
            };

        };
    };

    let table_card = currentPlayedCard;
    let table_card_color;
    if (changedColor?.color) {
        table_card_color = changedColor.color
    } else {
        table_card_color = table_card.map(card => card.content.split("_")[0]);
    }

    return (
        <div className={table_card_color == 'red' ? ['game_page bRed'] : table_card_color == 'green' ? ['game_page bGreen'] : table_card_color == 'blue' ? ['game_page bBlue'] : ['game_page bYellow']}>
            {console.log(changedColor)}
            <div className='room_name_background'>
                <h1>
                    {gameInfo.roomCode}
                </h1>
            </div>
            <div style={{position: 'absolute', right: 0}}>
                <Button onClick={() => setIsOpenHM(true)} variant='contained' color='primary' style={{marginRight:10}}>
                    Help
                </Button>
                <Button onClick={() => endgame()} variant='contained' color='primary'>
                    Close
                </Button>
            </div>
            <div className='turns'>
                <h2 style={{paddingRight:5}}>Turn of:  </h2>
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
                                        changeTurn(1, reverse);
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
                    contentLabel="Example Modal"
                    shouldCloseOnOverlayClick={false}
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
                    isOpen= {hasWon}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles2}
                >
                    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                        <h1 style={{position: 'absolute'}}>{gameInfo.gameWinner} Won!</h1>
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
            {/* Modal start game */}
            <div>
                <Modal
                    isOpen= {gameInfo.started ? false : true }
                    // onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles2}
                >
                    <div style={{display: 'flex'}}>
                        <div style={{width: '27vh', display: 'flex', flexDirection: 'column'}}>
                            <h1 style={{textAlign: 'center'}}>UNO</h1>
                            <label><b>Room code:</b> {gameInfo.roomCode}</label>
                            <div style={{display: 'flex', marginBottom: '5%'}}>
                                <label><b>Connected players: </b>{players.map(player => (<div style={{textAlign:'center'}}>{player.username}{"\n"}</div>))}</label>
                            </div>
                            {
                                currentUser.username == gameInfo.roomOwner ? (
                                        players.length < 1 ? (
                                            <>
                                                <label style={{color: 'red', fontSize: 12}}>There must be at least 3 players connected</label>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    disabled
                                                >
                                                    Start
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={ () => startgame() }
                                                variant='contained'
                                                color='primary'
                                            >
                                                Start
                                            </Button>
                                        )
                                ) : (
                                    <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20%'}}>
                                        <FontAwesomeIcon icon={faSpinner} size='3x' className="fa-pulse"/>
                                        <label style={{marginTop: '20%', textAlign: 'center'}}>Waiting for the host to start the game</label>
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            <img src={ startGame } style={{height: '40vh'}}/>
                        </div>
                    </div>

                </Modal>
            </div>
            {/* Modal help me */}
            <div>
                    <Modal
                        isOpen={modalIsOpenHM}
                        onRequestClose={() => setIsOpenHM(false)}               
                        contentLabel="Example Modal"
                        style={customStylesHM}
                    >
                        <div>
                            <Markdown>
                                {post}
                            </Markdown>
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
                // url: 'ws://localhost:8080',
                url: 'ws://3.11.105.145:8080',
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
        startgame(gameInfo, currentUser, socket, socket_send, takeCard, deck, players) {
            socket_send(gameInfo, socket, {
                type: 'game_started',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                sent_at: Date.now(),
                text: 'Game on!'
            })
            dispatch(gameState.actions.startPlayingGame())

            const message = {
                type: 'text',
                sent_by: currentUser.username,
                roomCode: gameInfo.roomCode,
                text: 'Game on!',
                sent_at: Date.now(),
            };

            dispatch(chatState.actions.sendMessage(message));

            for (let player_index in players){
                let player = players[player_index];

                for (let i=0; i<7; i++){
                    const randomCard = deck.pop();
                    socket_send(gameInfo, socket, {
                        type: 'game_move',
                        roomCode: gameInfo.roomCode,
                        sent_by: player.username,
                        moved_card: randomCard,
                        sent_at: Date.now(),
                        moved_to: player.username,
                    });

                    dispatch(gameState.actions.moveCard({
                        moved_by: player.username,
                        moved_card: randomCard,
                        moved_to: player.username,
                        moved_by_me: player.username === currentUser.username ? true : false,
                    }));
                }
            }
        },
        receiveGameStarted(){
            dispatch(gameState.actions.startPlayingGame());
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
                moved_by_me: messageData.moved_by_me,
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
        changeMatchState(currentUser, gameInfo, propState){
            if (currentUser.username === gameInfo.roomOwner) {
                if (propState.gameState === gameState.GAME_STATES.ROOM_CREATED) {
                    dispatch(gameState.actions.startGame());
                } else if (propState.gameState === gameState.GAME_STATES.PLAYING|| propState.gameState === gameState.GAME_STATES.WON) {
                    dispatch(gameState.actions.startClosingGame());
                }
            } else {
                // SALIR DE LA SALA
            }
        },
        winGame(username) {
            dispatch(gameState.actions.winGame(username));
        },
        changeTurn(gameInfo, currentUser, socket, socket_send, turns, reverse) {
            if(reverse){
                turns = turns * (-1);
            };
            socket_send(gameInfo, socket, {
                type: 'change_turn',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                turns: turns,
            });

            dispatch(gameState.actions.changeTurn(turns));
        },
        receiveChangeTurn(messageData) {
            dispatch(gameState.actions.changeTurn(messageData.turns))
        },
        takeXCards(gameInfo, currentUser, socket, socket_send, players, turns, cardsNumber) {
            socket_send(gameInfo, socket, {
                type: 'take_x_cards',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                take: players[(turns+1)%players.length].username,
                number: cardsNumber,
            });
        },
        reverseTurns(gameInfo, currentUser, socket, socket_send) {
            socket_send(gameInfo, socket, {
                type: 'reverse_turn',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
            });

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
        changeMatchState(){
            dispatchProps.changeMatchState(stateProps.gameInfo);
        },
        startgame() {
            dispatchProps.startgame(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send, dispatchProps.takeCard, stateProps.deck, stateProps.players);
        },
        changeColor(color, colorEsp=null) {
            dispatchProps.changeColor(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send, color, colorEsp);
        },
        changeTurn(turns, reverse) {
            dispatchProps.changeTurn(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send, turns, reverse);
        },
        takeXCards(players, turns, cardsNumber) {
            dispatchProps.takeXCards(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send, players, turns, cardsNumber);
        },
        reverseTurns() {
            dispatchProps.reverseTurns(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, dispatchProps.socket_send);
        },
    })
)(Game);
