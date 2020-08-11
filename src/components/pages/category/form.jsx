import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import { TextField, FormLabel } from "@material-ui/core";

export class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    props.data
      ? (this.state = {
          validator: new SimpleReactValidator(),
          name: props.data.name,
          description: props.data.description,
          //picture: this.getBase64Image(props.data.picture),
        })
      : (this.state = {
          validator: new SimpleReactValidator(),
          name: "Nume categorie",
          description: "Descriere",
          picture: "",
          background: "",
        });
  }

  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e, type) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    //const { picture } = this.state;

    reader.onloadend = async () => {
      const canvas = reader.result;
      //pictures[i].img = reader.result;
      type === "picture"
        ? this.setState({ picture: canvas })
        : this.setState({ background: canvas });
    };
    reader.readAsDataURL(file);
  }

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
      picture: this.state.picture,
      background: this.state.background,
    };
    this.setState({
      name: "Nume categorie",
      description: "Descriere",
      id: "",
      picture: "",
      background: "",
    });
    this.props.addItem(data);
  };

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.props.data && this.getBase64Image(this.props.data.picture, "picture");
    /*let search = window.location.search;
        let params = new URLSearchParams(search);
        this.id = params.get('id');
        if(this.id) {
          this.fetchSingleProduct(this.id);
          this.edit = true;
        }*/
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
      type === "picture"
        ? obj.setState({
            picture: dataURL.replace(/^data:image\/(png|jpg);base64,/, ""),
          }) || obj.getBase64Image(obj.props.data.background, "background")
        : obj.setState({
            background: dataURL.replace(/^data:image\/(png|jpg);base64,/, ""),
          });
    };
    img.src = picture;
  };

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
          <Modal.Title id="contained-modal-title-vcenter">Nou</Modal.Title>
        </Modal.Header>
        <ModalBody className="p-3">
          <div className="container-fluid">
            <div className="col-xl-12">
              <form className="needs-validation add-product-form">
                <div className="form form-label-center row">
                  <div className="form-group mb-3 col-lg-12">
                    <label className="col-xl-3 col-sm-4">Nume</label>
                    <div className="description-sm">
                      <TextField
                        name="name"
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
                    <FormLabel className="col-xl-3 col-sm-4">
                      Descriere
                    </FormLabel>
                    <div className="description-sm">
                      <TextField
                        name="description"
                        value={this.state.description}
                        onChange={this.setStateFromInput}
                      />
                      {this.state.validator.message(
                        "description",
                        this.state.description,
                        "string"
                      )}
                    </div>
                  </div>
                  <div className="form-group mb-3 col-lg-12">
                    <label className="col-xl-3 col-sm-4">
                      Imagine categorie
                    </label>
                    <div className="box-input-file row mx-0 col-lg-12 bg-white">
                      <input
                        className="upload mx-auto"
                        type="file"
                        onChange={(e) => this._handleImgChange(e, "picture")}
                      />
                      <img
                        src={this.state.picture}
                        style={{ width: 133, height: 100 }}
                      />
                      <a
                        id="result1"
                        onClick={(e) => this._handleSubmit(e.target.id)}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 col-lg-12">
                    <label className="col-xl-3 col-sm-4">
                      Imagine fundal categorie
                    </label>
                    <div className="box-input-file row mx-0 col-lg-12 bg-white">
                      <input
                        className="upload mx-auto"
                        type="file"
                        onChange={(e) => this._handleImgChange(e, "background")}
                      />
                      <img
                        src={this.state.background}
                        style={{ width: 133, height: 100 }}
                      />
                      <a
                        id=""
                        onClick={(e) => this._handleSubmit(e.target.id)}
                      />
                    </div>
                  </div>
                </div>
              </form>
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
