import React, { Component,Fragment } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { compose } from 'recompose';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { withFirebase } from '../../firebase';
//import Product from '../menu/product';
import Button from "react-bootstrap/Button";
import { Typography, Box, Tooltip, Fab, Fade } from '@material-ui/core';
import { Grid } from '@material-ui/core/';
import GridImage from './image-grid.jsx';
import Card from './_card.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { ArrowDropUp } from '@material-ui/icons/';
import { animateScroll } from 'react-scroll';


const styles = (theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    zIndex: 1500
  },
});

export class Menu extends Component {
    constructor(props) {
        super(props)
        this.edit = false;
        this.state = {
            //validator : new SimpleReactValidator(),
            products: [],
            show_form : false,
            data: [],
            refs: [],
            showToolTip: false,
        }
    }


    
  fetchData = async (title) => {
    try{
      let response = await fetch('https://bathtimestories.com/apim/menu/view/get.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          title: title
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let apiData = await response.json();
      console.log(apiData);
      let data = [];
      apiData.forEach((el,i) => {
        if (i==0 || apiData[i-1].category_id !== el.category_id){
          let category = {
            category_id: el.category_id,
            name: el.c_name,
            items: [],
            picture: el.c_picture,
            background: el.background,
          };
          //data.push();
          category.items = apiData
            .filter((_el,_i) => _el.category_id == el.category_id)
            .map((_el, _i) => (
              { id: _el.item_id,
                name: _el.i_name,
                ingredients: _el.ingredients,
                alergens: _el.alergens,
                calories: _el.calories,
                pictures: _el.i_pictures,
                size: _el.size
              }));
          data.push(category);
        }
      });
      this.setState({
          data: data
          //items: apiData[1],
        });
          
      //let categories = apiData.reduce((i,j) => i[j.c_name]=[j.c_id, j.c_name], []);
      //let items = apiData.map(i => [i.i_id,i.i_name]);
    }
    catch(error){
      console.log(error);
    }
  }


  handleToolTip = (event) => {
    if(!this.state.showToolTip && window.scrollY > window.innerHeight/2)
      this.setState({
        showToolTip: true,
      });
    else if(this.state.showToolTip && window.scrollY  < window.innerHeight/2)
      this.setState({
        showToolTip: false,
      });

  }


    componentDidMount() {
      const title = this.props.match.params.title;
      this.fetchData(title);
      this.fetchDesign(title);
      window.addEventListener('scroll', this.handleToolTip);
    }
 
    fetchMenu = async title => {
      try{
        let response = await fetch('https://bathtimestories.com/apim/menu/get.php/?title='+title);
        let data = await response.json();
        console.log(data);
        this.setState({
          products: data.products,
          categories: data.categories.map(i => i.category),
        });
      } catch(error) {
          console.error(error);
      }
    }

    fetchDesign = async (title) => {
      try{
        let response = await fetch('https://bathtimestories.com/apim/menu/design/get.php', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            title: title,
            }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        let apiData = await response.json();
        console.log(apiData);
        this.setState({ 
          category : JSON.parse(apiData.category_design),
          item : JSON.parse(apiData.item_design),
        });
      } catch (error) {
        console.log(error)
      }
    }

    scrollToTop = () => {
      animateScroll.scrollToTop()
      //window.scrollTo(0, 0);
    }


    getContent = (HTML) => {
      var tmp = document.createElement('span');
      tmp.innerHTML = HTML;
      return tmp.textContent;
    }
    
    addRef = (element) => {
      let refs = this.state.refs;
      refs.push(element);
      this.setState(refs);
    }

    render() {
        const {data, category, item} = this.state;
        const { classes } = this.props;
        const grid = data ? data.map((el,i) => ({name: el.name, picture: el.picture})) : [];
        const category_style = category && {color: category.name.color, fontFamily: category.name.color, fontSize: category.name.size};
        //this.state.products && (document.querySelector(".loader-wrapper").style = "display: none");
        return (
          <>
          <div className="my-1 mx-auto display-menu" style={{maxWidth: 600}}>
            {
              grid.length ? 
              <GridImage
                data={grid} 
                header={true}
                refs={this.state.refs}
                style={category_style}
                /> : ''
            }
            {
              data.length && category ?
              data.map((el,i) =>
                <div ref={this.addRef} key={i} style={{backgroundImage: 'url("'+el.background+'")'}}>
                  <GridImage
                   data={[el]}
                   style={category_style}
                    /> 
                  {/* <Typography gutterBottom variant="h4" component="h2" style={{color: category.name.color, fontFamily: category.name.color, fontSize: category.name.size}}>
                    {el.name}
                  </Typography> */}
                  <Box p={2.5}>
                  {
                    el.items.map((_el,_i) =>
                    
                    <Card
                      style={item}
                      data={_el}
                    />

                    )}
                    </Box>
                </div>
              )

              : ''
              // data.length ? data.forEach((el,i) => {
              //   (i==0 || data[i-1].category_id !== el.category_id) ? 
              //     <>
              //     {el.category_id}
                  
              //     </> : ''
              //   }) : ''
                
            }
            { 
            <Fade in={this.state.showToolTip}>
              <Tooltip title="Add" aria-label="add" arrow={true} onClick={this.scrollToTop}>
              <Fab color="secondary" className={classes.absolute}>
                <ArrowDropUp/>
              </Fab>
            </Tooltip>
          </Fade>
          }
          </div>
          </>

        )
    }
}


/*const mapStateToProps = (state) => ({

})*/

export default compose(
  withFirebase,
  withStyles(styles,  { withTheme: true }),
  connect(
    null
  )
)(injectIntl(Menu))

