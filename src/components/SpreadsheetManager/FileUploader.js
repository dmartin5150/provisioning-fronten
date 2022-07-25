
import React from 'react';
import classes from './FileUploader.module.css';


const FileUploader = (props) => {


    const fileUploadHandler = () => {
        props.onUpload();
    }
    const cancelUploadHandler = () => {
        props.onCancel();
    }
 
    return (
        <div className={classes.container}>
            <section>
                <p> {props.filename} is ready for upload</p>
                <button type="button" onClick={fileUploadHandler}>Upload</button>
                <button type="button" onClick={cancelUploadHandler}>Cancel</button>
            </section>
        </div>
    )
}
export default FileUploader;