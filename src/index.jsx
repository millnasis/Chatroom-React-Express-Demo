import React from "react";
import ReactDom from "react-dom";
import App from "./app.jsx";
import "antd/dist/antd.less";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

ReactDom.render(
  <Provider store={store}>
    <Router>
      <App></App>
    </Router>
  </Provider>,
  document.querySelector("#root")
);
