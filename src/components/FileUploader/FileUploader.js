import { useState, useContext } from "react";
import Layout from "../Layout/Layout";
import classes from "./FileUploader.module.css";
import fileContext from "../../store/file-context";
import FileSaver from "file-saver";

const FileUploader = (props) => {
  const fileCtx = useContext(fileContext);
  const [curFileName, setCurFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [fileData, setFileData] = useState();

  const fileSelectChangeHandler = async (event) => {
    const fileInfo = event.target.files[0];
    const fileType = fileInfo.type;
    const fileName = fileInfo.name;

    if (fileType !== "text/csv") {
      alert("Must upload a .csv file");
      return;
    }
    setFileSelected(true);
    setFileUpload(false);
    setCurFileName(fileName);
    setFileData(fileInfo);
  };

  const uploadFileHandler = async (event) => {
    event.preventDefault();
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
        setFileSelected(false);
        setFileUpload(true);
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
        {/* <section className={classes["file-upload"]}> */}
          <label className={classes["upload-label"]} htmlFor="inputdata">
            Select File
          </label>
          <button
            className={classes["selectbutton"]}
            onClick={uploadFileHandler}
          >
            Upload File
          </button>
        {/* </section> */}
        <button onClick={createNewSpreadsheetHandler} className={classes["selectbutton"]} disabled={!fileUpload}type="submit">
          Create New Spreadsheet
        </button>
        <button onClick={downloadSpreadsheetHandler} className={classes["selectbutton"]} type="submit">
          Download Spreadsheet
        </button>
      </section>
      <section>
        {fileSelected && (
          <p className={classes["selectedfile"]}>
            Selected File:&nbsp;&nbsp;{curFileName}
          </p>
        )}
        {fileUpload && (
          <p className={classes["selectedfile"]}>
            Uploaded File:&nbsp;&nbsp;{curFileName}
          </p>
        )}
      </section>
      <input
        onChange={fileSelectChangeHandler}
        className={classes.inputdata}
        type="file"
        name="fname"
        id="inputdata"
      />
    </Layout>
  );
};
export default FileUploader;
