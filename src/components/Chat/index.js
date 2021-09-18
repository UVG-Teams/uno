import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
                    <input type='text' placeholder='Write your message...' className='inpMessage'></input>
                    <button className='btnMessage'><FontAwesomeIcon icon={faPaperPlane} size="2x" color="#ffffff" swapOpacity/></button>
                </div>
            </div>
        </div>
    )
}

export default Chat;