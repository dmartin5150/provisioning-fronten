import React  from "react";
import Card from "../UI/Card/Card";

import classes from './FileStatus.module.css'

const FileStatus = (props) => {
    return (
        <Card className={classes.status}>
            <section >
                <p className={classes.title}>{props.title}</p>
                <p className={classes.filename}>{props.filename}</p>
                <p>{props.creationDate}</p>
            </section>
        </Card>
    )


}
export default FileStatus;