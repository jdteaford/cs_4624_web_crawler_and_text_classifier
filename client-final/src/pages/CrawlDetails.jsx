import React from 'react';

function CrawlDetails(props) {
    console.log("props:", props);

    const state = props.state;
    console.log("state:", state);

    // Check if state is undefined or null
    if (!state) {
        console.log("No state found");
        return <div>No data available</div>;
    }

    // Access properties from the state object
    const crawlID = state['Crawl ID'];
    console.log("Crawl ID:", crawlID);

    return (
        <div>
            <p>Crawl ID: {crawlID}</p>
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
