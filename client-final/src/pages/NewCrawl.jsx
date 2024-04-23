import React, {useCallback, useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
//import CrawlCardHolder from '../components/CrawlCardHolder'
import 'font-awesome/css/font-awesome.min.css';
import 'rc-slider/assets/index.css'; // Import the default CSS styles
//import axios, * as others from 'axios';
import {jwtDecode} from 'jwt-decode';
import Banner from '../components/Banner';
import HomeButton from '../components/HomeButton';
import logo from '../trans_web.png';
import uniqid from 'uniqid';


const NewCrawl = () => {

    const spinner = document.getElementById('spinner--wrapper');
    var requestCompleteFlag = "";

    const [selectedFile, setSelectedFile] = useState(null); //file state, tracks file.
    const [modalClass, setModalClass] = useState("hidden");

    const [userHardCount, setUserHardCount] = useState(1000); //hard counts for server side data.
    const [urlThreshold, setUrlThreshold] = useState(0.2);
    const [paraThreshold, setParaThreshold] = useState(0.5);
    const [pageHardCount, setPageHardCount] = useState(5);

    const [userName, setUserName] = useState("");
    const [crawlName, setCrawlName] = useState("");
    const [modelData, setModelData] = useState([]);
    const [model, setModel] = useState("")
    const [dropdownOption, setOption] = useState("");

    let formData = new FormData();
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

    //assuming i have jwt token in local storage
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUserName(decodedToken.sub);
        }
    }, []);

    ///////////////////FILE DROP STUFF//////////////////////////////////
    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const removeFile = () => {
        setSelectedFile(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch('http://127.0.0.1:5000/models', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}` // Include JWT token in the Authorization header
                    }
                });
    
                if (!response.ok) {
                    console.log(response.body)
                    throw new Error("Request failed");
                }
    
                const data = await response.json();
    
                const newArray = data.map(m => ({
                    model_name: m.model_name,
                    model: m["_id"]
                }));
    
                setModelData(newArray);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error if necessary
            }
        };
    
        fetchData();
    }, []);

    ///////////////MODAL STUFF//////////////////////////////////////////
    const toggleModal = () => {
        // setOption(modelData[0].model_name);
        // setModel(modelData[0].model);
        if(modalClass === "hidden"){
            setModalClass("show");
        }
        else{
            setModalClass("hidden");
        }
    }

    /////////////////HANDLE CONSTRAINTS FORM////////////////////

    //state veraiible that holds error messages related to form validation
    const [errors, setErrors] = useState({
        crawlName: "",
        userHardCount: "",
        urlThreshold: "",
        paraThreshold: "",
        pageHardCount: ""
    });

    const handleFormSubmit = async () => {
        console.log(model)
        console.log(userHardCount);
        console.log(urlThreshold);
        console.log(errors);
        // Form validation
        if (!crawlName || crawlName.trim() === "") {
            setErrors({ ...errors, crawlName: "Crawl Name is required" });
        }
        if (userHardCount > 5000) {
            setErrors({ ...errors, userHardCount: "Max URLs Traversed cannot exceed 5000" });
        }
        if (urlThreshold > 1) {
            console.log("hit")
            setErrors({ ...errors, urlThreshold: "URL Score Threshold cannot exceed 1" });
        }
        if (paraThreshold > 1) {
            setErrors({ ...errors, paraThreshold: "Page Score Threshold cannot exceed 1" });
        }
        if (pageHardCount > 10) {
            setErrors({ ...errors, pageHardCount: "Max Pages Downloaded cannot exceed 10" });
        }
        if ((crawlName || crawlName.trim() !== "") && userHardCount <= 5000 && urlThreshold <= 1 && paraThreshold <= 1 && pageHardCount <= 10){
               // If all validations pass, proceed with form submission
            toggleModal();
            alert("Form submitted successfully");
            return;
        }
        else{
            alert("Follow constraint form requirements and try to submit again.");
            return;
        }   
    }; 

    //////////////POST REQUEST//////////////////

    async function sendPostRequest(){
        spinner.classList.toggle('hide');

        try{
            const apiUrl = 'http://127.0.0.1:5000/scrape_and_save';
            formData.append('file', selectedFile);
            formData.append('urlTotal', userHardCount);
            formData.append('urlThreshold', urlThreshold);
            formData.append('paraThreshold', paraThreshold);
            formData.append('pageTotal', pageHardCount);
            formData.append("model", model);
            //console.log(userName);

            formData.append('username', userName);
            formData.append('crawlname', crawlName);

            formData.append('crawl_id', uniqid());

            const response = await fetch(apiUrl, {
                method: 'POST',
                // headers:{
                //     'Content-Type': 'multipart/form-data',
                //     //'Authorization': `Bearer ${token}`,
                // },
                body: formData
            });
            console.log(response.data);
            requestCompleteFlag = response;
            spinner.classList.toggle('hide');
            //sendGetRequest(userName);
        }
        catch(error){
            spinner.classList.toggle('hide');
            //console.error('View error messages and try again:', error);
            console.log('View error messages and try again');
        }
    }

    //////////////CONSTAINTS FORM INPUT STUFF///////////////////////
    const handleCrawlNameChange = (event) => {
        setCrawlName(event.target.value);
        setErrors({ ...errors, crawlName: "" }); // Reset error message
    };
    
    const handleUserHardCountChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setUserHardCount(value);
        setErrors({ ...errors, userHardCount: "" });
    };
    
    const handleURLThresholdChange = (event) => {
        const value = parseFloat(event.target.value);
        setUrlThreshold(value);
        setErrors({ ...errors, urlThreshold: "" });
    };
    
    const handleParaThresholdChange = (event) => {
        const value = parseFloat(event.target.value);
        setParaThreshold(value);
        setErrors({ ...errors, paraThreshold: "" }); 
    };
    
    const handlePageTotalChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setPageHardCount(value);
        setErrors({ ...errors, pageHardCount: "" }); 
    };

    const handleModel = (event) => {
        // Get the selected model object from the event
        const selectedModel = modelData.find(m => m.model_name === event.target.value);
        
        // Set the selected model object to the model state variable
        setOption(event.target.value);
        setModel(selectedModel.model);
        console.log(selectedModel.model)
    }
    return (
    <>
        <Banner imageUrl={logo}><b>Integrated Web App for Crisis Events Crawling</b></Banner>
        <HomeButton/>
        <div className={`modal__container ${modalClass}`}>
        <button className="close__button" onClick={handleFormSubmit}>Submit</button>
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
                        required
                    />
                    {errors.crawlName && <div className="error">{errors.crawlName}</div>}
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Max URLs Traversed: </label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={userHardCount}
                        onChange={handleUserHardCountChange}
                        max="5000"
                    />
                    {errors.userHardCount && <div className="error">{errors.userHardCount}</div>}
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">URL Score Threshold: </label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={urlThreshold}
                        onChange={handleURLThresholdChange}
                        max="1"
                        step="0.01"
                    />
                    {errors.urlThreshold && <div className="error">{errors.urlThreshold}</div>} {/* Error message */}
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Page Score Threshold:</label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={paraThreshold}
                        onChange={handleParaThresholdChange}
                        max="1"
                        step="0.01"
                    />
                    {errors.paraThreshold && <div className="error">{errors.paraThreshold}</div>} {/* Error message */}
                </div>
                <div className="user__hardcount--container">
                    <label className="hardcount__label" htmlFor="text-input">Max Pages Downloaded:</label>
                    <input
                        className="url__hardcount--input"
                        type="number"
                        id="text-input"
                        value={pageHardCount}
                        onChange={handlePageTotalChange}
                        max="10"
                    />
                    {errors.pageHardCount && <div className="error">{errors.pageHardCount}</div>} {/* Error message */}
                </div>
                <select value={dropdownOption} onChange={e => handleModel(e)}>
                    {modelData && modelData.length ? modelData.map(m => 
                        (<option key={m.model_name} value={m.model_name}>{m.model_name}
                        </option>)) :
                        <></>}
                </select>
                <h3 className="modal__instructions">Done entering? Click the "Submit" to submit the constraints.</h3>
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
            <div className = "button__container">
                {selectedFile != null ?
                <button className="remove__file" onClick={removeFile}>
                    Remove File
                </button>
                :
                <></>
                }
                { selectedFile != null && userName?
                    <button className="run__crawl" onClick={toggleModal}> 
                        Set Constraints
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
            </div>
        </div>
        <div className="spinner--wrapper hide" id="spinner--wrapper">
            <div className="spinner"></div>
            <h2 className="spinner__text">Running Crawl...</h2>
        </div>
    </>

    );
};

export default NewCrawl