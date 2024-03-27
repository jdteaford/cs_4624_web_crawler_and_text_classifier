import React, {useCallback, useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
//import CrawlCardHolder from '../components/CrawlCardHolder'
import 'font-awesome/css/font-awesome.min.css';
import 'rc-slider/assets/index.css'; // Import the default CSS styles
//import axios, * as others from 'axios';
import {jwtDecode} from 'jwt-decode';
//import Banner from '../components/Banner';

//import uniqid from 'uniqid';


const NewCrawl = () => {

    const [selectedFile, setSelectedFile] = useState(null); //file state, tracks file.
    const [modalClass, setModalClass] = useState("hidden");

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

    ///////////////MODAL STUFF//////////////////////////////////////////
    const toggleModal = () => {
        if(modalClass === "hidden"){
            setModalClass("show");
        }
        else{
            setModalClass("hidden");
        }
    }

    return (
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
                { selectedFile != null ?
                        // onClick={toggleModal}
                    <button className="run__crawl"> 
                        Set Constraints
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
};

export default NewCrawl