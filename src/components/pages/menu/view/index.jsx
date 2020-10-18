import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../../firebase";
//import Product from '../menu/product';
import { Typography, Box, Tooltip, Fab, Fade, Button, Divider, Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core/";
import GridImage from "./image-grid.jsx";
import Card from "./item-card.jsx";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { ArrowDropUp, RateReviewSharp } from "@material-ui/icons/";
import { animateScroll } from "react-scroll";
import { fetchMenuView, fetchMenu, fetchMenuDesign, fetchData } from '../../../utils/fetch';
import Reviews from './review';
import CustomTabs from './tabs.jsx';
import Hx from './hx.jsx';

const queryString = require('query-string');

const styles = (theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    zIndex: 1500,
  },
  h1: {
    '& img': {
      borderRadius: 75
    }
  },
  h2: {
    '& .Mui-selected img': {
      border: '1px solid rgba(255,0,0,1)'
    }
  },
  tabs: {
    '& .MuiTab-root': {
      minWidth: 'auto',
      '& .MuiTab-wrapper': {
        alignSelf: 'baseline'
      }
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center'
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    },
    '& img': {
      border: '1px solid rgba(0,0,0,0.5)'
    },
    '& .Mui-selected img': {
      border: '1px solid rgba(0,0,0,1)'
    }
  }
});
/*      h1: cercuri
				h2: patrate
				h3: liniar
				h4: grid
				
				b1: overlapped rectangles v1
				b2: overlapped rectangles v2
				b3: liniar rectangles */


const scrollToTop = () => {
  animateScroll.scrollToTop();
  //window.scrollTo(0, 0);
};

const scrollToBottom = () => {
  animateScroll.scrollToBottom();
  //window.scrollTo(0, 0);
};

// let [mobileView, setMobileView] = useState(window.innerWidth<600);
// useEffect(() => {
//   //(window.innerWidth>600 && mobileView || window.innerWidth<600 && !mobileView) && setMobileView(!mobileView)
//   window.addEventListener("resize", updateWindowDimensions);

//   return () => window.removeEventListener("resize", updateWindowDimensions);
// },[]);

const value = (size) => ( window.innerWidth<600 ? ((100 * parseInt(size)) / 400 + "vw") : parseInt(size));

const getStyle = ({color, font, size}) => ({
  color, 
  fontSize: value(size), 
  fontFamily: font,
})

export class Menu extends Component {
  constructor(props) {
    super(props);
    //const parsed = window.location.href.split('%22').join('"').split('%20').join(' ');
   // console.log(queryString.parse(props.location.search));
    this.state = {      
      headerType: '',
      bodyType: '',
      samePage: '',
      default_style: '',
      settings: {
        disableToC: false,
        disableImages: false,
        disableReviews: false,
      },
      tabIndex: 0,
      products: [],
      show_form: false,
      data: [],
      refs: [],
      showToolTip: false,
      item: "",
      category: "",
      mobileView: window.innerWidth<600,
    };
    const params = queryString.parse(props.location.search);
    if (Object.keys(params).length){
    this.state.isPreview = true;
    this.state.category = {
      name: {
        color: "#"+params.cnc,
        size: params.cns,
        font: params.cnf.replace(/_/g, " "),
      },
    };
    this.state.item = {
        name: {
          color: "#"+params.inc,
          size: params.ins,
          font: params.inf.replace(/_/g, " "),
        },
        ingredients: {
          color: "#"+params.iic,
          size: params.iis,
          font: params.iif.replace(/_/g, " "),
        },
        alergens: {
          color: "#"+params.iac,
          size: params.ias,
          font: params.iaf.replace(/_/g, " "),
        },
        calories: {
          color: "#"+params.icc,
          size: params.ics,
          font: params.icf.replace(/_/g, " "),
        },
        size: {
          color: "#"+params.isc,
          size: params.iss,
          font: params.isf.replace(/_/g, " "),
        },
    };
  }
    this.edit = false;
  }

  updateWindowDimensions = () => {
    if(window.innerWidth>600 && this.state.mobileView || window.innerWidth<600 && !this.state.mobileView){
      this.setState({mobileView: !this.state.mobileView});
      console.log("updating height")
    };
  };

  componentDidMount() {
    this.setContentType('h3b0');
    window.addEventListener("resize", this.updateWindowDimensions);
    const title = this.props.match.params.title;
    this.fetchData(title);
    if(!this.state.item)
      this.fetchDesign(title);
    window.addEventListener("scroll", this.handleToolTip);
  }


  fetchData = async (title) => {
    try {
      let settings = await fetchData({ title: title }, "menu/category/get.php");
      //let categories = apiData.categories;
      this.setState({settings: { 
        /*enableAlergens: apiData.enables.enableAlergens == true,
        enableCalories: apiData.enables.enableCalories == true,*/
        disableToC: !(settings.enables.enableToC == true),
        disableReviews: !(settings.enables.enableReviews == true)
      }
      });
      let {data, layout} =  await fetchData({title: title}, "menu/view/get.php");
      console.log(data);
      let newData = [];
      data.forEach((el, i) => {
        if (i == 0 || data[i - 1].category_id !== el.category_id) {
          let category = {
            category_id: el.category_id,
            name: el.c_name,
            items: [],
            picture: el.image_option === "library" ?
            el.library_picture : el.upload_picture,
            background: el.background,
          };

          //data.push();
          category.items = data
            .filter((_el, _i) => _el.category_id == el.category_id)
            .map((_el, _i) => ({
              id: _el.item_id,
              name: _el.i_name,
              ingredients: _el.ingredients,
              alergens: _el.alergens,
              calories: _el.calories,
              picture: _el.i_pictures,
              size: _el.size,
            }));
          newData.push(category);
        }
      });
      this.setState({
        data: newData,
        headerType: Number(layout.header_type),
        bodyType: Number(layout.body_type),
        samePage: layout.same_page==true
      });
    } catch (error) {
      console.log(error);
    }
  };

  fetchMenu = async (title) => {
    try {
      let data = await fetchMenu(title);
      console.log(data);
      this.setState({
        products: data.products,
        categories: data.categories.map((i) => i.category),
      });
    } catch (error) {
      console.error(error);
    }
  };

  fetchDesign = async (title) => {
    try {
      let apiData = await fetchData({title: title}, "menu/design/get.php")
      console.log(apiData);
      this.setState({
        category: JSON.parse(apiData.category_design),
        item: JSON.parse(apiData.item_design),
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleToolTip = (event) => {
    if (!this.state.showToolTip && window.scrollY > window.innerHeight / 2)
      this.setState({
        showToolTip: true,
      });
    else if (this.state.showToolTip && window.scrollY < window.innerHeight / 2)
      this.setState({
        showToolTip: false,
      });
  };

  addRef = (element) => {
    let refs = this.state.refs;
    refs.push(element);
    this.setState(refs);
  };

  handleCategoryChange = (event, value) => {
    this.setState({tabIndex: value});
  }

  setContentType = (type) => {
    switch (type) {
        case 'h0b0':
          this.setState({headerType: 0, bodyType: 0, samePage: true});
          break;
        case 'h0b1':
          this.setState({headerType: 0, bodyType: 1, samePage: true});
          break;
        case 'h1b0':
          this.setState({headerType: 1, bodyType: 0, samePage: true});
          break;
        case 'h1b1':
          this.setState({headerType: 1, bodyType: 1, samePage: true});
          break;          
        case 'h3b0':
          //header list, header and item overlapped rectangles
          this.setState({headerType: 3, bodyType: 0, samePage: false});
          break;
        case 'h3b1':
          this.setState({headerType: 3, bodyType: 1, samePage: false});
          break;
        case 'h3':
          this.setState({headerType: 3});
          break;
        default:
          this.setState({headerType: 1});   
    }
  }

  tableOfContent = (grid, style) => {
    const {classes} = this.props;
    switch (this.state.headerType){
      case 0:
        return <CustomTabs
                //classes={classes.tabs}
                classes={[classes.tabs, classes.h1]}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>
                  <>
                    <img width="50" height="50" style={{background: 'white'}} src={el.picture}/>
                    <Typography style={{...getStyle(style), textTransform: 'none', width: 'min-content'}}>
                      {el.name}
                    </Typography>
                  </>
                )}>
        </CustomTabs>
      case 1:
        return <CustomTabs
                //classes={classes.tabs}
                classes={this.props.classes.tabs}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>                   
                  <>
                    <img width="50" height="50" src={el.picture}/>
                    <Typography style={{...getStyle(style), fontSize: 'inherit', textTransform: 'none', width: 'min-content'}}>
                      {el.name}
                    </Typography>
                  </>
                )}>
        </CustomTabs>
      case 2:
        return <GridImage
            data={grid}
            header={true}
            refs={this.state.refs}
            style={style}
          />
      case 3: 
        return grid.map((el,i) => 
        <Hx
          el={el}
          style
          onClick={()=>{this.props.history.push(''+grid[i].id)}}
          key={'_hx3'+i}
          children={<Typography style={getStyle(style)}>
            {el.name}
          </Typography>}
        />)
      default: 
        return ''

    }
  }

  getCategoryHeader = (el, category_style) => {
    let style = getStyle(category_style);
    switch (this.props.layout) {
      case 'layout1':
        return <GridImage /*disableImages={this.state.settings.disableImages}*/ data={[el]} style={style} />

      default:
        return ''/*<Typography style={{...style, textAlign: "center", whiteSpace: "break-spaces",}} align="center">
            {el.name}
        </Typography>*/

    }
  }

  getItem = (el,i) => {
    const {item, isPreview, settings, bodyType} = this.state;
    const style = {
      name: getStyle(item.name),
      size: getStyle(item.size),
      ingredients: getStyle(item.ingredients),
      alergens: getStyle(item.alergens),
      calories: getStyle(item.calories),
    };
    switch (bodyType) {
      case 0:
        return <Hx
          key={'_xsd0'+i}
          el={el}
          children={
            <>
              <Box display="flex" justifyContent="space-between" alignItems="baseline">        
                <Typography style={{...style.name, lineHeight: '2.5em'}}>
                  {el.name}
                </Typography>
              </Box>                
              <Box>          
                <Typography style={{...style.ingredients}} >
                  {el.ingredients} 
                </Typography>
              </Box>
              <Typography style={{...style.size, lineHeight: '2.5em', textAlign: 'right'/*whiteSpace: "nowrap"*/}} >
                  {el.size}
                </Typography>
            </>}
          style={getStyle(style)}
        />
      case 1:
        return <Card 
            disableReviews={ settings.disableReviews} 
            disableImages={ settings.disableImages}
            isPreview={ isPreview} 
            key={'_ca1'+i} 
            style={style} 
            id={i} 
            data={el} />
      case 2:
        return <Box 
            display="flex" 
            key={'_bjd'+i}
            mb={1} 
            justifyContent="space-between">
            <Box>
              <Typography style={style.name}>
                {el.name}
              </Typography>
              <Typography style={{...style.ingredients, textAlign: 'right'}} >
                {el.ingredients} 
              </Typography>
            </Box>
            <Box>
              <Typography style={{...style.size, whiteSpace: "nowrap"}} >
              {el.size}
              </Typography>
            </Box>
          </Box>
      default: 
        return 'error'

    }

  }

  goBack = (e) => {
    this.props.history.goBack();
  }

  getBody = (category_id) => {
    const { data, category, item } = this.state;
    const category_style = category && {
      color: category.name.color,
      font: category.name.font,
      size: category.name.size,
    };

    if (data.length && item && category_style){
      if(category_id){
        let el = data.find(el => el.category_id == category_id);
        return <Box
            
            ref={this.addRef}
            key={'_jk'+0}
            style={{ /*backgroundImage: 'url("' + el.background + '")',*/ position: 'relative' }}
            p={2}
          >
          <Button onClick={this.goBack}>Go back</Button>
          
            { this.getCategoryHeader(el,category_style) }
            <Box p={2}>
              {el.items.map((_el, _i) => (
                  this.getItem(_el,_i)
              ))}
            </Box>
          </Box>
      }
      else 
        return data.map((el, i) => (
          <Box
            p={2}
            ref={this.addRef}
            display={ (this.state.samePage && i==this.state.tabIndex) ? "inherit" : "none"}
            key={'_jk'+i}
            style={{ /*backgroundImage: 'url("' + el.background + '")',*/
              //background: '#333333',
              position: 'relative' }}
          >
            { this.getCategoryHeader(el,category_style) }
            <Box>
              {el.items.map((_el, _i) => (
                  this.getItem(_el,_i)
              ))}
            </Box>
          </Box>))
    }
  }

  render() {
    const category_id = this.props.match.params.category;
    const { data, category } = this.state;
    const { classes } = this.props;
    const grid = data
      ? data.map((el, i) => ({ id: el.category_id, name: el.name, picture: el.picture }))
      : [];
    const category_style = category && {
      color: category.name.color,
      font: category.name.font,
      size: category.name.size,
    };


    //this.state.products && (document.querySelector(".loader-wrapper").style = "display: none");
    return (
      <Box className="mx-auto" style={{ maxWidth: 600 }}>
        { !this.state.settings.disableReviews && <Button onClick={scrollToBottom}>Vezi recenziile restaurantului</Button>
        }
        <Box py={2} className="display-menu" style={{position: "relative", background: '#e2e2e2'}}>
          { grid && !category_id && !this.state.settings.disableToC && this.tableOfContent(grid, category_style) }
          { this.getBody(category_id)
          }
        </Box>
        <Box>
          { !this.state.settings.disableReviews &&
            <>
              <Divider/>
              <br/>
              Recenzii
              <br/>
              <Reviews menu_title={this.props.match.params.title}
              />
            </>
          }
          <Fade in={this.state.showToolTip}>
            <Tooltip
              title="Cuprins"
              aria-label="cuprins"
              arrow={true}
              onClick={scrollToTop}
            >
              <Fab color="secondary" className={classes.absolute}>
                <ArrowDropUp />
              </Fab>
            </Tooltip>
          </Fade>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  layout: state.settings.layout
})

export default compose(
  withFirebase,
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(injectIntl(Menu));
