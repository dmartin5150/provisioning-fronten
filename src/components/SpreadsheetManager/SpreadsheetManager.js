import { useState, useEffect, useRef, Fragment } from "react";
import ReactDOM, { unstable_batchedUpdates } from "react-dom";
import Layout from "../Layout/Layout";
import classes from "./SpreadsheetManager.module.css";
import FileSaver from "file-saver";
import FileUploader from "./FileUploader";
import Backdrop from "../UI/Backdrop";
import FileStatus from "./FileStatus";

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
  const [sourceUpdated, setSourceUpdated] = useState(false);
  const [currentStatus, setCurrentStatus] = useState([]);
  const selectedFileRef = useRef();


  const setUploadFileStatus = (data) => {
    if (data.upload.filename === "") {
      setUploadedFileName("No file uploaded");
      setFileIsUploaded(false);
    } else {
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

  useEffect(()=> {
    if (uploadedFileName === sourceFileName) {
      setSourceUpdated(true);
    } else {
      setSourceUpdated(false);
    }
  }, [uploadedFileName,sourceFileName])

  const setFileStatus = (data) => {
    setUploadFileStatus(data);
    setProvisioningFileStatus(data);
    console.log('file', uploadedFileName);

  };



  const getStatus = async () => {
    let status = [];
    const response = await fetch("http://localhost:5000/currentstatus");
    if (response) {
      const data = await response.json();
      setFileStatus(data, status);
      console.log(data.provision.creation_date);
      return data;
    }
  };

  useEffect(() => {
    console.log('in use effect');
    getStatus();
  }, []);

  useEffect(()=> {
    let status = [{
      id:'s1',
      title:'Most Recent Uploaded File:',
      filename: uploadedFileName,
      creationDate: uploadedCreationDate
    },
    {
      id:'s2',
      title:'Provisioning File',
      filename: provisioningFileName,
      creationDate: provisioningCreationDate         
    },
    {
      id: 's3',
      title: 'Source for Provisioning File:',
      filename:sourceFileName,
      creationDate:''
    }]
    setCurrentStatus(status);

  },[uploadedFileName, uploadedCreationDate,provisioningFileName,provisioningCreationDate,sourceFileName])

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


  const downloadSpreadsheetHandler = async () => {
    const response = await fetch("http://localhost:5000/provisioningCSV");
    if (response.ok) {
      const data = await response.blob({ type: "text/csv;charset=utf-8;" });
      FileSaver.saveAs(data, "CSProvisioning.csv");
      return response.ok
    } else {
      if (response.status === 404) {
        throw new Error("Unable to find provisioning file");
      } else {
        throw new Error("Server Error");
      }
      return false;
    }
  };

  const createNewSpreadsheetHandler = async (event) => {
    try {
      const response = await fetch("http://localhost:5000/spreadsheet");
      if (response.ok) {
        const data = await response.json();
        getStatus();
        return response.ok
      } else {
        if (response.status === 404) {
          throw new Error("Unable to find provisioning file");
        } else {
          throw new Error("Server Error");
        }
      }
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const uploadFileHandler = async () => {
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
        return response.ok
      } else {
        if (response.status === 404) {
          throw new Error("Unable to upload file");
        } else {
          throw new Error("Server Error");
        }
      }
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const processUploadedFileHandler = async () => {
    if (await uploadFileHandler()){
      if(await createNewSpreadsheetHandler()) {
        await downloadSpreadsheetHandler();
      }
    }
    selectedFileRef.current.value = null;
    getStatus();
  }




  const cancelUploadHandler = () => {
    setFileIsSelected(false);
    selectedFileRef.current.value = null;
    console.log("cancel");
  };


  return (
    <Fragment>
      {fileIsSelected &&
        ReactDOM.createPortal(
          <Backdrop onClick={cancelUploadHandler} />,
          document.getElementById("backdrop-root")
        )}
      {fileIsSelected &&
        ReactDOM.createPortal(
          <FileUploader
            filename={selectedFileName}
            onCancel={cancelUploadHandler}
            onUpload={processUploadedFileHandler}
          />,
          document.getElementById("modal-root")
        )}
      <Layout>
        <section className={classes["file-actions"]}>
          <label className={classes["upload-label"]} htmlFor="inputdata">
            Select File
          </label>
          {/* <button
            onClick={createNewSpreadsheetHandler}
            className={classes["selectbutton"]}
            disabled={!fileUpload}
            type="submit"
          >
            Create New Spreadsheet
          </button> */}
          <button
            onClick={downloadSpreadsheetHandler}
            className={classes["selectbutton"]}
            type="submit"
            disabled={!provisioningSheetExists}
          >
            Download Spreadsheet
          </button>
          <button
            onClick={downloadSpreadsheetHandler}
            className={classes["selectbutton"]}
            type="submit"
            disabled={!provisioningSheetExists}
          >
            Download Excel
          </button>
        </section>
        {currentStatus.map((status)=> {
          return  (<FileStatus
          key={status.id}
          title={status.title}
          filename={status.filename}
          creationDate={status.creationDate}
        ></FileStatus>)
        })}
        <input
          onChange={fileSelectChangeHandler}
          className={classes.inputdata}
          type="file"
          name="fname"
          id="inputdata"
          ref={selectedFileRef}
        />
      </Layout>
      {!sourceUpdated && <p className={classes.warning}>Provisiong Document Not updated with most recent file upload</p>}
    </Fragment>
  );
};
export default ManageSpreadsheet;
