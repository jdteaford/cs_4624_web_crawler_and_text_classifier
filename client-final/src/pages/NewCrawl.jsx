import React, {useCallback, useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
//import CrawlCardHolder from '../components/CrawlCardHolder'
import 'font-awesome/css/font-awesome.min.css';
import 'rc-slider/assets/index.css'; // Import the default CSS styles
import axios, * as others from 'axios';
import {jwtDecode} from 'jwt-decode';

//import uniqid from 'uniqid';


const NewCrawl = ({user}) => {

    //var uniqid = require('uniqid');
    const spinner = document.getElementById('spinner--wrapper');
    var requestCompleteFlag = "";

    const [selectedFile, setSelectedFile] = useState(null); //file state, tracks file.
    
    const [userHardCount, setUserHardCount] = useState(1000); //hard counts for server side data.
    const [urlThreshold, setUrlThreshold] = useState(0.2);
    const [paraThreshold, setParaThreshold] = useState(0.5);
    const [pageHardCount, setPageHardCount] = useState(5);

    const [userName, setUserName] = useState("");
    const [crawlName, setCrawlName] = useState("");

    const [modalClass, setModalClass] = useState("hidden");
    const [bodyClass, setBodyClass] = useState("show");

    const formData = new FormData();
    const formDataGet = new FormData();

    const instance = axios.create();

    const [data, setData] = useState([{
        "message": "not yet",
        "crawl_id": "",
        "crawl_data": {
            "name": "",
            "crawl_name": "",
            "urls": [],
            "stats": "",
            "date" : "",
            "Tree": ""
        }
    }]); //data, and setData which manipulates the state of data.

    // Add a request interceptor
    instance.interceptors.request.use((config) => {
        console.log('Request Data:', config.data); // Log request data
        return config;
    });

    //assuming i have jwt token in local storage
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUserName(decodedToken.sub);
        }
    }, []);

    // function childConditionalCall(){
    //     sendGetRequest(userName);
    // }



    // async function sendGetRequest(){
    //     try{
    //         const apiUrl = 'http://127.0.0.1:5000/get_user_crawls'
    //         //formDataGet.append('userid', userName);

    //         const responseGet = await instance.post(apiUrl, formDataGet, {
    //             headers:{
    //                 'Content-Type': 'multipart/form-data'
    //             },
    //         })
    //         setData(responseGet.data);
    //         console.log(responseGet.data);
    //     }
    //     catch(error){
    //         console.error('Error:', error);
    //     }   
    // }

    async function sendPostRequest(){
        spinner.classList.toggle('hide');

        try{
            const apiUrl = 'http://127.0.0.1:5000/scrape_and_save';
            formData.append('file', selectedFile);

            formData.append('urlTotal', userHardCount);
            formData.append('urlThreshold', urlThreshold);
            formData.append('paraThreshold', paraThreshold);
            formData.append('pageTotal', pageHardCount);

            //console.log(userName);

            formData.append('username', userName);
            formData.append('crawlname', crawlName);

            //formData.append('crawl_id', uniqid());

            const response = await instance.post(apiUrl, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            requestCompleteFlag = response;
            spinner.classList.toggle('hide');
            //sendGetRequest(userName);
        }
        catch(error){
            spinner.classList.toggle('hide');
            console.error('Error:', error);
        }
    }

    const onDrop = useCallback((acceptedFiles) => {
        
        setSelectedFile(acceptedFiles[0]);

    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
        },
    });

    const removeFile = () => {
        setSelectedFile(null);
    };

    const handleUserHardCountChange = (event) =>  {
        if(event.target.value > 5000){
            setUserHardCount(0);
        }
        else{
            setUserHardCount(event.target.value);
        }
    };

    const handleURLThresholdChange = (event) => {
        if(event.target.value > 1){
            setUrlThreshold(0.2);
        }
        else{
            setUrlThreshold(event.target.value);
        }
    }

    const handleParaThresholdChange = (event) => {
        if(event.target.value > 1){
            setParaThreshold(0.5);
        }
        else{
            setParaThreshold(event.target.value)
        }
    }

    const handlePageTotalChange = (event) => {
        if(event.target.value > 10){
            setPageHardCount(2);
        }
        else{
            setPageHardCount(event.target.value);
        }
    }

    // const handleUserNameChange = (event) => {
    //     setUserName(event.target.value);
    // }
    const handleCrawlNameChange = (event) => {
        setCrawlName(event.target.value);
    }


    const toggleModal = () => {
        if(modalClass == "hidden"){
            setModalClass("show");
        }
        else{
            setModalClass("hidden");
        }
    }

    return (
    <>
      <div className={`modal__container ${modalClass}`}>
        <button className="close__button" onClick={toggleModal}>Continue</button>
        <h1 className="modal__header">Change Crawl Constraints</h1>
        <h3 className="modal__instructions">Edit the Parameters for the Crawl, maxes are 5000 URLs, 10 pages, and 1.0 for Tresholds. They will reset to their defaults in error.</h3>
            <div className="constraint__wrapper">
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">
                        <i className="fa fa-asterisk" aria-hidden="true"></i>
                        Crawl Name: 
                    </label>
                    <input
                        className="url__hardcount--input"
                        type="text"
                        id="text-input"
                        value={crawlName}
                        onChange={handleCrawlNameChange}
                    />
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Max URLs Traversed: </label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={userHardCount}
                        onChange={handleUserHardCountChange}
                    />
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">URL Score Threshold: </label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={urlThreshold}
                        onChange={handleURLThresholdChange}
                    />
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Page Score Threshold:</label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={paraThreshold}
                        onChange={handleParaThresholdChange}
                    />
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Max Pages Downloaded:</label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={pageHardCount}
                        onChange={handlePageTotalChange}
                    />
                </div>
                <h3 className="modal__instructions">Done entering? Click the "X" On The Top Right.</h3>
            </div>
      </div>
      <div className="crawl__initializer--wrapper">
        <div className="crawl__initializer--instructions">To Run a Crawl, First Provision a File</div>
        <div className="input__wrapper">
            <div {...getRootProps()} className="dropzone">
                <input className="file__dropper" {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop your file here.</p>
                ) : (
                    <p>Drag & Drop File Here, or Click to Insert Directly.</p>
                )}
            </div>
            {selectedFile && (
            <div className="file__holder">
                <p>Selected File: {selectedFile.name}</p>
            </div>
            )}
        </div>
        <div className="button__container">
            {selectedFile != null ?
            <button className="remove__file" onClick={removeFile}>
                Remove File
            </button>
            :
            <></>
            }
            { selectedFile != null && userName && crawlName?
            <button className="run__crawl" onClick={sendPostRequest}>
                Run New Crawl
            </button>
            :
            <></>
            }
            { selectedFile != null ?
            <button className="run__crawl" onClick={toggleModal}>
                Set Constraints
            </button>
            :
            <></>
            }   
        </div>
     </div>
        <div className="spinner--wrapper hide" id="spinner--wrapper">
            <div className="spinner"></div>
            <h2 className="spinner__text">Running Crawl...</h2>
        </div>
        {/* <CrawlCardHolder data={data} response={requestCompleteFlag} user={user} childFunction={childConditionalCall}/> */}
     </>
    )
}

export default NewCrawl