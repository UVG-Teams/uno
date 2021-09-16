import React from 'react';

import './styles.css';

const ReceiveBubble = () => {
    return (
        <div style={{marginTop: '3%'}}>
            <label className='receive_bubble_sender'>User</label>
            <div className='receive_bubble_component'>
                <text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</text>
            </div>
        </div>
    )
}

export default ReceiveBubble;