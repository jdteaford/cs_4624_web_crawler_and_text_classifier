import React,{useState, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';
import PropTypes from 'prop-types';
import LogoutButton from './Logout';

const styles = {
    banner: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        width: '100vw',
        height: '20vh',
        position: 'fixed', //
        top:0, //
        zIndex: 1000 //
    },
    h1: {
        position: 'absolute',
        left: '60px',
        top: '70px',
        margin: 0,
        fontSize: '52px',
        color: '#fff'
    },
    h2: {
        position: 'absolute',
        left: '65px',
        top: '135px',
        margin: '5px 0 0',
        fontSize: '28px',
        color: '#fff'
    },
    logo: {
        position: 'absolute',
        top: '20px',
        right: '50px',
        width: '50px',
        height: '50px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        borderStyle: 'solid',
        borderColor: 'black',
    }
};

function Banner({ imageUrl, children }) {
    const [user, setUser] = useState('');

    //assuming i have jwt token in local storage
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUser(decodedToken.sub);
        }
    }, []);

    return (
        // <div style={styles.banner}>
        //     {user ? (
        //         <div>
        //             <h1 style={styles.h1}>Welcome, {user}</h1>
        //             <h2 style={styles.h2}>Automated Crisis Events Collection Interface</h2>
        //             <p className="banner__expo">{expo}</p>
        //         </div>
        //     ): (
        //         <div>
        //             <h1 style={styles.h1}>Welcome </h1>
        //             <h2 style={styles.h2}>Automated Crisis Events Collection Interface</h2>
        //             <p className="banner__expo">{expo}</p>
        //         </div>
        //     )}
        // </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: '#f2a65a',
            borderRadius: '0 0 25px 25px', // Rounded corners at the bottom
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            position: 'fixed', // Fixed at the top
            top: 0,
            left: 0,
            right: 0, // Stretches across the top
            zIndex: 1000, // Ensure it's above other content
            overflow: 'visible',
          }}>
            <img src={imageUrl} alt="Ribbon Image" style={{
              height: '50px', // Adjust based on your needs
            //   width: '50px', // Adjust based on your need
            }} />
            <span>{children}</span>
            <div>
                <span style={{ marginRight: "10px" }}><b>User: </b>{user}</span>
                <LogoutButton />
            </div>
            {/* Display user information and logout button if user is logged in */}
            {/* user && (
              <div>
                <span>{user.name}</span> {/* Display the user's name or any other information */}
                {/* <LogoutButton onClick={logout} /> {/* Your logout functionality */}
              {/* </div>
            ) */}
        </div>
    );
}

Banner.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Banner;