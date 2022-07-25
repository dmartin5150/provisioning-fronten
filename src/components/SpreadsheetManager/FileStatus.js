import React  from "react";

import classes from './FileStatus.module.css'

const FileStatus = (props) => {
    return (
        <section className={classes.status}>
            <p className={classes.title}>{props.title}</p>
            <p className={classes.filename}>{props.filename}</p>
            <p>{props.creationDate}</p>
        </section>
    )


}
export default FileStatus;