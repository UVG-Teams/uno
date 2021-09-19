import React , { useState, useEffect } from 'react';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import deck_1 from '../Resources/deck.png';
import deck_2 from '../Resources/deck_2.png';
import deck_3 from '../Resources/deck_3.png';
import deck_4 from '../Resources/deck_4.png';
import deck_5 from '../Resources/deck_5.png';
import deck_6 from '../Resources/deck_6.png';
import deck_7 from '../Resources/deck_7.png';
import deck_7plus from '../Resources/deck_7+.png';

import './styles.css';
import Chat from '../Chat';

import * as selectors from '../../reducers';
import * as gameState from '../../reducers/game';
import * as chatState from '../../reducers/chat';
import * as socketState from '../../reducers/socket';


// Moves a card from my deck to the game deck (from one list to another list)
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
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


const Game = ({ currentUser, gameInfo, socket, connectWS, endgame, receiveChatMessage }) => {
    useEffect(() => {
        // Validate if the websocket connection exists already
        if (!socket || socket.readyState == WebSocket.CLOSED) {
            connectWS();
        };
    }, []);

    const [myDeck, setMyDeck] = useState([{id: 'blue_1', content: 'blue_1'},{id: 'blue_2', content: 'blue_2'},{id: 'blue_3', content: 'blue_3'},{id: 'blue_4', content: 'blue_4'},{id: 'blue_5', content: 'blue_5'},{id: 'blue_6', content: 'blue_6'},{id: 'blue_7_1', content: 'blue_7'},{id: 'blue_7_2', content: 'blue_7'},]);
    const [gameDeck, setGameDeck] = useState([{id: 'green_8', content: 'green_8'}]);

    if (!gameInfo) {
        return <Redirect to='/' />
    };

    if (socket) {
        socket.onopen = function(event) {
            // Send an initial message
            socket.send(
                JSON.stringify({
                    type: 'text',
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

    // Handle with multiple lists matching ids of the droppable container to the names in state.
    const id2List = {
        myDeck: 'myDeck',
        gameDeck: 'gameDeck'
    };

    const getList = id => id2List[id] == 'myDeck' ? myDeck : gameDeck;

    const onDragEnd = result => {
        const { source, destination } = result;

        // Dropped outside the list, then return card to origin
        if (!destination) {
            return;
        }

        // Dropped in the own list, then return card to origin
        if (source.droppableId == 'gameDeck') {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            return;
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setGameDeck(result.gameDeck);
            setMyDeck(result.myDeck);
        };
    };

    return (
        <div className="game_page">
            <div style={{position: 'absolute'}}>
                <Button onClick={() => endgame(socket)} variant='contained' color='primary'>
                    Close
                </Button>
            </div>
            <div className='dnd'>
                <div className='rival_deck_1'>
                    <img src={deck_7} className='rival_cards'/>
                    <h2>Rival 1</h2>
                </div>
                <div className='rival_deck_2'>
                    <img src={deck_4} className='rival_cards'/>
                    <h2>Rival 2</h2>
                </div>
                <div className='rival_deck_3'>
                    <img src={deck_5} className='rival_cards'/>
                    <h2>Rival 3</h2>
                </div>
                <div className='rival_deck_4'>
                    <img src={deck_7plus} className='rival_cards'/>
                    <h2>Rival 4</h2>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className='droppables'>
                        <div className='deck_droppable'>
                            <Droppable droppableId="myDeck" direction='horizontal'>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {myDeck.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <img src={`/images/${item.content}.png`} className='game_cards'/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className='table_deck_droppable'>
                            {/* TODO: Button agarrar carta */}
                            <img src={deck_1} className='take_card'/>
                            <Droppable droppableId="gameDeck">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {gameDeck.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <img src={`/images/${item.content}.png`} className='main_game_card'/>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
                <Chat/>
            </div>
        </div>
    )
}

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
