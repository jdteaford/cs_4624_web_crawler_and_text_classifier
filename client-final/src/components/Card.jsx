import React from 'react';
// import './Card.css'; // Your CSS file for basic styling

const Card = ({ width, height, header, body }) => {
  // Create a style object that includes the passed width and height
  const cardStyle = {
    width: width, // You can use just `width` if the property and value are the same
    height: height, // Same as above, could be simplified to `height`
  };

  return (
    <div className="card-comp" style={cardStyle}>
      <div className="card-comp-header">{header}</div>
      <div className="card-comp-body">{body}</div>
    </div>
  );
};

export default Card;
