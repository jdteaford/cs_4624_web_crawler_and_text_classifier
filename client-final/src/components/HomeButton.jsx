import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './../stylesheets/homebutton.css'; // Import CSS file for styling

const HomeButton = () => {
  return (
    <Link to="/" className="home-button-wrapper">
      <button className="home-button">
        Home
      </button>
    </Link>
  );
}

export default HomeButton;