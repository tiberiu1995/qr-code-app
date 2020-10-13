import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../../firebase";
//import Product from '../menu/product';
import { Typography, Box, Tooltip, Fab, Fade, Button, Divider } from "@material-ui/core";
import { Grid } from "@material-ui/core/";
import GridImage from "./image-grid.jsx";
import Card from "./item-card.jsx";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { ArrowDropUp, RateReviewSharp } from "@material-ui/icons/";
import { animateScroll } from "react-scroll";
import { fetchMenuView, fetchMenu, fetchMenuDesign, fetchData } from '../../../utils/fetch';
import Reviews from './review';

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
});

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

export class Menu extends Component {
  constructor(props) {
    super(props);
    //const parsed = window.location.href.split('%22').join('"').split('%20').join(' ');
   // console.log(queryString.parse(props.location.search));
    this.state = {
      settings: {
        disableToC: false,
        disableImages: false,
        disableReviews: false,
      },
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
    window.addEventListener("resize", this.updateWindowDimensions);
    const title = this.props.match.params.title;
    this.fetchData(title);
    if(!this.state.item)
      this.fetchDesign(title);
    window.addEventListener("scroll", this.handleToolTip);
  }



  fetchData = async (title) => {
    try {
      let apiData = await fetchData({ title: title }, "menu/category/get.php");
      //let categories = apiData.categories;
      this.setState({settings: { 
        /*enableAlergens: apiData.enables.enableAlergens == true,
        enableCalories: apiData.enables.enableCalories == true,*/
        disableToC: !(apiData.enables.enableToC == true),
        disableReviews: !(apiData.enables.enableReviews == true)
      }
      });

      apiData =  await fetchData({title: title}, "menu/view/get.php"); //await fetchMenuView(title);
      console.log(apiData);
      let data = [];
      apiData.forEach((el, i) => {
        if (i == 0 || apiData[i - 1].category_id !== el.category_id) {
          let category = {
            category_id: el.category_id,
            name: el.c_name,
            items: [],
            picture: el.c_picture,
            background: el.background,
          };
          //data.push();
          category.items = apiData
            .filter((_el, _i) => _el.category_id == el.category_id)
            .map((_el, _i) => ({
              id: _el.item_id,
              name: _el.i_name,
              ingredients: _el.ingredients,
              alergens: _el.alergens,
              calories: _el.calories,
              pictures: _el.i_pictures,
              size: _el.size,
            }));
          data.push(category);
        }
      });
      this.setState({
        data: data,
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

  tableOfContent = (grid, style) => {
    return (grid.length && style) ?
      <>
        Cuprins
        <br/>
        <GridImage
            data={grid}
            header={true}
            refs={this.state.refs}
            style={style}
          />
      </> : "";
  }



  render() {
    const { data, category, item } = this.state;
    const { classes } = this.props;
    const grid = data
      ? data.map((el, i) => ({ name: el.name, picture: el.picture }))
      : [];
    const category_style = category && {
      color: category.name.color,
      fontFamily: category.name.font,
      fontSize: category.name.size,
    };
    //this.state.products && (document.querySelector(".loader-wrapper").style = "display: none");
    return (
      <Box className="mx-auto" style={{ maxWidth: 600 }}>
        { !this.state.settings.disableReviews && <Button onClick={scrollToBottom}>Vezi recenziile restaurantului</Button>
        }
        <div className="my-1 display-menu" style={{position: "relative"}}>
          { !this.state.settings.disableToC && this.tableOfContent(grid, category_style) }
          {
            data.length && item && category_style
              ? data.map((el, i) => (
                  <div
                    ref={this.addRef}
                    key={i}
                    style={{ /*backgroundImage: 'url("' + el.background + '")',*/ position: 'relative' }}
                  >
                    <GridImage disableImages={this.state.settings.disableImages} data={[el]} style={category_style} />
                    {/* <Typography gutterBottom variant="h4" component="h2" style={{color: category.name.color, fontFamily: category.name.color, fontSize: category.name.size}}>
                    {el.name}
                  </Typography> */}
                    <Box p={2.5}>
                      {el.items.map((_el, _i) => (
                        <Card 
                          disableReviews={this.state.settings.disableReviews} 
                          disableImages={this.state.settings.disableImages}
                          isPreview={this.state.isPreview} 
                          key={'card'+_i} 
                          style={item} 
                          id={_i} 
                          data={_el} />
                      ))}
                    </Box>
                  </div>
                ))
              : ""
          }
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
        </div>
      </Box>
    );
  }
}

/*const mapStateToProps = (state) => ({

})*/

export default compose(
  withFirebase,
  withStyles(styles, { withTheme: true }),
  connect(null)
)(injectIntl(Menu));
