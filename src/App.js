import { useState } from "react";
import Layout from "./components/Layout/Layout";
import SpreadsheetManager from "./components/SpreadsheetManager/SpreadsheetManager";
import "./App.css";
import { Redirect, Switch, Route } from "react-router-dom";

function App() {
  const [resFromFlask, setResFromFlask] = useState("No Response");

  const testAPIHandler = async () => {
    const response = await fetch("http://localhost:5000/currentstatus");
    if (response) {
      const data = await response.json()
      console.log(data)
      // const data = await response.blob({type: 'text/csv;charset=utf-8;'});
      // console.log(data)
      // FileSaver.saveAs(data, 'test.csv');

    }
  };

  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Redirect to='/home'></Redirect>
        </Route>
        <Route path='/home'>
        <Layout>
            <p>{resFromFlask}</p>
            <button onClick={testAPIHandler}>Test API</button>
          </Layout>
        </Route>
        <Route path="/upload">
          <SpreadsheetManager></SpreadsheetManager>
        </Route>
        <Route path="*">
          <Redirect to="/home"></Redirect>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
