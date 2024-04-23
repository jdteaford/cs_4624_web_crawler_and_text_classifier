import React, {useState, useEffect} from 'react';
import logo from '../trans_web.png';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';

const styles = {
  h1: {
      color: 'white',
      // display: 'flex',
      top: '100px', /* Adjust the distance from the y coordinate */
      left: "475px", 
      // left: '20px',
      textAlign: 'center',
      // justifyContent: 'space-around',
      // alignItems: 'center',
      // width: '100vw',
      // height: '20vh',
      position: 'absolute', 
      // top:0,
  },
};


function LandingPage() {

  const [user, setUser] = useState('');

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
        <Banner imageUrl={logo}>Integrated Web App for Crisis Events Crawling</Banner>
        <div >

          <h1 style={styles.h1}>Hello {user}, Please select an action</h1>
          
          <Link to="/newcrawl">
            <button type="new crawl">+ Create New Crawl</button>
          </Link>
          <Link to="/crawlhistory">
            <button type = "crawl history">View Crawl History</button>
          </Link>
          <Link to="/train">
            <button type = "train model">+ Train Model</button>
          </Link>
        </div>
    </div>
    
  );
}

export default LandingPage;