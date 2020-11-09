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
    products: [],
    cartList: []
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state,  ...action.payload };
    case "ADD_PRODUCT":
      const {id, option, quantity} = action.payload;
      const equalProducts = state.cartList.filter(el => el.id == id);
      if (equalProducts.find(el => el.option === option)){
        const newArray = [...state.cartList];
        const element = newArray.find(el => el.option === option && el.id === id);
        element.quantity += quantity;
        return {...state, cartList: newArray};
      }
      else 
        return {...state, cartList: [...state.cartList, action.payload]}
    default:
      return state;
  }
};

export default cartReducer;
