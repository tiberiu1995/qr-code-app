import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    INCREMENT_QTY,
    DECREMENT_QTY } from "../constants/ActionTypes";

import {priceAfterDiscount} from "../services";

export default function cartReducer(state = {
    cart: [],
    shipping_method: {rate: 0},
    shipping_address: {},
    billing_details: {},
}, action) {
    switch (action.type) {
        case 'CHOOSE_SHIPING_METHOD':
          return { ...state, shipping_method: action.shipping_method}
        case 'CHOOSE_SHIPPING_ADDRESS':
          return { ...state, shipping_address: action.shipping_address}
        case 'CHOOSE_BILLING_DETAILS':
          return { ...state, billing_details: action.billing_details}
        case ADD_TO_CART:
            const productId = action.product.id
            if (state.cart.findIndex(product => product.id === productId) !== -1) {
                const cart = state.cart.reduce((cartAcc, product) => {
                    if (product.id === productId) {
                        cartAcc.push({ ...product, qty: product.qty+1, sum: priceAfterDiscount(product.price,product.discount)*(product.qty+1) }) // Increment qty
                    } else {
                        cartAcc.push(product)
                    }

                    return cartAcc
                }, [])

                return { ...state, cart }
            }

            return { ...state, cart: [...state.cart, { ...action.product, qty: action.qty, sum: priceAfterDiscount(action.product.price,action.product.discount)*action.qty }] }

        case DECREMENT_QTY:
            
            if (state.cart.findIndex(product => product.id === action.productId) !== -1) {
                const cart = state.cart.reduce((cartAcc, product) => {
                    if (product.id === action.productId && product.qty > 1) {
                        //console.log('price: '+product.price+'Qty: '+product.qty)
                        cartAcc.push({ ...product, qty: product.qty-1, sum: priceAfterDiscount(product.price,product.discount)*(product.qty-1) }) // Decrement qty
                    } else {
                        cartAcc.push(product)
                    }

                    return cartAcc
                }, [])

                return { ...state, cart }
            }

            return { ...state, cart: [...state.cart, { ...action.product, qty: action.qty, sum: action.product.price*action.qty }] }

        case REMOVE_FROM_CART:
            return { ...state, cart: state.cart.filter(item => item.id !== action.product_id.id)}

        default:
    }
    return state;
}
