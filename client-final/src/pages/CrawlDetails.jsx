import React, {useEffect, useState} from 'react';
import { useParams} from 'react-router-dom';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import '../stylesheets/crawldetails.css';

function CrawlDetails() {
    const { id } = useParams();

    const [crawlData, setCrawlData] = useState(null);

    const requestBody = {
        crawl_id: id
    };

    useEffect(() => {
     // Retrieve JWT token from local storage
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/crawl_details', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            console.log('yay');
            return response.json();
        })
        .then(data => {
            // Process the JSON data
            setCrawlData(data);
            console.log(data);
            console.log(data['Crawl Name']);
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
        });
    }, [id]) //will execute the effect whenever id changes

  // Function to handle download JSON
    const handleDownloadJSON = (data, filename) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
  return (
    <div>
        <Banner imageUrl="logo">Web Crawler History</Banner>
        <HomeButton/>
        <h1>Collection: "{crawlData['Crawl Name']}"</h1>
        {crawlData ? (
            <div className="box">
                <div className="row"><b>Crawl ID: </b>{crawlData['Crawl ID']}</div>
                <div className="row"><b>Crawl Name: </b>{crawlData['Crawl Name']}</div>
                <div className="row"><b>Date Collected: </b>{crawlData['Collection Time']}</div>
                {/* Download links for URLs, Statistics, and Tree */}
                <div className="row-urls"><b>URLs: </b>
                    <button onClick={() => handleDownloadJSON(crawlData['URLs'], 'urls.json')}>
                        Download URLs as JSON
                    </button>
                </div>

                <div className="row-stats"><b>Statistics: </b>
                    <button onClick={() => handleDownloadJSON(crawlData['Stats'], 'statistics.json')}>
                        Download Statistics as JSON
                    </button>
                </div>
                <div className="row"><b>Tree: </b>
                    {crawlData['Tree'] && (
                        <button onClick={() => handleDownloadJSON(crawlData['Tree'], 'tree.json')}>
                            Download Tree as JSON
                        </button>
                    )}

                </div>
            </div>
        ) : (
            <p>Loading...</p>
        )}
       
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
