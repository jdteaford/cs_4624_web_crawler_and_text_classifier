import React, { useState, useEffect } from 'react';
// import JSZip from 'jszip';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
//import './Train.css'
import '../stylesheets/train.css';

const Train = () => {
  const [trainData, setTrainData] = useState([]);
  const [trainModelType, setTrainModelType] = useState('');
  const [trainDataType, setTrainDataType] = useState('');
  const [showLossCurve, setShowLossCurve] = useState(false);
  const [trainedModel, setTrainedModel] = useState('');
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      data: []
    }]
  });

  useEffect(() => {
    // Register Chart.js scales
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  }, []);

  const train = async () => {
    const path = 'http://localhost:8000/train';
    let formData = new FormData();
    formData.append("data", trainData[0]);
    formData.append("data_type", trainDataType);
    formData.append("model_type", trainModelType);

    // PRINTING ENTIRES IN THE FORMDATA
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // FORMDATA IS EMPTY
    console.log("FormData:", formData);
    await submitForm(path, formData);
  };

  const updateTrainData = async (event) => {
    const files = event.target.files;
    setTrainData(files);

    // Read the contents of the zip file
    const file = files[0];
    // const zip = new JSZip();

    // // THIS PART IS PURELY FOR TESTING
    // try {
    //   const zipFile = await zip.loadAsync(file);

    //   // Iterate through each file in the zip
    //   zipFile.forEach(async (relativePath, zipEntry) => {
    //     if (zipEntry.dir) return; // Skip directories

    //     // Read the contents of the text file
    //     const txtContents = await zipEntry.async("text");
    //     // PRINT STATEMENT FOR THE LINKS
    //     // console.log(`Contents of ${relativePath}:`, txtContents);
    //   });
    // } catch (error) {
    //   console.error("Error reading zip file:", error);
    // }
  };

  const submitForm = async (path, formData) => {
    try {
      const response = await fetch(path, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Res.data[1]: ", data);
      const blob = new Blob([data[1]]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'model.pickle';
      link.click();
      URL.revokeObjectURL(link.href);

      setTrainedModel(data[1]);
      setGraphData({
        datasets: [{ data: data[0], label: 'Loss Curve', backgroundColor: '#191623' }],
        labels: [...Array(data[0].length).keys()]
      });
      setShowLossCurve(true);
      console.log(graphData);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="main">
      <div className="subpage_box">
        <div className="dot_holder">
          <div className="dot1" onClick={() => window.location.href = '/'}></div>
          <div className="dot2"></div>
          <div className="dot3"></div>
        </div>
        <div className="title">
          <h2 id="titletrain">Perform Training</h2>
        </div>
        <form className="main_form">
          <div className="content-left">
            <div className="align-horizontal">
              <p className="label">Upload Train Data</p>
              <p className="upload_type"><input type="file" onChange={updateTrainData} multiple /></p>
            </div>
            <div className="align-horizontal">
              <p className="label">Train Model Type</p>
              <p className="upload_type">
                <select value={trainModelType} onChange={(e) => setTrainModelType(e.target.value)}>
                  <option></option>
                  <option value='svm'>One-class SVM</option>
                  <option value='ae'>Autoencoder</option>
                </select>
              </p>
            </div>
            <div className="align-horizontal">
              <p className="label">Train Data Type</p>
              <p className="upload_type">
                <select value={trainDataType} onChange={(e) => setTrainDataType(e.target.value)}>
                  <option></option>
                  <option value='urls'>Zipfile of URLs</option>
                  <option value='html'>Zipfile of HTML</option>
                  <option value='txt'>Zipfile of .txt files</option>
                </select>
              </p>
            </div>
            <div className="align-horizontal">
              <p className="align-center"><button type="button" onClick={train}>Perform Training</button></p>
            </div>
          </div>
        </form>
        {showLossCurve &&
          <div className="loss_curve">
            <Line data={graphData} options={{ responsive: true }} />
          </div>
        }
      </div>
    </div>
  );
};

export default Train;
