import React from 'react';
import { connect } from 'react-redux';
import './styles.css';
import * as selectors from '../../reducers';
import { actions } from '../../reducers/game';
import { actions as chatActions } from '../../reducers/chat';

const UnoButton = props => {
  const {onClick} = props;
  return (
    <div className='uno-button-container' onClick={onClick}>
      <h1>
        UNO
      </h1>
    </div>
  );
};

export default connect(
  state => ({
    socket: selectors.getSocket(state),
    player: selectors.getCurrentUserInfo(state),
  }),
  dispatch => ({
    onClick: (socket, player) => {
      socket.send(
        JSON.stringify({
          type: 'UNO_BUTTON_CLICKED',
          sent_by: player.username,
          sent_at: Date.now(),
        })
      );
      dispatch(actions.pressUno({
        type: 'UNO_BUTTON_CLICKED',
        sent_by: player.username,
        sent_at: Date.now(),
      }));

      const message = {
        type: 'text',
        sent_by: player.username,
        text: 'UNO!',
        sent_at: Date.now(),
    };

    socket.send(JSON.stringify(message));
    dispatch(chatActions.sendMessage(message));
      console.log('UNO BUTTON CLICKED AND DATA SENT');
    }
  }),
  (stateProps, dispatchProps) => ({
    onClick: () => {
      dispatchProps.onClick(stateProps.socket, stateProps.player);
    }
  })
)(UnoButton);
