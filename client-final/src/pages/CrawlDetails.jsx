import React, {useEffect} from 'react';
import { useParams} from 'react-router-dom';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import '../stylesheets/crawldetails.css';

function CrawlDetails() {
  const { id } = useParams();

  const requestBody = {
    crawl_id: id
  };

  useEffect(() => {
     // Retrieve JWT token from local storage
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:5000/crawl_details', {  
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Include JWT token in the Authorization header
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Parse the JSON response
        return response.json();
    })
    .then(data => {
        // Process the JSON data
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    });
  }, [id]) //will execute the effect whenever id changes
    
  return (
    <div>
        <Banner imageUrl="logo">Web Crawler History</Banner>
        <HomeButton/>
        <h1>Collection: "{id}"</h1>
        <div className="box">
            <div className="row">Crawl ID</div>
            <div className="row">Crawl Name</div>
            <div className="row">Date Collected</div>
            <div className="row">URLs</div>
            <div className="row">Statistics</div>
            <div className="row">Tree</div>
        </div>
        {/* Display other data properties here as needed */}
    </div>
  );
}

export default CrawlDetails;


// import React from 'react';

// const CrawlDetails = (props) => {
//     console.log('here');
//     console.log("props are");
//     console.log(props);
//   // Access the data passed from the previous component
//     const { id } = props.location.state;

//     // Now you can use the id to fetch additional details or display information
//     return (
//     <div>
//         <h2>Details for Crawl ID: {id}</h2>
//         {/* You can render additional details or fetch more data based on the id */}
//     </div>
//     );
//     };

//     export default CrawlDetails;
