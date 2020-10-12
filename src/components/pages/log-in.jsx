import React, { Component, Fragment, useState, useCallback } from "react";
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
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";

//import data from './../../../../all_in_one_multikart_react/front-end/src/admin/assets/data/digital-category';
import { TextField, OutlinedInput, InputAdornment } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel, IconButton } from '@material-ui/core/';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { setToken, setUser } from "../../actions";
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';

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
    showPassword: false,
  });


  const addItem = async (e) => {
    e.preventDefault();
		if (!values.validator.allValid()) {
			values.validator.showMessages();
		setValues({...values, "error": !values.validator.allValid()});
			return "";
		}
		try {
      const obj = {
        email: values.email,
        token: values.token,
      }
			let apiData = await fetchData( obj, "user/get.php");
			if(apiData.email === values.email) {
				setUser(values.email);
				setToken(values.token);
				props.history.push("/menu");
			}
      console.log(apiData);
    } catch (error) {
      console.log(error);
    }
   /* try {
      const obj = {
        products: this.state.products,
        title: this.state.title || this.props.match.params.id,
      }
      const data = await fetchData(obj, "/menu/" + endpoint + ".php");
      console.log(data);
      this.setState({
        message: data === true ? "transaction done" : "transaction void",
      });
      window.scrollTo(0, 0);
    } catch (error) {
      this.setState({ message: error.message });
      window.scrollTo(0, 0);
    }*/
  };


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
											<InputLabel htmlFor="outlined-adornment-password">Token</InputLabel>
											<OutlinedInput
													id="outlined-adornment-password"
													type={values.showPassword ? 'text' : 'password'}
													value={values.token}
													onChange={handleChange('token')}
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
											"token",
											values.token,
											"required"
										)}                   
									<Button margin="normal" variant="primary" onClick={addItem}>
											Log In
									</Button>    
								</Box>
							</div>
					</div>
	);
}


const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  //email: state.account.email,
  //token: state.account.token
});

export default compose(
	withRouter,
  connect(mapStateToProps)
)(injectIntl(Form));
