import React, { Component, Fragment, useState, useEffect, useCallback } from 'react';
import {Datatable} from '../../../datatable/datatable';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import  update from 'immutability-helper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';  
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MediaCard from './../../../cardboard/_card';
import CustomList from '../../../cardboard/_list';
import { Box } from '@material-ui/core';
import { Grid, Button} from '@material-ui/core/';

const Categories = (props) => {
  const [data, setData] = useState([]);
  const title = props.match.params.title;
  const category = props.match.params.category;
  const [right, setRight] = useState([]);
  const [left, setLeft] = useState([]);
  //const [categories, setCategories] = useState([]);


  
  const moveRow = (dragIndex, hoverIndex) => {
    //const initialArray = [1, 2, 3];
    //const newArray = update(initialArray, [4]); // => [1, 2, 3, 4]
    const dragRecord = right[dragIndex];
    const newRecords = update(right, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      });
    setRight(newRecords);
  }

  const fetchItemsConfiguration = async () => {
    try{
      let response = await fetch('https://bathtimestories.com/apim/menu/item/get.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          category: category
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let apiData = await response.json();
      console.log(apiData);
      let config = apiData;//[0].item_configuration.split(',')      
      console.log(apiData);
      response = await fetch('https://bathtimestories.com/apim/item/get.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          title: title,
          category: category
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      apiData = await response.json();
      let products = apiData;
      let _left = [];
      let _right = [];
      config.forEach(el => {
        let selected = products.findIndex(_el => _el.id == el.item_id);
        if(selected !== -1){
          _right.push(products[selected]);
          products.splice(selected,1);
        }
      }) 
      _left = [...products];
      // products.forEach((el,i) => {
      //   let selected = config.findIndex(_el => _el == el.id);
      //   selected !== -1 ? _right.push(el) : _left.push(el)
      // });
      setLeft(_left);
      setRight(_right);
      //setData(apiData);
    } catch(error) {
        console.error(error);
    }
  }

  if (title && category) 
    useEffect(() => {

      fetchItemsConfiguration(title);
    }, []);

  const saveItem = async (item, endpoint) => {
    try{
      const response = await fetch('https://bathtimestories.com/apim/menu/' + endpoint + '.php', {
                              method: 'POST',
                              mode: 'cors',
                              body: JSON.stringify({
                                data: item
                              }),
                              headers: {
                                'Content-Type': 'application/json'
                              },
                            });
      const apiData = await response.json();
      console.log(apiData);
      endpoint === 'edit' ? toast.success("Meniul a fost editat!") : toast.success("Meniul a fost salvat!"); 
      //await fetchMenus();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
        //this.setState({ message: error.message });
        //window.scrollTo(0, 0);
    }
  }

  const saveItemsConfig = async () => {
    let endpoint = 'edit';
    try{
      const response = await fetch('https://bathtimestories.com/apim/menu/item/' + endpoint + '.php', {
                              method: 'POST',
                              mode: 'cors',
                              body: JSON.stringify({
                                data: right.map((el,i) => el.id),
                                category: category
                              }),
                              headers: {
                                'Content-Type': 'application/json'
                              },
                            });
      const apiData = await response.json();
      console.log(apiData);
      endpoint === 'edit' ? toast.success("Categoria a fost editata!") : toast.success("Categoria a fost salvata!"); 
      //await fetchMenus();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
        //this.setState({ message: error.message });
        //window.scrollTo(0, 0);
    }
  }


  const removeItem = value => {
    let l = left;
    let r = right;
    let index = right.findIndex(el => el.id == value);
    setLeft(update(left, {
      $push: [right[index]],
    }));
    setRight(update(right, {
      $splice: [
        [index, 1]
      ]}));
  }

  const addItem = (value) => {
    //alert(value);
    let l = left;
    let r = right;
    let index = l.findIndex(el => el.id == value);
    setRight(update(right, {
      $push: [left[index]],
    }));
    setLeft(update(left, {
      $splice: [
        [index, 1]
      ]}));
  }


  const handleToggle = (value) => {
    alert(value);
  }

  return (
    <div className="my-1 mx-auto text-center">
      <Box m={5}>
      <Grid container spacing={4} justify={"center"}>
        <Grid item xs={12} sm={6} style={{ maxWidth: 600}}>
        { left.length
          ? <CustomList
            data={left}
            handleToggle={addItem} /> 
            : ''
        }
        </Grid>
        <Grid item xs={12} sm={6} style={{ maxWidth: 600}}>
          <DndProvider backend={HTML5Backend}>
          { right.length
            ? right.map((el,i) => <MediaCard index={i} remove={removeItem} moveRow={moveRow} data={el}/>) 
            : ''
          }
          </DndProvider>
        </Grid>
      </Grid>
      <Button className="m-2" onClick={saveItemsConfig}>Salveaza meniul</Button>


      {
        data.length
        ? <>
          <DndProvider backend={HTML5Backend}>
          { data &&
          data.map((el,i) => <MediaCard index={i} remove={removeItem} moveRow={moveRow} data={el}/>)
          }
          </DndProvider>
          {/* <Button className="m-2" onClick={saveCategoriesConfig}>Salveaza meniul</Button> */}
        </>
        : ''
      }
      </Box>

    </div>
  )
}


export default compose(
  withRouter,
)(Categories);

