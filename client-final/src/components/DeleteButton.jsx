import React from 'react';
import './../stylesheets/homebutton.css'; // Import CSS file for styling


const deleteAction = (id) => {

    // Retrieve JWT token from local storage
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:5000/delete_entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include JWT token in the Authorization header
        },
        body: JSON.stringify(id)
    })
    .then(response => {
        // Check if response is successful (status code in the range 200-299)
        if (response.ok) {
            // If successful, parse response JSON
            return response.json();
        } else {
            // If not successful, throw an error
            throw new Error('Network response was not ok');
        }
    })
}

const DeleteButton = (id) => {
  return (
    <button className="delete-button" onClick={() => deleteAction(id)}>
        Delete
    </button>

  );
}

export default DeleteButton;