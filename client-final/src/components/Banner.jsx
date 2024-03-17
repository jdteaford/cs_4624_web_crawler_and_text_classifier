import React from 'react';

const styles = {
    banner: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        width: '100vw',
        height: '10vh',
        position: 'relative',
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

function Banner({expo, user}) {
    return (
        <div style={styles.banner}>
            <div>
                <h1 style={styles.h1}>Welcome, {user}</h1>
                <h2 style={styles.h2}>Automated Crisis Events Collection Interface</h2>
                <p className="banner__expo">{expo}</p>
            </div>
        </div>
    );
}

export default Banner;