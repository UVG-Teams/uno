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
    gameInfo: selectors.getGameInfo(state),
    myCards: selectors.getMyCards(state),
    deck: selectors.getDeck(state),
  }),
  dispatch => ({
    onClick: (socket, player, gameInfo, myCards, deck) => {
      socket.send(
        JSON.stringify({
          type: 'uno_button_clicked',
          sent_by: player.username,
          roomCode: gameInfo.roomCode,
          sent_at: Date.now(),
        })
      );
      dispatch(actions.pressUno({
        type: 'uno_button_clicked',
        sent_by: player.username,
        sent_at: Date.now(),
      }));

      const message = {
        type: 'text',
        sent_by: player.username,
        roomCode: gameInfo.roomCode,
        text: 'UNO!',
        sent_at: Date.now(),
    };

      socket.send(JSON.stringify(message));
      dispatch(chatActions.sendMessage(message));
      
      if (myCards.length !== 1) {
        // Takes two cards from the deck
        for (let i = 0; i<2; i++) {
          const randomCard = deck.pop();
          socket.send(
            JSON.stringify({
              type: 'game_move',
              roomCode: gameInfo.roomCode,
              sent_by: player.username,
              moved_card: randomCard,
              sent_at: Date.now(),
              moved_to: player.username,
            })
          );
          dispatch(actions.moveCard({
            moved_by: player.username,
            moved_card: randomCard,
            moved_to: player.username,
            moved_by_me: true
          }));
        }

        const messageMistake = {
          type: 'text',
          sent_by: player.username,
          roomCode: gameInfo.roomCode,
          text: 'Sorry, I messed up! Already took my extra cards...',
          sent_at: Date.now(),
        };
  
        socket.send(JSON.stringify(messageMistake));
        dispatch(chatActions.sendMessage(messageMistake));
      }
    }
  }),
  (stateProps, dispatchProps) => ({
    onClick: () => {
      dispatchProps.onClick(stateProps.socket, stateProps.player, stateProps.gameInfo, stateProps.myCards, stateProps.deck);
    }
  })
)(UnoButton);
