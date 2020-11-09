import React, {
  useState,
  useEffect,
} from "react";
import Datatable from "../../datatable/datatable";
import { Link, Redirect, withRouter } from "react-router-dom";
import { compose } from "recompose";
//import Form from "./form0";
import Form from "./new-menu";
import update from "immutability-helper";
import { Button, Box } from "@material-ui/core";
import { toast, } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { fetchData, fetchMenu } from "../../utils/fetch";
import { Add } from '@material-ui/icons';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
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
  const {formatMessage} = props.intl;
  const [data, setData] = useState([]);
  const [isVisible, showForm] = useState(false);
  //const id = props.match.params.id;


  const fetchMenus = async () => {
    try {
      let apiData = await fetchData({uid: props.uid, token: props.token}, "menu/get.php");
      if (apiData.status === "fail") 
        throw apiData.message;
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
      const apiData = await fetchData({ title: item.title, token: props.token}, "menu/delete.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      toast.success(formatMessage({id: "deleted_menu"}));
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
      const apiData = await fetchData({...item, token: props.token}, "menu/new.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      apiData.error ? toast.error(formatMessage({id: 'menu_exists'}), style) : (toast.success(formatMessage({id: 'menu_created'}), style) && await fetchMenus());
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error(formatMessage({id: 'error_menu'}), style)
      //this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }
  };


  const showModal = () => showForm(true);
  const closeModal = () => showForm(false);


  return (
    <div className="my-1 mx-auto text-center">
      { props.token ? '' : <Redirect to='/log-in' /> }
      <Box m={5}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Menus</title>
      </Helmet>
        {data.length ? 
          <Datatable edit={edit} remove={remove} myData={[...data]} /> : 
          <h4>{ formatMessage({id: 'no_menu'})}</h4>
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
            {formatMessage({id: 'add_menu'}) }
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

const mapStateToProps = (state) => ({
  uid: state.account.uid,
  token: state.account.token
})

export default compose(
  withRouter,
  connect(mapStateToProps))(injectIntl(Categories));
