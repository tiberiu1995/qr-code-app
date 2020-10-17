/*import {
    FETCH_SINGLE_PRODUCT,
    CHANGE_CURRENCY,
    RECEIVE_PRODUCTS,
    RELATED_PRODUCTS } from "../constants/ActionTypes";
*/
import { ADD_USER, ADD_MSG } from "../constants/ActionTypes";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose, withReducer } from "recompose";
import { withFirebase } from "../components/firebase";

const initialState = {
  user: "---",
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_EMAIL":
      return { ...state, email: action.email };
    case "ADD_TOKEN":
      return { ...state, token: action.token };
    case "ADD_UID":
      return { ...state, uid: action.uid };
    case "ADD_NAME":
      return { ...state, name: action.name };
    case ADD_MSG:
      return { ...state, message: action.message };
    default:
      return state;
  }
};

export default accountReducer;
