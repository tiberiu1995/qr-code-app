import React, { Component, Fragment, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
//import { withFirebase } from "../../firebase";
//import Breadcrumb from "../breadcrumb";
import SimpleReactValidator from "simple-react-validator";
import Button from "react-bootstrap/Button";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { fetchMenu, fetchData } from "../utils/fetch";
import { setToken, setUser, setLanguage } from "../../actions";
import { HelpOutline } from "@material-ui/icons";
import Select from "../utils/select";

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


  const disconnect = async (e) => {
    setUser('');
    setToken('');
    props.history.push("/log-in");
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

	return (
			<div className="container-fluid">
					<div className="col-xl-12">
							<div className="form form-label-center row">
                                {'Hello '+props.email}
								<div className="form-group mb-3 col-lg-12">       
									<Button variant="primary" onClick={disconnect}>
											Log out
									</Button>
                  <Select
                    name="language"
                    style={{width: 86}}
                    label="Language"
                    value={props.language}
                    onChange={(e) => setLanguage(e.target.value)}
                    array={["English", "Romanian"]}
                    />    
								</div>
							</div>
					</div>
			</div>
	);
}


const mapStateToProps = (state) => ({
  email: state.account.email,
  token: state.account.token,
  language: state.settings.language
});

export default compose(
  connect(mapStateToProps)
)(injectIntl(Form));
