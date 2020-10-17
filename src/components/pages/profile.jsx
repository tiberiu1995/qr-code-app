import React, { Component, Fragment, useState, useCallback, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
//import { withFirebase } from "../../firebase";
//import Breadcrumb from "../breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { fetchMenu, fetchData } from "../utils/fetch";
import { setToken, setUser, setLanguage, setName } from "../../actions";
import { HelpOutline } from "@material-ui/icons";
import Select from "../utils/select";
import { Box, TextField, makeStyles } from '@material-ui/core';
import clsx from "clsx";
import { withFirebase } from './../firebase/context';
import { Button } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  form:{
    maxWidth: 500,
    flexWrap: 'wrap',
    '& .MuiFormControl-root':{
      marginLeft: 16,
      marginRight: 16,
      flex: [[1, 0, '200px']],

    }
  }
}))

const Form = (props) => {
	const [values, setValues] = React.useState({
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
      }
      let apiData = await fetchData( obj, "user/get.php");
        //Cookie.set('token_valid_until', apiData.token_end_time);
      if(apiData.email === props.email) {
          setValues({...values, ...apiData});
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
        name: values.name,
        phone: values.phone,
        company_name: values.companyName
      }
      let apiData = await fetchData( obj, "user/edit.php");
      console.log(apiData);
      setName(values.name);
    } catch (error) {
      console.log(error);
    }

  }

	const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

	const setStateFromInput = (event) => {
		setValues({...values, [event.target.name]: event.target.value});
  }
  
  const languageCode = (lg) => {
    switch(lg.toLowerCase()){
      case 'en':
        return 'English';
      case 'ro':
        return 'Romana';
      default:
        return 'English';
    }
  }

  const {intl: {formatMessage}} = props;

	return (
			<div className="container-fluid">
        <div className="form form-label-center row">
          <Box my="2.5" mx="auto">
            <Box display="flex" className={clsx(classes.form)}>
              <TextField label="Name" name="name" value={values.name} onChange={setStateFromInput} variant="outlined" size="small" margin="normal"/>
              <TextField label="Phone" name="phone" value={values.phone} onChange={setStateFromInput} variant="outlined" size="small" margin="normal"/>
              <TextField disabled label="Email" value={values.email} variant="outlined" size="small" margin="normal"/>
              <TextField label="Company Name" name="companyName" value={values.companyName} onChange={setStateFromInput} variant="outlined" size="small" margin="normal"/>
            </Box>

            {formatMessage({id: 'greeting'})+props.email}     
            <Button variant="primary" onClick={disconnect} mt={2} mb={1}>
                {formatMessage({id: 'log_out'})}
            </Button>
            <Button variant="primary" onClick={editUser} mt={2} mb={1}>
              {formatMessage({id: 'save'})}
            </Button>
            <Link to={"change-password"}>
              Change password
            </Link>
            <Select 
              style={{
                marginTop: 16,
                marginBottom: 8
              }}
              name="language"
              label={formatMessage({id: "language"})}
              value={props.language}
              onChange={(e) => setLanguage(e.target.value)}
              array={["en", "ro"]}
              display={(lg) => languageCode(lg)} />    
          </Box>
        </div>
			</div>
	);
}


const mapStateToProps = (state) => ({
  email: state.account.email,
  token: state.account.token,
  uid: state.account.uid,
  language: state.settings.language
});

export default compose(
  withFirebase,
  connect(mapStateToProps)
)(injectIntl(Form));
