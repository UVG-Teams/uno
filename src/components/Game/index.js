import React , { useState } from 'react';
import { DragDropContext, Droppable,  Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';

import table_0 from '../Resources/table_0.png'
import Chat from '../Chat';

import './styles.css';


const initialData = {
    tasks: {
        'task-1': {id: 'task-1', content: 'Take out the garbage'},
        'task-2': {id: 'task-2', content: 'Watch my favorite show'},
        'task-3': {id: 'task-3', content: 'Charge my phone'},
        'task-4': {id: 'task-4', content: 'Cook dinner'},

    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },
    columnOrder: ['column-1'],
};

const itemsFromBackend = [
    []
]


const Game = () => {
    const [columns, setColumns] = useState(initialData)

    
    return (
        <Draggable draggableId="supported" index={0}>
            {(provided) => (
                <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="item"
                />
            )}
        </Draggable>
        // <div className='game_page'>
        //     <div>

        //     </div>



        //     <Chat />
        // </div>
    )
}

export default Game;