import React, { Component, Fragment, useState, useCallback, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
//import { withFirebase } from "../../firebase";
//import Breadcrumb from "../breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import { fetchMenu, fetchData } from "../../utils/fetch";
import { setToken, setUser, setLanguage, setName } from "../../../actions";
import Select from "../../utils/select";
import { Box, TextField, makeStyles } from '@material-ui/core';
import clsx from "clsx";
import { withFirebase } from '../../firebase/context';
import { Button } from '@material-ui/core/';
import ChangePasswordForm from "./change-password";
import { Helmet } from 'react-helmet';

const useStyles = makeStyles(theme => ({
  form:{
    maxWidth: 500,
    flexWrap: 'wrap',
    '& .MuiFormControl-root':{
      marginLeft: 16,
      marginRight: 16,
      flex: [[1, 0, '200px']],

    }
  },
  edit: {
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#4caf50',
    '&:hover': {
      border: '1px solid #4caf50',
      color: '#4caf50',
    },
    '&.Mui-disabled': {
      color: 'inherit',
      backgroundColor: 'inherit'
    }
  },
  delete: {
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#f44336',
  }

}))

const Form = (props) => {
	const [state, setState] = React.useState({
		validator: new SimpleReactValidator(),
		error: false,
    token: '',
    name: '',
    phone: '',
    email: '',
    companyName: '',
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const classes = useStyles();

  const disconnect = async (e) => {
    await props.firebase.doSignOut();
    setUser('');
    setToken('');
    props.history.push("/log-in");
  } 

  useEffect(()=>{
    fetchUser();
  },[])

  const fetchUser = async () => {
    try {
      const obj = {
        email: props.email,
        uid: props.uid,
        token: props.token
      }
      let apiData = await fetchData( obj, "user/get.php");
      if (apiData.status === "fail") 
        throw apiData.message;
        //Cookie.set('token_valid_until', apiData.token_end_time);
      if(apiData.email === props.email) {
          setState({...state, ...apiData});
          //setUser(apiData.email);
         // setToken(apiData.token);
          //props.history.push("/menu");
      }
      console.log(apiData);
    } catch (error) {
      console.log(error);
    }
  }

  const editUser = async () => {
    try {
      const obj = {
        id: props.uid,
        name: state.name,
        phone: state.phone,
        company_name: state.companyName,
        token: props.token
      }
      let apiData = await fetchData( obj, "user/edit.php");
      if (apiData.status === "fail") 
        throw apiData.message;
      setName(state.name);
    } catch (error) {
      console.log(error);
    }

  }

	const setStateFromInput = (event) => {
		setState({...state, [event.target.name]: event.target.value});
  }
  
  const {intl: {formatMessage}} = props;

	return (
			<div className="container-fluid">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Profile</title>
          </Helmet>
        <div className="form form-label-center row">
          <Box my="2.5" mx="auto">
            <Box display="flex" className={clsx(classes.form)}>
              <TextField 
                label="Name" 
                name="name" 
                value={state.name} 
                onChange={setStateFromInput} 
                variant="outlined" 
                size="small" 
                margin="normal"/>
              {state.validator.message(
                "name",
                state.name,
                "required"
              )}
              <TextField 
                label="Phone" 
                name="phone" 
                value={state.phone} 
                onChange={setStateFromInput} 
                variant="outlined" 
                size="small" 
                margin="normal"/>
              <TextField
                disabled 
                name="email"
                label="Email" 
                value={state.email} 
                variant="outlined" 
                size="small" 
                margin="normal"/>
              <TextField 
                label="Company Name" 
                name="companyName" 
                value={state.companyName} 
                onChange={setStateFromInput} 
                variant="outlined" 
                size="small" 
                margin="normal"/>
            </Box>  
            <Box align="center">
              <Button variant="outlined" className={classes.edit} onClick={editUser} mt={2} mb={1}>
                {formatMessage({id: 'save'})}
              </Button>
            </Box>
            <Box align="center" pt={2}>
              <ChangePasswordForm classes={classes}/>
            </Box> 
            <Box align="center" pt={2}>
              <Button variant="outlined" className={classes.edit} onClick={disconnect} mt={2} mb={1}>
                  {formatMessage({id: 'log_out'})}
              </Button> 
            </Box>
          </Box>
        </div>
			</div>
	);
}


const mapStateToProps = (state) => ({
  email: state.account.email,
  token: state.account.token,
  uid: state.account.uid,
});

export default compose(
  withFirebase,
  connect(mapStateToProps)
)(injectIntl(Form));
