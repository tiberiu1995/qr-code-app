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
import { Save, Add } from "@material-ui/icons";
import Header from "../menu/menu-header.jsx";

const Categories = (props) => {
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;
  const title = props.match.params.title;
  const [category, setCategory] = useState(undefined);
  !category && setPageIndex(0);

  const fetchCategories = async () => {
    try {
      let apiData = await fetchData({title: title}, "category/get.php");
      apiData = apiData.map(el => 
        ({...el, picture: el.image_option === "library" ?
        el.library_picture : el.upload_picture}));
      console.log(apiData);
      setData(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  title &&
    useEffect(() => {
      fetchCategories();
    }, []);

  const saveItem = async (item, endpoint) => {
    try {
      const apiData = await fetchData({ title: title, data: item }, "category/" + endpoint + ".php");
      console.log(apiData);
      endpoint === "edit"
        ? toast.success("Categoria a fost editata!")
        : toast.success("Categoria a fost salvata!");
      await fetchCategories();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      window.scrollTo(0, 0);
    } catch (error) {
      //this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }
  };

  const removeItem = async (item) => {
    try {
      const apiData = await fetchData({ data: item }, "category/delete.php");
      console.log(apiData);
      toast.success("Categoria a fost stearsa!");
      await fetchCategories();
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

  const edit = (category) => {
    setCategory(category);
    showModal();
    //props.history.push(menu.title);
  };

  const showModal = () => showForm(true);
  const closeModal = () => showForm(false);

  return (
    <div className="my-1 mx-auto col-lg-10">
      <div className="form-group mb-3">
        <Header/>
        {
          <Form
            key={new Date().valueOf()}
            addItem={addItem}
            data={category}
            show={isVisible}
            onCancel={closeModal}
          />
        }
        {data.length ? (
          <Datatable edit={edit} remove={removeItem} myData={[...data]} />
        ) : (
          <h4>Nu ai adaugat nicio categorie</h4>
        )}
        <Box m={2} display="flex" justifyContent="center" >
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{justifyContent: 'center'}}
            startIcon={<Add />}
            onClick={showModal}
          >
            Adauga categorie
          </Button>
        </Box>
      </div>
      {/* <Button className="m-2" onClick={saveData}>Salveaza <i className="fa fa-check" aria-hidden="true"/></Button> */}
    </div>
  );
};

export default compose(withRouter)(Categories);
