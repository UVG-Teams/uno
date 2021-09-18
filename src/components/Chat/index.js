import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import './styles.css';
import SendBubble from './Send_bubble';
import * as selectors from '../../reducers';
import ReceiveBubble from './Receive_bubble';
import * as chatState from '../../reducers/chat';



const Chat = ({ chat_messages, sendMessage }) => {

    const [messageText, setMessageText] = useState('');

    return (
        <div className='chat_component'>
            <div className='chat'>
                <div className='chat_header'>
                    <h3>Game Chat</h3>
                </div>
                <div className='chat_messages'>
                    {
                        chat_messages.map(chat_message => {
                            const tag_key = `${chat_message.sent_by}-${new Date()}-${chat_message.text}`

                            if (chat_message.sent_by != 'Willi') {
                                return <ReceiveBubble key={ tag_key } username={ chat_message.sent_by } text={ chat_message.text } />
                            } else {
                                return <SendBubble key={ tag_key } text={ chat_message.text } />
                            }
                        })
                    }
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
    )
}

export default connect(
    state => ({
        socket: selectors.getSocket(state),
        chat_messages: selectors.getMessages(state),
    }),
    dispatch => ({
        sendMessage(socket, messageText) {
            const message = {
                text: messageText,
                sent_by: "Willi",
            };

            socket.send(
                JSON.stringify(message)
            );

            dispatch(chatState.actions.sendMessage(message));
        }
    }),
    (stateProps, dispatchProps, ownProps) => ({
        ...dispatchProps,
        ...stateProps,
        ...ownProps,
        sendMessage(messageText) {
            dispatchProps.sendMessage(stateProps.socket, messageText)
        }
    })
)(Chat);
