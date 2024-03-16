import React, { useState } from 'react';
import "../stylesheets/login.css"

function AccountSignInForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form>
            <br />
            <label>
                Username: 
                <input 
                    type='text'
                    onChange={(e) => setUsername(e.target.value)}>
                </input>
            </label>
            <br />
            <label>
                Password: 
                <input 
                    type='text'
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
            </label>
            <br />
            <button type="submit">Sign In</button>
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
            const response = await fetch('http://localhost:5000/create_account', {
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
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <br />
            <label>
                Password: 
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <br />
            <label>
                Email: 
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <br />
            <button type="submit">Create Account</button>
        </form>
    );
}

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render () {
        return (
        <div className="main"> 
            <h1></h1>
            <div className= "central-content">
            <div className="sign-in-div">
                <AccountSignInForm />
            </div>
            <div className='sign-up-div'>
                <AccountCreationForm />
            </div>
            </div>
        </div>)
    }
}

export default Login;