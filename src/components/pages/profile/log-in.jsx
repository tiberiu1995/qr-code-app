import React, { Component, Fragment, useState, useCallback } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
//import { withFirebase } from "../../firebase";
//import Breadcrumb from "../breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import { fetchMenu, fetchData } from "../../utils/fetch";

//import data from './../../../../all_in_one_multikart_react/front-end/src/admin/assets/data/digital-category';
import { TextField, OutlinedInput, InputAdornment } from '@material-ui/core';
import { FormControl, Button } from '@material-ui/core';
import { InputLabel, IconButton } from '@material-ui/core/';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { setToken, setUser, setName } from "../../../actions";
import { Box } from '@material-ui/core';
import { withFirebase } from '../../firebase';
import Cookies from 'js-cookie';
import { setUid } from '../../../actions/index';
import ForgetPassword from './forgot-password';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from "react-helmet";

const useStyles = makeStyles(theme => ({
  edit: {
      backgroundColor: '#4caf50',
      color: 'white',
  },
}))

const Form = (props) => {
	const [values, setValues] = React.useState({
		validator: new SimpleReactValidator(),
		error: false,
		token: '',
		email: '',
		amount: '',
		password: '',
		weight: '',
    weightRange: '',
    uid: '',
		showPassword: false,
	});
  const classes = useStyles();
  const {firebase, location, history} = props;

  const fetchUser = async (email, uid) => {
    try {
      const obj = {
        email: email,
        uid: uid,
        token: props.token
      }
	  let apiData = await fetchData( obj, "user/get.php");
	  if (apiData.status === "fail") 
        throw apiData.message;
      console.log(apiData);
      setName(apiData.name);
    } catch (error) {
      console.log(error);
    }
  }

  const addItem = async (e) => {
	e.preventDefault();
		if (!values.validator.allValid()) {
			values.validator.showMessages();
		setValues({...values, "error": !values.validator.allValid()});
			return "";
		}
		try {
		  await firebase.doSignInWithEmailAndPassword(values.email, values.password);
			const token = await firebase.getUser().getIdToken();
			console.log(token);
			const response = await fetch('https://bathtimestories.com/api/validation.php', {
			  method: 'POST',
			  mode: 'cors',
			  body: JSON.stringify({token: token, action: 'set', csrf: Cookies.get('csrf')}),
			  headers: {
				  'Content-Type': 'application/json'
			  },
			});
      const data = await response.json();
			if(data.status === 'success') {
        await fetchUser(values.email, firebase.getUser().uid);
			  location.search.includes("ref") ? history.goBack() : history.push('/menu');
			  console.log('set '+data);
			  setUser(values.email);
        setToken(token);
        setUid(firebase.getUser().uid);
			}
		} catch (error) {
		console.log(error);
		//	this.setState({ error })
		}

	}


	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	 };

	const setStateFromInput = (event) => {
		setValues({...values, [event.target.name]: event.target.value});
	}

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};
	
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	  };

	return (
		<div className="container-fluid">
			<div className="form form-label-center row">
				<Box my="2.5" mx="auto" display="grid">
				<Helmet>
					<meta charSet="utf-8" />
					<title>Log In</title>
				</Helmet>
					<TextField 
						margin="normal"
						label="Email"
						name="email"
						variant="outlined" 
						value={values.email} 	
						onChange={setStateFromInput}/>
					{values.validator.message(
							"email",
							values.email,
							"required|email"
						)}
					<FormControl margin="normal" /*className={clsx(classes.margin, classes.textField)}*/ variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
							<OutlinedInput
									id="outlined-adornment-password"
									type={values.showPassword ? 'text' : 'password'}
									value={values.password}
									onChange={handleChange('password')}
									endAdornment={
									<InputAdornment position="end">
											<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
											>
											{values.showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
									</InputAdornment>
									}
									labelWidth={70}
							/>
					</FormControl> 
					{values.validator.message(
							"password",
							values.password,
							"required"
						)}
          <Box align="center" mb={1}>
            <Button margin="normal" className={classes.edit} onClick={addItem}>
              Log In
            </Button>
          </Box>                   
					<Link align="center" to={'/forgot-password/'} >
						Reset Password
					</Link>
				</Box>
			</div>
		</div>
	);

}


const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  //email: state.account.email,
  token: state.account.token
});

export default compose(
	withFirebase,
	withRouter,
  connect(mapStateToProps)
)(injectIntl(Form));
