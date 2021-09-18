import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import backCard from '../Resources/deck.png';
import * as selectors from '../../reducers';
import { actions } from '../../reducers/game';


const Login = ({ gameInfo, createGame }) => {

    if (gameInfo) {
        return <Redirect to="/game" />
    }

    return (
        <div className='login_page'>
            <div className='login_form'>

                <h1 className='login_title'>Sign in</h1>

                <div className='inputs_login_form'>
                    <TextField
                        id='standard-basic'
                        label='Display Name'
                        className='login_inputs'
                    />
                    <TextField
                        id='standard-basic'
                        label='IP Adress'
                        // color='secondary'
                        className='login_inputs'
                    />
                    <TextField
                        id='standard-basic'
                        label='Room Code'
                        className='login_inputs'
                    />
                </div>

                <div className='login_button'>
                    <Button variant='contained' color='primary'>Sign in</Button>
                </div>

                <div className='login_button'>
                    <Button onClick={ createGame } variant='contained' color='primary'>Create Room</Button>
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
    )
}


export default connect(
    state => ({
        gameInfo: selectors.getGameInfo(state),
    }),
    dispatch => ({
        createGame() {
            const data = {
                roomName: "4F",
                password: "12345",
                isServer: true,
            };

            dispatch(actions.startCreatingGame(data));
        }
    })
)(Login);
