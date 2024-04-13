import React from 'react';
import Banner from '../components/Banner';

class CrawlHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showSignUpFlag: false
        }
    }

    render () {

        return (
        <div>
        <div className='main'>
            <Banner />
            <p>crawl history page babyyyy</p>
            </div>
        </div>)
    }
}

export default CrawlHistory;