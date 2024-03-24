import React from 'react';
import LogoutButton from '../components/Logout';

import "../stylesheets/landing.css"

function LandingPage() {
  return (
    <div className='landing'>
        <h1>hello user</h1>
        <LogoutButton />
    </div>
  );
}

export default LandingPage;