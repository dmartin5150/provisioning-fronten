import { useState, useEffect, useRef, Fragment } from "react";
import ReactDOM from "react-dom";
import Layout from "../Layout/Layout";
import classes from "./SpreadsheetManager.module.css";
import FileSaver from "file-saver";
import FileUploader from "./FileUploader";
import Backdrop from "../UI/Backdrop";

const ManageSpreadsheet = (props) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedCreationDate, setUploadedCreationDate] = useState("");
  const [provisioningFileName, setProvisioningFileName] = useState("");
  const [provisioningCreationDate, setProvisioningCreationDate] = useState("");
  const [provisioningSheetExists, setProvisioningSheetExists] = useState(false);
  const [sourceFileName, setSourceFileName] = useState("");
  const [fileIsUploaded, setFileIsUploaded] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const selectedFileRef = useRef();

  const setUploadFileStatus = (data) => {
    if (data.upload.filename === "") {
      setUploadedFileName("No file uploaded");
      setFileIsUploaded(false);
    } else {
      console.log(data.upload.filename);
      setUploadedFileName(data.upload.filename);
      setUploadedCreationDate(data.upload.creation_date);
      setFileIsUploaded(true);
    }
  };

  const setSourceFile = (data) => {
    if (data.source === "") {
      setSourceFileName("Souce Data Unknown");
    } else {
      setSourceFileName(data.source);
    }
  };

  const setProvisioningFileStatus = (data) => {
    if (data.provision.filename === "") {
      setProvisioningFileName("No provisioning file available");
      setProvisioningSheetExists(false);
    } else {
      console.log(data.provision.filename);
      setProvisioningFileName(data.provision.filename);
      setProvisioningCreationDate(data.provision.creation_date);
      setProvisioningSheetExists(true);
      setSourceFile(data);
    }
  };

  const setFileStatus = (data) => {
    setUploadFileStatus(data);
    setProvisioningFileStatus(data);
  };

  const getStatus = async () => {
    const response = await fetch("http://localhost:5000/currentstatus");
    if (response) {
      const data = await response.json();
      setFileStatus(data);
      console.log(data.provision.creation_date);
      return data;
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

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
    const data = new FormData();
    data.append("file_from_react", fileData);
    data.append("filename", fileData.name);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        setFileIsSelected(false);
        selectedFileRef.current.value = null;
        setFileUpload(true);
        getStatus();
      }
    } catch (error) {
      alert(error.message);
    }
  };



  const createNewSpreadsheetHandler = async (event) => {
    try {
      const response = await fetch("http://localhost:5000/spreadsheet");
      if (response.ok) {
        const data = await response.json();
        getStatus();
      } else {
        if (response.status === 404) {
          throw new Error("Unable to find provisioning file");
        } else {
          throw new Error("Server Error");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const downloadSpreadsheetHandler = async () => {
    const response = await fetch("http://localhost:5000/provisioningCSV");
    if (response.ok) {
      const data = await response.blob({ type: "text/csv;charset=utf-8;" });
      FileSaver.saveAs(data, "CSProvisioning.csv");
    } else {
      if (response.status === 404) {
        throw new Error("Unable to find provisioning file");
      } else {
        throw new Error("Server Error");
      }
    }
  };

  const cancelUploadHandler = () => {
    setFileIsSelected(false);
    selectedFileRef.current.value = null;
    console.log('cancel');
  };


  const test = () => {
    console.log(test);
  }

  return (

    <Fragment>
      {fileIsSelected && ReactDOM.createPortal(
        <Backdrop onClick={cancelUploadHandler} />, document.getElementById("backdrop-root")
      )}
      {fileIsSelected && ReactDOM.createPortal(
            <FileUploader />
      , document.getElementById("modal-root"))}
      <Layout>
        <section className={classes["file-actions"]}>
          <label className={classes["upload-label"]} htmlFor="inputdata">
            Select File
          </label>
          <button
            className={classes["selectbutton"]}
            onClick={uploadFileHandler}
            disabled={!fileIsSelected}
          >
            Upload File
          </button>
          <button
            onClick={createNewSpreadsheetHandler}
            className={classes["selectbutton"]}
            disabled={!fileUpload}
            type="submit"
          >
            Create New Spreadsheet
          </button>
          <button
            onClick={downloadSpreadsheetHandler}
            className={classes["selectbutton"]}
            type="submit"
            disabled={!provisioningSheetExists}
          >
            Download Spreadsheet
          </button>
        </section>
        <section>
          {fileIsSelected && (
            <FileUploader
              filename={uploadedFileName}
              onCancel={cancelUploadHandler}
            ></FileUploader>
          )}
          <p className={classes["selectedfile"]}>
            <span>Uploaded File:</span>&nbsp;&nbsp;{uploadedFileName}
            &nbsp;&nbsp;
            {uploadedCreationDate}
          </p>
          <p className={classes["selectedfile"]}>
            Provisioning File:&nbsp;&nbsp;{provisioningFileName}&nbsp;&nbsp;
            {provisioningCreationDate}
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
    </Fragment>
  );
};
export default ManageSpreadsheet;
