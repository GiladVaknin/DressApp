import React from "react";
import Iframe from "react-iframe";
import simpsonGif from "../styles/simpsonGif.gif";

function DancingLoader(props) {
  return <img src={simpsonGif} alt="LOADING..." className="dancingLoader" />;
}

export default DancingLoader;
