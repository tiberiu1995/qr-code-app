import React, { Component, Fragment, useState, useEffect, useCallback } from 'react';
import {Datatable} from '../../datatable/datatable';
import Card from '../../cardboard/datatable';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Form from './form';
import update from 'immutability-helper';
import {Button, Box }from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';  
import MediaCard from './../../cardboard/_card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomList from './../../cardboard/_list';
import { Grid } from '@material-ui/core/';


const Categories = (props) => {
  const [data, setData] = useState([]);
  //const id = props.match.params.id;
  const title = props.match.params.title;
  const [categoriesConfig, setCategoriesConfig] = useState([]);
  const [categories, setCategories] = useState([]);
  const [right, setRight] = useState([]);
  const [left, setLeft] = useState([]);
  const [items, setItems] = useState([]);


  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = right[dragIndex];
    const newRecords = update(right, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      });
    setRight(newRecords);
  }

  const fetchMenus = async () => {
    try{
      let response = await fetch('https://bathtimestories.com/apim/menu/get.php/');
      let apiData = await response.json();
      console.log(apiData);
      setData(apiData);
    } catch(error) {
        console.error(error);
    }
  }

  const fetchCategoriesConfig = async () => {
    try{
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
      let config = apiData;//[0].category_configuration.split(',')      
      console.log(apiData);
      response = await fetch('https://bathtimestories.com/apim/category/get.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          title: title,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      apiData = await response.json();
      let categories = apiData;
      let _left = [];
      let _right = [];
      config.forEach(el => {
        let selected = categories.findIndex(_el => _el.id == el.category_id);
        if(selected !== -1){
          _right.push(categories[selected]);
          categories.splice(selected,1);
        }
      }) 
      _left = [...categories];


      // categories.forEach((el,i) => {
      //   let selected = config.findIndex(_el => _el == el.id);
      //   selected !== -1 ? _right.push(el) : _left.push(el)
      // });
      setLeft(_left);
      setRight(_right);
      setCategories(categories);
    } catch(error) {
        console.error(error);
    }
  }


  const fetchItems = async title => {
    try{
      let response = await fetch('https://bathtimestories.com/apim/menu/get.php/?title='+title);
      let apiData = await response.json();
      console.log(apiData);
      setItems(apiData.products);
    } catch(error) {
        console.error(error);
    }
  }

  //const compare = (a,b) => (parseInt(a.el)>parseInt(b.el) ? 1 : -1)

  title ?
    useEffect(() => {
      fetchCategoriesConfig();
      //fetchCategories(title);
      fetchItems(title);
    }, [])  :
    useEffect(() => {
      fetchMenus();
    }, []);

    const saveCategoriesConfig = async () => {
      let endpoint = 'edit';
      try{
        const response = await fetch('https://bathtimestories.com/apim/menu/category/' + endpoint + '.php', {
                                method: 'POST',
                                mode: 'cors',
                                body: JSON.stringify({
                                  data: right.map(el => el.id),//.map((el,i) => el.id).join(),
                                  title: title
                                }),
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                              });
        const apiData = await response.json();
        console.log(apiData);
        endpoint === 'edit' ? toast.success("Meniul a fost editat!") : toast.success("Meniul a fost salvat!"); 
       // await fetchMenus();
        // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
        //window.scrollTo(0, 0);
      } catch (error) {
          //this.setState({ message: error.message });
          //window.scrollTo(0, 0);
      }
    }

  const remove = async (item) => {
    try{
      const response = await fetch('https://bathtimestories.com/apim/menu/delete.php', {
                              method: 'POST',
                              mode: 'cors',
                              body: JSON.stringify({
                                title: item.title
                              }),
                              headers: {
                                'Content-Type': 'application/json'
                              },
                            });
      const apiData = await response.json();
      console.log(apiData);
      toast.success("Meniul a fost sters!");
      await fetchMenus();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
        //this.setState({ message: error.message });
      ///  window.scrollTo(0, 0);
    }
  }

  const edit = async menu => {
    //setMenu(menu);
    //await fetchCategories();
    //await fetchItems();
    //showModal();

    //props.history.push(title+'/edit/categories/'+menu.id);
    props.history.push(`menu/${menu.title}/`)
  }

  // const addItem = async (item) => {
  //   console.log(item);
  //   if (item.id === '') {
  //     item.id = '_'+(data.length+1);
  //     saveItem(item, 'new')
  //   }
  //   else
  //     saveItem(item, 'edit');
  //   console.log(data);
  //   //closeModal();
  // }



  const editCat = id => {
    //alert(id);
    props.history.push('edit-category/'+id);
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


  const showCategories = () => {
    props.history.push('categories/');
  }

  const showItems = () => {
    props.history.push({
      pathname: 'items/',
      state: {categories: categories}
    });
  }

  const showDesign = () => {
    props.history.push('design/');
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


  return (
    <div className="my-1 mx-auto text-center">
      <Box m={5}>
      {
        title ?
        <>
          De format meniu
          <Button className="m-2" onClick={showCategories}>Vezi categorii</Button>
          <Button className="m-2" onClick={showItems}>Vezi produse</Button>
          <Button className="m-2" onClick={showDesign}>Design meniu</Button>
          <Grid container spacing={4} justify={"center"} m="2">
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
                ? right.map((el,i) => <MediaCard index={i} edit={editCat} remove={removeItem} moveRow={moveRow} data={el}/>) 
                : ''
              }
              </DndProvider>
            </Grid>
          </Grid>
          <Button className="m-2" onClick={saveCategoriesConfig}>Salveaza meniul</Button>
            
             {/* <Card
               edit={editCat}
              remove={removeCat}
              myData={[...categories.map(el => ({id: el.id, name: el.name, })   )]} /> */}
        </> :
        (data.length ?
          <Datatable
            edit={edit}
            remove={remove}
            myData={[...data]}/> :
          <h4>Nu ai adaugat niciun produs</h4>)
        

      }
      </Box>

    </div>
  )
}


export default compose(
  withRouter,
)(Categories);

