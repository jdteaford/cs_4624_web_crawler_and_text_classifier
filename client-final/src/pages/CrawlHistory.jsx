import React from 'react';
import logo from '../trans_web.png';
import Banner from '../components/Banner';
import Card from '../components/Card';

function CrawlHistory() {

    // Retrieve JWT token from local storage
    const token = localStorage.getItem('jwtToken');

    // Make GET request with JWT token in the headers
    fetch('http://127.0.0.1:5000/crawl_history', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}` // Include JWT token in the Authorization header
    }
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(data => {
    // Handle the response data
    console.log(data);
    })
    .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
    });


    return (
    <div>
        <Banner imageUrl={logo}>Web Crawler History</Banner>
        <Card width="100px" height="150px" header="Custom Small Card" body="This is a small card with custom dimensions." />
    </div>
    );
}

export default CrawlHistory;