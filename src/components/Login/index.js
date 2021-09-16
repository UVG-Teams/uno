import React from 'react';
import { TextField, Button } from '@material-ui/core';

import './styles.css';
import backCard from '../Resources/deck.png';


const Login = () => {
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
                    <Button onClick={ () => alert("HOLA") } variant='contained' color='primary'>Create Room</Button>
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


export default Login;