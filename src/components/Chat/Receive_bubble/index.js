import React from 'react';

import './styles.css';

const ReceiveBubble = ({ username, text }) => {
    return (
        <div style={{ paddingTop: '3%' }}>
            <label className='receive_bubble_sender'>{ username }</label>
            <div className='receive_bubble_component'>
                <span>{ text }</span>
            </div>
        </div>
    )
}

export default ReceiveBubble;
