import React from "react";
import { useNavigate } from "react-router-dom";

export const withUseParamsHooksHOC = (Component) => {
  return (props) => {
    const navigate = useNavigate();

    return <Component navigate={navigate} {...props}></Component>;
  };
};
