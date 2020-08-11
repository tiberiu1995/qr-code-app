import React, { Component, Fragment, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../firebase";
import Breadcrumb from "../common/breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import Product from "../menu/product";
import Button from "react-bootstrap/Button";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Card } from "../menu/card.jsx";
import QRCode from "qrcode.react";
import Datatable from "../datatable/datatable.jsx";
import { fetchMenu, fetchData } from "../utils/fetch";

//import data from './../../../../all_in_one_multikart_react/front-end/src/admin/assets/data/digital-category';

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      validator: new SimpleReactValidator(),
      products: [],
      categories: [],
      category: "<h2>Felul principal</h2>",
      title: "",
      show_form: false,
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
      }
      const data = await fetchData(obj, "/menu/" + endpoint + ".php");
      console.log(data);
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

  addCategory = (event) => {
    if (this.state.category == "") return;
    let categories = this.state.categories;
    categories.push(this.state.category);
    this.setState({ categories: categories, category: "" });
  };

  componentDidMount() {
    const title = this.props.match.params.id;
    if (title) {
      this.fetchMenu(title);
      this.edit = true;
    }
  }

  fetchMenu = async (title) => {
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
  };

  showModal = () => this.setState({ show_form: true });
  closeModal = () => this.setState({ show_form: false });

  getContent = (HTML) => {
    var tmp = document.createElement("span");
    tmp.innerHTML = HTML;
    return tmp.textContent;
  };

  editP = (product) => {
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
  };

  render() {
    const edit = this.editP;
    return (
      <>
        <div className="my-1 mx-auto text-center">
          <div className="form-group mb-3 col-lg-4">
            <label className="col-xl-3 col-sm-4">Titlu meniu</label>
            <div className="description-sm">
              <input
                className="form-control"
                name="title"
                value={this.state.title}
                onChange={this.setStateFromInput}
                type="text"
                placeholder="Introdu un titlu pentru meniu"
              />
              {this.state.validator.message(
                "title",
                this.state.title,
                "required"
              )}
            </div>
          </div>
          <div className="form-group mb-3 col-lg-4">
            <label className="col-xl-3 col-sm-4">Categorii</label>
            {this.state.categories.map((i, j) => (
              <span key={j} className="m-2">
                {this.getContent(i)}
              </span>
            ))}
            <div className="description-sm">
              <Editor
                name="category"
                value={this.state.category}
                apiKey="1rlgbfk0haw5den30zxey7o3be4lhyfspnp1bge75hi7a6q5"
                init={{
                  branding: false,
                  elementpath: false,
                  placeholder: "Categorie noua",
                  height: 150,
                  menubar: false,
                  plugins: [
                    "advlist charmap print preview visualblocks fullscreen paste",
                  ],
                  toolbar:
                    "undo redo | fontsizeselect fontselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | removeformat",
                }}
                onEditorChange={this.handleEditorChange}
              />
              <Button onClick={this.addCategory}>Adauga categorie</Button>
            </div>
          </div>
          {/*<table className="row m-5 d-block">
              <thead>
                <tr>
                  <td width="10%">img</td>
                  <td width="10%">Nume</td>
                  <td width="35%">Descriere</td>
                  <td width="5%">Categorie</td>
                  <td width="20%">Portii</td>
                  <td width="20%">Ingrediente</td>
                </tr>
              </thead>
              <tbody>
              </tbody>
          </table>
                this.state.products.length>0 ?*/}
          {this.state.products.length > 0 ? (
            <Datatable
              edit={this.editP}
              remove={this.remove}
              myData={[...this.state.products]}
              pageSize={10}
              pagination={true}
              class="-striped -highlight"
            />
          ) : (
            <h3>Nu ai adaugat niciun produs</h3>
          )}
          {/*<DndProvider backend={HTML5Backend}>
                { this.state.products.map(
                    (card, i) => 
                    this.renderCard(card, i))
                }
              </DndProvider>  */}

          <Product
            key={new Date().valueOf()}
            id={this.data ? this.data.id : this.state.products.length + 1}
            addProduct={this.addProduct}
            products={this.data}
            categories={this.state.categories}
            show={this.state.show_form}
            onCancel={this.closeModal}
          />
          {(this.data = undefined)}
          <Button onClick={this.showModal}>Adauga nou produs</Button>
        </div>
        <div className="my-1 mx-auto text-center">
          <Button onClick={this.submitForm}>Salveaza meniul</Button>
        </div>
        <div className="my-1 mx-auto text-center">
          <Button
            onClick={(e) =>
              this.previewMenu(this.state.products, this.state.categories)
            }
          >
            Vizualizeaza meniul
          </Button>
        </div>
        {this.state.result && (
          <div className="my-1 mx-auto text-center">
            <QRCode
              value={"http://menu.bathtimestories.com/menu/" + this.state.title}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  //email: state.account.email,
  //token: state.account.token
});

export default compose(
  withFirebase,
  connect(mapStateToProps)
)(injectIntl(Menu));
