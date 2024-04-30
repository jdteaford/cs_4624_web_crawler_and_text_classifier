import React, {useEffect, useState} from 'react';
import { json, useParams} from 'react-router-dom';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import '../stylesheets/crawldetails.css';
import logo from '../trans_web.png';
import { BarChart } from "@mui/x-charts";
import CustomTree from './CustomTree';

import { Tree } from 'react-d3-tree';

function CrawlDetails() {
    const { id } = useParams();

    const [crawlData, setCrawlData] = useState(null);
    const [stats, setStats] = useState(null);
    const [jsonStats, setJsonStats] = useState(null);
    const [websites, setWebsites] = useState(null);

    const requestBody = {
        crawl_id: id
    };

    useEffect(() => {
        if (crawlData) {
            const statsData = crawlData['Stats'];
            if (statsData) {
                setStats(statsData);
            }
        }
    }, [crawlData]);

    useEffect(() => {
        if (stats) {
            try {
                const parsedStats = JSON.parse(stats);
                setJsonStats(parsedStats);
            } catch (error) {
                console.error('Error parsing JSON stats:', error);
            }
        }
    }, [stats]);


    useEffect(() => {
        if (jsonStats) {
            const websites = Object.keys(jsonStats);
            setWebsites(websites);
        }
    }, [jsonStats]);

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
          <Banner imageUrl={logo}><b>Integrated Web App for Crisis Events Crawling</b></Banner>
          <HomeButton/>    
          {crawlData ? (
            <div style={{marginTop:"1000px"}}>
              <h1>Collection: "{crawlData['Crawl Name']}"</h1>
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
                <div className="tree-container">
                <b>Tree: </b> When you zoom in and hover on a node, it will display the url string
                and its relevancy score in the top left box of the screen.
                    {crawlData && (
                      <CustomTree 
                        data={crawlData['URLs']}
                        style={{ width: '100%' }} />
                    )}
                </div>

                {websites && websites.length > 0 && jsonStats && (
                  <div className="bar-chart">
                    <b>Average Scores of Domains: </b>
                    <BarChart
                      xAxis={[
                        {
                          id: 'barCategories',
                          data: websites,
                          scaleType: 'band',
                          label: 'Domains'
                        },
                      ]}
                      yAxis={[
                        {
                          id: 'barData',
                          label: 'Average Score'
                        }
                      ]}
                      series={[
                        {
                          data: websites.map(website => jsonStats[website].avg_score),
                        },
                      ]}
                      width={500}
                      height={500}
                    />
                  </div>
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
