import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useCallback,
} from "react";
import Datatable from "../../datatable/datatable";
import Card from "../../cardboard/datatable";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
//import Form from "./form0";
import Form from "./new-menu";
import update from "immutability-helper";
import { Button, Box } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import MediaCard from "./../../cardboard/_card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomList from "./../../cardboard/_list";
import { Grid } from "@material-ui/core/";
import { fetchData, fetchMenu } from "../../utils/fetch";
import { Add } from '@material-ui/icons';

const style = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const Categories = (props) => {
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;


  const fetchMenus = async () => {
    try {
      let response = await fetch(
        "https://bathtimestories.com/apim/menu/get.php/"
      );
      let apiData = await response.json();
      console.log(apiData);
      setData(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  //const compare = (a,b) => (parseInt(a.el)>parseInt(b.el) ? 1 : -1)

  const remove = async (item) => {
    try {
      const apiData = await fetchData( { title: item.title }, "menu/delete.php");
      console.log(apiData);
      toast.success("Meniul a fost sters!");
      await fetchMenus();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
      //this.setState({ message: error.message });
      ///  window.scrollTo(0, 0);
    }
  };

  const edit = async (menu) => {
    //setMenu(menu);
    //await fetchCategories();
    //await fetchItems();
    //showModal();

    //props.history.push(title+'/edit/categories/'+menu.id);
    props.history.push(`menu/${menu.title}/`);
  };


  const addItem = async (item) => {
    console.log(data);
    closeModal();
    try {
      const apiData = await fetchData(item, "menu/new.php");
      console.log(apiData);
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      apiData.error ? toast.error("Titlul meniului exista deja!", style) : (toast.success("Meniul a fost creat!", style) && await fetchMenus());
      window.scrollTo(0, 0);
    } catch (error) {
      //this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }
  };


  const showModal = () => showForm(true);
  const closeModal = () => showForm(false);


  return (
    <div className="my-1 mx-auto text-center">
      <Box m={5}>
        {data.length ? 
          <Datatable hideFilters edit={edit} remove={remove} myData={[...data]} /> : 
          <h4>Nu ai adaugat niciun meniu</h4>
        }
      </Box>
      <Box m={2} display="flex" justifyContent="center" >
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{justifyContent: 'center'}}
            startIcon={<Add />}
            onClick={showModal}
          >
            Adauga meniu
          </Button>
          <Form
            key={new Date().valueOf()}
            addItem={addItem}
            show={isVisible}
            onCancel={closeModal}
          />
        </Box>
    </div>
  );
};

export default compose(withRouter)(Categories);
