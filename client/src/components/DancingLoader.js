import React from "react";
import Iframe from "react-iframe";

function DancingLoader(props) {
  return (
    <div className="dancingLoader">
      <Iframe
        title="gif"
        src="https://giphy.com/embed/UJzsIiAIK21DW"
        width="100%"
        height="100%"
        position="absolute"
        frameBorder="0"
        className="giphy-embed"
        overflow="hidden"
        allowFullScreen
      ></Iframe>
    </div>
    // <div className="dancingLoader">
    //   <Iframe
    //     // src="../XOsX.gif"
    //     width="100%"
    //     height="80%"
    //     position="absolute"
    //     top="0"
    //     left="0"
    //     frameBorder="0"
    //     allowFullScreen
    //   ></Iframe>
    // </div>
  );
}

export default DancingLoader;
