import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { TextField, FormLabel, Box, FormControl, Divider, Typography, Paper, withStyles, SvgIcon, useMediaQuery, Tabs, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { ChromePicker } from "react-color";
import Select from "../../../utils/select.jsx";
import { Grid, Button, AppBar, Tab } from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch.js";
import { injectIntl } from "react-intl";
import { Save, PhoneAndroid, Smartphone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Prompt } from 'react-router-dom';
import Header from "../menu-header.jsx";
import { connect } from 'react-redux';
import { compose } from 'redux';
import clsx from 'clsx';
import { setLayout } from './../../../../actions/index';
import FileInput from './../../../utils/FileInput';
import CustomTabs from '../view/tabs.jsx';

const queryString = require('query-string'); 

const style = theme => ({
  [theme.breakpoints.down('xs')]: {
    form: {
      '& .MuiFormLabel-root': {
          visibility: 'hidden'
      },
      '& .MuiBox-root .MuiBox-root .MuiBox-root': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'

      }
    }
  },
  [theme.breakpoints.up('sm')]: {
      form: {
      '& h6': {
        display: 'none'
      }
    }
  },
  tabs: { 
    '& .MuiTab-root': {
      minWidth: 0,
      flex: [[1, 1, 'auto']]
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'space-between',
    }
  }
});


/*
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));*/

const tabLabel = (text, size) => (
    <>
        <PhoneAndroid style={{fontSize: size}} />
        <Typography variant="subtitle2"></Typography>
    </>
)

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

const images = (mobile) => (
  mobile ? [              
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/small-phone.png" alt="" style={{maxWidth: 420, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/big-phone.png" alt="" style={{maxWidth: 420, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/small-tablet.png" alt="" style={{maxWidth: 420, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/big-tablet.png" alt="" style={{maxWidth: 420, width: '100%'}}/>
] :
[              
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/small-phone.png" alt="" style={{maxWidth: 400, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/big-phone.png" alt="" style={{maxWidth: 400, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/small-tablet.png" alt="" style={{maxWidth: 400, width: '100%'}}/>,
  <img src="https://bathtimestories.com/wp-content/uploads/2020/07/big-tablet.png" alt="" style={{maxWidth: 400, width: '100%'}}/>
]
);

const iframeStyle = mobile => (
  mobile ? 
  [
    {top: '10%', left: '7%', height: '80%', width: '86%'},
    {top: '9%', left: '6%', height: '83%',width: '88%'},
    {top: '12%', left: '15%', height: '76%',width: '70%'},
    {top: '12%', left: '15%', height: '76%',width: '70%'}
  ] :
  [
    {top: 0, left: '50%',  transform: 'translate(-50%, 18%) scale(1.1)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, 1%) scale(0.85)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, -15%) scale(0.59)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, -23%) scale(0.45)'},
  ]);

  const iframeSize = [
    {width: "320", height: "520"},
    {width: "420", height: "680"},
    {width: "600", height: "900"},
    {width: "800", height: "1150"},
  ]


class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      isEdited: false,
      validator: new SimpleReactValidator(),
      backgroundOption: 'image',
      name: "Nume categorie",
      layout: <img src={"https://menu.bathtimestories.com/assets/images/"+categoryIcons[0]}/>,
      tabIndex: 0,
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

  changeLayout = (event) => {
     // setLayout(event.target.value);
      this.setState({[event.target.name]: event.target.value});
  }

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

  handlePreviewChange = (event, newValue) => {
    this.setState({tabIndex: newValue});
  };

  componentDidMount() {
    this.fetchDesign();
  }

  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e, type) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = async () => {
      const canvas = reader.result;
      this.setState({ background: canvas });
    };
    reader.readAsDataURL(file);
  }

  getBase64Image = async (picture) => {
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
      obj.setState({ background: dataURL.replace(/^data:image\/(png|jpg);base64,/, "") }) || obj.getBase64Image(obj.props.data.background);
    };
    img.src = picture;
  };

  deleteImg(type) {
    this.setState({[type]: "" });
  }

  render() {
    const { show, onCancel, data, intl, media, classes} = this.props;
    let iframe = {
        background: 'white', 
        position: 'absolute', 
    }
    
    iframe = {...iframe, ...iframeStyle(this.props.media.mobile)[this.state.tabIndex]};
    
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
      <Box m={{'sm': 2}}>
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
            <Grid align="center" item xs={12} lg={6}>
              <Paper elevation={1}>
                <form className={"needs-validation add-product-form " + clsx(classes.form)}>
                {[
                    ["category", "name"],
                    ["item", "name"],
                    ["item", "ingredients"],
                   // ["item", "alergens"],
                    //["item", "calories"],
                    ["item", "size"],
                  ].map((el, i) => (
                    <Box key={'db'+i}>
                      <Divider/>
                      <Typography align="center" gutterBottom>
                        Stilizare {translate({id: el[1]})} {translate({id: el[0]})}  
                      </Typography>

                      <Box m={2}
                        display={media.mobile ? "block" : "flex"}
                        justifyContent="space-evenly" 
                        className="form form-label-center" >
                        <Box mb={2}/*display={{ xs: "block", sm: "none", md: "block" }}*/ >
                          <Typography align="center" gutterBottom  component="h6">
                            Dimensiune
                          </Typography>
                          <Select
                            name="size"
                            style={{width: 86}}
                            label="Dimensiune"
                            value={this.state[el[0]][el[1]].size}
                            onChange={(e) => this.setStateFromInput(e, el)}
                            array={[8, 9, 10, 11, 12, 14, 16, 20, 24, 32]}
                            display={(val) => (val+' px') }
                            />
                        </Box>                   
                         <Box mb={2}>
                          <Typography align="center" gutterBottom component="h6">
                            Culoare
                          </Typography>
                          <FormControl>
                            <FormLabel  style={{position: 'absolute', 'background': 'white'}} className="MuiInputLabel-outlined MuiInputLabel-shrink">Culoare</FormLabel>
                            <input
                              name="color"
                              label="Culoare"
                              type="color"
                              style={{
                                width: 86,
                                height: 40,
                                borderColor: 'rgba(0, 0, 0, 0.23)'

                              }}
                              onChange={(e) => this.setStateFromInput(e, el)}
                              value={this.state[el[0]][el[1]].color}
                            />
                          </FormControl>
                        </Box>
                        <Box mb={2}>
                          <Typography align="center" gutterBottom component="h6">
                            Font
                          </Typography>
                          <Select
                            style={{width: 185, textAlign: 'left'}}
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
                            display={(val) => (<Typography style={{fontFamily: val}}>{val}</Typography>)}
                          />
                        </Box>                        
                      </Box>
                    </Box>
                  ))}
                  <Divider/>
                  <Typography align="center" gutterBottom>
                    Layout 
                  </Typography>
                  <Box m={2}
                    display={"flex"}
                    justifyContent="space-evenly" 
                    className="form form-label-center" >
                    <Box mb={2}/*display={{ xs: "block", sm: "none", md: "block" }}*/ >
                      <Typography align="center" gutterBottom  component="h6"> </Typography>
                      
                    </Box> 
                  </Box>
                  <Divider/>
                  <Typography align="center" gutterBottom>
                    Background 
                  </Typography>
                  <Box m={2}
                    display={"flex"}
                    justifyContent="space-evenly" 
                    className="form form-label-center" >
                    <Box mb={2}/*display={{ xs: "block", sm: "none", md: "block" }}*/ >
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Background</FormLabel>
                        <RadioGroup aria-label="background" name="backgroundOption" value={this.state.backgroundOption} onChange={this.handleBackgroundChange}>
                         <FormControlLabel value="image" control={<Radio />} label="Image" />
                          <FormControlLabel value="color" control={<Radio />} label="Color" />
                       </RadioGroup>
                     </FormControl>
                      <Typography align="center" gutterBottom  component="h6"> </Typography>
                      {this.state.backgroundOption == "image" ? 
                        <FileInput 
                          source={this.state.background} 
                          onChange={(event) => this._handleImgChange(event,"picture")} 
                          deleteImg={(event) => this.deleteImg("picture")}
                          onClick={(event) => this._handleSubmit(event)}/> :
                        <FormControl>
                          <FormLabel  style={{position: 'absolute', 'background': 'white'}} className="MuiInputLabel-outlined MuiInputLabel-shrink">Culoare</FormLabel>
                          <input
                            name="color"
                            label="Culoare"
                            type="color"
                            style={{
                              width: 86,
                              height: 40,
                              borderColor: 'rgba(0, 0, 0, 0.23)'}}
                            //onChange={(e) => this.setStateFromInput(e)}
                            value={"#ffffff"}/>
                        </FormControl>}
                    </Box> 
                  </Box>                  
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
            <Grid align="center" item xs={12} lg={6} style={{position: 'relative'}}>
              <CustomTabs
                classes={classes.tabs}
                value={this.state.tabIndex}
                onChange={this.handlePreviewChange}
                tabLabel={[tabLabel("Small Phone",16), tabLabel("Big Phone",24), tabLabel("Small Tablet",32), tabLabel("Big Tablet",40)]}
                children={<Box mt={2} style={{position: 'relative'}}>
                  {images(this.props.media.mobile)[this.state.tabIndex]}
                  <iframe

                      title="preview"
                      src={`/my-menu/${this.props.match.params.title}?${previewQuery}/`}
                      {...iframeSize[this.state.tabIndex]}
                      style={iframe}
                    />
                </Box>
              }
              ></CustomTabs>
            </Grid>
          </Grid>
        </div>
      </Box>
    );
  }
}


const mapStateToProps = (state) => ({
  media: state.media
});


export default 
  compose(
    withStyles(style, { withTheme: true }),
    connect(mapStateToProps)
    )(injectIntl(Form));
