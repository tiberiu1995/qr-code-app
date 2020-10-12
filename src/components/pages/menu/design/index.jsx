import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { TextField, FormLabel, Box, FormControl, Divider, Typography, Paper, withStyles, SvgIcon, useMediaQuery } from "@material-ui/core";
import { ChromePicker } from "react-color";
import Select from "../../../utils/select.jsx";
import { Grid, Button } from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch.js";
import { injectIntl } from "react-intl";
import { Save, PhoneAndroid, Smartphone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Prompt } from 'react-router-dom';
import Header from "../menu-header.jsx";
import { connect } from 'react-redux';
import { compose } from 'redux';
import clsx from 'clsx';


const queryString = require('query-string'); 



class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      isEdited: false,
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
    !this.state.isEdited && this.setState({isEdited: true});
    var obj = {};
    //console.log(`/my-menu/${this.props.match.params.title}?category=${JSON.stringify(this.state.category)}&item=${JSON.stringify(this.state.item)}`);
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
    const { show, onCancel, data, intl} = this.props;
    let iframe = {
        background: 'white', 
        position: 'absolute', 
    }
    this.props.media.mobile ? 
      iframe = {...iframe, top: '12%', left: '15%', height: '76%',width: '70%'} :
      iframe = {...iframe, top: 83, left: '50%',  transform: 'translateX(-50%)', width: 300};
    
    const translate = intl.formatMessage;

    const {category, item} = this.state;
    const previewQuery = 
    `cnc=${category.name.color.replace("#",'')}&cns=${category.name.size}&cnf=${category.name.font.replace(/\s/g, "_")}&
inc=${item.name.color.replace("#",'')}&ins=${item.name.size}&inf=${item.name.font.replace(/\s/g, "_")}&
iic=${item.ingredients.color.replace("#",'')}&iis=${item.ingredients.size}&iif=${item.ingredients.font.replace(/\s/g, "_")}&
iac=${item.alergens.color.replace("#",'')}&ias=${item.alergens.size}&iaf=${item.alergens.font.replace(/\s/g, "_")}&
icc=${item.calories.color.replace("#",'')}&ics=${item.calories.size}&icf=${item.calories.font.replace(/\s/g, "_")}&
isc=${item.size.color.replace("#",'')}&iss=${item.size.size}&isf=${item.size.font.replace(/\s/g, "_")}`;

    return (
      <div className="p-3">
        <Prompt
          when={this.state.isEdited}
          message={`Are you sure you want to exit without saving?`}
        />
        <div className="container-fluid">
          <Header/>
          <Grid 
            container 
            direction="row"
            justify="center"
            alignItems="center"
            cols={2} 
            spacing={2} >
            <Grid align="center" item xs={12} sm={12} md={6}>
              <Paper elevation={1}>
                <form className="needs-validation add-product-form">
                {[
                    ["category", "name"],
                    ["item", "name"],
                    ["item", "ingredients"],
                    ["item", "alergens"],
                    ["item", "calories"],
                    ["item", "size"],
                  ].map((el, i) => (
                    <Box key={'db'+i}>
                      <Divider/>
                      <Typography align="center" gutterBottom>
                        Stilizare {translate({id: el[1]})} {translate({id: el[0]})}  
                      </Typography>
                      <Box m={2}
                        display={this.props.media.mobile ? "block" : "flex"}
                        justifyContent="space-evenly" 
                        className="form form-label-center" >
                      <div style={{width:175}}  className="form-group mb-3">
                        <div className="description-sm">
                          <Select
                            name="font"
                            label="Font"
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
                      <div className="form-group mb-3">
                        <div className="description-sm">
                        <FormControl>
                          <FormLabel className="MuiInputLabel-outlined MuiInputLabel-shrink">Culoare</FormLabel>
                          <input
                            name="color"
                            label="Culoare"
                            type="color"
                            style={{width: 100}}
                            onChange={(e) => this.setStateFromInput(e, el)}
                            value={this.state[el[0]][el[1]].color}
                          />
                        </FormControl>
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <div className="description-sm">
                          <Select
                            name="size"
                            label="Dimensiune"
                            value={this.state[el[0]][el[1]].size}
                            onChange={(e) => this.setStateFromInput(e, el)}
                            array={[8, 9, 10, 11, 12, 14, 16, 20, 24, 32]}
                            display={(val) => (val+' px') }
                          />
                        </div>
                      </div>
                    </Box>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="center" >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{margin: this.props.theme.spacing(2), justifyContent: 'center'}}
                      startIcon={<Save />}
                      onClick={this.saveDesign}
                    >
                      Save
                    </Button>
                  </Box>

                </form>
              </Paper>
            </Grid>
            <Grid align="center" item xs={12} sm={12} md={6} style={{position: 'relative'}}>
              <img src="https://bathtimestories.com/wp-content/uploads/2020/07/smartphone.png"  style={{maxWidth: 400, width: '100%'}}/>
              <iframe

                  title="preview"
                  src={`/my-menu/${this.props.match.params.title}?${previewQuery}/`}
                  width="338"
                  height="450"
                  style={iframe}
                />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  media: state.media
});


export default 
  compose(
    withStyles(null, { withTheme: true }),
    connect(mapStateToProps)
    )(injectIntl(Form));
