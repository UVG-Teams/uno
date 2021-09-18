import React from 'react';

import './styles.css';

const SendBubble = () => {
    return (
        <div style={{display: 'flex', alignItems: 'flex-end', flexDirection:'column', marginTop: '3%'}}>
            <label className='sender'>You</label>
            <div className='sender_bubble_component'>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
            </div>
        </div>
    )
}

export default SendBubble;
