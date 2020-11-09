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
  });

  const classes = useStyles();


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
      if(apiData.email === props.email) {
          setValues({...values, ...apiData});
      }
    } catch (error) {
      console.log(error);
    }
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

	return (<div className="container-fluid">
        <div className="form form-label-center row">
          <Box my="2.5" mx="auto">
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
