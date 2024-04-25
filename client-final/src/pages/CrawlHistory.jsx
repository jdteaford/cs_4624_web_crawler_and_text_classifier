import React, { useState, useEffect } from 'react';
import logo from '../trans_web.png';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import CrawlCard from '../components/CrawlCard';

function CrawlHistory() {
    const [crawlData, setCrawlData] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/crawl_history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setCrawlData(JSON.stringify(data, null, 2));
            setFilteredData(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setCrawlData(`Error: ${error.message}`);
        });
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = JSON.parse(crawlData).filter(item => item['Crawl Name'].toLowerCase().includes(query));
        setFilteredData(filtered);
    };

    return (
        <div>
            <Banner imageUrl={logo}><b>Integrated Web App for Crisis Events Crawling</b></Banner>
            <HomeButton/>
            <br />
            <br />
            <input 
                type="text" 
                placeholder="Search by crawl name" 
                value={searchQuery} 
                onChange={handleSearch} 
            />
            <div style={{ marginTop: '20px' }}>
                {filteredData.map((item, index) => (
                    <CrawlCard 
                        key={index}
                        width="100%" 
                        height="auto" 
                        data={item}
                    />
                ))}
            </div>
        </div>
    );
}

export default CrawlHistory;
