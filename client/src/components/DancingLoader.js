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
  );
}

export default DancingLoader;
