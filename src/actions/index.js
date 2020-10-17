import * as types from "../constants/ActionTypes";
import store from "../store";
//import { toast  } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.min.css';

export const setMedia = (media) => {
  store.dispatch({
    type: "MEDIA_QUERY",
    payload: media,
  });
}

export const setLanguage = (lg) => {
  store.dispatch({
    type: "LANGUAGE",
    payload: lg,
  }); 
}

export const setPageIndex = (page) => {
  store.dispatch({
    type: "PAGE_INDEX",
    payload: page,
  });
};

export const _setPageSize = (page) => {
  store.dispatch({
    type: "PAGE_SIZE",
    payload: page,
  });
};

export const setUser = (email) => {
  store.dispatch({
    type: "ADD_EMAIL",
    email: email,
  });
};

export const setToken = (token) => {
  store.dispatch({
    type: "ADD_TOKEN",
    token: token,
  });
};

export const setUid = (uid) => {
  store.dispatch({
    type: "ADD_UID",
    uid: uid,
  });
}

export const setName = (name) => {
  store.dispatch({
    type: "ADD_NAME",
    name: name,
  }); 
}

export const setLayout = (layout) => {
  store.dispatch({
    type: "ADD_LAYOUT",
    layout: layout,
  }); 
}


export const setMessage = (message) => {
  store.dispatch({
    type: types.ADD_MSG,
    message: message,
  });
};

export const fetchProductsBegin = () => ({
  type: types.FETCH_PRODUCTS_BEGIN,
});

export const receiveProducts = (products) => ({
  type: types.RECEIVE_PRODUCTS,
  products,
});

export const getRelatedProducts = (productId) =>
  store.dispatch({
    type: types.RELATED_PRODUCTS,
    productId,
  });

export const fetchSingleProduct = async (productId) => {
  try {
    let response = await fetch(
      "https://bathtimestories.com/apim/product/get.php/?id=" + productId
    );
    let data = await response.json();
    console.log(data);
    store.dispatch({
      type: types.FETCH_SINGLE_PRODUCT,
      item: data,
    });
  } catch (error) {
    console.error(error);
  }
};

//it seems that I should probably use this as the basis for "Cart"

export const chooseShippingMethod = (shipping_method) => {
  store.dispatch({
    type: "CHOOSE_SHIPING_METHOD",
    shipping_method,
  });
};

export const chooseShippingAddress = (shipping_address) => {
  store.dispatch({
    type: "CHOOSE_SHIPPING_ADDRESS",
    shipping_address,
  });
};

export const chooseBillingDetails = (billing_details) => {
  store.dispatch({
    type: "CHOOSE_BILLING_DETAILS",
    billing_details,
  });
};

export const addToCart = (product, qty) => (dispatch) => {
  //toast.success("Item Added to Cart");
  dispatch(addToCartUnsafe(product, qty));
};
export const addToCartAndRemoveWishlist = (product, qty) => (dispatch) => {
  //toast.success("Item Added to Cart");
  dispatch(addToCartUnsafe(product, qty));
  dispatch(removeFromWishlist(product));
};
export const addToCartUnsafe = (product, qty) => ({
  type: types.ADD_TO_CART,
  product,
  qty,
});
export const removeFromCart = (product_id) => (dispatch) => {
  //toast.error("Item Removed from Cart");
  dispatch({
    type: types.REMOVE_FROM_CART,
    product_id,
  });
};
export const incrementQty = (product, qty) => (dispatch) => {
  //toast.success("Item Added to Cart");
  dispatch(addToCartUnsafe(product, qty));
};
export const decrementQty = (productId) => (dispatch) => {
  //toast.warn("Item Decrement Qty to Cart");

  dispatch({
    type: types.DECREMENT_QTY,
    productId,
  });
};

//it seems that I should probably use this as the basis for "Wishlist"
export const addToWishlist = (product) => (dispatch) => {
  //toast.success("Item Added to Wishlist");
  dispatch(addToWishlistUnsafe(product));
};
export const addToWishlistUnsafe = (product) => ({
  type: types.ADD_TO_WISHLIST,
  product,
});
export const removeFromWishlist = (product_id) => (dispatch) => {
  //toast.error("Item Removed from Wishlist");
  dispatch({
    type: types.REMOVE_FROM_WISHLIST,
    product_id,
  });
};

//Compare Products
export const addToCompare = (product) => (dispatch) => {
  //toast.success("Item Added to Compare");
  dispatch(addToCompareUnsafe(product));
};
export const addToCompareUnsafe = (product) => ({
  type: types.ADD_TO_COMPARE,
  product,
});
export const removeFromCompare = (product_id) => ({
  type: types.REMOVE_FROM_COMPARE,
  product_id,
});

// Filters
export const filterBrand = (brand) => ({
  type: types.FILTER_BRAND,
  brand,
});
export const filterColor = (color) => ({
  type: types.FILTER_COLOR,
  color,
});
export const filterPrice = (value) => ({
  type: types.FILTER_PRICE,
  value,
});
export const filterName = (name) => ({
  type: types.FILTER_NAME,
  name,
});
export const filterSort = (sort_by) => ({
  type: types.SORT_BY,
  sort_by,
});

// Currency
export const changeCurrency = (symbol) => ({
  type: types.CHANGE_CURRENCY,
  symbol,
});

/*
const mapStateToProps = (state) => ({
    user :  this.props.firebase.getUser()
})

const mapDispatchToProps = (dispatch) => ({
    getUser :  dispatch(getUser)
})*/

//export default productReducer;
/*export default compose(
  withFirebase,
  withReducer,
  connect(mapStateToProps, mapDispatchToProps)
)(getUser);*/
