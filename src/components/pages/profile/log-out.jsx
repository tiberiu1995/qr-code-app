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
import { setToken, setUser } from "../../actions";

const Form = (props) => {

  const disconnect = async (e) => {
    //setUser('');
   // setToken('');
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

	return (
			<div className="container-fluid">
					<div className="col-xl-12">
							<div className="form form-label-center row">
								<div className="form-group mb-3 col-lg-12">       
									<Button variant="primary" onClick={disconnect}>
											Log out
									</Button>    
								</div>
							</div>
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
