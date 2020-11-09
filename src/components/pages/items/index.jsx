import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useCallback,
} from "react";
import Datatable from "../../datatable/datatable";
import { Link, Redirect, withRouter } from "react-router-dom";
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
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

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
      let apiData = await fetchData({ title: title, token: props.token }, "item/get.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      setData(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      let apiData = await fetchData({ title: title, token: props.token }, "category/get.php");
      if (apiData.status === "fail") 
        throw apiData.message;
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
      const apiData = await fetchData({ title: title, data: item, token: props.token}, "item/" + endpoint + ".php");
      if (apiData.status === "fail") 
        throw apiData.message;
      endpoint === "edit"
        ? toast.success(formatMessage({id: 'edited_item'}), style)
        : toast.success(formatMessage({id: 'saved_item'}), style);
      await fetchItems();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
      toast.error(formatMessage({id: 'error_item'}), style);
      //this.setState({ message: error.message });
      //window.scrollTo(0, 0);
    }
  };

  const removeItem = async (item) => {
    try {
      const apiData = await fetchData({ data: item, token: props.token}, "item/delete.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      toast.success(formatMessage({id: 'deleted_category'}), style);
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
  const {intl: {formatMessage}} = props;
  return (
    <div className="my-1 mx-auto col-lg-10">
      { props.token ? '' : <Redirect to='/log-in' /> }
      <Helmet>
        <meta charSet="utf-8" />
        <title>Menu Products</title>
      </Helmet>
      <div className="form-group mb-3">
        <Header/>
        <Box m={2} display="flex" justifyContent="center" flexDirection="column" >
          {categories.length 
          ? <Form
              key={new Date().valueOf()}
              addItem={addItem}
              data={item}
              show={isVisible}
              categories={categories}
              onCancel={closeModal}
            />
          : '' }
          {data.length ? (
            <Datatable edit={edit} remove={removeItem} myData={[...data]} />
          ) : (
            <h4>{ formatMessage({id: 'no_item'}) }</h4>
          )}
          <Box m={2} display="flex" justifyContent="center" >
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{justifyContent: 'center'}}
              startIcon={<Add />}
              onClick={_new} >
              { formatMessage({id: 'add_item'}) } 
            </Button>
          </Box>
        </Box>
      </div>
      {/* <Button className="m-2" onClick={saveData}>Salveaza <i className="fa fa-check" aria-hidden="true"/></Button> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  //email: state.account.email,
  token: state.account.token
});

export default 
compose(
  connect(mapStateToProps),
  withRouter
  )(injectIntl(Items));
