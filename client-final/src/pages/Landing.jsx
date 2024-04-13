import React, {useState, useEffect} from 'react';
import LogoutButton from '../components/Logout';

// import "../stylesheets/landing.css"

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
    <div>
      {user ? (
        <div className="card">
          <LogoutButton />
          <h1>hello {user}</h1>
          
          <Link to="/newcrawl">
            <button type="new crawl">Create New Crawl</button>
          </Link>
          <Link to="/crawlhistory">
            <button type = "crawl history">View Crawl History</button>
          </Link>
          <Link to="/train">
            <button type = "train model">Train Model</button>
          </Link>
        </div>
      ) : (
        <div>
          <LogoutButton />
          {/* I think this code is redundant bc we handle protected roots in app.js */}
        </div>
      )}
    </div>
    
  );
}

export default LandingPage;