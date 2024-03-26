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
            <img src='https://hoopdirt.com/wp-content/uploads/2017/05/VT_logo.svg_.png' alt='' />
            </div>
        </div>)
    }
}

export default NewCrawl;