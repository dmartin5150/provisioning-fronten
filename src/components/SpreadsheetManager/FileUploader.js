
import React from 'react';
import classes from './FileUploader.module.css';


const FileUploader = (props) => {


    const fileUploadHandler = (event) => {
        event.preventDefault();
        console.log(props)
    }

    return (
        <div className={classes.container}>
            <section>
                <p> {props.filename} is ready for upload</p>
                <button type="button" onClick={fileUploadHandler}>Upload</button>
                <button type="button">Cancel</button>
            </section>
        </div>
    )
}
export default FileUploader;