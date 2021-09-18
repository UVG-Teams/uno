import React , { useState, useEffect } from 'react';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import deck from '../Resources/deck.png';

import './styles.css';
import Chat from '../Chat';

import * as selectors from '../../reducers';
import * as gameState from '../../reducers/game';
import * as chatState from '../../reducers/chat';
import * as socketState from '../../reducers/socket';




// Record the movement of cards (items)
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

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

    const [items, setItems] = useState([{id: 'blue_1', content: 'blue_1'},{id: 'blue_2', content: 'blue_2'},{id: 'blue_3', content: 'blue_3'},{id: 'blue_4', content: 'blue_4'},{id: 'blue_5', content: 'blue_5'},{id: 'blue_6', content: 'blue_6'},{id: 'blue_7', content: 'blue_7'},{id: 'blue_7', content: 'blue_7'},])
    const [selected, setSelected] = useState([{id: 'green_8', content: 'green_8'}])

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
        droppable: 'items',
        droppable2: 'selected'
    };

    const getList = id => id2List[id] == 'items' ? items : selected; 

    const onDragEnd = result => {
        const { source, destination } = result;

        // Dropped outside the list, then return card to origin
        if (!destination) {
            return;
        }

        // Dropped in the own list, then return card to origin
        if (source.droppableId == 'droppable2') {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            // const items = reorder(
            //     getList(source.droppableId),
            //     source.index,
            //     destination.index
            // );

            // if (source.droppableId == 'droppable2'){
            //     setSelected(items)
            // } else {
            //     setItems(items)
            // }
            return
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setSelected(result.droppable2)
            setItems(result.droppable)
        }
    };
    
    return (
        <div className="game_page">
            <div style={{position: 'absolute'}}>
                <Button onClick={() => endgame(socket)} variant='contained' color='primary'>
                    Close
                </Button>
            </div>
            <div className='dnd'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className='droppables'>
                        <div className='deck_droppable'>
                            <Droppable droppableId="droppable" direction='horizontal'>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {items.map((item, index) => (
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
                            <img src={deck} className='take_card'/>                  
                            <Droppable droppableId="droppable2">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {selected.map((item, index) => (
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
