import React from 'react';
import { TextField, Button } from '@material-ui/core';

import ReceiveBubble from './Receive_bubble';
import SendBubble from './Send_bubble';
import './styles.css';

const Chat = () => {
    return (
        <div className='chat_component'>
            <div className='chat'>
                <div className='chat_header'>
                    <h3>Game Chat</h3>
                </div>
                <div className='chat_messages'>
                    <ReceiveBubble />
                    <SendBubble />
                    <ReceiveBubble />
                </div>
                <div className='chat_write_message'>
                </div>
            </div>
        </div>
    )
}

export default Chat;