import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';
import Modal from 'react-modal';
import Markdown from 'markdown-to-jsx';


import './styles.css';
import * as selectors from '../../reducers';
import backCard from '../Resources/deck_1.png';
import * as gameState from '../../reducers/game';


const Login = ({ gameInfo, createGame, endgame, joinGame }) => {

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: '50%',
          width: '50%',
        },
    };

    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [password, setPassword] = useState('');

    const [post, setPost] = useState('');
    useEffect(() => {
        import('../../helpme.md')
            .then(res => {
                fetch(res.default)
                    .then(res => res.text())
                    .then(res => setPost(res))
            })
            .catch(err => console.log(err));
    });



    if (gameInfo) {
        return <Redirect to="/game" />
    } else {
        // Try to delete existing game
        endgame()
    };

    return (
        <div className='login_page'>
            <div className='login_form'>

                <h1 className='login_title'>Sign in</h1>

                <div className='inputs_login_form'>
                    <TextField
                        id='standard-basic'
                        label='Display Name'
                        className='login_inputs'
                        value={ username }
                        onChange={ e => setUsername(e.target.value) }
                    />
                    <TextField
                        id='standard-basic'
                        label='Room Code'
                        // color='secondary'
                        className='login_inputs'
                        value={ roomCode }
                        onChange={ e => setRoomCode(e.target.value) }
                    />
                    <TextField
                        id='standard-basic'
                        label='Room Password'
                        className='login_inputs'
                        value={ password }
                        type={ 'password' }
                        onChange={ e => setPassword(e.target.value) }
                    />
                </div>

                <div className='login_button'>
                    <Button
                        onClick={ () => joinGame(username, roomCode, password) }
                        variant='contained'
                        color='primary'
                    >
                        Sign in
                    </Button>
                </div>

                <div className='login_button'>
                    <Button
                        onClick={ () => createGame(username, roomCode, password) }
                        variant='contained'
                        color='primary'
                    >
                        Create Room
                    </Button>
                </div>

                <div className='login_img_container'>
                    <div className='login_img_container2'>
                        <img src={ backCard } className='login_img' alt=''/>
                        <img src={ backCard } className='login_img2' alt=''/>
                        <img src={ backCard } className='login_img3' alt=''/>
                    </div>
                </div>

                <div style={{position:'absolute', right:'9%', top:'8%'}}>
                    <Button
                        onClick={ () => setIsOpen(true) }
                        variant='contained'
                        color='primary'
                        style={{borderRadius:100, padding: 20}}
                    >
                        ?
                    </Button>
                </div>

                {/* Modal help me */}
                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setIsOpen(false)}               
                        contentLabel="Example Modal"
                        style={customStyles}
                    >
                        <div>
                            <Markdown>
                                {post}
                            </Markdown>
                        </div>

                    </Modal>
                </div>

            </div>
        </div>
    );
};


export default connect(
    state => ({
        gameInfo: selectors.getGameInfo(state),
    }),
    dispatch => ({
        createGame(username, roomCode, password) {

            // eslint-disable-next-line eqeqeq
            if (!username || username == "") { return; };
            if (!roomCode || roomCode == "") { return; };
            if (!password || password == "") { return; };

            const gameData = {
                roomCode,
                password,
                roomOwner: username
            };

            const userData = {
                username: username,
            };

            dispatch(gameState.actions.startCreatingGame(gameData));
            dispatch(gameState.actions.setCurrentUserInfo(userData));

        },
        joinGame(username, roomCode, password) {

            if (!username || username == "") { return; };
            if (!roomCode || roomCode == "") { return; };
            if (!password || password == "") { return; };

            const joinPetitionData = {
                player: username,
                roomCode,
                password,
            };

            const userData = { username };

            dispatch(gameState.actions.startJoiningGame(joinPetitionData));
            dispatch(gameState.actions.setCurrentUserInfo(userData));

        },
        endgame() {
            dispatch(gameState.actions.startClosingGame());
        },
    })
)(Login);
