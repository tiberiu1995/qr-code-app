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
import { Save, Add } from "@material-ui/icons";
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

const Categories = (props) => {
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;
  const title = props.match.params.title;
  const [category, setCategory] = useState(undefined);
  !category && setPageIndex(0);

  const fetchCategories = async () => {
    try {
      let apiData = await fetchData({title: title, token: props.token}, "category/get.php");
      if (apiData.status === "fail") 
      throw apiData.message;
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
      const apiData = await fetchData({ title: title, data: item, token: props.token}, "category/" + endpoint + ".php");
      if (apiData.status === "fail") 
        throw apiData.message;
      endpoint === "edit"
        ? toast.success(formatMessage({id: 'edited_category'}), style)
        : toast.success(formatMessage({id: 'saved_category'}), style);
      await fetchCategories();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error(formatMessage({id: 'error_category'}), style);
      //this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }
  };

  const removeItem = async (item) => {
    try {
      const apiData = await fetchData({ data: item, token: props.token }, "category/delete.php");
      if (apiData.success !== "fail") 
        throw apiData.message;
      toast.success(formatMessage({id: 'deleted_category'}), style);
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
  const {intl: {formatMessage}} = props;
  return (
    <div className="my-1 mx-auto col-lg-10">
      { props.token ? '' : <Redirect to='/log-in' /> }
      <Helmet>
        <meta charSet="utf-8" />
        <title>Menu Categories</title>
      </Helmet>
      <div className="form-group mb-3">
        <Header/>
        <Box m={2} display="flex" justifyContent="center" flexDirection="column" >
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
            <h4>{ formatMessage({id: 'no_category'}) }</h4>
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
              { formatMessage({id: 'add_category'}) }
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

export default compose(
  withRouter,
  connect(mapStateToProps)
  )(injectIntl(Categories));
