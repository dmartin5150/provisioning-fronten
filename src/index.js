import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { FileContextProvider } from "./store/file-context";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FileContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FileContextProvider>
);


