import React from 'react';
import { TextField, Button } from '@material-ui/core';

import table_0 from '../Resources/Table_0.png'
import Chat from '../Chat';

import './styles.css';

const Game = () => {
    return (
        <div className='game_page' style={{ backgroundImage: `url(${table_0})`, backgroundRepeat: 'no-repeat'}}>
            <Chat />
        </div>
    )
}

export default Game;