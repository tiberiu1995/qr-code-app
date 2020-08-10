import React, { Component,Fragment } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { compose } from 'recompose';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { withFirebase } from '../../firebase';
//import Product from '../menu/product';
import Button from "react-bootstrap/Button";
import { Typography, Box } from '@material-ui/core';
import { Grid } from '@material-ui/core/';
import GridImage from './image-grid.jsx';
import Card from './_card.jsx';



export class Menu extends Component {
    constructor(props) {
        super(props)
        this.edit = false;
        this.state = {
            //validator : new SimpleReactValidator(),
            products: [],
            show_form : false,
            data: [],
        }
    }
/*
    fetchCategoriesConfig = async (title) => {
        let response = await fetch('https://bathtimestories.com/apim/menu/category/get.php', {
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
          return apiData;
    }

    fetchItemsConfig = async (title) => {
      let response = await fetch('https://bathtimestories.com/apim/menu/item/get.php', {
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
      return apiData;
    }
          

    fetchCategories = async (title) => {
          //console.log(apiData);
          let response = await fetch('https://bathtimestories.com/apim/category/get.php', {
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
          return apiData;
    }

    fetchItems = async (title) => {
        let response = await fetch('https://bathtimestories.com/apim/item/get.php', {
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
        return apiData;
    }

*/

    
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



    componentDidMount() {
      const title = this.props.match.params.title;
      this.fetchData(title);
      this.fetchDesign(title);
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


    getContent = (HTML) => {
      var tmp = document.createElement('span');
      tmp.innerHTML = HTML;
      return tmp.textContent;
    }

    render() {
        const {data, category, item} = this.state;
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
                category={true}
                style={category_style}
                /> : ''
            }
            {
              data.length && category ?
              data.map((el,i) =>
                <div id={i} key={i} style={{backgroundImage: 'url("'+el.background+'")'}}>
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
                    // <Grid container spacing={2} justify='space-between'>
                    //   <Grid item xs={9}>
                    //     <Typography gutterBottom variant="p" component="h3" style={{color: item.name.color, fontFamily: item.name.color, fontSize: item.name.size}}>
                    //       {_el.name}
                    //     </Typography>
                    //     <Typography gutterBottom variant="p" component="p" style={{color: item.ingredients.color, fontFamily: item.ingredients.color, fontSize: item.ingredients.size}}>
                    //       {_el.ingredients}
                    //     </Typography>
                    //     <Typography gutterBottom variant="p" component="p" style={{color: item.size.color, fontFamily: item.size.color, fontSize: item.size.size}}>
                    //       {_el.size}
                    //     </Typography>
                    //   </Grid>
                    //   <Grid item xs={3}> 
                    //     <img width="100px" src={_el.pictures}/>
                    //   </Grid>
                    // </Grid>

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
          </div>
          </>

        )
    }
}


/*const mapStateToProps = (state) => ({

})*/

export default compose(
  withFirebase,
  connect(
    null
  )
)(injectIntl(Menu))

