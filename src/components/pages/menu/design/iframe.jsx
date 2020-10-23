import React, { Component, Fragment } from "react";
               
const Iframe = ({title, iframe, iframeSize}) => {

  return  <iframe
            title="preview"
            src={`/my-menu/${title}`}
            //iframeSize
            style={iframe}/>
}  

export default Iframe;
