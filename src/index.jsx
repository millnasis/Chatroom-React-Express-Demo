import React from "react";
import ReactDom from "react-dom";
import App from "./app.jsx";
import "antd/dist/antd.less";
import { BrowserRouter as Router } from "react-router-dom";

ReactDom.render(
  <Router>
    <App></App>
  </Router>,
  document.querySelector("#root")
);
