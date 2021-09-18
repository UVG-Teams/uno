import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import * as selectors from '../../reducers';
import backCard from '../Resources/deck.png';
import { actions } from '../../reducers/game';


const Login = ({ gameInfo, createGame }) => {

    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [password, setPassword] = useState('');

    if (gameInfo) {
        return <Redirect to="/game" />
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
                        onChange={ e => setPassword(e.target.value) }
                    />
                </div>

                <div className='login_button'>
                    <Button variant='contained' color='primary'>Sign in</Button>
                </div>

                <div className='login_button'>
                    <Button onClick={ () => createGame(username, roomCode, password) } variant='contained' color='primary'>Create Room</Button>
                </div>

                <div className='login_img_container'>
                    <div className='login_img_container2'>
                        <img src={ backCard } className='login_img' />
                        <img src={ backCard } className='login_img2' />
                        <img src={ backCard } className='login_img3' />
                    </div>
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

            if (!username || username == "") {
                return
            }

            const gameData = {
                roomCode: "4F",
                password: "12345",
            };

            const userData = {
                username: username,
            };

            dispatch(actions.startCreatingGame(gameData));
            dispatch(actions.setCurrentUserInfo(userData));
        }
    })
)(Login);
