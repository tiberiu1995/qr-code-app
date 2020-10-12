/*import {
    FETCH_SINGLE_PRODUCT,
    CHANGE_CURRENCY,
    RECEIVE_PRODUCTS,
    RELATED_PRODUCTS } from "../constants/ActionTypes";
*/
//import { ADD_USER, ADD_MSG } from "../constants/ActionTypes";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { compose, withReducer } from "recompose";
import { withFirebase } from "../components/firebase";

const initialState = {
  mobile: "",
  tablet: "",
  desktop: ""
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "MEDIA_QUERY":
      return { ...state,  ...action.payload };
    default:
      return state;
  }
};

export default mediaReducer;
