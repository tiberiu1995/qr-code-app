import React, { Component} from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../../firebase";
//import Product from '../menu/product';
import { Typography, Box, Tooltip, Fab, Fade, Button, Divider, } from "@material-ui/core";
import GridImage from "./image-grid.jsx";
import Card from "./item-card.jsx";
import { withStyles } from "@material-ui/styles";
import { ArrowDropUp,  } from "@material-ui/icons/";
import { animateScroll } from "react-scroll";
import { fetchData } from '../../../utils/fetch';
import RestaurantReviews from './review/restaurant-reviews.jsx';
import ProductReviews from './review/product-reviews.jsx';
import CustomTabs from './tabs.jsx';
import Hx from './hx.jsx';
import { Link } from 'react-router-dom';
import Cx from './cx';
import {MoreVert} from '@material-ui/icons/';
import { Rating } from '@material-ui/lab/';
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
    '& .MuiTabs-scroller': {
      overflow:'overlay !important',
    },

    '& .MuiTab-root': {
      minWidth: 'auto',
      '& .MuiTab-wrapper': {
        alignSelf: 'baseline'
      }
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'center',
      width: 'max-content'
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

const scrollToTop = () => {
  animateScroll.scrollToTop();
  //window.scrollTo(0, 0);
};

const scrollToBottom = () => {
  animateScroll.scrollToBottom();
  //window.scrollTo(0, 0);
};


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
      tabIndex: 0,
      catIndex: -1,
      products: [],
      show_form: false,
      data: [],
      refs: [],
      showToolTip: false,
      item: "",
      category: "",
      mobileView: window.innerWidth<600,
      isVisible: false,
      modalIndex: -1,
      toggles: {

      }
    };
    this.edit = false;
  }

  showModal = (el) => {
    this.setState({modalIndex: el.id, modalItem: el});
  }

  hideModal = (e) => {
    this.setState({modalIndex: -1, modalItem: ''});
  }

   review = (isPreview, el, style, align="right") => {
    let count = this.state.reviews.find(r => r.id === el.id);
    count = count.rating ? count.count : 0;
    let reviewType = 'stars';
    return (this.state.reviews ?
          <Box 
            onClick={(e) => this.showModal(el)}> 
            { this.state.toggles.item_reviewStars ?
              <Rating 
              size="small" 
              name="read-only" 
              precision={0.5} 
              readOnly
              style={style.reviewStars}
              value={this.state.reviews.find(r => r.id === el.id).rating}/> : ''
            }
            { this.state.toggles.item_reviewText ? 
              <Typography 
                align={align}
                style={style.reviewText}
                variant="body2">
              {count} reviews
              </Typography> : ''
            }         
          </Box>
        : ''
    )}

  value = (size) => {
    if (this.props.media.mobile)
     return (100 * parseInt(size)) / 400 + "vw";
    if (this.props.media.tablet)
     return (100 * parseInt(size)) / 500 + "vw";    
    return parseInt(size);
  }

  /*updateWindowDimensions = () => {
    if(window.innerWidth>600 && this.state.mobileView || window.innerWidth<600 && !this.state.mobileView){
      this.setState({mobileView: !this.state.mobileView});
      console.log("updating height")
    };
  };*/

  updatePreviewStyle = () => {
    if(sessionStorage.getItem('style')){
      const {item, category, contentType, backgroundOption, toggles} = JSON.parse(sessionStorage.getItem('style'));
      this.setContentType(contentType);
      this.setState({item, category, backgroundOption, toggles});
      let preview = queryString.parse(this.props.location.search).preview;
      if(preview){
        let data = JSON.parse(JSON.stringify(this.state.originalData));
        data.forEach(el => {
          if (!toggles.category_description)
            el.description = "";
          el.items.forEach(_el => {
            if (!toggles.item_ingredients)
                _el.ingredients = "";
            if (!toggles.item_alergens)
                _el.alergens = "";
            if (!toggles.item_calories)
                _el.calories = "";
          })    
        })
        this.setState({data: data});
      }
      sessionStorage.setItem('style', '');
    }
  }

  componentDidMount() {
    //this.setContentType('h3b0');
    const params = queryString.parse(this.props.location.search);
    params.preview && setInterval(this.updatePreviewStyle, 1000);
    window.addEventListener("resize", this.updateWindowDimensions);
    const title = this.props.match.params.title;
    this.fetchData(title);
    window.addEventListener("scroll", this.handleToolTip);
  }


  fetchData = async (title) => {
    try {
      //let settings = await fetchData({ title: title }, "menu/category/get.php");
      let {data, layout, reviews} =  await fetchData({title: title}, "menu/view/get.php");
      let design = await fetchData({title: title}, "menu/design/get.php")
      let toggles = JSON.parse(design.custom.toggles);
      let preview = queryString.parse(this.props.location.search).preview;
      console.log(data);
      let newData = [];
      data.forEach((el, i) => {
        if (i === 0 || data[i - 1].category_id !== el.category_id) {
          let category = {
            category_id: el.category_id,
            name: el.c_name,
            items: [],
            picture: el.image_option === "library" ?
            el.library_picture : el.upload_picture,
            background: el.background,
          };
          if (toggles.category_description || preview)
            category = {...category, description: el.description};
          //data.push();
          category.items = data
            .filter((_el, _i) => _el.category_id == el.category_id)
            .map((_el, _i) => {
              let item = {
                id: _el.item_id,
                name: _el.i_name,
                picture: _el.i_pictures,
                size: _el.size,
              }
              if (toggles.item_ingredients || preview)
                item = {...item, ingredients: _el.ingredients}
              if (toggles.item_alergens || preview)
                item = {...item, alergens: _el.alergens}
              if (toggles.item_calories || preview)
                item = {...item, calories: _el.calories}
              return item
            });
          newData.push(category);
        }
      });
      preview && this.setState({originalData: JSON.parse(JSON.stringify(newData))});
      this.setState({
        reviews: reviews,
        category: JSON.parse(design.custom.category_design ? design.custom.category_design : design.defaults.category_design),
        item: JSON.parse(design.custom.item_design ? design.custom.item_design : design.defaults.item_design),
        data: newData,
        headerType: Number(layout.header_type),
        bodyType: Number(layout.body_type),
        samePage: layout.same_page==true,
        toggles: toggles,
        backgroundOption: design.custom.background_option || design.defaults.background_option

      });
      this.setContentType(layout.id);
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
        case 'h5b2':
          this.setState({headerType: 5, bodyType: 2, samePage: true});
          break;
        case 'h4b4':
          this.setState({headerType: 4, bodyType: 4, samePage: false, catIndex: -1});
          break;
        default:
          this.setState({headerType: 1});   
    }
  }

  tableOfContent = (grid, category_style) => {
    const {classes} = this.props;
    let style =  JSON.parse(JSON.stringify(category_style));
    style.name.fontSize = this.value(style.name.fontSize);
    style.description.fontSize = this.value(style.description.fontSize);
    switch (this.state.headerType){
      case 0:
        return <CustomTabs
                //classes={classes.tabs}
                classes={[classes.tabs, classes.h1].join(' ')}
                //style={style.background}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>
                  <>
                    <img alt="" width="50" height="50" style={{background: 'white'}} src={el.picture}/>
                    <Typography style={{...style.name, textTransform: 'none', width: 'min-content'}}>
                      {el.name}
                    </Typography>
                  </>
                )}>
        </CustomTabs>
      case 1:
        return <CustomTabs
                style={{overflow: 'scroll'}}
                //classes={classes.tabs}
                classes={this.props.classes.tabs}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>                   
                  <>
                    <img alt="" width="50" height="50" style={{background: 'white'}} src={el.picture}/>
                    <Typography style={{...style.name, fontSize: 'inherit', textTransform: 'none', width: 'min-content'}}>
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
          onClick={()=>{this.props.history.push(grid[i].id+'/')}}
          key={'_hx3'+i}
          children={<Typography style={style.name}>
            {el.name}
          </Typography>}
        />)
      default: 
        return ''

    }
  }

  getCategoryHeader = (el, category_style, index) => {
    //let style = {...category_style};
    //style.fontSize = this.value(style.fontSize);
    switch (this.state.headerType){
      case 4: 
        return <Cx 
          key={'chs4'+index}
          index = {index}
          fade 
          onClick={()=>{this.setState({
              catIndex: this.state.catIndex !== index ? index : -1
          }) }}

          style={{backgroundSize: 'cover'}}
          el={el} >
            <Typography style={category_style.name}>
              {el.name}
            </Typography>
            <Typography style={category_style.description}>
              {el.description}
            </Typography>
            </Cx>
      case 5:
        return <Box 
          display="flex" 
          key={'_bjd'+index}
          mb={1} 
          justifyContent="space-between">
          <Box>
            <Typography style={category_style.name}>
              {el.name}
            </Typography>
          </Box>
        </Box>
      default: 
        return ''
    }
    switch (this.props.layout) {
     // case 'layout1':
      //  return <GridImage /*disableImages={this.state.settings.disableImages}*/ data={[el]} style={style} />

      default:
        return ''/*<Typography style={{...style, textAlign: "center", whiteSpace: "break-spaces",}} align="center">
            {el.name}
        </Typography>*/

    }
  }

  getItem = (el,i, index) => {
    const {item, isPreview, bodyType, toggles} = this.state;
    let style = JSON.parse(JSON.stringify(item)); //{...item};
    for (const [key, value] of Object.entries(style)) {
      style[key].fontSize = this.value(value.fontSize)
    }
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
                { this.state.reviews.length ? this.review(isPreview, el, style) : ''}
              </Box>                
              <Box>          
                <Typography style={{...style.ingredients}} >
                  {el.ingredients} 
                </Typography>
                <Typography style={{...style.alergens}} >
                {el.alergens}
              </Typography>
              <Typography style={{...style.calories}} >
                {el.calories} 
              </Typography> 
              </Box>
              <Typography style={{...style.size, lineHeight: '2.5em', textAlign: 'right'/*whiteSpace: "nowrap"*/}} >
                  {el.size}
              </Typography>
            </>}
        />
      case 1:
        return <Card 
            key={'_ca1'+i} 
            style={style} 
            id={i} 
            review={this.state.reviews.length ? this.review(isPreview,el,style) : ''}
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
              { this.state.reviews.length ? this.review(isPreview, el, style, 'left') : ''}
              <Typography style={{...style.ingredients}} >
                {el.ingredients} 
              </Typography>
              <Typography style={{...style.alergens}} >
                {el.alergens}
              </Typography>
              <Typography style={{...style.calories}} >
                {el.calories} 
              </Typography> 
              <Typography style={{...style.size, whiteSpace: "nowrap"}} >
              {el.size}
              </Typography>
            </Box>
          </Box>
      case 4:
        return <Cx 
          index={i}
          key={'cxs4'+i}
          el={el} 
          fade={this.state.catIndex == index}
          style={{backgroundSize: 'contain', backgroundRepeat: 'no-repeat', position: 'relative'}}>
            <Typography style={style.name}>
                {el.name}
              </Typography>
              <Typography style={{...style.ingredients}} >
                {el.ingredients} 
              </Typography>
              <Typography style={{...style.alergens}} >
                {el.alergens}
              </Typography>
              <Typography style={{...style.calories}} >
                {el.calories} 
              </Typography>              
              <Typography style={{...style.size}} >
                {el.size} 
              </Typography>
              { this.state.reviews.length ? this.review(isPreview, el, style) : '' }
          </Cx>
      default: 
        return 'error'

    }

  }

  goBack = (e) => {
    this.props.history.goBack();
  }

  getBody = (category_id) => {
    const { data, category, item } = this.state;
    const category_style = category;

    if (data.length && item && category_style){
      if(category_id){
        let el = data.find(el => el.category_id == category_id);
        return <Box
            
            ref={this.addRef}
            key={'_jk'+0}
            style={{ /*backgroundImage: 'url("' + el.background + '")',*/ position: 'relative' }}
          >
          <Button onClick={this.goBack}>Go back</Button>
          
            { el && this.getCategoryHeader(el,category_style, '') }
            <Box>
              {el.items.map((_el, _i) => (
                  this.getItem(_el,_i,'')
              ))}
            </Box>
          </Box>
      }
      else 
        return data.map((el, i) => (
          <Box
            ref={this.addRef}
            key={'_jk'+i}
            style={{ /*backgroundImage: 'url("' + el.background + '")',*/
              //background: '#333333',
              position: 'relative' }}
          >
            { this.getCategoryHeader(el,category_style, i) }
            <Box display={ (([4,5].includes(this.state.headerType)) || (this.state.samePage && i==this.state.tabIndex)) ? "inherit" : "none"}>
              {el.items.map((_el, _i) => (
                  this.getItem(_el,_i,i)
              ))}
            </Box>
          </Box>))
    }
  }

  render() {
    const category_id = this.props.match.params.category;
    const { data, category, item, modalItem, modalIndex } = this.state;
    const { classes } = this.props;
    const grid = data
      ? data.map((el, i) => ({ id: el.category_id, name: el.name, picture: el.picture }))
      : [];
    const category_style = category;


    //this.state.products && (document.querySelector(".loader-wrapper").style = "display: none");
    return (
      <Box className="mx-auto" style={{ maxWidth: 600 }}>
        {/* this.state.toggles.item_reviews && <Button onClick={scrollToBottom}>Vezi recenziile restaurantului</Button>
         */}
        {modalItem ? 
          <ProductReviews
          item={modalItem}
          key="pr23"
          style={JSON.parse(JSON.stringify(item))}
          show={modalIndex>=0}
          onCancel={this.hideModal} /> : ''
        }
        <Box 
          className="display-menu" 
          style={{
            position: "relative", 
            background: (this.state.backgroundOption==="image" && category.backgroundImage) ? 
              ( category.backgroundImage.indexOf("base64") >=0 ? 
                'url('+ category.backgroundImage +')' :
                'url(https://bathtimestories.com/'+category.backgroundImage+')') :
              category.background
              }}>
          { grid && category_style && !category_id && this.tableOfContent(grid, category_style) }
          { this.getBody(category_id)
          }
        </Box>
        <Box m={2}>
          { this.state.toggles.item_reviews &&
            <>
              <Divider/>
              <br/>
              <RestaurantReviews menu_title={this.props.match.params.title}/>
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
  layout: state.settings.layout,
  media: state.media
})
export default compose(
  withFirebase,
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(injectIntl(Menu));