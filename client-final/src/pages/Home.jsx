import React from 'react'
//import CrawlInitializer from '../components/CrawlInitializer'
//import Banner from '../components/Banner'

const Home = ({match}) => {
    const {username} = match.params;

  return (
    <div className="homepage">
        {/* <Banner expo={"To begin, please engage with the Drag & Drop Menu Below. Once a file has been provisioned, you will be able to provide the crawl with constraints, and a name."}
                user={user.email}/> */}
        {/* <CrawlInitializer user={user}/> */}
        <h1>Welcome, {username}!</h1>
    </div>
  )
}

export default Home