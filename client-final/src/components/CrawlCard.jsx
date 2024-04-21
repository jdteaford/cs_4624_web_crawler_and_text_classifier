import React from 'react';
import DeleteButton from './DeleteButton';
import './../stylesheets/crawlcard.css'; // Your CSS file for basic styling
import { Link } from 'react-router-dom';

const CrawlCard = ({ width, height, data }) => {
  // Create a style object that includes the passed width and height
  const cardStyle = {
    width: width, // You can use just `width` if the property and value are the same
    height: height, // Same as above, could be simplified to `height`
  };

  return (
    <div className="card-comp" style={cardStyle}>
      {/* <div className="card-comp-header">{header}</div>
      <div className="card-comp-body">{body}</div> */}
       {/* Display "Name" */}
      <div>
          Crawl Name: {data['Crawl Name']}
      </div>
      {/* Display "Date" on a new line */}
      <div>
          Date: {data['Collection Time']}
      </div>
      <DeleteButton
        id={data['Crawl ID']}
      />
      <button>Click to see details</button>

    </div>
  );
};

export default CrawlCard;
