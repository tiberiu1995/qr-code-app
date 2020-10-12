import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useCallback,
} from "react";
import Datatable from "../../datatable/datatable";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import Form from "./form";
import { update } from "immutability-helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setPageIndex } from "./../../../actions/index";
import { fetchData } from "../../utils/fetch";
import { Button, Box } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Header from "../menu/menu-header.jsx";

const style = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const Items = (props) => {
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;
  const title = props.match.params.title;
  const [item, setItem] = useState(undefined);
  const [categories, setCategories] = useState([]);
  !item && setPageIndex(0);

  const fetchItems = async () => {
    try {
      let apiData = await fetchData({ title: title }, "item/get.php");
      console.log(apiData);
      setData(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      let apiData = await fetchData({ title: title }, "category/get.php");
      console.log(apiData);
      setCategories(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  title &&
    useEffect(() => {
      console.log(props.location.state);
      fetchCategories();
      fetchItems();
    }, []);

  const saveItem = async (item, endpoint) => {
    try {
      const apiData = await fetchData({ title: title, data: item, }, "item/" + endpoint + ".php");
      console.log(apiData);
      endpoint === "edit"
        ? toast.success("Produsul a fost editat!", style)
        : toast.success("Produsul a fost salvat!", style);
      await fetchItems();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
      toast.error("Produsul nu a putut fi adaugat!", style);
      //this.setState({ message: error.message });
      //window.scrollTo(0, 0);
    }
  };

  const removeItem = async (item) => {
    try {
      const apiData = await fetchData({ data: item, }, "item/delete.php");
      console.log(apiData);
      toast.success("Produsul a fost sters!", style);
      await fetchItems();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
      //this.setState({ message: error.message });
      //window.scrollTo(0, 0);
    }
  };

  const addItem = async (item) => {
    console.log(item);
    if (item.id === "") {
      item.id = "_" + (data.length + 1);
      saveItem(item, "new");
    } else saveItem(item, "edit");
    console.log(data);
    closeModal();
  };

  const edit = (item) => {
    //fetchItems(item);
    setItem(item);
    showModal();
    //props.history.push(menu.title);
  };

  const _new = () => {
    setItem(undefined);
    showModal();
  };

  const showModal = () => showForm(true);
  const closeModal = () => showForm(false);

  return (
    <div className="my-1 mx-auto col-lg-10">
      <div className="form-group mb-3">
        <Header/>
        {/* <ToastContainer /> */}
        {categories.length && (
          <Form
            key={new Date().valueOf()}
            addItem={addItem}
            data={item}
            show={isVisible}
            categories={categories}
            onCancel={closeModal}
          />
        )}
        {data.length ? (
          <Datatable edit={edit} remove={removeItem} myData={[...data]} />
        ) : (
          <h4>Nu ai adaugat niciun produs</h4>
        )}
        <Box m={2} display="flex" justifyContent="center" >
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{justifyContent: 'center'}}
            startIcon={<Add />}
            onClick={_new}
          >
            Adauga produs
          </Button>
        </Box>
      </div>
      {/* <Button className="m-2" onClick={saveData}>Salveaza <i className="fa fa-check" aria-hidden="true"/></Button> */}
    </div>
  );
};

export default compose(withRouter)(Items);
