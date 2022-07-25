import { Link } from "react-router-dom";
import { useState } from "react";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const fileSelectChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  return (
    <header className={classes.header}>

        <Link to="/">
          <div className={classes.logo}><p>Care Studio Provisioning</p></div>
        </Link>
        <nav>
        <Link to="/upload">
          <div className={classes.logo}><button>Manage Spreadsheet</button></div>
        </Link>
      </nav>
    </header>
  );
};

export default MainNavigation;
