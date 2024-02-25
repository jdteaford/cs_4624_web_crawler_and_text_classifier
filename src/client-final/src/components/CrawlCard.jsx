import React from 'react';
import { Link } from 'react-router-dom';
import axios, * as others from 'axios';

const CrawlCard = ({ id, name, crawlName, urls, stats, date, tree, childFunction, user}) => {

  const formDataDelete = new FormData();
  const instance = axios.create();

  var email = user.email
 
  async function sendDeleteRequest(){
    try{
      const apiUrl = 'http://127.0.0.1:5000/delete_firebase_entry'
      formDataDelete.append('crawl_name', crawlName);

      const responseGet = await instance.post(apiUrl, formDataDelete, {
          headers:{
            'Content-Type': 'multipart/form-data'
          },
      })

      childFunction();
      
    }
    catch(error){
      console.error('Failed to Delete:', error);
    }
  }
 
  var displaySeeds = urls.filter((value) => value.URL_Score === 1);

  return (
    <div className="crawl__card--actual" >
    <button className="close__button--card" onClick={sendDeleteRequest}>Delete Crawl</button>
    <Link to={`/crawls/${id}`} state={{displaySeeds, stats, tree, id, crawlName, email}}>
      <div id={id} className="crawl__wrapper">
        <div className="crawl__name">{crawlName}</div>
        <div className="crawl__date">Crawl Date: {date}</div>
        <div className="crawl__seed">
          First 5 Seed Urls:
          {
          displaySeeds.map((item, index) => {
            if(index < 5){
            return <div href={item.URL} id={`${index}`} target="_blank" className="seed__url--li" key={index}>
              {item.URL}
            </div>
            }
          })
          }
        </div>
        <div className="stats_cta">To See Statistics, Click the Card</div>
      </div>
    </Link>
    </div>
  );
};

export default CrawlCard;
