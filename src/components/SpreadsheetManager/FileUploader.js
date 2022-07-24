
import React from 'react';
import classes from './FileUploader.module.css';


const FileUploader = (props) => {

    return (
        <div className={classes.container}>
            <section>
                <p> File is ready for upload</p>
                <button>Upload</button>
                <button>Cancel</button>
            </section>
        </div>
    )

}
export default FileUploader;