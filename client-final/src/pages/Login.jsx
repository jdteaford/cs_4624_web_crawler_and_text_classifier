import React, { useState } from 'react';
import logo from '../crawl_logo.png';
import { useNavigate } from 'react-router-dom';


// import "../stylesheets/login.css"


function AccountSignInForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const { access_token } = await response.json();
            localStorage.setItem('token', access_token); // Store the token in local storage
            navigate('/');
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
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (!response.ok) {
                throw new Error('Account Creation failed');
            }

            const { access_token } = await response.json();
            localStorage.setItem('token', access_token); // Store the token in local storage
            navigate('/');
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
        <div className="card">
            <img src={logo} alt="logo" />
            <h1>Integrated Web App for Crisis Events Crawling</h1>
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
                        Register
                    </button>
                </>
                
            }
            </div>
        </div>)
    }
}

export default Login;