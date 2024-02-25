import { React, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TreeVisualization from '../components/TreeVisualization';
import Banner from '../components/Banner';
import { BarChart } from "@mui/x-charts"
import axios, * as others from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Crawl = () => {
  const location = useLocation();
  const { displaySeeds, stats, tree, id, crawlName, email } = location.state;
  const [htmls, setHTMLS] = useState([])

  const instance = axios.create();
  const formDataHTMLS = new FormData();


  const chartRef = useRef();

  const statsActual = JSON.parse(stats);


  const websites = Object.keys(statsActual);

  const downloadFilesAsZip = async (files) => {
    const zip = new JSZip();

    files.forEach((file, index) => {
      zip.file(`${file.name}`, file.content);
    });
  
    const zipBlob = await zip.generateAsync({tytpe: 'blob'});
    saveAs(zipBlob, `${id}.zip`)
  }

  const downloadJSON = () => {

    const jsonData = {
      url_stats: websites,
      tree_hierarchy: tree,
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    saveAs(blob, `${id}.json`)
    URL.revokeObjectURL(url);
  }

  async function getHTMLFiles(){
      try{
          const apiUrl = '/get_downloaded_htmls'
          formDataHTMLS.append('crawl_id', id);

          const responseGet = await instance.post(apiUrl, formDataHTMLS, {
              headers:{
                  'Content-Type': 'multipart/form-data'
              },
          })
          setHTMLS(responseGet.data);
          if(htmls != null){
            downloadFilesAsZip(htmls);
          }
      }
      catch(error){
          console.error('Error:', error);
      }   
  }

  return (
    <>
    <Banner user={email}
            expo={`You are currently viewing Crawl Data for Crawl ID: ${id}, Crawl Name: ${crawlName}`}/>
    <div className="crawl__page">
      <div className="download__button--wrapper">
        {/* <button className="download__button" onClick={() => getHTMLFiles()}>
          Download HTML Files for Crawl as Zip
        </button> */}
        <button className="download__button" onClick={downloadJSON}>
          Download Statistics JSON
        </button>
      </div>
      <div className="crawl-details">
        <h2>User Provided Seeds:</h2>
        <ul>
          {displaySeeds.map((item, index) => (
            <li key={index} className="seed_li">
              <a href={item.URL} target="_blank" className="seed__url--li">
                {item.URL}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="crawl-stats">
        <h1>Average URL Score per Domain Yield</h1>
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: websites,
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: websites.map(website => statsActual[website].avg_score),
            },
          ]}
          width={1750}
          height={500}
        />
        <h1>Tree Visualization</h1>
        <TreeVisualization data={tree}/>
      </div>
    </div>
    </>
  );
};

export default Crawl;
