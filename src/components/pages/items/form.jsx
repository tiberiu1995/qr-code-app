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
import { Remove } from '@material-ui/icons/';

const initState = {
  validator: new SimpleReactValidator(),
  created: new Date().valueOf(),
  name: "",
  description:
    "",
  ingredients:
    "",
  alergens: "",
  size: [],
  picture: '',
}

const useStyles = theme => ({
  pointerCursor: {
    cursor: 'pointer'
  },
  edit: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none'
  },
  modal: {
    '& .modal-dialog': { 
      minWidth: '100%',
      position: 'fixed'
    },
    '& .MuiTextField-root': {
      width: '100%'
    },
    '& .form-group > .MuiBox-root  .MuiFormControl-root': {
      margin: 8
    },
  },
  [theme.breakpoints.up('md')]: {
    modal: {
      '& .modal-dialog': { 
        minWidth: 500,
      }
    },
  },
  [theme.breakpoints.down('md')]: {
    imageOption: {
      flexDirection: 'column',
      '& .MuiFormGroup-root': {
        flexDirection: 'row',
        alignSelf: 'center',
      },
      '& > .MuiBox-root': {
        justifyContent: 'center'
      }
    }
  },
  [theme.breakpoints.up('0')]: {
    modal: {
      '& .modal-body': {
        maxHeight: 400,
        overflow: 'scroll'
      }
    }
  }
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
          size: JSON.parse(props.data.size),
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
      size: this.state.size,
      picture: this.state.picture.replace(/.*07\//,''),
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

  setSizefromInput = (event,index) => {
    const newArray = [...this.state.size];
    newArray[index][event.target.name] = event.target.value;
    this.setState({size: newArray});
  }

  removeSize = (index) => {
    const newArray = [...this.state.size];
    newArray.splice(index,1);
    this.setState({size: newArray});
  }

  addSize = () => {
    const newArray = [...this.state.size];
    newArray.push({size: '', price: '', calories: ''});
    this.setState({size: newArray});
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
          <Box display="flex" flexDirection="column">
            <div className="form-group mb-3">
              <TextField
                name="name"
                variant="outlined"
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
            <div className="form-group mb-3">
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
            <div className="form-group mb-3">
              <Box>
              { this.state.size.map( (el,i) =>
                <Box display="flex" alignItems="center">
                  <TextField
                    name="size"
                    variant="outlined"
                    label={formatMessage({id: 'size' })}
                    value={el.size}
                    onChange={(e) => this.setSizefromInput(e,i)}  />
                  <TextField
                    variant="outlined"
                    name="price"
                    label={formatMessage({id: 'price' })}
                    value={el.price}
                    onChange={(e) => this.setSizefromInput(e,i)} />
                    {this.state.validator.message(
                      "price",
                      el.price,
                      "required"
                    )}
                    <TextField
                      variant="outlined"
                      name="calories"
                      label={formatMessage({id: 'calories' })}
                      value={el.calories}
                      onChange={(e) => this.setSizefromInput(e,i)} />
                  <Remove className={classes.delete+" "+classes.pointerCursor} onClick={(e) => this.removeSize(i)}/>
                </Box>
              )}  
              </Box>
              <Button onClick={this.addSize}>Add new size</Button>
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
            <div className="form-group mb-3">
                <TextField
                  variant="outlined"
                  name="ingredients"
                  multiline
                  label={formatMessage({id: 'ingredients'})}
                  value={this.state.ingredients}
                  onChange={this.setStateFromInput}
                />
            </div>
            <div className="form-group mb-3">
                <TextField
                  label={formatMessage({id: 'alergens'})}
                  multiline
                  variant="outlined"
                  name="alergens"
                  value={this.state.alergens}
                  onChange={this.setStateFromInput}
                />
              </div>
              <div className="form-group mb-3">
                  <TextField
                    name="description"
                    label={formatMessage({id: 'description'})}
                    multiline
                    variant="outlined"
                    value={this.state.description}
                    onChange={this.setStateFromInput}
                  />
              </div>
        </Box>
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
