import React, { Component, Fragment, useState, useEffect, useCallback } from 'react';
import {Datatable} from '../../datatable/datatable';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Form from './form';
import { update } from 'immutability-helper';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';  


const Categories = (props) => {
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;
  const title = props.match.params.title;
  const [category, setCategory] = useState(undefined);

    const fetchCategories = async () => {
      try{
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
        console.log(apiData);
        setData(apiData);
      } catch(error) {
          console.error(error);
      }
    }

  title && useEffect(() => {
    fetchCategories();
  }, []);

  const saveItem = async (item, endpoint) => {
    try{
      const response = await fetch('https://bathtimestories.com/apim/category/' + endpoint + '.php', {
                              method: 'POST',
                              mode: 'cors',
                              body: JSON.stringify({
                                title: title,
                                data: item
                              }),
                              headers: {
                                'Content-Type': 'application/json'
                              },
                            });
      const apiData = await response.json();
      console.log(apiData);
      endpoint === 'edit' ? toast.success("Categoria a fost editata!") : toast.success("Categoria a fost salvata!");
      await fetchCategories();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      window.scrollTo(0, 0);
    } catch (error) {
        //this.setState({ message: error.message });
        window.scrollTo(0, 0);
    }
  }

const removeItem = async (item) => {
    try{
      const response = await fetch('https://bathtimestories.com/apim/category/delete.php', {
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
      toast.success("Categoria a fost stearsa!")
      await fetchCategories();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
        //this.setState({ message: error.message });
        //window.scrollTo(0, 0);
    }
  }


  const addItem = async (item) => {
    console.log(item);
    if (item.id === '') {
      item.id = '_'+(data.length+1);
      saveItem(item, 'new')
    }
    else
      saveItem(item, 'edit');
    console.log(data);
    closeModal();
  }



  const edit = category => {
    setCategory(category);
    showModal();
    //props.history.push(menu.title);
  }

  const showModal = () => showForm(true);
  const closeModal = () => showForm(false);

  return (
    <div className="my-1 mx-auto text-center col-lg-10">
      <div className="form-group mb-3">
      {
        <Form 
          key={new Date().valueOf()}
          addItem={addItem}
          data={category}
          show={isVisible}
          onCancel={closeModal} />
      }{
        data.length ?
          <Datatable
            edit={edit}
            remove={removeItem}
            myData={[...data]}/> :
          <h4>Nu ai adaugat nicio categorie</h4>
      }
        <Button className="m-2" onClick={showModal}>Adauga <i className="fa fa-plus" aria-hidden="true"/></Button>
      </div>
      {/* <Button className="m-2" onClick={saveData}>Salveaza <i className="fa fa-check" aria-hidden="true"/></Button> */}

    </div>
  )
}


export default compose(
  withRouter,
)(Categories);

