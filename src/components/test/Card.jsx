import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-image-crop";
import "./styles.css";

const crop = (url, aspectRatio) => {
  // we return a Promise that gets resolved with our canvas element
  return new Promise((resolve) => {
    // this image will hold our source image data
    const inputImage = new Image();

    // we want to wait for our image to load
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio;
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      // create a canvas that will present the output image
      const outputImage = document.createElement("canvas");

      // set it to the same size as the image

      outputImage.width = Math.min(outputWidth, 500);
      outputImage.height = Math.min(outputHeight, 500 / aspectRatio);

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext("2d");
      ctx.drawImage(inputImage, outputX, outputY);
      resolve(outputImage);
    };

    // start loading our image
    inputImage.src = url;
  });
};

const Card = () => {
  crop(
    "https://upload.wikimedia.org/wikipedia/commons/8/86/Logo_Test-Achats_Test-Aankoop.jpg",
    4 / 3
  ).then((canvas) => document.querySelector("#dfd").append(canvas));
  // console.log(x);
  return (
    <div className="row">
      <div id="dfd" className="row">
        kjhjk
      </div>
      <div className="controls"></div>
    </div>
  );
};

export default Card;
