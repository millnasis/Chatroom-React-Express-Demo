import React from "react";
import ReactDom from "react-dom";
import App from "./app.jsx";
import "antd/dist/antd.less";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { AliveScope } from "react-activation";
// 与Vue的KeepAlive相同实现的React应用

ReactDom.render(
  <Provider store={store}>
    <Router>
      <AliveScope>
        <App></App>
      </AliveScope>
    </Router>
  </Provider>,
  document.querySelector("#root")
);
