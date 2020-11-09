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
import { ArrowDropUp, ExpandLessOutlined, ExpandLess, ExpandMore, Add,  } from "@material-ui/icons/";
import { fetchData } from '../../../utils/fetch';
import RestaurantReviews from './review/restaurant-reviews.jsx';
import ProductReviews from './review/product-reviews.jsx';
import CustomTabs from './tabs.jsx';
import Hx from './hx.jsx';
import Cx from './cx';
import { Helmet } from 'react-helmet';
import { Rating } from '@material-ui/lab/';
import { setProducts, addProduct } from "../../../../actions";
const queryString = require('query-string');


const styles = (theme) => ({
  divider: {
    margin: [[10, 0]],
  },
  pointerCursor: {
    cursor: 'pointer'
  },
  container: {
    '& p, & span': {
      lineHeight: 1.8
    },
    '& .MuiTypography-root + .MuiButtonBase-root': {
      padding: 0,
      justifyContent: 'left'
    }
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    zIndex: 1500,
  },
  tabs: {
    '& .MuiTabs-scroller': {
      overflow:'overlay !important',
    },
    '& p, & span': {
      lineHeight: 1.1
    },
    '& img': {
      borderRadius: 75,
      opacity: 0.5,
      width: 50,
      height: 50,
      [theme.breakpoints.up('450')]:{
        width: 60,
        height: 60,
      },
      [theme.breakpoints.up('500')]:{
            width: 75, 
            height: 75, 
      },
    },
    '& .Mui-selected img': {
      opacity: 1
    },
    '& .MuiTab-root': {
      minWidth: 'auto',
      '& .MuiTab-wrapper': {
        alignSelf: 'baseline'
      }
    },
    '& .MuiTabs-flexContainer': {
      width: 'fit-content',
      margin: 'auto',
      justifyContent: 'center'
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    },
  },
  h0: {
    '& img': {
      border: '1px solid rgba(0,0,0,0.5)',
      
    },
    '& .Mui-selected img': {
      border: '1px solid rgba(0,0,0,1)'
    }, 
  },
  h2: {
    display: "flex",
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  h3: {
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    backgroundSize: '50%', 
    backgroundRepeat: 'no-repeat', 
    height: 100, 
    [theme.breakpoints.up(500)]: {
      height: 130
    },
    '& img': {
      position: 'absolute',
      height: '250%'
    },
    '& .MuiBox-root': {
      flex: '1 1 auto',
    },
    '&:nth-child(odd)': {
      flexDirection:' row-reverse',
      '& .MuiTypography-root': {
        left: 30,   
      },
      '& img':{
        right: -150,
        [theme.breakpoints.down(500)]: {
          right: -120
        }
      }
    },    
    '&:nth-child(even)': {
      flexDirection:' row',
      '& .MuiTypography-root': {
        right: 30,   
      },
      '& img':{
        left: -150,
        [theme.breakpoints.down(500)]: {
          left: -120
        }
      }
    },
    '& .MuiTypography-root': {
      position: 'absolute',
      width: '60%',
      [theme.breakpoints.up(600)]: {
        width: '70%',
      }
    }

  },
  b0: {
    margin: [[0, 16, 16, 16]],
    '&:first-child': {
      marginTop: 16
    },
  },
  b2: {
    '& .MuiTypography-root': {
      alignSelf: 'baseline'
    }
  },
  b4: {
    '& img': {
      alignSelf: 'center'
    },
  },
  maxContainer: {
    [theme.breakpoints.up('600')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 568
    }
  }
});


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
      isVisible: false,
      modalIndex: -1,
      toggles: {

      },
      showMore: -1,
      addToCartModal: -1,
    };
    this.edit = false;
  }

  showModal = (el) => {
    this.setState({modalIndex: el.id, modalItem: el});
  }

  hideModal = (e) => {
    this.setState({modalIndex: -1, modalItem: ''});
  }

   review = (isPreview, el, style, align="left") => {
    let count = this.state.reviews.find(r => r.id === el.id);
    count = count.rating ? count.count : 0;
    let reviewType = 'stars';
    return (this.state.reviews ?
          <Box 
            className={!isPreview ? this.props.classes.pointerCursor : ''}
            display="flex"
            flexDirection="column"
            onClick={(e) => this.showModal(el)}> 
            { this.state.toggles.item_reviewStars ?
              <Rating 
              size="small" 
              name="read-only" 
              precision={0.5} 
              readOnly
              style={style.reviewStars}
              value={parseFloat(this.state.reviews.find(r => r.id === el.id).rating)}/> : ''
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

    getExtra = (el,style) => {
      const calories = el.size.filter(el => el.calories != '');
      if (calories.length == 0 && el.alergens == '')
        return '';
      return <>
      { this.state.showMore==el.id
        ? <>
            <Typography style={{...style.alergens}} >
            {this.props.intl.formatMessage({id: 'alergens'}) + ': ' + el.alergens}
            </Typography>
            <Typography style={style.calories} >
            { calories.length 
              ? this.props.intl.formatMessage({id: 'calories'})+ ': ' +
                calories.map(el => el.size=="{}" ? el.calories : el.size+" "+el.calories).join(" | ") 
              : ''
            }
            </Typography>
          </>
        : '' }
      <Button onClick={(e) => this.showMoreHandler(el.id)}>
      { this.state.showMore==el.id ? <ExpandLess/> :  <ExpandMore/> }
      </Button>
      </>}


  value = (size) => {
    if (this.props.media.mobile)
     return (100 * parseInt(size)) / 400 + "vw";
    if (this.props.media.lt600)
     return (100 * parseInt(size)) / 500 + "vw";    
    return parseInt(size);
  }

  getColor = (array, index) => {
    return array[index%array.length]
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
      if(preview && this.state.originalData){
        let data = JSON.parse(JSON.stringify(this.state.originalData));
        data.forEach(el => {
          if (!toggles.category_description)
            el.description = "";
          el.items.forEach(_el => {
            if (!toggles.item_ingredients)
                _el.ingredients = "";
            if (!toggles.item_alergens)
                _el.alergens = "";
                _el.size.forEach(el => {
                  el.calories = (!toggles.item_calories) ? '' : el.calories
                })
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
    this.fetchMenuData(title);
    window.addEventListener("scroll", this.handleToolTip);
  }


  fetchMenuData = async (title) => {
    try {
      //let settings = await fetchData({ title: title }, "menu/category/get.php");
      let {data, layout, reviews} =  await fetchData({title: title}, "menu/view/get.php");
      let design = await fetchData({title: title}, "menu/design/get.php")
      let toggles = design.custom.toggles ? JSON.parse(design.custom.toggles) : '';
      let preview = queryString.parse(this.props.location.search).preview;
      console.log(data);
      let newData = [];
      newData = data.map(el => ({
        ...el,
        picture: el.image_option === "library" ?
            el.library_picture : el.upload_picture,
        description: ((toggles.category_description || preview) ? el.description : ''),
        items: 
          JSON
          .parse(el.items)
          .map(el => ({
              ...el,
              size: el.size
                    .map(el =>
                      ({
                        ...el, 
                        calories: ((toggles.item_calories || preview) ? el.calories : '')})
                    ),
              ingredients: ((toggles.item_ingredients || preview) ? el.ingredients : ''),
              alergens: ((toggles.item_alergens || preview) ? el.alergens : ''),
            })
          )
      }) );
      //setProducts(data.map(el => JSON.parse(el.items)).reduce((el,acc) => el.concat(acc), []));
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

  showMoreHandler = (id) => {
    this.state.showMore == id 
    ? this.setState({showMore: -1})
    : this.setState({showMore: id});
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
    const {classes, media} = this.props;
    let style =  JSON.parse(JSON.stringify(category_style));
    style.name.fontSize = this.value(style.name.fontSize);
    style.description.fontSize = this.value(style.description.fontSize);
    switch (this.state.headerType){
      case 0:
        return <CustomTabs
                //classes={classes.tabs}
                classes={[classes.tabs, classes.h0].join(' ')}
                //style={style.background}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>
                  <>
                    <img alt="" src={el.picture}/>
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
                 classes={[classes.tabs, classes.h1].join(' ')}
                value={this.state.tabIndex}
                onChange={this.handleCategoryChange}
                tabLabel={grid.map(el =>                   
                  <>
                    <img alt="" src={el.picture}/>
                    <Typography style={{...style.name, textTransform: 'none', width: 'min-content'}}>
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
        <Cx 
          key={'chs4'+i}
          index = {i}
          fade 
          h3
          className={[classes.h3, classes.pointerCursor, classes.maxContainer].join(' ')}
          onClick={()=>{this.props.history.push(grid[i].id+'/')}}
          boxStyle={{
            /*alignItems: (i%2 ? 'flex-start' : 'flex-end')*/
          }}
          style={{
            backgroundColor: this.getColor(style.background,i)}}
          el={el} >
            <Typography align="center" style={style.name}>
              {el.name}
            </Typography>
            <Typography style={style.description}>
              {el.description}
            </Typography>
            </Cx>
        )
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
          className={[this.props.classes.pointerCursor,this.props.classes.h4, this.props.classes.maxContainer].join(' ')}
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
        return <Box px={2} pt={3} pb={2}>
            <Typography align="center" style={category_style.name}>
              {el.name}
            </Typography>
            <Typography align="center" style={category_style.description}>
              {el.description}
            </Typography>
          </Box>
      default: 
        return ''
    }
  }
  openModal = (e, id) => {
    this.setState({ addToCartModal: this.state.addToCartModal === id ? -1 : id })
  }

  closeModal = () => { this.setState({ addToCartModal: -1}) }

  addItem = (data) => addProduct(data)

  getItem = (el, itemIndex, catIndex) => {
    const {classes, intl: {formatMessage}} = this.props;
    const {item, isPreview, bodyType, toggles, category: {background}} = this.state;
    let style = JSON.parse(JSON.stringify(item)); //{...item};
    for (const [key, value] of Object.entries(style)) {
      style[key].fontSize = this.value(value.fontSize)
    }
    switch (bodyType) {
      case 0:
        return <Hx
          key={'_xsd0'+itemIndex}
          el={el}
          className={[classes.b0, classes.maxContainer].join(' ')}
          children={
              <Box >        
                <Typography style={{...style.name, }}>
                  {el.name}
                </Typography>
                { this.state.reviews ? this.review(isPreview, el, style) : ''}
                <Typography style={{...style.ingredients}} >
                  {el.ingredients} 
                </Typography>
                <Typography style={style.size} >
                {el.size.map(el => el.size=="{}" ? el.price : el.size+" "+el.price).join(" | ")}
                </Typography>
                {this.getExtra(el,style)}
              </Box> }
        />
      case 1:
        return <Card 
            key={'_ca1'+itemIndex} 
            style={style} 
            id={itemIndex} 
            review={this.state.reviews ? this.review(isPreview,el,style) : ''}
            getExtra={this.getExtra(el,style)}
            data={el} />
      case 2:
        return <Box 
            key={'_bjd'+itemIndex}
            className={[classes.b2, classes.maxContainer].join(' ')}
            m={1} >
            <Box display="flex" justifyContent="space-between">
              <Typography style={{...style.name, }}>
                {el.name}
              </Typography>
              <Typography style={style.size} >
              {el.size.map(el => el.size=="{}" ? el.price : el.size+" "+el.price).join(" | ")}
              </Typography>
            </Box>
            { this.state.reviews ? this.review(isPreview, el, style) : ''}
            <Typography style={style.ingredients} >
              {el.ingredients} 
            </Typography>
            <Typography style={style.alergens} >
              {el.alergens && formatMessage({id: 'alergens'}) + ': ' + el.alergens}
            </Typography>
            <Typography style={style.calories} >
            { (el.size && el.size.filter(el => el.calories != '').length)
                ? formatMessage({id: 'calories'})+ ': ' +
                el.size.filter(el => el.calories != '').map(el => el.size=="{}" ? el.calories : el.size+" "+el.calories).join(" | ") 
                : ''
            }
            </Typography>
            {/* <Add onClick={(e) => this.openModal(e, el.id)}></Add> */}
            { itemIndex < this.state.data[catIndex].items.length-1 &&
            <Divider 
              className={classes.divider} 
              style={{
                backgroundImage: '-webkit-gradient( linear, left bottom, right bottom, color-stop(0, '+background[1]+'), color-stop(0.3, '+background[1]+'), color-stop(0.7, transparent), color-stop(1, transparent) )'}} />
              }      
          </Box>
          
      case 4:
        return <Cx 
          index={itemIndex}
          key={'cxs4'+itemIndex}
          el={el} 
          className={[classes.b4, classes.maxContainer].join(' ')}
          b4
          fade={this.state.catIndex == catIndex}
          style={{backgroundSize: 'contain', backgroundRepeat: 'no-repeat', position: 'relative'}}>
            <Typography style={{...style.name, }}>
              {el.name}
            </Typography>
            { this.state.reviews ? this.review(isPreview, el, style) : ''}
            <Typography style={{...style.ingredients}} >
              {el.ingredients} 
            </Typography>
            <Typography style={style.size} >
            {el.size.map(el => el.size=="{}" ? el.price : el.size+" "+el.price).join(" | ")}
            </Typography>
            {this.getExtra(el,style)}
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
            style={{ 
              background: (this.state.backgroundOption==="image" && category.backgroundImage) 
              ? (category.backgroundImage.indexOf("base64") >=0 
                ? 'url('+ category.backgroundImage +')' 
                : 'url(https://bathtimestories.com/'+category.backgroundImage+')') 
              : ( category.background 
                 ? category.background[0] 
                 : ''), 
              position: 'relative' }}
          >
          <Button onClick={this.goBack}>Go back</Button>
          
            { el && this.getCategoryHeader(el,category_style, '') }
            <Box>
              {el.items.map((_el,_i) => (
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
            <Box 
              flexDirection="column" 
              display={ 
                (([4,5].includes(this.state.headerType)) || (this.state.samePage && i==this.state.tabIndex)) 
                ? "flex" 
                : "none"}>
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
    return <>
        {/* <Navbar/>
        <AddToCart 
          id={this.state.addToCartModal} 
          addItem={this.addItem}
          show={this.state.addToCartModal!==-1}
          onCancel={this.closeModal} /> */}
        <Box className={"mx-auto "+ classes.container}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{this.props.match.params.title}</title>
          </Helmet>
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
            className={"display-menu "+(this.state.headerType == 3 ? classes.h2 : '') }
            style={{
              position: "relative", 
              background: this.state.headerType == 3 ? 'white' : (this.state.backgroundOption==="image" && category.backgroundImage) ? 
                ( category.backgroundImage.indexOf("base64") >=0 ? 
                  'url('+ category.backgroundImage +')' :
                  'url(https://bathtimestories.com/'+category.backgroundImage+')') :
                (category.background ? category.background[0] : '')
                }}>
            { grid && category_style && !category_id && this.tableOfContent(grid, category_style) }
            { this.getBody(category_id) }
          </Box>
          <Box m={2} className={classes.maxContainer}>
            { this.state.toggles.item_reviews &&
                <RestaurantReviews menu_title={this.props.match.params.title}/>
            }
            {/* <Fade in={this.state.showToolTip}>
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
            </Fade> */}
          </Box>
        </Box>
      </>
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