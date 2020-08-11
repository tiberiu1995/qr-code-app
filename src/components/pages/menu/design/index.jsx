import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import { TextField, FormLabel } from "@material-ui/core";
import { ChromePicker } from "react-color";
import Select from "../../../utils/select.jsx";
import { Grid } from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch.js";

export class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      validator: new SimpleReactValidator(),
      name: "Nume categorie",
      description: "Descriere",
      category: {
        name: {
          color: "#000",
          size: 20,
          font: "Times New Roman",
        },
      },
      item: {
        name: {
          color: "#000",
          size: 14,
          font: "Times New Roman",
        },
        ingredients: {
          color: "#000",
          size: 12,
          font: "Times New Roman",
        },
        alergens: {
          color: "#000",
          size: 12,
          font: "Times New Roman",
        },
        calories: {
          color: "#000",
          size: 12,
          font: "Times New Roman",
        },
        size: {
          color: "#000",
          size: 12,
          font: "Times New Roman",
        },
      },
    };
  }

  setStateFromInput = (event, type) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState({
      [type[0]]: {
        ...this.state[type[0]],
        [type[1]]: {
          ...this.state[type[0]][type[1]],
          [event.target.name]: event.target.value,
        },
      },
    });
  };

  fetchDesign = async () => {
    try {
      let apiData = await fetchData({title: this.props.match.params.title}, "menu/design/get.php");
      console.log(apiData);
      this.setState({
        category: JSON.parse(apiData.category_design),
        item: JSON.parse(apiData.item_design),
      });
    } catch (error) {
      console.log(error);
    }
  };

  saveDesign = async () => {
    try {
      const obj = {
        title: this.props.match.params.title,
        category: JSON.stringify(this.state.category),
        item: JSON.stringify(this.state.item),
      }
      let apiData = await fetchData( obj, "menu/design/edit.php");
      console.log(apiData);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.fetchDesign();
    /*let search = window.location.search;
        let params = new URLSearchParams(search);
        this.id = params.get('id');
        if(this.id) {
          this.fetchSingleProduct(this.id);
          this.edit = true;
        }*/
  }

  // handleColor = (color) => {
  //   this.setState({ category_name_color: color.hex });
  // };

  render() {
    const { show, onCancel, data } = this.props;
    return (
      <div className="p-3">
        <div className="container-fluid">
          <Grid container cols={2}>
            <Grid item>
              <form className="needs-validation add-product-form">
                {[
                  ["category", "name"],
                  ["item", "name"],
                  ["item", "ingredients"],
                  ["item", "alergens"],
                  ["item", "calories"],
                  ["item", "size"],
                ].map((el, i) => (
                  <div className="form form-label-center row">
                    <div className="form-group mb-3 col-lg-12">
                      <label className="col-xl-3 col-sm-4">
                        Font titlu {el[1]} {el[0]}
                      </label>
                      <div className="description-sm">
                        <Select
                          name="font"
                          value={this.state[el[0]][el[1]].font}
                          onChange={(e) => this.setStateFromInput(e, el)}
                          array={[
                            "Arial",
                            "Courier New",
                            "Georgia",
                            "Palatino",
                            "Tahoma",
                            "Times New Roman",
                            "Trebuchet MS",
                            "Verdana",
                          ]}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 col-lg-12">
                      <label className="col-xl-3 col-sm-4">
                        Culoare titlu {el}
                      </label>
                      <div className="description-sm">
                        <input
                          name="color"
                          type="color"
                          onChange={(e) => this.setStateFromInput(e, el)}
                          value={this.state[el[0]][el[1]].color}
                        />
                        {/* <ChromePicker 
                                name="category_name_color"
                                disableAlpha={true}
                                color={ this.state.category_name_color }
                                onChangeComplete={ this.handleColor }
                              />                    */}
                      </div>
                    </div>
                    <div className="form-group mb-3 col-lg-12">
                      <label className="col-xl-3 col-sm-4">
                        Dimensiune titlu {el}
                      </label>
                      <div className="description-sm">
                        <Select
                          name="size"
                          value={this.state[el[0]][el[1]].size}
                          onChange={(e) => this.setStateFromInput(e, el)}
                          array={[8, 9, 10, 11, 12, 14, 16, 20, 24, 32]}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="primary" onClick={this.saveDesign}>
                  Salveaza
                </Button>
              </form>
            </Grid>
            <Grid item>
              <iframe
                title="preview"
                src={`/my-menu/${this.props.match.params.title}/`}
                width="350"
                height="450"
              ></iframe>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Form;
