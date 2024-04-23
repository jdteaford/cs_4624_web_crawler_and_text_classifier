import React, { useState, useEffect } from 'react';
import logo from '../trans_web.png';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import CrawlCard from '../components/CrawlCard';



function CrawlHistory() {
    // const [crawlData, setCrawlData] = useState([]); 
    const [crawlData, setCrawlData] = useState(''); 

    useEffect(() => {
        // Retrieve JWT token from local storage
        const token = localStorage.getItem('token');

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
            // Update state with the fetched data
            // setCrawlData(data);
            setCrawlData(JSON.stringify(data, null, 2));
        })
        .catch(error => {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
            setCrawlData(`Error: ${error.message}`);
        });
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <Banner imageUrl={logo}><b>Integrated Web App for Crisis Events Crawling</b></Banner>
            <HomeButton/>
            {crawlData && JSON.parse(crawlData).map((item, index) => (
                // Assuming `item` has properties `header` and `body` you want to display
                <CrawlCard 
                    key={index}
                    width="100%" 
                    height="auto" 
                    data={item}
                />
            ))}
        </div>
    );
}

export default CrawlHistory;