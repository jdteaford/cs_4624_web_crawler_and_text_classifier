import React, { useState, useEffect } from 'react';
import CrawlCard from '../components/CrawlCard';

const CrawlCardHolder = ({ data, response, user, childFunction }) => {
  const [dataMappable, setDataMappable] = useState([]);
  const [filter, setFilter] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

  const filteredData = dataMappable.filter(item => {
    console.log(item["Crawl Name"]);
    return (
      item &&
      item["Crawl Name"] &&
      item["Crawl Name"].toLowerCase().includes(filter.toLowerCase())
    );
  });

  useEffect(() => {
    setDataMappable(data);
  }, [data]);

  console.log("dataMappable:", dataMappable);

  return (
    <>
      <input
        className="lookup__crawls"
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter Crawls by Crawl Name"
      />
      <div className="card__holder">
        {filteredData.map((crawlData, index) => (
          crawlData.message === "data in correct format" ? (
            <div className="card__section" key={index}>
              <CrawlCard
                id={crawlData["Crawl ID"]}
                name={crawlData["Crawl Name"]}
                crawlName={crawlData["Crawl Name"]}
                user={user}
                urls={crawlData.URLs}
                stats={crawlData.Stats}
                date={crawlData["Collection Time"]}
                tree={crawlData.Tree}
                childFunction={childFunction}
              />
            </div>
          ) : (
            <div key={index}>Not mappable</div>
          )
        ))}
      </div>
    </>
  );
};

export default CrawlCardHolder;
