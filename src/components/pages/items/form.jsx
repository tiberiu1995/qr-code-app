import React, { Component,  } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import Select from "./../../utils/select.jsx";
import {
  TextField,
  Button,
  Box,
} from "@material-ui/core/";
import FileInput from "../../utils/FileInput.jsx";
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';

const initState = {
  validator: new SimpleReactValidator(),
  created: new Date().valueOf(),
  name: "",
  description:
    "",
  ingredients:
    "",
  alergens: "",
  calories: "",
  size: "",
  picture: '',
}

const useStyles = theme => ({
  edit: {
      backgroundColor: '#4caf50',
      color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  [theme.breakpoints.up('md')]: {
    modal: {
      '& .modal-dialog': { minWidth: 600,
      }
    },
  },
});



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
          picture: props.data.picture,
          category: props.categories.find(
            (el) => el.name === props.data.category
          ).id,
        })
      : (this.state = initState);
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
      picture: this.state.picture,
      category: this.state.category || this.props.categories[0],
      id: this.props.data ? this.props.data.id : "",
    };
    this.setState(initState);
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

  _handleImgChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let picture = '';

    reader.onloadend = async () => {
      const canvas = await crop(reader.result, 1);
      picture = canvas.toDataURL();
      //pictures[i].img = reader.result;
      this.setState({
        file: file,
        picture,
      });
    };
    reader.readAsDataURL(file);
  }

  deleteImg() {
    this.setState({picture: ''});
  }

  render() {
    const { classes, show, onCancel, data, intl: {formatMessage} } = this.props;
    return (
      <Modal
        backdrop="static"
        className={"row d-flex justify-content-center "+classes.modal}
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
                    <div className="form-group mb-3 col-lg-12">
                      <div className="">
                        <TextField
                          className="col-12"
                          name="name"
                          label={formatMessage({id: 'name' })}
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
                              label={formatMessage({id: 'category'})}
                              default={{ value: 0, text: formatMessage({id: 'choose_category'}) }}
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
                            name="size"
                            placeholder="Small €12/ Medium €15/ Large €18"
                            label={formatMessage({id: 'size/price'})}
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
                    <FileInput 
                        source={this.state.picture} 
                        onChange={(event) => this._handleImgChange(event)} 
                        deleteImg={(event) => this.deleteImg()}
                        onClick={(event) => this._handleSubmit(event)}/>
                        {this.state.validator.message(
                          "picture",
                          this.state.picture,
                          "required"
                        )}
                    <div className="form-group mb-3 col-lg-12">
                      <div className="description-sm">
                        <TextField
                          className="col-12"
                          name="ingredients"
                          multiline
                          label={formatMessage({id: 'ingredients'})}
                          value={this.state.ingredients}
                          onChange={this.setStateFromInput}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 col-lg-12">
                      <div className="description-sm">
                        <TextField
                          label={formatMessage({id: 'alergens'})}
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
                          label={formatMessage({id: 'calories'})}
                          value={this.state.calories}
                          onChange={this.setStateFromInput}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 col-lg-12">
                      <div className="description-sm">
                        <TextField
                          name="description"
                          label={formatMessage({id: 'description'})}
                          multiline
                          className="col-12"
                          value={this.state.description}
                          onChange={this.setStateFromInput}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <Modal.Footer>
          <Button className={classes.delete} variant="contained" onClick={onCancel}>
            {formatMessage({id: 'back'})} 
          </Button>
          <Button className={classes.edit} variant="contained" onClick={this.addItem}>
            {formatMessage({id: 'add'})}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose(withStyles(useStyles))(injectIntl(Form));
