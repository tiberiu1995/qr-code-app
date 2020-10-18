import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import { Box, TextField, FormLabel, FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import FileInput from './../../utils/FileInput';
import { TransferWithinAStationSharp } from "@material-ui/icons";
import Select from "../../utils/select.jsx";

const categoryIcons = [
  'icons8-banana-split-100.png',   
  'icons8-beer-100.png',
  'icons8-bottle-of-water-100.png',
  'icons8-bread-100.png',
  'icons8-cafe-100.png',
  'icons8-chocolate-bar-100.png',
  'icons8-cola-100.png',
  'icons8-cookie-100.png',
  'icons8-croissant-100.png',
  'icons8-doughnut-100.png',
  'icons8-french-fries-100.png',
  'icons8-hamburger-100.png',
  'icons8-hot-chocolate-with-marshmallows-100.png',
  'icons8-hot-dog-100.png',
  'icons8-ice-cream-cone-100.png',
  'icons8-ice-cream-sundae-100.png',
  'icons8-meat-100.png',
  'icons8-noodles-100.png',
  'icons8-pancake-100.png',
  'icons8-pizza-100.png',            
  'icons8-prawn-100.png',
  'icons8-rice-bowl-100.png',
  'icons8-sandwich-100.png',   
  'icons8-sausage-100.png',    
  'icons8-seafood-100.png',      
  'icons8-soy-sauce-100.png',    
  'icons8-spaghetti-100.png',       
  'icons8-sushi-100.png'
];

const initState = { 
  validator: new SimpleReactValidator(),
  name: "Nume categorie",
  description: "Descriere",
  library_picture: <img src={"https://menu.bathtimestories.com/assets/images/"+categoryIcons[16]}/>,
  upload_picture: "",
  //background: "",
  imageOption: "library"
};

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

      // create a canvas that will present the output image
      const outputImage = document.createElement("canvas");

      // set it to the same size as the image

      const scale = 500 / outputHeight;
      //outputWidth = outputWidth*scale;
      //outputHeight = outputHeight*scale;

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      outputImage.width = outputWidth * scale;
      outputImage.height = outputHeight * scale;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext("2d");
      ctx.scale(scale, scale);

      ctx.drawImage(inputImage, outputX, outputY);
      resolve(outputImage);
    };

    // start loading our image
    inputImage.src = url;
  });
};

export class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    props.data
      ? (this.state = {
          validator: new SimpleReactValidator(),
          name: props.data.name,
          description: props.data.description,
          imageOption: props.data.image_option,
          library_picture: <img src={props.data.library_picture}/>,
          upload_picture: this.getBase64Image(props.data.upload_picture)
        }) : this.state = initState;
  }

  componentDidMount() {
    this.props.data && this.getBase64Image(this.props.data.upload_picture, "upload_picture");
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
  };

  addItem = async (e) => {
    e.preventDefault();
    if (!this.state.validator.allValid()) {
      this.state.validator.showMessages();
      this.forceUpdate();
      return "";
    }
    const data = {
      name: this.state.name,
      description: this.state.description,
      id: this.props.data ? this.props.data.id : "",
      library_picture: this.state.library_picture.props.src,
      upload_picture: this.state.upload_picture,
      image_option: this.state.imageOption
      //background: this.state.background,
    };
    this.setState(initState);
    this.props.addItem(data);
  };

  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e, type) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    //const { picture } = this.state;

    reader.onloadend = async () => {
      const canvas = await crop(reader.result, 1);
      //pictures[i].img = reader.result;
      type === "upload_picture"
        ? this.setState({ upload_picture: canvas })
        : this.setState({ background: canvas });
    };
    reader.readAsDataURL(file);
  }

  

  getBase64Image = async (picture, type) => {
    var obj = this;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/jpeg");
      type === "upload_picture"
        ? obj.setState({
            upload_picture: dataURL.replace(/^data:image\/(png|jpg);base64,/, ""),
          }) || obj.getBase64Image(obj.props.data.background, "background")
        : obj.setState({
            background: dataURL.replace(/^data:image\/(png|jpg);base64,/, ""),
          });
    };
    img.src = picture;
  };

  deleteImg(type) {
    this.setState({[type]: "" });
  }

  render() {
    const { show, onCancel, data } = this.props;
    return (
      <Modal
        backdrop="static"
        className="row d-flex justify-content-center"
        show={show}
        onHide={onCancel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <ModalBody className="p-3">
          <div className="container-fluid">
            <div className="col-xl-12">
                <Box display="flex" flexDirection="column">
                  <div className="form-group mb-3">
                    <TextField
                      name="name"
                      label="Nume"
                      value={this.state.name}
                      onChange={this.setStateFromInput}
                    />
                    {this.state.validator.message(
                      "name",
                      this.state.name,
                      "required|string"
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <FormLabel className="col-xl-3 col-sm-4">
                    </FormLabel>
                      <TextField
                        name="description"
                        label="Descriere"
                        multiline
                        value={this.state.description}
                        onChange={this.setStateFromInput}
                      />
                      {this.state.validator.message(
                        "description",
                        this.state.description,
                        "string"
                      )}
                  </div>
                  <Box display="flex" flexDirection="column">
                    <FormControl component="fieldset">
                        <FormLabel>Imagine categorie</FormLabel>
                        <RadioGroup row aria-label="image-source" name="imageOption" value={this.state.imageOption} onChange={this.setStateFromInput}>
                         <FormControlLabel value="library" control={<Radio />} label="Library" />
                          <FormControlLabel value="upload" control={<Radio />} label="Upload" />
                       </RadioGroup>
                    </FormControl>
                    {this.state.imageOption === "upload" ? 
                      <FileInput 
                        source={this.state.upload_picture} 
                        onChange={(event) => this._handleImgChange(event,"upload_picture")} 
                        deleteImg={(event) => this.deleteImg("upload_picture")}
                        onClick={(event) => this._handleSubmit(event)}/> :
                      <Select
                        name="library_picture"
                        onChange={this.setStateFromInput}
                        value={this.state.library_picture} 
                        array={categoryIcons.map((el,i) => 
                          <img src={"https://menu.bathtimestories.com/assets/images/"+el} alt={el.replace(/(icons8-|-100.png)/g,'')} height="50"/>
                          )}/> }
                  </Box>
                  {/* <div className="form-group mb-3 col-lg-12">
                    <label className="col-xl-3 col-sm-4">
                      Imagine fundal categorie
                    </label>
                    <FileInput 
                            source={this.state.background} 
                            onChange={(event) => this._handleImgChange(event,"background")} 
                            deleteImg={(event) => this.deleteImg("background")}
                            onClick={(event) => this._handleSubmit(event)} />
                   </div> */}
                </Box>
            </div>
          </div>
        </ModalBody>
        <Modal.Footer>
          <Button variant="primary" onClick={this.addItem}>
            Salveaza
          </Button>
          <Button variant="primary" onClick={onCancel}>
            Inapoi
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Form;
