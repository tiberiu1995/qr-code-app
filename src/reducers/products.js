import {
  FETCH_SINGLE_PRODUCT,
  CHANGE_CURRENCY,
  RECEIVE_PRODUCTS,
  RELATED_PRODUCTS,
} from "../constants/ActionTypes";

const initialState = {
  products: [],
  symbol: "$",
  product_details: [],
  recs: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case RELATED_PRODUCTS:
      let items = state.products.filter((l) =>
        state.products
          .filter((el) => el.id == action.productId)[0]
          .rec.includes(l.id)
      );
      return { ...state, items: items };
    case RECEIVE_PRODUCTS:
      return { ...state, products: action.products };
    case FETCH_SINGLE_PRODUCT:
      return { ...state, product_details: action.item };
    case CHANGE_CURRENCY:
      return { ...state, symbol: action.symbol };
    default:
      return state;
  }
};

export default productReducer;
