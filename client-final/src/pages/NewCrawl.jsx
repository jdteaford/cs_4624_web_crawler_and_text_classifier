import React from 'react';
import Banner from '../components/Banner';

class NewCrawl extends React.Component {

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
            <p>new crawl page babyy</p>
            </div>
        </div>)
    }
}

export default NewCrawl;