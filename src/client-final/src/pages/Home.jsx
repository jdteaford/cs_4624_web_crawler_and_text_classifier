import React from 'react'
import CrawlInitializer from '../components/CrawlInitializer'
import Banner from '../components/Banner'

const Home = ({user}) => {
  return (
    <div className="homepage">
        <Banner expo={"To begin, please engage with the Drag & Drop Menu Below. Once a file has been provisioned, you will be able to provide the crawl with constraints, and a name."}
                user={user.email}/>
        <CrawlInitializer user={user}/>
    </div>
  )
}

export default Home