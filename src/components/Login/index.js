import React from 'react';
import { TextField, Button } from '@material-ui/core';

import './styles.css';


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
                <div className="login_button">
                    <Button variant="contained" color="primary">Sign in</Button>
                </div>

            </div>
        </div>
    )
}


export default Login;