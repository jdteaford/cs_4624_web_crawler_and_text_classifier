import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Banner from '../components/Banner';
import Home from './Home';

import "../stylesheets/login.css"

function AccountSignInForm() {
    const nav = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // Redirect to another page
                //nav.push(`/home/${username}`);
            } else {
                alert('Failed to sign in: maybe check for incorrect credentials?');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error creating account');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <br />
            <label>
                Username: 
            </label>
            <input 
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}>
            </input>
            <br />
            <label>
                Password: 
            </label>
            <input 
                type='text'
                value={password}
                onChange={(e) => setPassword(e.target.value)}>
            </input>
            <br />
            <div>
                <button type="submit">
                    Sign In
                </button>
            </div>
        </form>
    )
}

function AccountCreationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Success message
                // Additional actions on success (e.g., redirect)
            } else {
                alert('Failed to create account');
                // Handle errors or unsuccessful responses
            }
        } catch (error) {
            console.error('Error during account creation:', error);
            alert('Error creating account');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username: 
            </label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <label>
                Password: 
            </label>
            <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <label>
                Email: 
            </label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <div>
                <button type="submit">Create Account</button>
            </div>
            <br />
            <br />
        </form>
    );
}

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showSignUpFlag: false
        }
    }

    render () {

        return (
        <div>
        <div className='main'>
            <Banner />
            <img src='https://hoopdirt.com/wp-content/uploads/2017/05/VT_logo.svg_.png' alt='' />
            <br />
            {
                this.state.showSignUpFlag
                ?
                <>
                    <AccountCreationForm />
                    <br />
                    <button onClick={() => this.setState({ showSignUpFlag: false})}>
                        Go Back
                    </button>
                </>
                :
                <>
                    <AccountSignInForm />
                    <br />
                    <button onClick={() => this.setState({ showSignUpFlag: true})}>
                        Go to Sign Up
                    </button>
                </>
                
            }
            </div>
        </div>)
    }
}

export default Login;