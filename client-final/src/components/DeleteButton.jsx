import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './../stylesheets/homebutton.css'; // Import CSS file for styling




const DeleteButton = () => {
  return (
    <Link to="/" className="delete-button-wrapper">
      <button className="delete-button">
        Delete
      </button>
    </Link>
  );
}

export default DeleteButton;