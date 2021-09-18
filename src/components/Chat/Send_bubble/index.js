import React from 'react';

import './styles.css';

const SendBubble = ({ text }) => {
    return (
        <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column', marginTop: '3%'}}>
            <label className='sender'>You</label>
            <div className='sender_bubble_component'>
                <span>{ text }</span>
            </div>
        </div>
    )
}

export default SendBubble;
