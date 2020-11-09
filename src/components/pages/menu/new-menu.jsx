import React, { Component, Fragment, useState, useCallback } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../firebase";
//import Breadcrumb from "../breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import { fetchMenu, fetchData } from "../../utils/fetch";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";

//import data from './../../../../all_in_one_multikart_react/front-end/src/admin/assets/data/digital-category';
import { Button, TextField } from '@material-ui/core';

import { withStyles } from '@material-ui/styles';

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

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      validator: new SimpleReactValidator(),
      title: "",
      /*products: [],
      categories: [],
      category: "<h2>Felul principal</h2>",
      title: "",
      show_form: false,*/
    };
  }

  submitForm = async (e) => {
    e.preventDefault();
    if (this.state.products.length === 0) {
      return "";
    }
    if (!this.state.validator.allValid()) {
      this.state.validator.showMessages();
      this.forceUpdate();
      return "";
    }
    let endpoint = this.edit ? "edit" : "new";
    try {
      const obj = {
        products: this.state.products,
        title: this.state.title || this.props.match.params.id,
        token: this.props.token
      }
      const data = await fetchData(obj, "/menu/" + endpoint + ".php");
      if (data.status === "fail") 
      throw data.message;
      this.setState({
        message: data === true ? "transaction done" : "transaction void",
      });
      window.scrollTo(0, 0);
    } catch (error) {
      this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }
  };

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
  };

  /*addCategory = (event) => {
    if (this.state.category == "") return;
    let categories = this.state.categories;
    categories.push(this.state.category);
    this.setState({ categories: categories, category: "" });
  };*/

  componentDidMount() {
   /* const title = this.props.match.params.id;
    if (title) {
      this.fetchMenu(title);
      this.edit = true;
    }*/
  }

  /*fetchMenu = async (title) => {
    try {
      let data = await await fetchMenu(title);
      console.log(data);
      this.setState({
        title: this.props.match.params.id,
        products: data.products,
        categories: data.categories.map((i) => i.category),
      });
    } catch (error) {
      console.error(error);
    }
  };

  addProduct = (product) => {
    let products = this.state.products;
    let index = products.findIndex((i) => i.id == product.id);
    index === -1 ? products.push(product) : (products[index] = product);
    this.setState({ products: products });
  };*/

  showModal = () => this.setState({ show_form: true });
  closeModal = () => this.setState({ show_form: false });


  /*editP = (product) => {
    this.data = product;
    this.showModal();
    console.log(product);
  };

  remove = (index) => {
    let products = this.state.products;
    products.splice(index, 1);
    this.setState(products);
  };

  handleEditorChange = (content, editor) => {
    this.setState({ category: content });
  };

  previewMenu = (products, categories) => {
    this.props.history.push({
      pathname: "/menu/",
      state: {
        products: products,
        categories: categories,
      },
    });
  };*/

  addItem = async (e) => {
    e.preventDefault();
    if (!this.state.validator.allValid()) {
      this.state.validator.showMessages();
      this.forceUpdate();
      return "";
    }
    const data = {
      title: this.state.title,
      uid: this.props.uid
    };
    this.setState({
      title: "",
    });
    this.props.addItem(data);
  };

  render() {
    const { classes, show, onCancel, intl: {formatMessage} } = this.props;
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
            <div className="col-xl-12">
                <div className="form form-label-center row">
                  <div className="form-group mb-3 col-lg-12">

                    <div className="description-sm">
                      <TextField
                        name="title"
                        label="Titlu meniu"
                        value={this.state.title}
                        onChange={this.setStateFromInput}
                      />
                      {this.state.validator.message(
                        "title",
                        this.state.title,
                        "required|string"
                      )}
                    </div>
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

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  uid: state.account.uid,
  token: state.account.token
});

export default compose(
  withFirebase,
  connect(mapStateToProps),
  withStyles(useStyles)
)(injectIntl(Menu));
