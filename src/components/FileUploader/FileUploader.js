import { useState, useEffect, useRef } from "react";
import Layout from "../Layout/Layout";
import classes from "./FileUploader.module.css";
import fileContext from "../../store/file-context";
import FileSaver from "file-saver";

const FileUploader = (props) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileIsSelected, setFileIsSelected] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedCreationDate, setUploadedCreationDate]= useState("")
  const [provisioningFileName, setProvisioningFileName] = useState("");
  const [provisioningCreationDate, setProvisioningCreationDate]= useState("")
  const [sourceFileName, setSourceFileName] = useState("")
  const [fileUpload, setFileUpload] = useState(false);
  const selectedFileRef = useRef();




  const setUploadFileStatus = (data) => {
    if (data.upload.filename === ''){
      setUploadedFileName('No file uploaded')
    } else {
      console.log(data.upload.filename)
      setUploadedFileName(data.upload.filename)
      setUploadedCreationDate(data.upload.creation_date)
    }
  }

  const setSourceFile = (data) => {
    if (data.source === '') {
      setSourceFileName('Souce Data Unknown');
    } else {
      setSourceFileName(data.source);
    }
  }

  const setProvisioningFileStatus = (data) => {
    if (data.provision.filename === ''){
      setProvisioningFileName('No provisioning file available');
    } else {
      console.log(data.provision.filename);
      setProvisioningFileName(data.provision.filename);
      setProvisioningCreationDate(data.provision.creation_date);
      setSourceFile(data);

    }
  }

  const setFileStatus = (data) => {
    setUploadFileStatus(data);
    setProvisioningFileStatus(data);
  }


  const getStatus = async()=> {
    const response = await fetch("http://localhost:5000/currentstatus");
    if (response) {
      const data = await response.json()
      setFileStatus(data)
      console.log(data.provision.creation_date)
      return data
    }
  }

  useEffect(() => {
    getStatus();
},[])



  const fileSelectChangeHandler = async (event) => {
    const fileInfo = event.target.files[0];
    const fileType = fileInfo.type;
    const fileName = fileInfo.name;

    if (fileType !== "text/csv") {
      alert("Must upload a .csv file");
      return;
    }
    setSelectedFileName(fileName);
    setFileIsSelected(true);
  };

  const uploadFileHandler = async (event) => {
    event.preventDefault();
    const fileData = selectedFileRef.current.files[0];
    console.log('filedata', fileData)
    const data = new FormData();
    data.append("file_from_react", fileData);
    data.append("filename", fileData.name);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: data,
      });
      console.log(response);
      if (response.ok) {
        setFileIsSelected(false);
        selectedFileRef.current.value=null;
        setFileUpload(true);
        getStatus();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const createNewSpreadsheetHandler = async (event) => {
    try {
      const response = await fetch(
        "http://localhost:5000/spreadsheet"
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        if (response.status === 404){
            throw new Error('Unable to find provisioning file');
        } else {
            throw new Error('Server Error');
        }
      }
    } catch (error) {
      alert(error.message)
    }
  };

  const downloadSpreadsheetHandler =  async () => {
    const response = await fetch(
        "http://localhost:5000/getprovfile"
      );
      if (response.ok) {
        const data = await response.blob({type: 'text/csv;charset=utf-8;'});
        FileSaver.saveAs(data, 'CSProvisioning.csv');
      } else {
        if (response.status === 404){
            throw new Error('Unable to find provisioning file');
        } else {
            throw new Error('Server Error');
        }
      }
  }

  return (
    <Layout>
      <section className={classes["file-actions"]}>
          <label className={classes["upload-label"]} htmlFor="inputdata">
            Select File
          </label>
          <button
            className={classes["selectbutton"]}
            onClick={uploadFileHandler}
          >
            Upload File
          </button>
        <button onClick={createNewSpreadsheetHandler} className={classes["selectbutton"]} disabled={!fileUpload}type="submit">
          Create New Spreadsheet
        </button>
        <button onClick={downloadSpreadsheetHandler} className={classes["selectbutton"]} type="submit">
          Download Spreadsheet
        </button>
      </section>
      <section>
        {fileIsSelected && 
          <p className={classes["selectedfile"]}>
            Selected File:&nbsp;&nbsp;{selectedFileName}
          </p>
        }
        <p className={classes["selectedfile"]}>
          Uploaded File:&nbsp;&nbsp;{uploadedFileName}&nbsp;&nbsp;{uploadedCreationDate}
        </p>
        <p className={classes["selectedfile"]}>
          Provisioning File:&nbsp;&nbsp;{provisioningFileName}&nbsp;&nbsp;{provisioningCreationDate}
        </p>
        <p className={classes["selectedfile"]}>
          Provisioning File SourceData:&nbsp;&nbsp;{sourceFileName}
        </p>
      </section>
      <input
        onChange={fileSelectChangeHandler}
        className={classes.inputdata}
        type="file"
        name="fname"
        id="inputdata"
        ref={selectedFileRef}
      />
    </Layout>
  );
};
export default FileUploader;
