import React , { useState, useEffect } from 'react';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import blue_0 from '../Resources/blue_0.png';
import blue_1 from '../Resources/blue_1.png';
import blue_2 from '../Resources/blue_2.png';
import blue_3 from '../Resources/blue_3.png';
import blue_4 from '../Resources/blue_4.png';
import blue_5 from '../Resources/blue_5.png';
import blue_6 from '../Resources/blue_6.png';
import blue_7 from '../Resources/blue_7.png';
import blue_8 from '../Resources/blue_8.png';
import blue_9 from '../Resources/blue_9.png';



import './styles.css';
import Chat from '../Chat';
import * as selectors from '../../reducers';
import * as gameState from '../../reducers/game';
import * as socketState from '../../reducers/socket';
import table_0 from '../Resources/table_0.png';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';



// fake data generator
// const getItems = (count, offset = 0) =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k + offset}`,
//         content: `item ${k + offset}`
//     }));



// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    // const destClone = Array.from(destination);
    const destClone = [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
    display: 'flex'
});


const Game = ({ gameInfo, socket, connectWS, endgame }) => {

    useEffect(() => {
        // Validate if the websocket connection exists already
        if (!socket || socket.readyState == WebSocket.CLOSED) {
            connectWS();
        }
    }, []);

    // const [items, setItems] = useState([{id: 'blue_1', content: 'blue_1'},{id: 'blue_2', content: 'blue_2'},{id: 'blue_3', content: 'blue_3'},{id: 'blue_4', content: 'blue_4'},{id: 'blue_5', content: 'blue_5'},{id: 'blue_6', content: 'blue_6'},{id: 'blue_7', content: 'blue_7'},])
    const [items, setItems] = useState([{id: 'blue_1', content: 'blue_1'},{id: 'blue_2', content: 'blue_2'},{id: 'blue_3', content: 'blue_3'}])
    const [selected, setSelected] = useState([])

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
    };

    // const state = {
    //     items: getItems(10),
    //     selected: getItems(5, 10)
    // };
    
    

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    const id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    const getList = id => id2List[id] == 'items' ? items : selected; 

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId == 'droppable2') {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            if (source.droppableId == 'droppable2'){
                setSelected(items)
            } else {
                setItems(items)
            }
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
        <div>
            <div className="game_page">
                <Button onClick={() => endgame(socket)} variant='contained' color='primary'>
                    Close
                </Button>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div style={{display: 'flex', width: '60vw', height: '90%' , backgroundColor: 'blue', flexDirection:'column-reverse'}}>
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
                                                    {/* {item.content} */}
                                                    <img src={`/images/${item.content}.png`} style={{width: '50%'}}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
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
                                                    <img src={`/images/${item.content}.png`} style={{width: '50%'}}/>

                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
                <Chat />
            </div>
        </div>
    )
}

export default connect(
    state => ({
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
    })
)(Game);
