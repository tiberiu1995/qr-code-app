import React, { Component, Fragment } from "react";
import { Editor } from "@tinymce/tinymce-react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Select from "./../../utils/select.jsx";
import {
  TextField,
  Button,
  Box,
} from "@material-ui/core/";
import FileInput from "../../utils/FileInput.jsx";
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
          ingredients: props.data.ingredients,
          alergens: props.data.alergens,
          calories: props.data.calories,
          size: props.data.size,
          pictures: props.data.pictures,
          category: props.categories.find(
            (el) => el.name === props.data.category
          ).id,
        })
      : (this.state = {
          validator: new SimpleReactValidator(),
          name: "Nume produs",
          description:
            "Descriere exemplu. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          ingredients:
            "Lorem, ipsum, dolor, sit, amet, consectetur, adipiscing, elit",
          alergens: "",
          calories: "",
          size: "Mica 5.00 lei | Medie 8.00 lei | Mare 12.00 lei",
          pictures: [{ img: "" }],
        });
  }

  componentDidMount() {
    /* let search = window.location.search;
        let params = new URLSearchParams(search);
        this.id = params.get('id');
        if(this.id) {
          this.fetchSingleProduct(this.id);
          this.edit = true;
        }*/
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
      ingredients: this.state.ingredients,
      alergens: this.state.alergens,
      calories: this.state.calories,
      size: this.state.size,
      pictures: this.state.pictures,
      category: this.state.category || this.props.categories[0],
      id: this.props.data ? this.props.data.id : "",
    };
    this.setState({
      created: new Date().valueOf(),
      name: "Nume produs",
      description:
        "Descriere exemplu. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ingredients:
        "Lorem, ipsum, dolor, sit, amet, consectetur, adipiscing, elit",
      alergens: "",
      calories: "",
      size: "Mica 5.00 lei | Medie 8.00 lei | Mare 12.00 lei",
      pictures: [{ img: "" }],
    });
    this.props.addItem(data);
  };


  handleChange = (event) => {
    this.setState({ stock: event.target.value });
  };

  handleEditorChange = (content, editor, name) => {
    this.setState({ [name]: content });
    //console.log('Content was updated:', content);
  };
  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e, i) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    const { pictures } = this.state;

    reader.onloadend = async () => {
      const canvas = await crop(reader.result, 4 / 3);
      pictures[i].img = canvas.toDataURL();
      //pictures[i].img = reader.result;
      this.setState({
        file: file,
        pictures,
      });
    };
    reader.readAsDataURL(file);
  }

  deleteImg(i) {
    this.setState({pictures: [{ img: "" }]});
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
            <div className="col-sm-12">
              <div className="row">
                <div className="col-lg-12">
                  {/* <button onClick={(e) => this.addImageSlot(e)}>+ image slot</button>*/}
                </div>
              </div>
              <div className="container-fluid">
                <div className="col-xl-12">
                  <form className="needs-validation add-product-form">
                    <ul className="file-upload-product row">
                      {this.state.pictures.map((res, i) => {
                        return (
                          <li key={"p" + i} className="col-lg-3 row">
                            <FileInput 
                              source={res.img} 
                              onChange={(event) => this._handleImgChange(event,i)} 
                              deleteImg={(event) => this.deleteImg(i)}
                              onClick={(event) => this._handleSubmit(event)}/>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="form form-label-center row">
                      <div className="form-group mb-3 col-lg-12">
                        <div className="">
                          <TextField
                            className="col-12"
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
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          {this.props.categories && (
                            <Select
                              label="Categorie"
                              default={{ value: 0, text: "Alege o categorie" }}
                              value={this.state.category || 0}
                              onChange={this.setStateFromInput}
                              display={(el) => {
                                return el.name;
                              }}
                              name={"category"}
                              valueF={(el) => el.id}
                              array={this.props.categories}
                            />
                          )}
                          {this.state.validator.message(
                            "category",
                            this.state.category,
                            "required"
                          )}
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          <TextField
                            className="col-12"
                            name="ingredients"
                            multiline
                            label="Ingrediente"
                            value={this.state.ingredients}
                            onChange={this.setStateFromInput}
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          <TextField
                            label="Alergeni"
                            multiline
                            className="col-12"
                            name="alergens"
                            value={this.state.alergens}
                            onChange={this.setStateFromInput}
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          <TextField
                            className="col-12"
                            name="calories"
                            label="Calorii"
                            value={this.state.calories}
                            onChange={this.setStateFromInput}
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          <TextField
                            name="description"
                            label="Descriere"
                            multiline
                            className="col-12"
                            value={this.state.description}
                            onChange={this.setStateFromInput}
                          />
                          {this.state.validator.message(
                            "description",
                            this.state.description,
                            "required|string"
                          )}
                        </div>
                      </div>
                      <div className="form-group mb-3 col-lg-12">
                        <div className="description-sm">
                          <TextField
                            name="size"
                            label="Portie/preturi"
                            className="col-12"
                            value={this.state.size}
                            onChange={this.setStateFromInput}
                          />
                          {this.state.validator.message(
                            "size",
                            this.state.size,
                            "required"
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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
