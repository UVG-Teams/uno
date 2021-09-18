import React from 'react';

import './styles.css';

const ReceiveBubble = () => {
    return (
        <div style={{paddingTop: '3%'}}>
            <label className='receive_bubble_sender'>User</label>
            <div className='receive_bubble_component'>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
            </div>
        </div>
    )
}

export default ReceiveBubble;
