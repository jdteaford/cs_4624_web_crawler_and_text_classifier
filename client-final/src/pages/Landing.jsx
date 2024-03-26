import React, {useState, useEffect} from 'react';
import LogoutButton from '../components/Logout';

import "../stylesheets/landing.css"

import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';

function LandingPage() {

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
    <div className='landing'>
      {user ? (
        <div>
          <h1>hello {user}</h1>
          <LogoutButton />
          <Link to="/crawl">
            <button type="new crawl">Create New Crawl</button>
          </Link>
          <Link>
            <button type = "crawl history">View Crawl History</button>
          </Link>
        </div>
      ) : (
        <div>
          <p>Please sign in</p>
          <LogoutButton />
          
        </div>
      )}
    </div>
    
  );
}

export default LandingPage;