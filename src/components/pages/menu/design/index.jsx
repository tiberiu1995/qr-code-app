import React, { Component } from "react";
import SimpleReactValidator from "simple-react-validator";
import { FormLabel, Box, FormControl, Divider, Typography, Paper, withStyles, Switch, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import Select from "../../../utils/select.jsx";
import { Grid, Button} from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch.js";
import { injectIntl } from "react-intl";
import { Save, PhoneAndroid} from "@material-ui/icons";
import { Prompt } from 'react-router-dom';
import Header from "../menu-header.jsx";
import { connect } from 'react-redux';
import { compose } from 'redux';
import clsx from 'clsx';
import FileInput from './../../../utils/FileInput';
import CustomTabs from '../view/tabs.jsx';
import Layout from './radio-layout.jsx';
import { thunkMiddleware } from 'redux-thunk';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

const style = theme => ({
  formGroup: {
    justifyContent: 'center'
  },
  toggle: {
    '& .MuiSwitch-thumb': {
      color: '#f44336',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#f44336',
    },
    '& .Mui-checked': {
      '& + .MuiSwitch-track':{
        backgroundColor: '#4caf50',
      },
      '& .MuiSwitch-thumb':{
        color: '#4caf50',
      },
    } 
  },
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
      },
      '& input[type=color]:not(:disabled)': {
        cursor: 'pointer'
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


const tabLabel = (text, size) => (
    <>
        <PhoneAndroid style={{fontSize: size}} />
        <Typography variant="subtitle2"></Typography>
    </>
)

const layoutArray = ["h0b0", "h0b1", "h1b0", "h1b1", "h2b1", "h3b0", "h3b1", "h3b2", 'h4b4'];
const fontArray = [
  'Alegreya', 
  'Alegreya Sans', 
  'Anton',
  'Archivo',
  'Arial',
  'B612',
  'Cairo',
  'Cardo',
  'Concert One',
  'Cormorant',
  'Courier New',
  'Fjalla One',
  'Georgia',
  'Karla',
  'Lato',
  'Lobster',
  'Montserrat',
  'Mulish',
  'Palatino',
  'Rakkas',
  'Roboto',
  'Rubik',
  'Source Pro',
  'Source Sans Pro',
  'Spectral',
  'Tahoma',
  'Times New Roman',
  'Titillium',
  'Trebuchet MS',
  'Ubuntu',
  'Varela',
  'Verdana',
  'Work Sans'];
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
    {top: '9%', left: '6%', height: '83%', width: '88%'},
    {top: '10%', left: '6%', height: '80%', width: '89%'},
    {top: '9%', left: '5%', height: '82%', width: '90%'}
  ] :
  [
    {top: 0, left: '50%',  transform: 'translate(-50%, 18%) scale(1.1)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, 1%) scale(0.85)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, -15%) scale(0.59)'},
    {top: 0, left: '50%',  transform: 'translate(-50%, -23%) scale(0.45)'},
  ]
);

const iframeSize = [
    {width: "320", height: "520"},
    {width: "420", height: "680"},
    {width: "600", height: "900"},
    {width: "800", height: "1150"},
]

const styleElements = [
                    ["category", "name"],
                    ["category", "description"],
                    ["item", "name"],
                    ["item", "ingredients"],
                    ["item", "alergens"],
                    ["item", "calories"],
                    ["item", "size"],
                    ["item", "reviewText"],
                    ["item", "reviewStars"],
                  ];

class Form extends Component {
  constructor(props) {
    super(props);
    this.edit = false;
    this.state = {
      isEdited: false,
      validator: new SimpleReactValidator(),
      backgroundOption: 'image',
      name: "Nume categorie",
      layout: "0",
      //layout: <img alt="" src={"https://menu.bathtimestories.com/assets/images/"+categoryIcons[0]}/>,
      tabIndex: 0,
      backgroundCount: 1,
      description: "Descriere",
      contentType: 'h0b0',
      background: '',
      category: {
        color: '#ffffff',
        name:{
          color:"#000000",
          fontSize:20,
          fontFamily:"Verdana"
        },
        description:{
          color:"#000000",
          fontSize:12,
          fontFamily:"Verdana"
        },
        background:["#ffffff"],
        backgroundImage:""
      },
      item: {
        name:{
          color:"#000000",
          fontSize:14,
          fontFamily:"Arial"},
        ingredients:{
          "color":"#000000",
          "fontSize":12,
          "fontFamily":"Tahoma"},
        alergens:{
          color:"#000000",
          fontSize:12,
          fontFamily:"Times New Roman"},
        calories:{
          color:"#000000",
          fontSize:12,
          fontFamily:"Times New Roman"},
        size:{
          color:"#000000",
          fontSize:10,
          fontFamily:"Verdana"},
        reviewText:{
          color:"#8b3232",
          fontSize:32,
          fontFamily:"Verdana"},
        reviewStars:{
          color:"#8b3232",
          fontSize:32}           
      },
      toggles: {...styleElements.reduce((acc,el) => ({...acc, [el[0]+'_'+el[1]]:false}), {})}
    }

  }

  fetchDesign = async () => {
    try {
      let {custom, defaults, id} = await fetchData({title: this.props.match.params.title, all: true, token: this.props.token}, "menu/design/get.php");

      let layout = "";
      switch (id.substring(0,2)) {
        case 'h0':
          layout = "0";
          break;
       case 'h1':
          layout = "1";
          break;
        case 'h3':
          layout = "2";
          break;
        case 'h4':
          layout = "3";
          break;
        case 'h5':
          layout = "4";
          break;
        default:
          layout = "0";
      }
      let selectedLayout = defaults.find(el => el.id == id);
      this.setState({
        layout: layout,
        contentType: id,
        backgroundCount: selectedLayout.background_count,
        category: JSON.parse(custom.category_design ? custom.category_design : selectedLayout.category_design),
        item: JSON.parse(custom.item_design ? custom.item_design : selectedLayout.item_design),
        toggles: custom.toggles ? JSON.parse(custom.toggles) : styleElements.reduce((acc,el) => ({...acc, [el[0]+'_'+el[1]]:false}), {}),
        defaults: defaults
        /*defaults: {
          category: JSON.parse(selectedLayout.category_design),
          item: JSON.parse(selectedLayout.item_design),
          backgroundOption: selectedLayout.background_option
        }*/,
        backgroundOption: custom.background_option || selectedLayout.background_option
      });
    } catch (error) {
    }
  };

  saveDesign = async () => {
    const {formatMessage} = this.props.intl;
    try {
      const obj = {
        title: this.props.match.params.title,
        category: JSON.stringify(this.state.category),
        item: JSON.stringify(this.state.item),
        layout_id: this.state.contentType,
        background_option: this.state.backgroundOption,
        toggles: JSON.stringify(this.state.toggles),
        token: this.props.token
      }
      let apiData = await fetchData( obj, "menu/design/edit.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      toast.success(formatMessage({id: 'edited_menu'}));
      this.setState({isEdited: false});
    } catch (error) {
      toast.error(formatMessage({id: "error_menu"}));
    }
  };

  setStateFromType = (event, type) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    Array.isArray(type) ?
      this.setState({
        [type[0]]: {
          ...this.state[type[0]],
          [type[1]]: {
            ...this.state[type[0]][type[1]],
            [event.target.name]: event.target.value,
          },
        },
        isEdited: true
      }) :
    this.setState({
      [type]: { ...this.state[type],
        [event.target.name]: event.target.value,
      },
      isEdited: true
    });
  };

  debouncedStateFromType  = debounce(this.setStateFromType,500);

  setStateArrayFromInput = (event, root, index) => {
    let newArray = [...this.state[root][event.target.name]];
    newArray[index] = event.target.value;
    this.setState({
      [root]: { ...this.state[root],
        [event.target.name]: newArray,
      },
      isEdited: true
    });
  }

  setStateFromInput = (event) => {
      this.setState({[event.target.name]: event.target.value, isEdited: true});
  }

  handleToggle = (event) => {
    this.setState({ 
      toggles: {
        ...this.state.toggles,
        [event.target.name]: event.target.checked,
      },
      isEdited: true
    });
  }

  handlePreviewChange = (event, newValue) => {
    this.setState({tabIndex: newValue});
  };

  handleLayoutChange = (event, newValue) => {
    let contentType = "";
    let backgroundCount = 1;
    switch (newValue){
      case "0":
        contentType = "h0b0";
        break;
      case "1":
        contentType = "h1b0";
        break;
      case "2":
        contentType = "h3b0";
        backgroundCount = 4;
        break;
      case "3":
        contentType = "h4b4";
        break
      case "4":
        contentType = "h5b2";
        backgroundCount = 2;
        break
      default:
        contentType = "h0b0";
    }
    let bgColors = [...this.state.category.background];
    backgroundCount > bgColors.length && (bgColors = bgColors.concat([...Array(backgroundCount-bgColors.length).keys()].map(el => "#ffffff")))
    this.setState({
      category: {
        ...this.state.category, 
        background: bgColors},
      layout: newValue, 
      contentType: contentType, 
      backgroundCount: backgroundCount, 
      isEdited: true, });
  };

  handleVariantChange = (event, newValue) => {
    this.setState({contentType: newValue, isEdited: true, });
  };

  componentDidMount() {
    this.fetchDesign();
  }

  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = async () => {
      const canvas = reader.result;
      this.setState({ category: {
        ...this.state.category,
        isEdited: true, 
        backgroundImage: canvas }
      });
    };
    reader.readAsDataURL(file);
  }

  deleteImg() {
    this.setState({ category: {
      ...this.state.category,
      isEdited: true, 
      backgroundImage: "" }
    });
  }

  restorePresets = () => {
    let newLayout = this.state.defaults.find(el => el.id == this.state.contentType);
    this.setState({
      backgroundCount: newLayout.background_count,
      category: JSON.parse(newLayout.category_design),
      item: JSON.parse(newLayout.item_design),
       isEdited: true});
  }



  render() {
    const { intl, media, classes} = this.props;
    let iframe = {
        background: 'white', 
        position: 'absolute', 
    }
    
    iframe = {...iframe, ...iframeStyle(this.props.media.mobile)[this.state.tabIndex]};
    
    const {formatMessage} = intl;
    const backgroundImage = this.state.category.backgroundImage || "";
    const {category, item, contentType, backgroundOption, toggles} = this.state;
    if (item && category && contentType)
      sessionStorage.setItem('style', JSON.stringify({category, item, contentType, backgroundOption, toggles}));

   /* const previewQuery = 
    `cnc=${category.name.color.replace("#",'')}&cns=${category.name.size}&cnf=${category.name.font.replace(/\s/g, "_")}&
inc=${item.name.color.replace("#",'')}&ins=${item.name.size}&inf=${item.name.font.replace(/\s/g, "_")}&
iic=${item.ingredients.color.replace("#",'')}&iis=${item.ingredients.size}&iif=${item.ingredients.font.replace(/\s/g, "_")}&
iac=${item.alergens.color.replace("#",'')}&ias=${item.alergens.size}&iaf=${item.alergens.font.replace(/\s/g, "_")}&
icc=${item.calories.color.replace("#",'')}&ics=${item.calories.size}&icf=${item.calories.font.replace(/\s/g, "_")}&
isc=${item.size.color.replace("#",'')}&iss=${item.size.size}&isf=${item.size.font.replace(/\s/g, "_")}`;*/
    

    //document.querySelector('iframe').contentWindow.postMessage(1233, '*');
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
                <Button onClick={this.restorePresets}>Restore preset styles</Button>
                <form className={"needs-validation add-product-form " + clsx(classes.form)}>
                {this.state.item && styleElements.map((el, i) => (
                    <Box key={'db'+i}>
                      <Divider/>
                      <Box display="flex" alignItems="center" >
                        <Typography align="center" gutterBottom style={{flex: '0 1 50%'}}>
                          {formatMessage({id: el[0]})} {formatMessage({id: el[1]})} 
                        </Typography>
                        { ["alergens", "ingredients", "calories", "description", "reviewStars", "reviewText"].includes(el[1]) ?
                            <FormControlLabel
                              style={{flex: '0 1 50%', marginRight: 0}}
                              value={this.state.toggles[el[0]+'_'+el[1]]!==false}
                              control={
                                <Switch 
                                  className={classes.toggle} 
                                  name={el[0]+'_'+el[1]}
                                  checked={this.state.toggles[el[0]+'_'+el[1]]!==false} 
                                  onChange={this.handleToggle}  />}
                              label={"Show "}
                              labelPlacement="start"
                            /> : ''}
                      </Box>
                      <Box m={2}
                        display={media.mobile ? "block" : "flex"}
                        justifyContent="space-evenly" 
                        className="form form-label-center" >
                        <Box mb={2}/*display={{ xs: "block", sm: "none", md: "block" }}*/ >
                          <Typography align="center" gutterBottom  component="h6">
                            {formatMessage({id: 'size'})}
                          </Typography>
                          <Select
                            disabled={this.state.toggles[el[0]+'_'+el[1]]===false}
                            name="fontSize"
                            style={{width: 86}}
                            label={formatMessage({id: 'size'})}
                            value={this.state[el[0]][el[1]].fontSize}
                            onChange={ (e) => this.setStateFromType(e,el) }
                            array={[8, 9, 10, 11, 12, 14, 16, 20, 24, 32, 40]}
                            display={(val) => (val+' px') }
                            />
                        </Box>                   
                         <Box mb={2}>
                          <Typography align="center" gutterBottom component="h6">
                          {formatMessage({id: 'color'})}
                          </Typography>
                          <FormControl>
                            <FormLabel  
                              style={{position: 'absolute', 'background': 'white'}} 
                              className="MuiInputLabel-outlined MuiInputLabel-shrink">
                              {formatMessage({id: 'color'})}
                            </FormLabel>
                            <input                            
                              name="color"
                              disabled={ this.state.toggles[el[0]+'_'+el[1]]===false }
                              label={formatMessage({id: 'color'})}
                              type="color"
                              style={{
                                width: 86,
                                height: 40,
                                borderColor: 'rgba(0, 0, 0, 0.23)'

                              }}
                              onChange={ (e) => this.setStateFromType(e,el) }
                              value={this.state[el[0]][el[1]].color}
                            />
                          </FormControl>
                        </Box>
                        <Box mb={2} visibility={el[1]=="reviewStars" && "hidden"}>
                          <Typography align="center" gutterBottom component="h6">
                            Font
                          </Typography>
                          <Select
                            disabled={this.state.toggles[el[0]+'_'+el[1]]===false}
                            style={{width: 185, textAlign: 'left'}}
                            name="fontFamily"
                            label="Font"
                            value={this.state[el[0]][el[1]].fontFamily || fontArray[0]}
                            onChange={ (e) => this.setStateFromType(e,el) }
                            array={fontArray}
                            display={(val) => (<Typography style={{fontFamily: val}}>{val}</Typography>)}
                          />
                        </Box>                        
                      </Box>
                    </Box>
                  ))}
                  <Divider/>              
                  <Typography align="center" gutterBottom>
                   {formatMessage({id: 'layout'})}
                  </Typography>
                  <Box m={2}
                    display={"flex"}
                    justifyContent="space-evenly" 
                    className="form form-label-center" >
                  <Layout 
                    layout={this.state.layout}
                    handleLayoutChange={this.handleLayoutChange}
                    contentType={this.state.contentType}
                    handleVariantChange={this.handleVariantChange}
                    />
                  </Box>
                  <Divider/>
                  <Box m={2}
                    display={"flex"}
                    justifyContent="space-evenly" 
                    className="form form-label-center" >
                    <Box mb={2} display="flex" flexDirection="column" >
                      <FormControl component="fieldset">
                        <FormLabel component="legend">{formatMessage({id: 'background'})}</FormLabel>
                        <RadioGroup 
                          className={classes.formGroup}
                          row 
                          aria-label="background"  
                          name="backgroundOption" 
                          value={this.state.backgroundOption} 
                          onChange={this.setStateFromInput}>
                          <FormControlLabel value="image" control={<Radio />} label="Image" />
                          <FormControlLabel value="color" control={<Radio />} label="Color" />
                        </RadioGroup>
                      </FormControl>
                      <Box display="flex" flexDirection="row" justifyContent="space-evenly">
                      { this.state.backgroundOption === "image" 
                        ? <FileInput 
                            source={
                              backgroundImage &&
                              backgroundImage.indexOf("base64") >=0 ? 
                              backgroundImage : 'https://bathtimestories.com/'+backgroundImage}

                            onChange={(event) => this._handleImgChange(event)} 
                            deleteImg={(event) => this.deleteImg()}
                            onClick={(event) => this._handleSubmit(event)}/> 
                        : this.state.category.background
                          .map((el,i) => 
                            i<this.state.backgroundCount
                            ? <FormControl key={"fmk"+i}>
                              <input
                                name="background"
                                type="color"
                                style={{
                                  height: 60,
                                  width: 60,
                                  margin: '0 5px 0 5px',
                                  borderColor: 'rgba(0, 0, 0, 0.23)'}}
                                onChange={(e) => this.setStateArrayFromInput(e, "category", i)}
                                value={this.state.category.background[i]}/>
                              </FormControl>
                            : '' )
                        
                      }
                      </Box>
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
                      {formatMessage({id: 'save'})}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>
            <Grid align="center" item xs={12} lg={6} style={{position: 'sticky', top: 0, alignSelf:'baseline'}}>
              <CustomTabs
                classes={classes.tabs}
                value={this.state.tabIndex}
                onChange={this.handlePreviewChange}
                tabLabel={[tabLabel("Small Phone",16), tabLabel("Big Phone",24), tabLabel("Small Tablet",32), tabLabel("Big Tablet",40)]}
                children={<Box mt={2} style={{position: 'relative'}}>
                  {images(this.props.media.mobile)[this.state.tabIndex]}
                  <iframe
                      title="preview"
                      src={`/my-menu/${this.props.match.params.title}/?preview=true/`}
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
  media: state.media,
  token: state.account.token
});


export default 
  compose(
    withStyles(style, { withTheme: true }),
    connect(mapStateToProps)
    )(injectIntl(Form));
