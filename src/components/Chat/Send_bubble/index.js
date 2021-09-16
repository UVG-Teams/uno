import React from 'react';

import './styles.css';

const SendBubble = () => {
    return (
        <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column', marginTop: '3%'}}>
            <label className='sender'>You</label>
            <div className='sender_bubble_component'>
                <text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</text>
            </div>
        </div>
    )
}

export default SendBubble;