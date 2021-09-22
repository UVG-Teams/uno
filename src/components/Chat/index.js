import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import './styles.css';
import SendBubble from './Send_bubble';
import * as selectors from '../../reducers';
import ReceiveBubble from './Receive_bubble';
import * as chatState from '../../reducers/chat';



const Chat = ({ currentUser, chat_messages, sendMessage }) => {
    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
      });
    const [messageText, setMessageText] = useState('');

    return (
        <div className='chat_component'>
            <div className='chat'>
                <div className='chat_header'>
                    <h3>Game Chat</h3>
                </div>
                <div className='chat_messages'>
                    {
                        chat_messages.map(msg => {
                            const tag_key = `${msg.sent_by}-${msg.sent_at}-${msg.text}`
                            
                            if (msg.sent_by != currentUser.username) {
                                return <ReceiveBubble key={ tag_key } username={ msg.sent_by } text={ msg.text } />
                            } else {
                                return <SendBubble key={ tag_key } text={ msg.text } />
                            }
                        })
                        
                    }
                    <div ref={divRef} />
                </div>
                <div className='chat_write_message'>
                    <input
                        type='text'
                        placeholder='Write your message...'
                        className='inpMessage'
                        value={ messageText }
                        onChange={ e => setMessageText(e.target.value) }
                    />
                    <button className='btnMessage' onClick={() => sendMessage(messageText)}>
                        <FontAwesomeIcon icon={faPaperPlane} size='2x' color='#ffffff' swapOpacity/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        currentUser: selectors.getCurrentUserInfo(state),
        socket: selectors.getSocket(state),
        gameInfo: selectors.getGameInfo(state),
        chat_messages: selectors.getMessages(state),
    }),
    dispatch => ({
        sendMessage(gameInfo, currentUser, socket, messageText) {
            const message = {
                type: 'text',
                roomCode: gameInfo.roomCode,
                sent_by: currentUser.username,
                text: messageText,
                sent_at: Date.now(),
            };

            socket.send(JSON.stringify(message));
            dispatch(chatState.actions.sendMessage(message));
        }
    }),
    (stateProps, dispatchProps, ownProps) => ({
        ...dispatchProps,
        ...stateProps,
        ...ownProps,
        sendMessage(messageText) {
            dispatchProps.sendMessage(stateProps.gameInfo, stateProps.currentUser, stateProps.socket, messageText)
        }
    })
)(Chat);
